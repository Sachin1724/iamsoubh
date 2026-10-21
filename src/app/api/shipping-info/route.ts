import { NextRequest, NextResponse } from "next/server";

/**
 * Razorpay Magic Checkout Shipping Info API.
 * Called by Razorpay to check if a delivery pincode is serviceable and calculate shipping fees.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Handle both single address and multiple addresses payload from Razorpay
    const addresses = Array.isArray(body?.addresses)
      ? body.addresses
      : body?.address
        ? [body.address]
        : [];

    const data = addresses.map((addr: { id?: string | number }, idx: number) => ({
      id: String(addr?.id ?? idx + 1),
      shipping_fee: 0, // Free shipping
      cod: false,      // Prepaid only (or true if COD enabled)
      cod_fee: 0,
      serviceable: true,
    }));

    return NextResponse.json({
      success: true,
      serviceable: true,
      cod_serviceable: false,
      shipping_fee: 0,
      cod_fee: 0,
      estimated_delivery_days: 5,
      message: "Delivery available across India",
      data: data.length > 0 ? data : [{ id: "1", shipping_fee: 0, cod: false, cod_fee: 0, serviceable: true }],
    });
  } catch {
    return NextResponse.json({
      success: true,
      serviceable: true,
      cod_serviceable: false,
      shipping_fee: 0,
      cod_fee: 0,
      estimated_delivery_days: 5,
      message: "Delivery available across India",
    });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    serviceable: true,
    shipping_fee: 0,
    cod_serviceable: false,
    cod_fee: 0,
    message: "Shipping service active",
  });
}
