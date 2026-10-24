"use client";
import { Fragment, useMemo, useState } from "react";
import type { AdminOrder } from "@/backend/orders";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const addr = (o: AdminOrder) =>
  [o.address, o.landmark, o.city, o.state, o.pincode].filter(Boolean).join(", ");

export default function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [q, setQ] = useState("");
  const [pack, setPack] = useState("");
  const [missing, setMissing] = useState(false);
  const [sort, setSort] = useState<"date" | "amount" | "boxes">("date");
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return orders
      .filter((o) => !pack || String(o.boxes) === pack)
      .filter((o) => !missing || !addr(o))
      .filter(
        (o) =>
          !s ||
          [o.name, o.phone, o.email, o.razorpayOrderId, o.pincode, o.city]
            .join(" ")
            .toLowerCase()
            .includes(s)
      )
      .sort((a, b) =>
        sort === "amount"
          ? b.amountInr - a.amountInr
          : sort === "boxes"
            ? b.boxes - a.boxes
            : b.createdAt - a.createdAt
      );
  }, [orders, q, pack, missing, sort]);

  const field = "rounded-full border border-black/10 bg-white px-4 py-2 text-sm";

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          className={`${field} min-w-[220px] flex-1`}
          placeholder="Search name, phone, email, pincode, order id"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={field} value={pack} onChange={(e) => setPack(e.target.value)}>
          <option value="">All packs</option>
          <option value="1">1 box</option>
          <option value="3">3 boxes</option>
          <option value="10">10 boxes</option>
        </select>
        <select
          className={field}
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="date">Newest first</option>
          <option value="amount">Highest paid</option>
          <option value="boxes">Most boxes</option>
        </select>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={missing} onChange={(e) => setMissing(e.target.checked)} />
          Missing address only
        </label>
        <span className="text-sm text-black/50">{rows.length} shown</span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-black/[0.04] text-xs uppercase tracking-wide text-black/60">
            <tr>
              {["Date", "Name", "Phone", "Address", "Pack", "Boxes", "Paid", "Razorpay"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <Fragment key={o.razorpayOrderId}>
                <tr
                  key={o.razorpayOrderId}
                  onClick={() => setOpen(open === o.razorpayOrderId ? null : o.razorpayOrderId)}
                  className="cursor-pointer border-t border-black/5 align-top hover:bg-black/[0.02]"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-black/70">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 font-semibold">{o.name || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{o.phone || "—"}</td>
                  <td className="px-4 py-3 text-black/70">
                    {addr(o) || (
                      <span className="font-semibold text-red-700">no address on order</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {o.product} ×{o.qty}
                  </td>
                  <td className="px-4 py-3 font-bold">{o.boxes}</td>
                  <td className="whitespace-nowrap px-4 py-3">{inr(o.amountInr)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-black/50">{o.razorpayOrderId}</td>
                </tr>
                {open === o.razorpayOrderId && (
                  <tr key={`${o.razorpayOrderId}-d`} className="bg-black/[0.03] text-sm">
                    <td colSpan={8} className="px-4 py-3 text-black/70">
                      Email: {o.email || "—"} · Gift note: {o.giftNote || "—"} · Source:{" "}
                      {o.utm || "—"}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-black/50">
                  No orders match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
