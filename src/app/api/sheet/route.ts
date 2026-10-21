import { NextRequest, NextResponse } from "next/server";
import { logToSheet } from "@/backend/sheet";
import { clientIp, tooMany } from "@/backend/rate-limit";

// The creator, bulk and waitlist forms save here; the Google Sheet is where they land.
// Only these columns may be written, so a crafted request cannot add headers
// (or formula-looking header names) to the sheet.
const FIELDS = {
  Creator: ["Name", "Phone", "Email", "Socials", "Address", "What made you stop", "Content formats"],
  Bulk: ["Name", "Company or group", "Phone", "Email", "Boxes", "Needed by", "Delivery city", "Notes"],
  Waitlist: ["WhatsApp"],
} as const;

export async function POST(req: NextRequest) {
  if (tooMany("sheet", clientIp(req), 5)) return NextResponse.json({ code: "RATE_LIMITED" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const kind = body?.kind;
  if (typeof kind !== "string" || !Object.hasOwn(FIELDS, kind) || typeof body.fields !== "object" || !body.fields) {
    return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });
  }

  const row: Record<string, string> = { Time: new Date().toISOString() };
  for (const k of FIELDS[kind as keyof typeof FIELDS]) {
    const v = body.fields[k];
    if (typeof v === "string" && v.trim()) row[k] = v.trim().slice(0, 500);
  }

  if (!(await logToSheet(kind as keyof typeof FIELDS, row))) {
    return NextResponse.json({ code: "SHEET_FAILED" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
