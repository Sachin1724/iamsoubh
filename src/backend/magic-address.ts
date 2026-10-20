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
  const order = (await getRazorpay().orders.fetch(razorpayOrderId)) as unknown as RzpOrder;
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
  const ship = d?.shipping_address;

  const shipAddress = [ship?.line1, ship?.line2].filter(Boolean).join(", ").slice(0, 250);
  const shipPhone = (ship?.contact ?? d?.contact ?? "").replace(/\D/g, "").slice(-10);

  // The address Razorpay captured wins; the form prefill is only the fallback.
  return {
    razorpayOrderId,
    paymentId,
    receipt: order.receipt,
    amountInr: order.amount / 100,
    product: s(n.product) || "single",
    qty: Number(s(n.qty)) || 1,
    boxes: Number(s(n.boxes)) || 1,
    name: ship?.name || d?.name || s(n.name),
    email: d?.email || s(n.email),
    phone: shipPhone.length === 10 ? shipPhone : s(n.phone),
    address: shipAddress || s(n.address),
    city: ship?.city || s(n.city),
    state: ship?.state || s(n.state),
    pincode: (ship?.zipcode || s(n.pincode)).replace(/\D/g, "").slice(0, 6),
    landmark: s(n.landmark),
    giftNote: s(n.gift_note),
    utm: s(n.utm),
  };
}
