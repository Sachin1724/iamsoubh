import { siteConfig } from "@/config/site-config";

export const SUPPORT_EMAIL = siteConfig.supportEmail;

/**
 * The creator, bulk and waitlist forms save straight to the Google Sheet through
 * /api/sheet. Resolves true once the row is written, so the form can say so.
 */
export async function submitForm(
  kind: "Creator" | "Bulk" | "Waitlist",
  fields: Record<string, string | undefined>
): Promise<boolean> {
  try {
    const res = await fetch("/api/sheet", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, fields }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
