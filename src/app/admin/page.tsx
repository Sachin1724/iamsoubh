import OrdersTable from "./orders-table";
import { siteConfig } from "@/config/site-config";
import { listPaidOrders, type AdminOrder } from "@/backend/orders";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders · IAMSOUBH", robots: { index: false, follow: false } };

const hasAddr = (o: AdminOrder) => Boolean(o.address || o.city || o.pincode);
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ refresh?: string }>;
}) {
  const { refresh } = await searchParams;
  let orders: AdminOrder[] = [];
  let failed = false;
  try {
    orders = await listPaidOrders(refresh === "1");
  } catch {
    orders = [];
    failed = true;
  }

  const boxes = orders.reduce((sum, o) => sum + (o.boxes || 0), 0);
  const revenue = orders.reduce((sum, o) => sum + (o.amountInr || 0), 0);
  const left = Math.max(0, siteConfig.batchCap - boxes);
  const noAddr = orders.filter((o) => !hasAddr(o)).length;
  const pct = Math.min(100, Math.round((boxes / siteConfig.batchCap) * 100));

  return (
    <main className="min-h-screen bg-[#F6EFE2] px-4 py-10 text-[#1B1B1B] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="mt-1 text-sm text-black/60">
              Live from Razorpay, cached for a minute. Nothing is stored here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/logout" className="rounded-full border border-black/20 px-5 py-3 text-sm font-bold">
              Log out
            </a>
            <a href="/admin?refresh=1" className="rounded-full border border-black/20 px-5 py-3 text-sm font-bold">
              Refresh
            </a>
            <a
              href="/api/admin/xls?only=complete"
              className="rounded-full bg-[#8E1B1B] px-6 py-3 text-sm font-bold text-[#FFF4E2]"
            >
              Excel for Shiprocket (with address)
            </a>
            <a href="/api/admin/xls" className="rounded-full border border-black/20 px-5 py-3 text-sm font-bold">
              All orders
            </a>
          </div>
        </header>

        {failed && (
          <p className="mt-6 rounded-xl bg-red-100 p-4 text-sm font-semibold text-red-800">
            Could not reach Razorpay. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.
          </p>
        )}

        {/* The batch, at a glance */}
        <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Boxes sold", value: `${boxes} / ${siteConfig.batchCap}` },
            { label: "Boxes left", value: String(left) },
            { label: "Paid orders", value: String(orders.length) },
            { label: "Collected", value: inr(revenue) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/50">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </section>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div className="h-full rounded-full bg-[#8E1B1B]" style={{ width: `${pct}%` }} />
        </div>

        {noAddr > 0 && (
          <p className="mt-4 rounded-xl bg-amber-100 p-3 text-sm font-semibold text-amber-900">
            {noAddr} of {orders.length} orders have no address. The Shiprocket export skips them.
          </p>
        )}

        <OrdersTable orders={orders} />

        <p className="mt-6 text-xs text-black/50">
          Save every Excel file you download. Those files are the only copy outside Razorpay.
        </p>
      </div>
    </main>
  );
}
