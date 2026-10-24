import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { alert } from "@/backend/clients";
import { fetchPaidOrder } from "@/backend/magic-address";
import { logToSheet } from "@/backend/sheet";

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

  if (event === "payment.captured" || event === "order.paid") {
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;
    const orderId = paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;

    if (orderId) {
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
      } catch (e) {
        // Razorpay retries on a non-200, so fail loudly here rather than swallowing
        // an order that never reached the sheet.
        await alert(`webhook failed for ${orderId}: ${String(e)}`);
        return NextResponse.json({ code: "HANDLER_FAILED" }, { status: 500 });
      }
    }
  }

  // payment.failed needs no action — nothing was ever reserved.
  return NextResponse.json({ ok: true });
}
