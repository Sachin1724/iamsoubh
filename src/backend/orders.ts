import "server-only";
import { getRazorpay } from "@/backend/clients";
import { mapOrder, type PaidOrder } from "@/backend/magic-address";

/**
 * Razorpay is the order store, so this reads straight from it. Nothing is
 * written anywhere: the list, the box count and the CSV are all derived from
 * the same fetch, cached for a minute so a page refresh does not re-paginate.
 */
type Cache = { at: number; orders: PaidOrder[] };
let cache: Cache | null = null;
const TTL_MS = 60_000;

type RzpOrderList = {
  items: Array<{
    id: string;
    status: string;
    amount: number;
    amount_paid: number;
    created_at: number;
    receipt?: string;
    notes?: Record<string, unknown>;
    customer_details?: unknown;
  }>;
};

export type AdminOrder = PaidOrder & { createdAt: number };

export async function listPaidOrders(force = false): Promise<AdminOrder[]> {
  if (!force && cache && Date.now() - cache.at < TTL_MS) {
    return cache.orders as AdminOrder[];
  }

  const rzp = getRazorpay();
  const out: AdminOrder[] = [];
  let skip = 0;

  // 100 is Razorpay's page ceiling; 500 boxes is five or six pages.
  for (let page = 0; page < 20; page++) {
    const res = (await rzp.orders.all({ count: 100, skip })) as unknown as RzpOrderList;
    const items = res.items ?? [];
    if (items.length === 0) break;

    for (const item of items) {
      if (item.status !== "paid" && item.amount_paid === 0) continue;
      out.push({
        ...mapOrder(item.id, item as Parameters<typeof mapOrder>[1]),
        createdAt: item.created_at * 1000,
      });
    }

    if (items.length < 100) break;
    skip += 100;
  }

  out.sort((a, b) => b.createdAt - a.createdAt);
  cache = { at: Date.now(), orders: out };
  return out;
}

/** Boxes already sold, which is what the 500 cap counts. */
export async function boxesSold(): Promise<number> {
  const orders = await listPaidOrders();
  return orders.reduce((sum, o) => sum + (o.boxes || 0), 0);
}

const cell = (v: string | number | undefined) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// Shiprocket's bulk upload wants one shipment per row, with the parcel's own
// weight and size. One box is 180g; the pack sizes stack in the same carton.
const WEIGHT_KG: Record<number, number> = { 1: 0.25, 3: 0.65, 10: 2.1 };
const DIMENSIONS: Record<number, string> = { 1: "14x10x3", 3: "16x12x5", 10: "24x18x10" };

export function toCsv(orders: AdminOrder[]): string {
  const head = [
    "Order Id",
    "Order Date",
    "Customer Name",
    "Phone",
    "Email",
    "Address",
    "Landmark",
    "City",
    "State",
    "Pincode",
    "Country",
    "Product",
    "Quantity",
    "Boxes",
    "Order Total",
    "Payment Method",
    "Weight (kg)",
    "Dimensions (cm)",
    "Gift Note",
    "Source",
  ];

  const rows = orders.map((o) =>
    [
      o.razorpayOrderId,
      new Date(o.createdAt).toISOString().slice(0, 10),
      o.name,
      o.phone,
      o.email,
      o.address,
      o.landmark,
      o.city,
      o.state,
      o.pincode,
      "India",
      `Odia Viral Calendar 2027 — ${o.product}`,
      o.qty,
      o.boxes,
      o.amountInr,
      "Prepaid",
      WEIGHT_KG[o.boxes] ?? 0.25 * o.boxes,
      DIMENSIONS[o.boxes] ?? "14x10x3",
      o.giftNote,
      o.utm,
    ]
      .map(cell)
      .join(",")
  );

  return [head.join(","), ...rows].join("\n");
}
