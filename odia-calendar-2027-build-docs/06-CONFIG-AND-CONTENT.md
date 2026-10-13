# 06 · Config and Content

Everything a non-developer may need to change lives in **one config file** plus a few content JSON files. Components never hard-code prices, dates, counts, links or copy.

---

## 1. `src/config/site.config.ts`

```ts
export const site = {
  // ── Offer ───────────────────────────────────────────────
  cap: 500,                          // display only; the real cap is in the Supabase settings table
  counterThreshold: 300,             // show "n of 500 left" only below this
  products: {
    single: { label: 'Single Box',       price: 299, laterPrice: 339, boxes: 1, min: 1, max: 9, soldOut: false },
    family: { label: 'Family Pack (x3)', price: 749, perBox: 250,     boxes: 3, min: 1, max: 3, soldOut: false, default: true },
  },
  bulkFrom: 10,
  batch2Price: 339,

  // ── Dates and promises ─────────────────────────────────
  shipWindow: 'first week of November',
  shipYear: 2026,
  refundBy: '15 November',
  holdMinutes: 15,

  // ── Switches ───────────────────────────────────────────
  checkoutMode: 'custom' as 'custom' | 'payment-buttons',
  forceSoldOut: false,
  manualRemaining: null as number | null,   // payment-buttons mode only
  paymentButtons: { single: 'pl_XXXX', family: 'pl_YYYY' },

  // ── Contact and links ──────────────────────────────────
  whatsapp: '91XXXXXXXXXX',                 // digits only, with country code, for wa.me
  whatsappCommunity: 'https://chat.whatsapp.com/XXXX',
  instagram: 'iamsoubh',
  email: 'hello@iamsoubh.com',              // [confirm]
  legalName: '[legal name as on Razorpay]',
  storyTemplate: '/downloads/story-template-2027.png',

  // ── Forms ──────────────────────────────────────────────
  quoteEndpoint: 'https://api.web3forms.com/submit',  // or the Google Apps Script URL
  printedNoteMinimum: 50,                              // [confirm]

  // ── Tracking ───────────────────────────────────────────
  metaPixelId: 'XXXXXXXXXXXXXXX',
  ga4Id: 'G-XXXXXXXXXX',

  // ── SEO / link preview ─────────────────────────────────
  url: 'https://iamsoubh.com/calendar',      // [confirm domain or path]
  ogTitle: 'The Odia Viral Calendar is back · 2027',
  ogDescription: '12 festival cards, one sealed 13th parba. Only 500 in batch 1, shipping the first week of November.',
  ogImage: '/og/og-2027.jpg',
} as const;
```

The server functions import **the same file** for prices and limits, so the browser total and the charged amount can never disagree.

All page copy goes in `src/content/copy.ts` (or `copy.json`), keyed by section, exactly as written in `03-COPY.md`. Placeholders use `{remaining}`, `{boxes}`, `{amount}` and `{firstName}`.

---

## 2. `src/content/months.json`

```json
[
  { "chip": "JAN", "festival": "Makar Sankranti", "date": "Fri 15 Jan",
    "line": "New rice in the bowl, the sun turning north, a sweet start to the year",
    "front": "/cards/front-01.webp", "back": "/cards/back-01.webp", "sticker": null },
  { "chip": "FEB", "festival": "Jagara", "date": "Sat 6 Mar (Shivaratri falls in March in 2027)",
    "line": "One night, a thousand lamps, a whole town awake till the Mahadeep rises",
    "front": "/cards/front-02.webp", "back": "/cards/back-02.webp", "sticker": null },
  { "chip": "MAR", "festival": "Dola Purnima", "date": "Sun 21 Mar",
    "line": "Gods on palanquins, abira on every cheek, spring arriving door to door",
    "front": "/cards/front-03.webp", "back": "/cards/back-03.webp",
    "sticker": "A Sunday. Wear the white you don't care about." },
  { "chip": "APR", "festival": "Pana Sankranti", "date": "Wed 14 Apr",
    "line": "Sweet pana, burning embers, brave feet: the Odia new year begins",
    "front": "/cards/front-04.webp", "back": "/cards/back-04.webp",
    "sticker": "New year on a Wednesday. Bela pana at office? Your call." },
  { "chip": "MAY", "festival": "Chandan Yatra", "date": "Begins Sun 9 May",
    "line": "Sandal paste, still water, gods afloat: the coolest festival of summer",
    "front": "/cards/front-05.webp", "back": "/cards/back-05.webp", "sticker": null },
  { "chip": "JUN", "festival": "Raja", "date": "Mon 14 to Wed 16 Jun",
    "line": "Swings, Raja paan, zero chores: three days when the earth and her daughters rest",
    "front": "/cards/front-06.webp", "back": "/cards/back-06.webp",
    "sticker": "Starts on a Monday. Three days of zero chores, officially." },
  { "chip": "JUL", "festival": "Rath Yatra", "date": "Mon 5 Jul",
    "line": "Three chariots, one Grand Road, the day the Lord steps out to meet us",
    "front": "/cards/front-07.webp", "back": "/cards/back-07.webp",
    "sticker": "A Monday. Apply for leave now, thank me later." },
  { "chip": "AUG", "festival": "Gamha Purnima", "date": "Tue 17 Aug",
    "line": "Rakhi on wrists, garlands on cattle, manda pitha on every plate",
    "front": "/cards/front-08.webp", "back": "/cards/back-08.webp", "sticker": null },
  { "chip": "SEP", "festival": "Nuakhai", "date": "Sun 5 Sep",
    "line": "The first grain of the harvest, eaten together, and the long road home",
    "front": "/cards/front-09.webp", "back": "/cards/back-09.webp",
    "sticker": "A Sunday. No excuse for not going home." },
  { "chip": "OCT", "festival": "Durga Puja", "date": "Ashtami Thu 7 Oct, Dashami Sat 9 Oct",
    "line": "Dhak beats, silver medhas, new clothes: four nights that belong to Maa",
    "front": "/cards/front-10.webp", "back": "/cards/back-10.webp", "sticker": null },
  { "chip": "NOV", "festival": "Kartik Purnima", "date": "Sun 14 Nov",
    "line": "Tiny boats at dawn, for the sailors who once sailed all the way to Bali",
    "front": "/cards/front-11.webp", "back": "/cards/back-11.webp",
    "sticker": "A Sunday. Set the 4 am alarm anyway." },
  { "chip": "DEC", "festival": "Manabasa Gurubar", "date": "Margasira Thursdays [confirm]",
    "line": "Rice-paste jhoti at the door, paddy in the mana, Thursdays that belong to Lakshmi",
    "front": "/cards/front-12.webp", "back": "/cards/back-12.webp", "sticker": null },
  { "chip": "13?", "festival": "Sealed", "date": "You find out when it arrives",
    "line": "Sealed. Three possible parbas, one per box. You meet yours when it's in your hands.",
    "sealed": true, "front": "/cards/sealed-13.webp", "back": null, "sticker": null }
]
```

A build-time check fails if any value contains `[confirm]` while `NODE_ENV=production`.

---

## 3. `src/content/stories.json`

```json
{
  "cities": [
    { "id": "bhubaneswar", "label": "Bhubaneswar", "stories": [
      { "handle": "someone", "image": "/stories/bhubaneswar/01.webp", "thumb": "/stories/bhubaneswar/01-300.webp", "line": "optional one-liner", "permission": true }
    ]},
    { "id": "cuttack",   "label": "Cuttack",   "stories": [] },
    { "id": "sambalpur", "label": "Sambalpur", "stories": [] },
    { "id": "bengaluru", "label": "Bengaluru", "stories": [] },
    { "id": "hyderabad", "label": "Hyderabad", "stories": [] },
    { "id": "pune",      "label": "Pune",      "stories": [] },
    { "id": "delhi",     "label": "Delhi",     "stories": [] },
    { "id": "abroad",    "label": "Abroad",    "stories": [] }
  ],
  "wall": [ "bhubaneswar/01", "cuttack/03", "…" ],
  "dms":  [ { "image": "/dms/01.webp", "thumb": "/dms/01-300.webp", "alt": "A DM from a 2026 buyer saying …" } ],
  "counter": { "creators": "200+", "homes": "1,500", "states": "22", "abroad": "USA" }
}
```

Rules:
- **Hide any city with fewer than 6 stories** at build time.
- A story is included only if `permission: true`.
- Anyone else in the frame is blurred before export.

---

## 4. `src/content/videos.json`

```json
[
  { "post": "DTNeI7gAXQd", "url": "https://www.instagram.com/reel/DTNeI7gAXQd/",
    "name": "[fill]", "handle": "[fill]", "pull": "[fill]",
    "video": "/videos/creator-01.mp4", "poster": "/videos/poster-01.webp", "captions": "/videos/creator-01.vtt",
    "rehost": true, "collab": false },
  { "post": "DR2HiElDCWN", "url": "https://www.instagram.com/reel/DR2HiElDCWN/", "…": "…" },
  { "post": "DS6dshSkVVu", "url": "https://www.instagram.com/reel/DS6dshSkVVu/", "…": "…" },
  { "post": "DTacYmMibCJ", "url": "https://www.instagram.com/reel/DTacYmMibCJ/", "…": "…" },
  { "post": "DSl3SA9E6Fq", "url": "https://www.instagram.com/reel/DSl3SA9E6Fq/", "…": "…" },
  { "post": "DRpWX2wiXBC", "url": "https://www.instagram.com/reel/DRpWX2wiXBC/", "…": "…" }
]
```
- `rehost: false` → poster plus a play icon linking out to Instagram.
- `collab: true` → shows the "Collab" tag (ASCI).

---

## 5. `src/content/faq.json`

An array of `{ "q": "...", "a": "...", "odia": "କ'ଣ ଅଛି?" (optional prefix) }`, copied from `03-COPY.md`. Answers may contain `{refundBy}`, `{shipWindow}` and `{bulkFrom}`, filled from the config.

---

## 6. Assets Soubh hands over

| Asset | Spec | Path |
|---|---|---|
| 12 card fronts | WebP, 800 × 1100 (8:11), < 120 KB each | `/public/cards/front-01.webp` … `front-12.webp` |
| 12 card backs | Same | `/public/cards/back-01.webp` … `back-12.webp` |
| Sealed 13th | Same | `/public/cards/sealed-13.webp` |
| Hero box | Box mockup with three cards fanned and last year's calendar behind. WebP 1200 px wide (plus a 750 px variant), < 140 KB | `/public/box/hero-box.webp` |
| Family pack shot | Three stacked boxes, WebP 1000 px | `/public/box/family-pack.webp` |
| Option thumbnails | 1 box and 3 stacked boxes, 160 × 160 | `/public/box/single-thumb.webp`, `family-thumb.webp` |
| Printed card proof photo | WebP 1000 px | `/public/box/card-proof.webp` |
| Soubh with the 2026 deck | WebP 1000 px | `/public/box/soubh-2026.webp` |
| Odia title | SVG, outlined (no live text), single colour so CSS can recolour via `currentColor` | `/public/lettering/title.svg` |
| Story screenshots | 20–30, sorted into city folders, each with handle and permission. WebP 1080 × 1920 (~120 KB) **plus** a 300 px wide thumb | `/public/stories/{city}/NN.webp`, `NN-300.webp` |
| DM screenshots | 3–4, with permission, names blurred where asked | `/public/dms/NN.webp` |
| Creator videos | 6, MP4 H.264, 720 × 1280, < 6 MB each, written OK from each creator | `/public/videos/creator-NN.mp4` |
| Video posters | First good frame, WebP 720 × 1280, < 80 KB | `/public/videos/poster-NN.webp` |
| Captions | VTT per video (or burned in) | `/public/videos/creator-NN.vtt` |
| Link preview | 1200 × 630 JPG, < 300 KB: the box with "IS BACK" in Disko Phonic on deep red | `/public/og/og-2027.jpg` |
| Story template | 1080 × 1920 PNG for the thank-you page | `/public/downloads/story-template-2027.png` |
| Patterns | Line-art tile, Pattachitra border strip, ikat border strip (drawn in-house as SVG) | `/public/patterns/*.svg` |
| Favicon | 32 px, 180 px Apple touch icon | `/public/favicon.svg`, `apple-touch-icon.png` |
| Font | Disko Phonic woff2 (included in this pack), **with a commercial licence** | `/public/fonts/DiskoPhonic-Regular.woff2` |

**Image pipeline:** use Astro's `<Image>` / `<Picture>` (sharp) to produce WebP and AVIF in two widths each, with explicit `width` and `height` to prevent layout shift.

---

## 7. Alt text guidance

- Card fronts: "{Festival} card, painted artwork". Card backs: "{Festival} card, calendar side for {Month} 2027".
- Stories: "Instagram story by @{handle} from {city} showing the 2026 calendar".
- Hero: "The 2027 Odia Viral Calendar box, with the 2026 calendar behind it".
- Decorative patterns and border strips: `alt=""` / `aria-hidden="true"`.
- The Odia title SVG: `role="img" aria-label="ବାର ମାସେ ତେର ପରବ, Bara Mase Tera Parba"`.
