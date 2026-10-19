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
