import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/server/clients";

/**
 * Razorpay is the order store, so the thank-you screen reads its status
 * straight off the order. No personal data leaves this endpoint — the page
 * polls it unauthenticated.
 */
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("o");
  if (!orderId) return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });

  try {
    const order = (await getRazorpay().orders.fetch(orderId)) as unknown as {
      status: string;
      amount: number;
      amount_paid: number;
      notes?: Record<string, unknown>;
    };

    const n = order.notes ?? {};

    return NextResponse.json({
      // Razorpay says "paid" / "attempted" / "created"; the page only waits on "held".
      status: order.status === "paid" || order.amount_paid > 0 ? "paid" : "held",
      orderNumber: null,
      boxes: Number(typeof n.boxes === "string" ? n.boxes : "") || 1,
      product: typeof n.product === "string" ? n.product : "single",
      amountInr: order.amount / 100,
    });
  } catch {
    return NextResponse.json({ code: "NOT_FOUND" }, { status: 404 });
  }
}
