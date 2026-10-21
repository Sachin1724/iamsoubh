import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body?.code ?? "").trim().toUpperCase();

    // If you want to support any custom promo code in future, you can handle it here:
    // e.g., if (code === "SPECIAL10") { return NextResponse.json({ success: true, discount_amount: 1000, ... }) }

    return NextResponse.json({
      success: false,
      error: {
        code: "INVALID_PROMO_CODE",
        description: code ? `Coupon "${code}" is invalid or expired.` : "No coupon provided.",
      },
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: "INVALID_PROMO_CODE",
        description: "Could not apply coupon.",
      },
    });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: {
      code: "METHOD_NOT_ALLOWED",
      description: "POST required to apply promotions.",
    },
  });
}
