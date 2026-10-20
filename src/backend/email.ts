import "server-only";
import { siteConfig } from "@/config/site-config";

import type { PaidOrder } from "@/backend/magic-address";

const FROM = process.env.EMAIL_FROM || "Soubh <orders@iamsoubh.com>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://iamsoubh.com";

const INK = "#1B1B1B";
const CREAM = "#F6EFE2";
const GOLD = "#E0A526";
const RED = "#C8221A";

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

/**
 * Tables and inline styles, because Outlook and Gmail still ignore <style> blocks
 * and flexbox. One layout, every message pours into it.
 */
function layout(opts: { preheader: string; heading: string; body: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(opts.heading)}</title></head>
<body style="margin:0;padding:0;background:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:2px solid ${INK};border-radius:16px;overflow:hidden;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${INK};">
    <tr><td style="background:${INK};padding:18px 24px;">
      <span style="color:${CREAM};font-size:18px;font-weight:800;letter-spacing:1px;">IAMSOUBH</span>
      <span style="color:${GOLD};font-size:12px;font-weight:700;float:right;padding-top:5px;">ODIA VIRAL CALENDAR 2027</span>
    </td></tr>
    <tr><td style="padding:28px 24px 8px 24px;">
      <h1 style="margin:0 0 14px 0;font-size:24px;line-height:1.2;color:${RED};">${esc(opts.heading)}</h1>
      ${opts.body}
    </td></tr>
    <tr><td style="padding:20px 24px 28px 24px;border-top:1px solid #e5ded1;color:#4A4642;font-size:12px;line-height:1.6;">
      Questions? Just reply to this email${
        siteConfig.supportEmail ? ` or write to ${esc(siteConfig.supportEmail)}` : ""
      }.<br/>
      <a href="${SITE}" style="color:${RED};">${esc(SITE.replace(/^https?:\/\//, ""))}</a>
      ${siteConfig.legalName ? ` · ${esc(siteConfig.legalName)}` : ""}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

const p = (text: string) =>
  `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;">${text}</p>`;

const button = (href: string, label: string) =>
  `<p style="margin:20px 0 6px 0;"><a href="${esc(href)}" style="background:${GOLD};color:${INK};text-decoration:none;font-weight:700;font-size:15px;padding:12px 24px;border-radius:999px;border:2px solid ${INK};display:inline-block;">${esc(label)}</a></p>`;

const factRow = (label: string, value: string) =>
  `<tr><td style="padding:6px 0;font-size:13px;color:#4A4642;width:120px;">${esc(label)}</td>
       <td style="padding:6px 0;font-size:15px;font-weight:700;">${esc(value)}</td></tr>`;

const facts = (rows: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${CREAM};border-radius:12px;padding:8px 16px;margin:4px 0 8px 0;">${rows}</table>`;

export function renderOrderEmail(o: PaidOrder) {
  const who = esc(o.name?.split(" ")[0] || "there");
  const boxes = `${o.boxes} box${o.boxes > 1 ? "es" : ""}`;

  return {
    subject: `Order confirmed — Odia Viral Calendar 2027`,
    html: layout({
      preheader: `${boxes} reserved. Ships first week of November.`,
      heading: "Your box is booked.",
      body:
        p(`Namaskar ${who}, the payment went through and ${boxes} of the 2027 Odia Viral Calendar ${o.boxes > 1 ? "are" : "is"} reserved in your name.`) +
        facts(
          factRow("Order", o.razorpayOrderId) +
            factRow("Boxes", String(o.boxes)) +
            factRow("Paid", `Rs ${o.amountInr}`)
        ) +
        p("Boxes ship in the first week of November. The moment yours leaves, you get an email with the courier and tracking number — there is nothing to track yet today.") +
        p("Delivering to:") +
        facts(
          factRow("Address", [o.address, o.landmark, o.city, o.state, o.pincode].filter(Boolean).join(", ")) +
            factRow("Phone", o.phone)
        ) +
        p("Wrong address? Reply to this email today and we will fix it before dispatch.") +
        p("— Soubhagya Ranjan"),
    }),
  };
}

/** The operator's copy: everything needed to pack and ship, in one mail. */
export function renderAdminEmail(o: PaidOrder) {
  return {
    subject: `NEW ORDER · ${o.boxes} box${o.boxes > 1 ? "es" : ""} · ${o.name || o.phone}`,
    html: layout({
      preheader: `Rs ${o.amountInr} · ${o.city || ""} ${o.pincode || ""}`,
      heading: "New order paid.",
      body: facts(
        factRow("Name", o.name || "—") +
          factRow("Phone", o.phone || "—") +
          factRow("Email", o.email || "—") +
          factRow("Address", [o.address, o.landmark].filter(Boolean).join(", ") || "—") +
          factRow("City", `${o.city || "—"}, ${o.state || "—"} ${o.pincode || ""}`) +
          factRow("Product", `${o.product} x${o.qty} (${o.boxes} boxes)`) +
          factRow("Paid", `Rs ${o.amountInr}`) +
          factRow("Gift note", o.giftNote || "—") +
          factRow("Razorpay", `${o.razorpayOrderId}${o.paymentId ? ` / ${o.paymentId}` : ""}`) +
          factRow("Source", o.utm || "—")
      ),
    }),
  };
}

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return { sent: false, reason: "unconfigured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html, reply_to: siteConfig.supportEmail || undefined }),
    });
    if (!res.ok) throw new Error(await res.text());
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: String(e) };
  }
}

/**
 * ponytail: Razorpay's own event dedupe (one 200 ends the retries) is the only
 * guard against a double mail now that there is no database. Worst case a buyer
 * gets the same confirmation twice; add a store if that ever actually bites.
 */
export async function sendOrderEmails(o: PaidOrder) {
  const customer = renderOrderEmail(o);
  const admin = renderAdminEmail(o);
  const adminTo = process.env.ADMIN_EMAIL || "";

  const [buyer, operator] = await Promise.all([
    send(o.email, customer.subject, customer.html),
    send(adminTo, admin.subject, admin.html),
  ]);

  return { buyer, operator };
}
