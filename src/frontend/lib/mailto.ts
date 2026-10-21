import { siteConfig } from "@/config/site-config";

export const SUPPORT_EMAIL = siteConfig.supportEmail;

/**
 * Both enquiry forms hand off to the visitor's own mail instead of posting to a
 * form service: no API key, no backend, and the person keeps a copy of what
 * they sent in their own Sent folder.
 *
 * The subject prefix is what Soubh filters on, so it is fixed here rather than
 * typed at each call site.
 */
export function openMail(
  kind: "Creator" | "Bulk" | "Waitlist",
  who: string,
  fields: Record<string, string | undefined>
) {
  const subject = `[${kind}] ${who.trim() || "Enquiry"}`;

  // Also log it to the Google Sheet (best effort), in case the Gmail draft is never sent.
  fetch("/api/sheet", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, fields }),
    keepalive: true,
  }).catch(() => {});

  const body = Object.entries(fields)
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`)
    .join("\n");

  const q = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Desktop: straight into a Gmail compose window, filled in. Phones: mailto,
  // which opens whichever mail app is the default (Gmail, for most people).
  const phone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!phone) {
    const w = window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.supportEmail)}&${q}`,
      "_blank",
      "noopener"
    );
    if (w) return;
  }
  window.location.href = `mailto:${siteConfig.supportEmail}?${q}`;
}
