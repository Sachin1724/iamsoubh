import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/server/clients";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("o");
  if (!orderId) return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });

  // No personal data leaves this endpoint — the thank-you page polls it unauthenticated.
  const { data, error } = await getSupabase()
    .from("orders")
    .select("status, order_number, boxes, product, amount_paise")
    .eq("razorpay_order_id", orderId)
    .single();

  if (error || !data) {
    return NextResponse.json({ code: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    status: data.status,
    orderNumber: data.order_number,
    boxes: data.boxes,
    product: data.product,
    amountInr: data.amount_paise / 100,
  });
}
