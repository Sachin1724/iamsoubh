import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendOrderEmail } from "@/server/email";
import { getSupabase, alert } from "@/server/clients";
import { syncOrderToShiprocket } from "@/server/shiprocket";
import { pullMagicAddress } from "@/server/magic-address";

export async function POST(req: NextRequest) {
  // The signature is over the raw body, so read text and parse by hand.
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const eventId = req.headers.get("x-razorpay-event-id") ?? "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest("hex");

  const given = Buffer.from(signature, "utf8");
  const want = Buffer.from(expected, "utf8");

  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) {
    return NextResponse.json({ code: "BAD_SIGNATURE" }, { status: 400 });
  }

  // Dedupe: Razorpay retries, and both this and verify-payment can mark the same order.
  if (eventId) {
    const { error } = await getSupabase().from("webhook_events").insert({ event_id: eventId });
    if (error) return NextResponse.json({ ok: true, duplicate: true });
  }

  const payload = JSON.parse(raw);
  const event: string = payload.event;

  if (event === "payment.captured" || event === "order.paid") {
    const entity = payload.payload.payment.entity;
    const { data, error } = await getSupabase()
      .rpc("mark_paid", { p_rzp_order: entity.order_id, p_payment: entity.id })
      .single<{ status: string; order_number: number | null }>();

    if (error) {
      await alert(`webhook mark_paid failed for ${entity.order_id}: ${error.message}`);
    } else if (data!.status === "overflow") {
      await alert(
        `OVERFLOW: payment ${entity.id} (order ${entity.order_id}) landed after the last box went. Refund in full.`
      );
    } else {
      // Magic Checkout holds the delivery address on the Razorpay order; copy it
      // across before the mail and the shipment read the row.
      await pullMagicAddress(entity.order_id);

      // The webhook is the one place every paid order passes through, so the
      // confirmation mail is sent here rather than from the browser.
      const { data: order } = await getSupabase()
        .from("orders")
        .select("id, name, email, order_number, boxes")
        .eq("razorpay_order_id", entity.order_id)
        .single();
      if (order) await sendOrderEmail("confirmed", order);

      // Automatically push order to Shiprocket for courier assignment & WhatsApp tracking
      await syncOrderToShiprocket({ razorpayOrderId: entity.order_id });
    }
  }

  // payment.failed needs no action — the hold expires on its own.
  return NextResponse.json({ ok: true });
}
