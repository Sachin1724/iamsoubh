import { getSupabase } from "@/server/clients";

const COLUMNS = [
  "order_number", "status", "name", "phone", "email", "product", "boxes",
  "address", "landmark", "city", "state", "pincode", "gift_note",
  "courier", "tracking_number", "paid_at", "shipped_at",
] as const;

const cell = (v: unknown) =>
  v == null ? "" : `"${String(v).replace(/"/g, '""')}"`;

/** CSV, because Excel and Sheets both open it without a sync job. */
export async function GET() {
  const { data, error } = await getSupabase()
    .from("fulfillment_queue")
    .select(COLUMNS.join(","));

  if (error) return new Response("EXPORT_FAILED", { status: 503 });

  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const csv = [
    COLUMNS.join(","),
    ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
