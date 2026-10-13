# Odia Viral Calendar 2027 — Pre-order Page: Build Docs

One mobile-first pre-order page for **@iamsoubh**. Its one job is to sell the first batch of **500 boxes** before shipping starts in the **first week of November 2026**, and to prove the 2027 edition has the demand for a full print run.

These docs are the single source of truth for the build. Read them in order.

| File | What it covers |
|---|---|
| `00-README.md` | This file. Sources, locked decisions, open items, repo layout |
| `01-DESIGN-SYSTEM.md` | Colours, type (Disko Phonic + Inter + Anek Odia), tokens, components, CSS variables |
| `02-LAYOUT-AND-SECTIONS.md` | Every section: background, bento layout on mobile and desktop, wireframes |
| `03-COPY.md` | All final page copy, section by section, plus sold-out, footer and link preview |
| `04-INTERACTIONS.md` | Behaviour of every moving part and its reduced-motion version |
| `05-CHECKOUT-AND-BACKEND.md` | Razorpay flow, the 500-box tally, serverless functions, database, fallback |
| `06-CONFIG-AND-CONTENT.md` | The config file, data JSON (months, stories, videos), asset list and folders |
| `07-TRACKING-SEO-POLICIES.md` | Meta Pixel, GA4, UTMs, Open Graph, thank-you page, policy pages |
| `08-QA-AND-LAUNCH.md` | Performance budget, accessibility, test matrix, sales-ready checklist, launch plan |
| `09-BUILD-PROMPT.md` | Starter prompt for Cursor / Claude Code / Lovable |
| `fonts/` | Disko Phonic as TTF and a subset WOFF2 ready for the web |

---

## Where each decision comes from

The client has supplied three briefs. They disagree in places, so this is how they are combined:

| Area | Follows |
|---|---|
| **Content, offer, sections, prices, dates, features** | The text brief "Odia Viral Calendar 2027: Pre-order Page" (8 sections, ships first week of November, refund promise 15 November) |
| **Colour, pattern, cultural look, Odia type rules, performance targets, copy rules** | The two PDFs: "Pre-order Page" (look section) and "Website Brief" (design, Odia, build notes) |
| **Layout style** | Neo-brutalist bento: rounded tiles, thick ink borders, hard offset shadows, on the 2026 deep-red line-art ground |
| **Display font** | Disko Phonic (supplied file) |
| **Body font** | Inter |
| **Odia text** | Anek Odia for running text; big Odia titles as SVG artwork only |

Where the text brief says "cream / bottle green / Anton / follows the two reference screens", that is **replaced** by the colour and type system in `01-DESIGN-SYSTEM.md`. The section structure of the reference screens (big number, title, one short line) is kept.

---

## Locked decisions

| Item | Value |
|---|---|
| Cap | 500 boxes in batch 1, one shared tally (single = 1 box, family pack = 3 boxes) |
| Single box | ₹299 (₹339 after batch 1) |
| Family pack of 3 | ₹749 (₹250 a box), all three 13th parbas guaranteed, extra sticker sheet |
| Bulk | 10+ boxes, quote on request |
| Ships | First week of November 2026 |
| Refund promise | Full refund if not shipped by 15 November |
| Shipping | Free across India, India only in batch 1 |
| Damage | Free replacement, photo within 48 hours |
| Payment | Razorpay: UPI, cards, netbanking, wallets |
| In the box | 12 festival cards, 1 sealed 13th parba, Odia New Year postcard, sticker sheet, thank-you card, rigid box |
| Wooden stand | **Not on the page** |
| 13th parbas | Three: Sahi Jata (Puri), Sitalsasthi (Sambalpur), Gajalaxmi Puja (Dhenkanal) |

---

## Open items to confirm with Soubh before launch

Every `[confirm]` in `03-COPY.md` is listed here. Nothing goes live with a bracket on the page.

1. **Display font licence.** The Disko Phonic file says *"Just for personal use"* (licence: alitdesign.net/license). A commercial licence covering **web embedding** must be bought from Alit Design before launch. Until then, build with it locally only. Fallback if not bought: Bagel Fat One or Shrikhand (Google Fonts, free).
2. Prices: ₹299 single and ₹749 family (the old reference screen showed ₹279).
3. Refund promise date (15 November) and cancellation wording.
4. Free shipping across India and India-only.
5. Last day a box can be paid for and still ship in the first week of November (from the printer).
6. Manabasa Gurubar 2027 dates (Margasira Thursdays).
7. February card: Jagara (text brief) vs Saraswati Puja (website brief). Docs use **Jagara**.
8. Title spelling: ବାର ମାସେ ତେର ପରବ vs ବାର ମାସ ତେର ପରବ. Docs use **ବାର ମାସେ**. One spelling everywhere.
9. Story city list: keep only cities with at least six stories.
10. Counter strip: "22 states + USA", checked against 2026 Razorpay records.
11. Section 05 creator names, handles, pull lines, and which collabs were paid or gifted.
12. Minimum for the printed note in bulk orders (suggested 50).
13. Batch 1 bulk allowance (suggested 50 of the 500).
14. Exact brand hex values (docs use starting values, see `01-DESIGN-SYSTEM.md`).
15. Legal business name as registered on Razorpay (footer and policy pages).

---

## Repo layout

```
/
├─ public/
│  ├─ fonts/            DiskoPhonic-Regular.woff2
│  ├─ lettering/        title.svg, kana-achhi.svg (Odia SVG artwork)
│  ├─ cards/            front-01.webp … front-12.webp, back-01.webp … back-12.webp, sealed-13.webp
│  ├─ box/              hero-box.webp, family-pack.webp, single-thumb.webp, family-thumb.webp
│  ├─ stories/<city>/   *.webp (1080×1920)
│  ├─ dms/              *.webp
│  ├─ videos/           creator-01.mp4 … + poster-01.webp …
│  ├─ patterns/         line-art.svg, border-pattachitra.svg, border-ikat.svg
│  └─ og/               og-2027.jpg (1200×630)
├─ src/
│  ├─ config/site.config.ts      ← everything Soubh may change
│  ├─ content/months.json
│  ├─ content/stories.json
│  ├─ content/videos.json
│  ├─ content/faq.json
│  ├─ styles/tokens.css
│  ├─ components/…
│  └─ pages/ index, thank-you, shipping, refunds, terms, privacy, contact, pricing, about
└─ api/ (or netlify/functions/)
   ├─ create-order
   ├─ verify-payment
   ├─ razorpay-webhook
   ├─ stock
   └─ waitlist
```

Recommended stack: **Astro + Tailwind** (static output) on **Vercel** or **Netlify**, serverless functions for checkout, **Supabase** free tier for the tally. Details in `05-CHECKOUT-AND-BACKEND.md`.
