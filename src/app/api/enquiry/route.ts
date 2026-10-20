import { NextRequest, NextResponse } from "next/server";
import { sendEnquiry, type EnquiryKind } from "@/server/email";

// ponytail: per-instance memory, so it resets on deploy and is per serverless
// instance. Enough to stop a casual flood; move to a shared store if it ever isn't.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ code: "BAD_REQUEST" }, { status: 400 });
  }

  const { kind, who, fields, replyTo, website } = body as {
    kind?: unknown;
    who?: unknown;
    fields?: unknown;
    replyTo?: unknown;
    website?: unknown;
  };

  // Hidden field a person never fills. A bot does: answer "fine" and drop it.
  if (typeof website === "string" && website.trim()) return NextResponse.json({ ok: true });

  if (kind !== "Creator" && kind !== "Bulk") {
    return NextResponse.json({ code: "BAD_KIND" }, { status: 400 });
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return NextResponse.json({ code: "BAD_FIELDS" }, { status: 400 });
  }

  const entries = Object.entries(fields as Record<string, unknown>);
  if (entries.length === 0 || entries.length > 14) {
    return NextResponse.json({ code: "BAD_FIELDS" }, { status: 400 });
  }
  const clean: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (typeof v !== "string") return NextResponse.json({ code: "BAD_FIELDS" }, { status: 400 });
    if (v.trim()) clean[k.slice(0, 40)] = v.trim().slice(0, 1500);
  }

  // Every enquiry has to be answerable.
  if (!/^\d{10}$/.test(clean.Phone ?? "")) {
    return NextResponse.json({ code: "BAD_PHONE" }, { status: 400 });
  }
  const email = typeof replyTo === "string" && /^\S+@\S+\.\S+$/.test(replyTo.trim()) ? replyTo.trim() : undefined;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ code: "RATE_LIMITED" }, { status: 429 });

  const result = await sendEnquiry(
    kind as EnquiryKind,
    typeof who === "string" ? who.slice(0, 120) : "",
    clean,
    email
  );

  // Not configured or Resend refused: tell the browser so it can fall back to
  // the visitor's mail app rather than lose the enquiry.
  if (!result.sent) return NextResponse.json({ code: "MAIL_FAILED" }, { status: 503 });
  return NextResponse.json({ ok: true });
}
