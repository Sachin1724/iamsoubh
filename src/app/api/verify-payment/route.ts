import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { fetchPaidOrder } from "@/backend/magic-address";
import { logToSheet } from "@/backend/sheet";

/**
 * Confirms the browser's success callback really came from Razorpay.
 * Also immediately syncs the paid order and shipping address to Google Sheet,
 * ensuring no dependency solely on external webhooks.
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

  // Instant sync: fetch the completed order (with address from Razorpay) and write to Sheet
  try {
    const order = await fetchPaidOrder(orderId, paymentId);
    await logToSheet(
      "Orders",
      {
        "Order Id": order.razorpayOrderId,
        Status: "Paid",
        Paid: new Date().toISOString(),
        "Payment Id": order.paymentId ?? "",
        Name: order.name,
        Phone: order.phone,
        Email: order.email,
        Address: order.address,
        Landmark: order.landmark,
        City: order.city,
        State: order.state,
        Pincode: order.pincode,
        Boxes: order.boxes,
        "Amount (INR)": order.amountInr,
        "Gift Note": order.giftNote,
        Source: order.utm,
      },
      order.razorpayOrderId
    );
  } catch (err) {
    // Non-fatal for the browser response; webhook will also attempt sync
    console.error(`verify-payment sheet sync error for ${orderId}:`, err);
  }

  return NextResponse.json({ ok: true });
}

