import { NextResponse } from "next/server";
import { getSupabase } from "@/server/clients";
import { sendOrderEmail } from "@/server/email";

/**
 * Entering the tracking number IS the shipped signal — one action, not three.
 */
export async function POST(req: Request) {
  const { orderId, courier, trackingNumber, trackingUrl } = await req.json();
  if (!orderId || !trackingNumber) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("orders")
    .update({
      status: "shipped",
      courier: courier || null,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl || null,
      shipped_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .in("status", ["paid", "shipped"])
    .select("id, name, email, order_number, boxes, courier, tracking_number, tracking_url")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 400 });
  }

  const mail = await sendOrderEmail("shipped", data);
  return NextResponse.json({ ok: true, order: data, mail });
}
