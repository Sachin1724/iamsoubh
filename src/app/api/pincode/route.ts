import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pin = req.nextUrl.searchParams.get("pin") ?? "";
  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json({ code: "BAD_PIN" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      signal: AbortSignal.timeout(3000),
    });
    const json = await res.json();
    const office = json?.[0]?.PostOffice?.[0];

    if (!office) return NextResponse.json({ code: "NOT_FOUND" }, { status: 404 });

    return NextResponse.json(
      { city: office.District, state: office.State },
      { headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400" } }
    );
  } catch {
    // Lookup is a convenience; the form stays editable when it fails.
    return NextResponse.json({ code: "LOOKUP_FAILED" }, { status: 404 });
  }
}
