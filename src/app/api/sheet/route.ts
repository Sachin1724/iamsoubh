import { NextRequest, NextResponse } from "next/server";
import { logToSheet } from "@/backend/sheet";

// The creator, bulk and waitlist forms save here; the Google Sheet is where they land.
// ponytail: per-instance memory, so it slows a flood rather than stopping a
// distributed one; add Vercel firewall rate limiting for that.
const hits = new Map<string, number[]>();
const LIMIT = 5; // per IP per 10 minutes

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) return NextResponse.json({ code: "RATE_LIMITED" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const kind = body?.kind;
  if ((kind !== "Creator" && kind !== "Bulk" && kind !== "Waitlist") || typeof body.fields !== "object" || !body.fields) {
    return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });
  }

  const row: Record<string, string> = { Time: new Date().toISOString() };
  for (const [k, v] of Object.entries(body.fields).slice(0, 20)) {
    if (typeof v === "string" && v.trim()) row[k.slice(0, 40)] = v.trim().slice(0, 500);
  }

  if (!(await logToSheet(kind, row))) {
    return NextResponse.json({ code: "SHEET_FAILED" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
