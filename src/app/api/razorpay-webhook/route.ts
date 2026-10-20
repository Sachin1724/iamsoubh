import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendOrderEmails } from "@/backend/email";
import { alert } from "@/backend/clients";
import { fetchPaidOrder } from "@/backend/magic-address";

export async function POST(req: NextRequest) {
  // The signature is over the raw body, so read text and parse by hand.
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest("hex");

  const given = Buffer.from(signature, "utf8");
  const want = Buffer.from(expected, "utf8");

  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) {
    return NextResponse.json({ code: "BAD_SIGNATURE" }, { status: 400 });
  }

  const payload = JSON.parse(raw);
  const event: string = payload.event;

  // order.paid would fire for the same money, so only payment.captured mails —
  // two subscribed events would otherwise mean two confirmations.
  if (event === "payment.captured") {
    const entity = payload.payload.payment.entity;
    try {
      const order = await fetchPaidOrder(entity.order_id, entity.id);
      const { buyer, operator } = await sendOrderEmails(order);
      if (!operator.sent) {
        await alert(`ADMIN MAIL FAILED for ${entity.order_id}: ${operator.reason}`);
      }
      if (!buyer.sent && order.email) {
        await alert(`buyer mail failed for ${entity.order_id}: ${buyer.reason}`);
      }
    } catch (e) {
      // Razorpay retries on a non-200, so fail loudly here rather than swallowing
      // an order that nobody was told about.
      await alert(`webhook failed for ${entity.order_id}: ${String(e)}`);
      return NextResponse.json({ code: "HANDLER_FAILED" }, { status: 500 });
    }
  }

  // payment.failed needs no action — nothing was ever reserved.
  return NextResponse.json({ ok: true });
}
