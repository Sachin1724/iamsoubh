import "server-only";
import { getRazorpay } from "@/backend/clients";

type RzpAddress = {
  name?: string;
  contact?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
};

export type PaidOrder = {
  razorpayOrderId: string;
  paymentId?: string;
  receipt?: string;
  amountInr: number;
  product: string;
  qty: number;
  boxes: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  giftNote: string;
  utm: string;
};

const s = (v: unknown) => (typeof v === "string" ? v : "");

/**
 * Magic Checkout collects the delivery address inside Razorpay, so the paid
 * order is the only place it exists. This reads the order back and merges it
 * with the notes written at create time — no database in the loop.
 */
export type RzpOrder = {
  amount: number;
  receipt?: string;
  notes?: Record<string, unknown>;
  customer_details?: {
    name?: string;
    contact?: string;
    email?: string;
    shipping_address?: RzpAddress;
  };
};

export async function fetchPaidOrder(
  razorpayOrderId: string,
  paymentId?: string
): Promise<PaidOrder> {
  const rzp = getRazorpay();
  const order = (await rzp.orders.fetch(razorpayOrderId)) as unknown as RzpOrder;

  // If paymentId is present and contact/email wasn't on the order, try payment entity
  if (paymentId && (!order.customer_details?.contact || !order.customer_details?.email)) {
    try {
      const pay = (await rzp.payments.fetch(paymentId)) as unknown as {
        contact?: string;
        email?: string;
      };
      if (pay) {
        order.customer_details = {
          ...order.customer_details,
          contact: order.customer_details?.contact || pay.contact,
          email: order.customer_details?.email || pay.email,
        };
      }
    } catch {
      // Non-fatal, use whatever order had
    }
  }

  return mapOrder(razorpayOrderId, order, paymentId);
}

/** The same order object, shaped for packing. Used by the webhook and /admin. */
export function mapOrder(
  razorpayOrderId: string,
  order: RzpOrder,
  paymentId?: string
): PaidOrder {
  const n = order.notes ?? {};
  const d = order.customer_details;
  const anyOrder = order as unknown as {
    customer_details?: {
      billing_address?: RzpAddress;
      shipping_address?: RzpAddress;
    };
  };
  const ship = d?.shipping_address || anyOrder.customer_details?.billing_address;

  const rawLine1 = ship?.line1 || (ship as Record<string, unknown>)?.address;
  const rawLine2 = ship?.line2 || (ship as Record<string, unknown>)?.street;
  const shipAddress = [rawLine1, rawLine2].filter(Boolean).join(", ").slice(0, 250);

  const rawPhone = ship?.contact ?? d?.contact ?? (n.phone as string) ?? "";
  const shipPhone = String(rawPhone).replace(/\D/g, "").slice(-10);

  const rawPin =
    ship?.zipcode ||
    (ship as Record<string, unknown>)?.postal_code ||
    (ship as Record<string, unknown>)?.pincode ||
    s(n.pincode);
  const pincode = String(rawPin ?? "").replace(/\D/g, "").slice(0, 6);

  // The address Razorpay captured wins; the form prefill is only the fallback.
  return {
    razorpayOrderId,
    paymentId,
    receipt: order.receipt,
    amountInr: order.amount / 100,
    product: s(n.product) || "single",
    qty: Number(s(n.qty)) || 1,
    boxes: Number(s(n.boxes)) || 1,
    name: String(ship?.name || d?.name || s(n.name) || "").trim(),
    email: String(d?.email || s(n.email) || "").trim(),
    phone: shipPhone.length === 10 ? shipPhone : s(n.phone),
    address: shipAddress || s(n.address),
    city: String(ship?.city || s(n.city) || "").trim(),
    state: String(ship?.state || s(n.state) || "").trim(),
    pincode,
    landmark: s(n.landmark),
    giftNote: s(n.gift_note),
    utm: s(n.utm),
  };
}
