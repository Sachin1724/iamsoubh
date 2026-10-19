import { NextResponse } from "next/server";
import { listPaidOrders, toCsv } from "@/server/orders";

export const dynamic = "force-dynamic";

/** The file Soubh uploads to Shiprocket. Generated per request, stored nowhere. */
export async function GET() {
  try {
    const orders = await listPaidOrders(true);
    const stamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(toCsv(orders), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="orders-${stamp}.csv"`,
        "cache-control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return NextResponse.json({ code: "RAZORPAY_FAILED" }, { status: 502 });
  }
}
