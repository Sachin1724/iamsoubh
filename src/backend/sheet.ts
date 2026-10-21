import "server-only";

/**
 * One row per record in a Google Sheet, through an Apps Script web app (see
 * docs/google-sheet-script.gs). Tabs: Creator, Bulk, Orders, Waitlist. With a `key` the
 * row is updated in place, which is how an Unpaid order turns Paid.
 * A missing URL or a failed write is swallowed: a sheet must never break a
 * checkout or a form.
 */
export type SheetTab = "Creator" | "Bulk" | "Orders" | "Waitlist";

export async function logToSheet(
  tab: SheetTab,
  row: Record<string, string | number>,
  key?: string
): Promise<void> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "text/plain" }, // Apps Script rejects a CORS-style JSON preflight
      body: JSON.stringify({ secret: process.env.GOOGLE_SHEET_SECRET ?? "", tab, key, row }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // intentionally silent
  }
}
