import { NextRequest, NextResponse } from "next/server";
import { logToSheet } from "@/backend/sheet";

// The enquiry and waitlist forms post here as well as opening Gmail, so a visitor who
// never presses Send still leaves a row.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const kind = body?.kind;
  if ((kind !== "Creator" && kind !== "Bulk" && kind !== "Waitlist") || typeof body.fields !== "object" || !body.fields) {
    return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });
  }

  const row: Record<string, string> = { Time: new Date().toISOString() };
  for (const [k, v] of Object.entries(body.fields).slice(0, 20)) {
    if (typeof v === "string" && v.trim()) row[k.slice(0, 40)] = v.trim().slice(0, 500);
  }

  await logToSheet(kind, row);
  return NextResponse.json({ ok: true });
}
