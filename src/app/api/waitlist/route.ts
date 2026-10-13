import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/server/clients";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const phone = String(body?.phone ?? "").replace(/\D/g, "").slice(-10);

  if (!/^\d{10}$/.test(phone)) {
    return NextResponse.json({ code: "BAD_PHONE" }, { status: 400 });
  }

  // Always 200, duplicates included — the visitor never needs to know they signed up twice.
  await getSupabase().from("waitlist").upsert({ phone, utm: body?.utm ?? {} }, { onConflict: "phone" });

  return NextResponse.json({ ok: true });
}
