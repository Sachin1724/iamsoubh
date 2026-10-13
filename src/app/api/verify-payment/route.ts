import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSupabase, alert } from "@/server/clients";
import { syncOrderToShiprocket } from "@/server/shiprocket";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const given = Buffer.from(String(razorpay_signature), "utf8");
  const want = Buffer.from(expected, "utf8");

  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) {
    return NextResponse.json({ code: "BAD_SIGNATURE" }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .rpc("mark_paid", {
      p_rzp_order: razorpay_order_id,
      p_payment: razorpay_payment_id,
    })
    .single<{ status: string; order_number: number | null }>();

  if (error) {
    await alert(`verify-payment mark_paid failed for ${razorpay_order_id}: ${error.message}`);
    return NextResponse.json({ code: "MARK_PAID_FAILED" }, { status: 500 });
  }

  if (data!.status === "overflow") {
    await alert(
      `OVERFLOW: payment ${razorpay_payment_id} (order ${razorpay_order_id}) landed after the last box went. Refund in full.`
    );
  } else if (data!.status === "paid") {
    syncOrderToShiprocket({ razorpayOrderId: razorpay_order_id }).catch((err: unknown) =>
      console.error("[verify-payment] Shiprocket sync error:", err)
    );
  }

  return NextResponse.json({ status: data!.status, orderNumber: data!.order_number });
}
