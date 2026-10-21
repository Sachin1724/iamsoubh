import { NextRequest, NextResponse } from "next/server";

/**
 * Razorpay Magic Checkout Shipping Info API. Razorpay posts the buyer's
 * addresses; we answer per address. Shipping is free and prepaid-only across
 * India, so every Indian address is serviceable at ₹0 and nothing else is.
 * Set this URL in Razorpay Dashboard → Magic Checkout → Shipping Setup.
 *
 * Fees are in paise. Each address carries both the flat fields of the older
 * spec and `shipping_methods` of the newer one, so either parser accepts it.
 */
type Address = { id?: string | number; zipcode?: string; state_code?: string; country?: string };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const addresses: Address[] = Array.isArray(body?.addresses) ? body.addresses.slice(0, 20) : [];

  return NextResponse.json({
    addresses: addresses.map((a, i) => {
      const serviceable = (a.country ?? "IN").toUpperCase() === "IN" && /^\d{6}$/.test(String(a.zipcode ?? ""));
      return {
        id: String(a.id ?? i),
        zipcode: a.zipcode ?? "",
        state_code: a.state_code ?? "",
        country: a.country ?? "IN",
        serviceable,
        cod: false,
        cod_fee: 0,
        shipping_fee: 0,
        shipping_methods: [
          {
            id: "free",
            name: "Free shipping",
            description: "Delivered across India",
            serviceable,
            shipping_fee: 0,
            cod: false,
            cod_fee: 0,
          },
        ],
      };
    }),
  });
}
