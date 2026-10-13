import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getRazorpay, PRICING, isProduct, forceSoldOut, alert } from "@/server/clients";

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

  if (!c.name?.trim() || !/^\d{10}$/.test(c.phone ?? "") || !/^\d{6}$/.test(c.pincode ?? "") || !c.address?.trim()) {
    return NextResponse.json({ code: "BAD_CUSTOMER" }, { status: 400 });
  }

  // Price and box count come from server config only.
  const boxes = rules.boxesEach * quantity;
  const amount = rules.price * quantity * 100;

  const { data: reserved, error: reserveError } = await getSupabase()
    .rpc("reserve_boxes", {
      p_product: product,
      p_qty: quantity,
      p_boxes: boxes,
      p_amount: amount,
      p_customer: c,
      p_utm: utm ?? {},
    })
    .single<{ order_id: string; remaining: number }>();

  if (reserveError) {
    const match = /OUT_OF_STOCK:(\d+)/.exec(reserveError.message);
    if (match) {
      return NextResponse.json(
        { code: "OUT_OF_STOCK", remaining: Number(match[1]) },
        { status: 409 }
      );
    }
    await alert(`create-order reserve failed: ${reserveError.message}`);
    return NextResponse.json({ code: "RESERVE_FAILED" }, { status: 500 });
  }

  const dbOrderId = reserved!.order_id;

  try {
    const rzpOrder = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: dbOrderId,
      notes: {
        db_order_id: dbOrderId,
        product,
        qty: String(quantity),
        boxes: String(boxes),
        name: c.name!,
        phone: c.phone!,
        pincode: c.pincode!,
        city: c.city ?? "",
        state: c.state ?? "",
        address: (c.address ?? "").slice(0, 250),
        landmark: (c.landmark ?? "").slice(0, 120),
        gift_note: (c.giftNote ?? "").slice(0, 200),
      },
    });

    await getSupabase()
      .from("orders")
      .update({ razorpay_order_id: rzpOrder.id })
      .eq("id", dbOrderId);

    return NextResponse.json({
      dbOrderId,
      razorpayOrderId: rzpOrder.id,
      amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    // Release the hold immediately so the boxes go back to the pool.
    await getSupabase().from("orders").update({ status: "failed" }).eq("id", dbOrderId);
    await alert(`razorpay order create failed for ${dbOrderId}: ${String(e)}`);
    return NextResponse.json({ code: "RAZORPAY_FAILED" }, { status: 502 });
  }
}
