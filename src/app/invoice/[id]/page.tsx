import { getSupabase } from "@/server/clients";
import { siteConfig } from "@/config/site-config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invoice", robots: { index: false, follow: false } };

const inr = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);

const TBC = (v: string) => v || "[TO CONFIRM]";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: o, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  // The uuid is the only credential, so an unpaid or expired hold must not render
  // one — and a wrong id is indistinguishable from an unpaid one.
  if (error || !o || !["paid", "shipped"].includes(o.status)) {
    return <main className="p-8 font-mono text-sm">Invoice not found.</main>;
  }

  // The stored total is authoritative; the unit rate is derived from it, so a
  // price change later never rewrites an old invoice.
  const unit = o.amount_paise / o.qty;

  return (
    <main className="min-h-screen bg-white text-black p-8 print:p-0">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start gap-6 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-2xl font-black uppercase">Invoice</h1>
            <p className="text-sm tabular-nums mt-1">
              #{o.order_number ?? "—"} ·{" "}
              {new Date(o.paid_at ?? o.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">{TBC(siteConfig.legalName)}</p>
            <p className="whitespace-pre-line">{TBC(siteConfig.businessAddress)}</p>
            <p>{TBC(siteConfig.supportEmail)}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 py-5 text-sm">
          <div>
            <p className="font-bold uppercase text-xs tracking-wider mb-1">Billed to</p>
            <p>{o.name ?? "—"}</p>
            <p className="whitespace-pre-line">
              {[o.address, o.landmark, o.city, o.state, o.pincode].filter(Boolean).join(", ")}
            </p>
            <p>{o.phone}</p>
            <p>{o.email}</p>
          </div>
          <div>
            <p className="font-bold uppercase text-xs tracking-wider mb-1">Payment</p>
            <p>Razorpay payment: {o.razorpay_payment_id ?? "—"}</p>
            <p>Razorpay order: {o.razorpay_order_id ?? "—"}</p>
            <p>Status: {o.status}</p>
          </div>
        </div>

        <table className="w-full text-sm border-t-2 border-black">
          <thead>
            <tr className="text-left border-b border-black/30">
              <th className="py-2">Item</th>
              <th className="py-2 text-right tabular-nums">Qty</th>
              <th className="py-2 text-right tabular-nums">Rate</th>
              <th className="py-2 text-right tabular-nums">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black/15">
              <td className="py-2">
                Odia Viral Calendar 2027 — {o.product} ({o.boxes} box
                {o.boxes > 1 ? "es" : ""})
              </td>
              <td className="py-2 text-right tabular-nums">{o.qty}</td>
              <td className="py-2 text-right tabular-nums">{inr(unit)}</td>
              <td className="py-2 text-right tabular-nums">{inr(o.amount_paise)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="py-2 text-right font-bold">
                Total
              </td>
              <td className="py-2 text-right font-bold tabular-nums">{inr(o.amount_paise)}</td>
            </tr>
          </tbody>
        </table>

        <p className="text-xs text-black/60 mt-4">
          {siteConfig.gstIncluded ? "All prices inclusive of GST." : "GST not applicable."} Shipping
          included.
        </p>

        <button
          // ponytail: the browser's own print-to-PDF, instead of a PDF library.
          // Swap for server-side rendering only if invoices ever need to be emailed.
          className="print:hidden mt-6 text-sm font-bold px-4 py-2 rounded-full bg-black text-white cursor-pointer"
          data-print
        >
          Print / Save as PDF
        </button>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.querySelector('[data-print]').onclick=()=>print()`,
          }}
        />
      </div>
    </main>
  );
}
