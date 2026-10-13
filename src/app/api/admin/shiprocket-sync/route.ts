import { NextRequest, NextResponse } from "next/server";
import { syncOrderToShiprocket } from "@/server/shiprocket";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.orderId) {
    return NextResponse.json({ error: "MISSING_ORDER_ID" }, { status: 400 });
  }

  try {
    await syncOrderToShiprocket({ orderId: body.orderId });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
