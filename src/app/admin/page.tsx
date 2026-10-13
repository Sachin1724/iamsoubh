import { getSupabase } from "@/server/clients";
import { OrderRow, type QueueOrder } from "./OrderRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fulfillment", robots: { index: false, follow: false } };

type StateRow = { state: string; orders: number; boxes: number; amount_inr: number };

export default async function AdminPage() {
  const db = getSupabase();
  const [queue, byState] = await Promise.all([
    db.from("fulfillment_queue").select("*"),
    db.from("orders_by_state").select("*"),
  ]);

  const orders = (queue.data ?? []) as QueueOrder[];
  const states = (byState.data ?? []) as StateRow[];
  const pending = orders.filter((o) => o.status === "paid");
  const shipped = orders.filter((o) => o.status === "shipped");

  if (queue.error) {
    return (
      <main className="p-8 font-mono text-sm">
        Supabase unreachable: {queue.error.message}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6EFE2] text-[#1B1B1B] p-5 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Fulfillment</h1>
            <p className="text-sm text-[#4A4642] mt-1 tabular-nums">
              {pending.length} to pack · {shipped.length} shipped ·{" "}
              {orders.reduce((n, o) => n + o.boxes, 0)} boxes
            </p>
          </div>
          <a
            href="/api/admin/email-preview?kind=confirmed"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold px-4 py-2 rounded-full bg-white border-2 border-[#1B1B1B] shadow-[3px_3px_0_#1B1B1B] hover:shadow-[4px_4px_0_#1B1B1B] transition-shadow"
          >
            Preview emails
          </a>
          <a
            href="/api/admin/export"
            className="text-sm font-bold px-4 py-2 rounded-full bg-[#E0A526] border-2 border-[#1B1B1B] shadow-[3px_3px_0_#1B1B1B] hover:shadow-[4px_4px_0_#1B1B1B] transition-shadow"
          >
            Download CSV
          </a>
        </div>

        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#8A1717] mb-2">
            Where orders came from
          </h2>
          <div className="flex flex-wrap gap-2">
            {states.length === 0 && (
              <p className="text-sm text-[#4A4642]">No paid orders yet.</p>
            )}
            {states.map((s) => (
              <span
                key={s.state}
                className="text-sm bg-white border-2 border-[#1B1B1B] rounded-full px-3 py-1 tabular-nums"
              >
                {s.state} · <b>{s.boxes}</b> boxes ({s.orders})
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#8A1717] mb-2">
            Checklist
          </h2>
          <div className="space-y-3">
            {orders.length === 0 && (
              <p className="text-sm text-[#4A4642]">Nothing paid yet.</p>
            )}
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
