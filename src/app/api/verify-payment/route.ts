import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * Confirms the browser's success callback really came from Razorpay. The
 * webhook is what mails the order through; this only decides whether the
 * thank-you screen is allowed to celebrate.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const orderId = body?.razorpay_order_id;
  const paymentId = body?.razorpay_payment_id;
  const signature = body?.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const given = Buffer.from(String(signature), "utf8");
  const want = Buffer.from(expected, "utf8");

  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) {
    return NextResponse.json({ code: "BAD_SIGNATURE" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
