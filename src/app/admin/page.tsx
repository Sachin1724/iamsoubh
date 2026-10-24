import React from "react";
import { siteConfig } from "@/config/site-config";
import { listPaidOrders, type AdminOrder } from "@/backend/orders";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders · IAMSOUBH", robots: { index: false, follow: false } };

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default async function AdminPage() {
  let orders: AdminOrder[] = [];
  let failed = false;
  try {
    orders = await listPaidOrders();
  } catch {
    orders = [];
    failed = true;
  }

  const boxes = orders.reduce((sum, o) => sum + (o.boxes || 0), 0);
  const revenue = orders.reduce((sum, o) => sum + (o.amountInr || 0), 0);
  const left = Math.max(0, siteConfig.batchCap - boxes);
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
          <a
            href="/api/admin/xls"
            className="rounded-full bg-[#8E1B1B] px-6 py-3 text-sm font-bold text-[#FFF4E2]"
          >
            Download Excel for Shiprocket
          </a>
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

        {/* Everything needed to pack, in the order they came in */}
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-black/[0.04] text-xs uppercase tracking-wide text-black/60">
              <tr>
                {["Date", "Name", "Phone", "Address", "Pack", "Boxes", "Paid", "Razorpay"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.razorpayOrderId} className="border-t border-black/5 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-black/70">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 font-semibold">{o.name || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{o.phone || "—"}</td>
                  <td className="px-4 py-3 text-black/70">
                    {[o.address, o.landmark, o.city, o.state, o.pincode]
                      .filter(Boolean)
                      .join(", ") || (
                      <span className="font-semibold text-red-700">no address on order</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {o.product} ×{o.qty}
                  </td>
                  <td className="px-4 py-3 font-bold">{o.boxes}</td>
                  <td className="whitespace-nowrap px-4 py-3">{inr(o.amountInr)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-black/50">
                    {o.razorpayOrderId}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && !failed && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-black/50">
                    No paid orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-black/50">
          Save every Excel file you download. Those files are the only copy outside Razorpay.
        </p>
      </div>
    </main>
  );
}
