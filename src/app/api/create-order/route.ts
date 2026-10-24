import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getRazorpay, forceSoldOut, alert } from "@/backend/clients";
import { boxesSold } from "@/backend/orders";
import { logToSheet } from "@/backend/sheet";
import { clientIp, tooMany } from "@/backend/rate-limit";
import { siteConfig, boxPrice, MAX_BOXES } from "@/config/site-config";

type Customer = {
  name?: string;
  phone?: string;
  email?: string;
  pincode?: string;
  city?: string;
  state?: string;
  address?: string;
  landmark?: string;
  giftNote?: string;
};

export async function POST(req: NextRequest) {
  // A real buyer retries a few times at most; this stops one script minting orders.
  if (tooMany("order", clientIp(req), 10)) {
    return NextResponse.json({ code: "RATE_LIMITED" }, { status: 429 });
  }

  if (forceSoldOut()) {
    return NextResponse.json({ code: "SOLD_OUT" }, { status: 409 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });

  const { qty, customer, utm } = body as {
    qty: unknown;
    customer?: Customer;
    utm?: Record<string, string>;
  };

  if (!Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_BOXES) {
    return NextResponse.json({ code: "BAD_QTY" }, { status: 400 });
  }

  // One box type; qty is the number of boxes, and the per-box price follows it.
  const quantity = qty as number;
  const product = "single";
  const c = customer ?? {};

  // Magic Checkout collects the phone (with OTP) and the address itself, so nothing
  // is required up front. A phone, if sent, is only a prefill and must be 10 digits;
  // the authoritative contact and address are read back off the paid order.
  if (c.phone && !/^\d{10}$/.test(c.phone)) {
    return NextResponse.json({ code: "BAD_PHONE" }, { status: 400 });
  }

  // Price and box count come from server config only.
  const boxes = quantity;
  const unit = boxPrice(boxes);

  // The batch is capped, and the count is a sum over Razorpay's own paid
  // orders — no store to drift out of sync with the money.
  try {
    const sold = await boxesSold();
    if (sold + boxes > siteConfig.batchCap) {
      return NextResponse.json(
        { code: "SOLD_OUT", left: Math.max(0, siteConfig.batchCap - sold) },
        { status: 409 }
      );
    }
  } catch {
    // Razorpay unreachable: take the order rather than lose it, and say so.
    await alert("stock check failed; order allowed through without a cap check");
  }

  const amount = unit * boxes * 100;
  const receipt = `ovc27_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;

  try {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://iamsoubh.com";
    // The box stays secret until it ships, so the line item shows the gamuchha-wrapped parcel.
    const label = `Odia Viral Calendar 2027 · ${boxes} box${boxes > 1 ? "es" : ""}`;

    // The SDK's types predate Magic Checkout's line_items, so the payload is
    // built loosely and cast back to what orders.create accepts.
    const orderPayload = {
      amount,
      currency: "INR",
      receipt,
      // line_items_total is what marks this as a Magic Checkout order; drop it
      // and Razorpay silently falls back to Standard Checkout.
      line_items_total: amount,
      line_items: [
        {
          sku: product,
          variant_id: product,
          price: unit * 100,
          offer_price: unit * 100,
          quantity,
          name: label,
          description: `${boxes} box${boxes > 1 ? "es" : ""} · 12 festival cards, a sealed 13th parba, stickers and a note.`,
          image_url: `${site}/icon.png`,
        },
      ],
      // Razorpay is the only order store now, so everything the admin mail and
      // the thank-you screen read has to live in the notes.
      notes: {
        project: "odia_calendar_2027",
        product,
        qty: String(quantity),
        boxes: String(boxes),
        name: c.name?.trim() ?? "",
        phone: c.phone ?? "",
        email: c.email ?? "",
        pincode: c.pincode ?? "",
        city: c.city ?? "",
        state: c.state ?? "",
        address: (c.address ?? "").slice(0, 250),
        landmark: (c.landmark ?? "").slice(0, 120),
        gift_note: (c.giftNote ?? "").slice(0, 200),
        utm: JSON.stringify(utm ?? {}).slice(0, 400),
      },
    };

    const rzpOrder = await getRazorpay().orders.create(
      orderPayload as unknown as Parameters<ReturnType<typeof getRazorpay>["orders"]["create"]>[0]
    );

    // Logged as Unpaid now; the payment webhook flips the same row to Paid.
    await logToSheet(
      "Orders",
      {
        "Order Id": rzpOrder.id,
        Status: "Unpaid",
        Created: new Date().toISOString(),
        Phone: c.phone ?? "",
        Boxes: boxes,
        "Amount (INR)": amount / 100,
      },
      rzpOrder.id
    );

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    await alert(`razorpay order create failed for ${receipt}: ${String(e)}`);
    return NextResponse.json({ code: "RAZORPAY_FAILED" }, { status: 502 });
  }
}
