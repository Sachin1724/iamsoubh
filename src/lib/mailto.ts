import { siteConfig } from "@/config/site-config";

export const SUPPORT_EMAIL = siteConfig.supportEmail;

/**
 * Both enquiry forms hand off to the visitor's mail app instead of posting to a
 * form service: no API key, no backend, and the person keeps a copy of what
 * they sent in their own Sent folder.
 *
 * The subject prefix is what Soubh filters on, so it is fixed here rather than
 * typed at each call site.
 */
export function openMail(
  kind: "Creator" | "Bulk",
  who: string,
  fields: Record<string, string | undefined>
) {
  const subject = `[${kind}] ${who.trim() || "Enquiry"}`;

  const body = Object.entries(fields)
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`)
    .join("\n");

  const url = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = url;
}

/**
 * Send an enquiry from the page. Returns "sent" when the server mailed it, or
 * "mail" when it could not and the visitor's mail app was opened instead, so
 * an enquiry is never lost to a missing key or a network blip.
 */
export async function submitEnquiry(
  kind: "Creator" | "Bulk",
  who: string,
  fields: Record<string, string | undefined>,
  replyTo?: string,
  trap = ""
): Promise<"sent" | "mail"> {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) if (v && v.trim()) clean[k] = v.trim();

  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, who, fields: clean, replyTo, website: trap }),
    });
    if (res.ok) return "sent";
  } catch {
    // fall through to the mail app
  }
  openMail(kind, who, fields);
  return "mail";
}
