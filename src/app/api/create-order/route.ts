import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getRazorpay, PRICING, isProduct, forceSoldOut, alert } from "@/server/clients";
import { boxesSold } from "@/server/orders";
import { siteConfig } from "@/config/site-config";

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

// The box stays secret until it ships, so the checkout line item shows the
// gamuchha-wrapped parcel instead.
const LABELS = {
  single: "Single Box",
  family: "Family Pack (3 boxes)",
  gift: "Gift Pack (10 boxes)",
} as const;

export async function POST(req: NextRequest) {
  if (forceSoldOut()) {
    return NextResponse.json({ code: "SOLD_OUT" }, { status: 409 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });

  const { product, qty, customer, utm } = body as {
    product: unknown;
    qty: unknown;
    customer?: Customer;
    utm?: Record<string, string>;
  };

  if (!isProduct(product)) {
    return NextResponse.json({ code: "BAD_PRODUCT" }, { status: 400 });
  }

  const rules = PRICING[product];
  if (!Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > rules.maxQty) {
    return NextResponse.json({ code: "BAD_QTY" }, { status: 400 });
  }

  const quantity = qty as number;
  const c = customer ?? {};

  // Magic Checkout collects the delivery address itself, so the phone number is
  // the only thing we need up front. Anything else the form sends is a bonus
  // prefill; the authoritative address is read back off the paid order.
  if (!/^\d{10}$/.test(c.phone ?? "")) {
    return NextResponse.json({ code: "BAD_PHONE" }, { status: 400 });
  }

  // Price and box count come from server config only.
  const boxes = rules.boxesEach * quantity;

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

  const amount = rules.price * quantity * 100;
  const receipt = crypto.randomUUID();

  try {
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://iamsoubh.com";
    const label = `Odia Viral Calendar 2027 · ${LABELS[product]}`;

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
          price: rules.price * 100,
          offer_price: rules.price * 100,
          quantity,
          name: label,
          description: `${boxes} box${boxes > 1 ? "es" : ""} · 12 festival cards, a sealed 13th parba, stickers and a note.`,
          image_url: `${site}/assets/product/parcel-${rules.boxesEach}.webp`,
        },
      ],
      // Razorpay is the only order store now, so everything the admin mail and
      // the thank-you screen read has to live in the notes.
      notes: {
        product,
        qty: String(quantity),
        boxes: String(boxes),
        name: c.name?.trim() ?? "",
        phone: c.phone!,
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
