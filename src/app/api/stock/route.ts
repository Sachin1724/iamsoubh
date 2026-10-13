import { NextResponse } from "next/server";
import { getSupabase, forceSoldOut } from "@/server/clients";

export async function GET() {
  // Before Supabase is wired up the page simply hides its counter, rather than erroring.
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "STOCK_UNCONFIGURED" }, { status: 503 });
  }

  const { data, error } = await getSupabase()
    .from("stock")
    .select("cap, remaining")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "STOCK_UNAVAILABLE" }, { status: 503 });
  }

  const remaining = Math.max(data.remaining, 0);

  return NextResponse.json(
    {
      cap: data.cap,
      remaining,
      soldOut: remaining <= 0 || forceSoldOut(),
      familyAvailable: remaining >= 3,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30",
      },
    }
  );
}
