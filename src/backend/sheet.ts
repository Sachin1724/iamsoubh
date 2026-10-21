import "server-only";

/**
 * One row per record in a Google Sheet, through an Apps Script web app (see
 * docs/google-sheet-script.gs). Tabs: Creator, Bulk, Orders, Waitlist. With a `key` the
 * row is updated in place, which is how an Unpaid order turns Paid.
 * Never throws: a sheet must never break a checkout. Returns whether the row
 * was written, so the public forms can tell the visitor.
 */
export type SheetTab = "Creator" | "Bulk" | "Orders" | "Waitlist";

export async function logToSheet(
  tab: SheetTab,
  row: Record<string, string | number>,
  key?: string
): Promise<boolean> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "text/plain" }, // Apps Script rejects a CORS-style JSON preflight
      body: JSON.stringify({ secret: process.env.GOOGLE_SHEET_SECRET ?? "", tab, key, row }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok && (await res.text()).trim() === "ok";
  } catch {
    return false;
  }
}
