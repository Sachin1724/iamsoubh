import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site-config";
import { boxesSold } from "@/backend/orders";

// The count is a sum over Razorpay's own paid orders (cached a minute inside
// boxesSold), so there is no counter to drift out of step with the money. The
// CDN holds it a further 30s, so a burst of visitors is still one Razorpay read.
export async function GET() {
  try {
    const sold = await boxesSold();
    const remaining = Math.max(0, siteConfig.batchCap - sold);
    return NextResponse.json(
      { cap: siteConfig.batchCap, remaining, soldOut: remaining === 0 },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch {
    // Razorpay unreachable or unconfigured: the page falls back to no counter.
    return NextResponse.json({ code: "UNAVAILABLE" }, { status: 503 });
  }
}
