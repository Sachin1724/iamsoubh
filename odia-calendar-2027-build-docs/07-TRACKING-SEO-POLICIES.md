# 07 · Tracking, SEO and Policy Pages

## 1. Event map

The same moments are tracked in **Meta Pixel** and **GA4**, so we can see which section actually sells.

| Moment | Meta Pixel | GA4 | Parameters |
|---|---|---|---|
| Page load | `PageView` | `page_view` (automatic) | UTMs (automatic) |
| Section 03 reached (40% visible, once) | `ViewContent` | `view_item` | `content_name: 'calendar_2027'`, `value: 299`, `currency: 'INR'` |
| Slider dragged (once per month per session) | — | `slider_drag` | `month` |
| Story opened | — | `story_open` | `city`, `source: 'circle' \| 'wall'` |
| Video first plays | — | `video_play` | `index`, `handle`, `autoplay: bool` |
| "Watch on Instagram" | — | `video_instagram_click` | `handle` |
| Option changed | — | `select_item` | `item_id: 'single' \| 'family'` |
| "Let's Odia This" tap | `InitiateCheckout` | `begin_checkout` | `value`, `currency`, `num_items` (boxes), `content_ids: [product]` |
| Razorpay opens | `AddPaymentInfo` | `add_payment_info` | `value`, `currency` |
| Payment confirmed on /thank-you | `Purchase` | `purchase` | `value`, `currency: 'INR'`, `eventID` / `transaction_id` = `razorpay_payment_id`, `num_items` |
| Quote popup opened | — | `quote_open` | `from: 'section' \| 'stepper' \| 'faq'` |
| Quote sent | `Lead` | `quote_submit` (also mark as a key event) | `range` |
| Waitlist joined | `Lead` (`content_name: 'batch2_waitlist'`) | `waitlist_join` | — |
| Sticky bar tap | — | `sticky_cta` | `state` |

**Implementation notes**
- Load the Pixel and GA4 **after first paint** (`requestIdleCallback`, or on the first interaction) so they never slow the hero.
- Wrap both in one `track(name, params)` helper so components never call `fbq` or `gtag` directly.
- `Purchase` fires **only once** per payment: guard it with `sessionStorage['ovc27_purchased_' + paymentId]`. The `eventID` lets a Conversions API event (added later) be deduplicated.
- Never send personal data (name, phone, address) to either tool.

**Test before launch:** Meta Events Manager → Test Events, and GA4 → DebugView. Every row above must appear.

---

## 2. UTMs

- One UTM link per channel, listed in a sheet: Instagram bio, story link sticker, each creator, WhatsApp broadcast (2026 buyers), DMs, Odia associations.
- Format: `?utm_source=instagram&utm_medium=story&utm_campaign=ovc27_batch1&utm_content=launch_day1`.
- On landing, save the UTM values in `sessionStorage` (`ovc27_utm`) and send them with `create-order`, the quote form and the waitlist, so every sale and lead traces back to its source in Supabase as well.

---

## 3. SEO and link preview

The page is built as real HTML text, not an image, so search engines, screen readers and translation tools can all read it.

```html
<html lang="en">
<title>The Odia Viral Calendar is back · 2027 · Pre-order</title>
<meta name="description" content="12 festival cards, one sealed 13th parba. Only 500 in batch 1, shipping the first week of November.">
<link rel="canonical" href="{site.url}">

<meta property="og:type" content="website">
<meta property="og:title" content="The Odia Viral Calendar is back · 2027">
<meta property="og:description" content="12 festival cards, one sealed 13th parba. Only 500 in batch 1, shipping the first week of November.">
<meta property="og:image" content="{absolute url}/og/og-2027.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="{site.url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#8A1717">
```

- The OG image URL must be **absolute** and under 300 KB, or WhatsApp may skip it.
- Add Odia text with `lang="or"` on its elements (for example `<span lang="or">କ'ଣ ଅଛି?</span>`).
- Add **Product** structured data (JSON-LD) with `offers.price` 299, `priceCurrency` INR, `availability` InStock or SoldOut (switched by the sold-out flag) and the brand IAMSOUBH.
- `/thank-you` gets `<meta name="robots" content="noindex">`.
- Test the preview by sending the link in a WhatsApp chat and an Instagram DM. If an old preview is cached, add `?v=2` to the shared link.

---

## 4. Thank-you page (`/thank-you`)

- Reads `?o=` (the Razorpay order id) and polls `/api/order-status` (see 05).
- **Paid:** "You're in. Order {n} of 500.", the ship line, and three buttons:
  1. **Join the WhatsApp community** → `site.whatsappCommunity`.
  2. **Download your story template** → `site.storyTemplate` (a plain `download` link).
  3. **Send to family** → `https://wa.me/?text={encoded share text with site.url and UTM utm_source=whatsapp&utm_medium=share}`.
- **Still confirming** (status `held` after 20 s): "Your payment is being confirmed…", with the WhatsApp contact link.
- **Overflow:** the refund message (see 05).
- **Payment-buttons mode:** "You're in." without the order number.

---

## 5. Policy pages (required by Razorpay's website review)

Six pages, all linked in the footer, plus About. They are plain text in the same type system, on a Rice surface with a max-width of 680 px.

| Page | Path | Must contain |
|---|---|---|
| Contact | `/contact` | Legal name, address, phone or WhatsApp, email, response time |
| Shipping | `/shipping` | India only for batch 1, free shipping, ships from the first week of November 2026, 3–7 days delivery, tracking on WhatsApp and email |
| Refunds and cancellation | `/refunds` | **Word for word:** "Full refund if your box hasn't shipped by 15 November." Cancellation before shipping means a full refund; after shipping, no returns for a printed product; damaged items are replaced if a photo is sent within 48 hours; refund timeline (5–7 working days to the original method) |
| Terms | `/terms` | Pre-order terms: batch of 500, contents, random sealed 13th (with a family pack getting all three), pricing in INR including taxes **[confirm GST status]** |
| Privacy | `/privacy` | What is collected (name, phone, email, address, gift note), why (delivery and updates), Razorpay as the processor, Meta Pixel and GA4 cookies, contact for deletion |
| Pricing | `/pricing` | ₹299 single, ₹749 family pack, ₹339 after batch 1, free shipping, bulk on quote |
| About | `/about` | Soubh's short story and the 2026 numbers |

If the site is on a **new domain or subdomain**, add it to Razorpay → Business website details early, because the review takes time.
