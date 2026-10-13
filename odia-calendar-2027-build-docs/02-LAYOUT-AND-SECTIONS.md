# 02 · Layout and Sections

The page is one long scroll of eight numbered sections. Each section is **full-bleed** on its own surface colour, so scrolling still feels like pulling cards out of the box one at a time. Inside each section, content sits in **bento tiles** on the grid from `01-DESIGN-SYSTEM.md`.

A border strip (Pattachitra or ikat SVG) runs wherever the surface changes.

| # | Section | Surface | The one memorable thing |
|---|---|---|---|
| — | Header | transparent → Red | — |
| 01 | Hero | **Red** + pattern | The 2027 box tile with 2026 peeking out |
| 02 | Sound familiar? | **Ink** | Four lines landing one at a time |
| 03 | Inside the calendar | **Parrot** | The artwork-to-calendar drag slider |
| 04 | Your stories | **Rice** | The moving wall of stories |
| 05 | Creators on camera | **Ink** | The vertical video row |
| 06 | Order now | **Rice** | The order card |
| 07 | Bulk and gifting | **Red** + pattern | One big funny title tile |
| 08 | Questions | **Rice** | — (quiet on purpose) |
| — | Footer | **Red** + pattern | The closing line |

Border strips: 01→02 Pattachitra (red / ink), 02→03 ikat, 03→04 Pattachitra, 04→05 ikat, 05→06 Pattachitra, 06→07 ikat, 07→08 Pattachitra, 08→footer ikat.

**Alignment:** text is left-aligned everywhere, including headings. The only centred element is the footer closing line. Tiles align to the grid, and only stickers and the hero box tile break it, with a slight rotation.

All copy is in `03-COPY.md`. All behaviour is in `04-INTERACTIONS.md`.

---

## Header (always on screen)

```
┌──────────────────────────────────────┐
│ IAMSOUBH                   (🛍) (☰)  │  56px, sticky
└──────────────────────────────────────┘
```
- The **bag** icon scrolls to 06. The **menu** opens the full-screen section list (01–08).
- The header is transparent over the hero and turns into a deep red fill with an ink bottom border after 40 px of scroll.

---

## 01 · Hero — Red

**Mobile (375)**
```
┌──────────────────────────────────────┐
│ 01 · Pre-orders open · 2027 edition  │ eyebrow
│                                      │
│ The Odia                             │ --t-hero, rice
│ Viral Calendar                       │
│ is back.                             │
│ [ ବାର ମାସେ ତେର ପରବ  ← SVG, turmeric ] │
│                                      │
│ ┌──────────────────────────────┐╗    │ box tile: rice, 3px ink, --sh-lg
│ │   [2026 calendar behind]     │║    │ rotated -2°
│ │      [ 2027 BOX PHOTO ]      │║    │
│ │                  ┌─────────┐ │║    │
│ │                  │2026→2027│ │║    │ sticker, rotated 5°
│ └──────────────────└─────────┘─┘║    │
│  ╚══════════════════════════════╝    │
│                                      │
│ Some calendars remind you what day   │ --t-lead
│ it is. This one reminds you who      │
│ you are.                             │
│ Twelve festival cards, one sealed…   │ --t-body
│                                      │
│ (• Only 500 boxes in batch 1)        │ info chips, wrap
│ (• Ships first week of November)     │
│ (• Free shipping across India)       │
│                                      │
│ [   Pre-order mine            →   ]  │ primary, full width, turmeric
│ From ₹250 a box in the family pack   │ --t-small
│ See what's inside ↓                  │ text link → 03
└──────────────────────────────────────┘
```

**Desktop (1024+)**
```
┌────────────── 6 cols ───────────────┬────────────── 6 cols ──────────────┐
│ eyebrow                             │  ┌──────────────────────────────┐  │
│ The Odia Viral Calendar is back.    │  │                              │  │
│ [Odia SVG]                          │  │     BOX TILE (4:5)           │  │
│ lead line                           │  │     rotated -2°              │  │
│ second line                         │  │                   [2026→2027]│  │
│ (chip) (chip) (chip)                │  └──────────────────────────────┘  │
│ [ Pre-order mine → ]  See inside ↓  │                                    │
│ From ₹250 a box in the family pack  │                                    │
└─────────────────────────────────────┴────────────────────────────────────┘
```
- **Counter.** Once fewer than 300 boxes are left, a small rice tile reading "Only 287 of 500 left." replaces the first chip. It uses the real number (see 05).
- Hero image: `hero-box.webp`, about 900 px wide on mobile, under 140 KB, and **not** lazy-loaded.

---

## 02 · Sound familiar? — Ink

**Mobile**
```
02                                      (number, tinted)
02 · Sound familiar?
For everyone who misses
Odisha without saying it.

┌──────────────────────────────┐        rice tile, turmeric shadow
│ Raja came and went, and you  │        line 1 (Inter 600, 20px)
│ found out from someone's story│
└──────────────────────────────┘
      ┌──────────────────────────────┐  line 2, offset right 24px
      │ Maa asked if you ate…        │
      └──────────────────────────────┘
┌──────────────────────────────┐        line 3
└──────────────────────────────┘
      ┌──────────────────────────────┐  line 4
      └──────────────────────────────┘

This calendar keeps the dates,          turn line: Disko --t-h2, turmeric
so you don't have to fake it.

One parba a month, right where…         closer: --t-body, rice
```

**Desktop:** a 2 × 2 bento of the four line tiles at mixed widths (7+5 / 5+7 columns), each tilted between -1.5° and 1.5°, with the turn line full width beneath and the closer at 6 columns.

---

## 03 · Inside the calendar — Parrot

**Mobile**
```
03 · Inside the calendar
Not just dates. Stories, festivals,      lead, ink
artwork and a deeper connection…

( Artwork | Calendar )                   segmented toggle, pill

┌──────────────────────────────┐
│                              │         slider tile, 8:11, rice frame
│   FRONT  ║◀▶║   BACK          │         handle with "Drag to explore"
│                              │
└──────────────────────────────┘
[JAN][FEB][MAR][APR] …[DEC][13?]         chips, one scrolling row

┌──────────────────────────────┐         caption tile, rice
│ Rath Yatra          Mon 5 Jul│         Disko h3 + date (Inter 700)
│ Three chariots, one Grand    │
│ Road, the day the Lord…      │
│ [ ] [ ]                      │         two tick boxes, 32px
└──────────────────────────────┘
        ┌──────────────────────┐
        │A Monday. Apply for   │         sticker, only on some months
        │leave now, thank me…  │
        └──────────────────────┘
```

**Desktop**
```
┌──── 5 cols ────┬──────────── 7 cols ─────────────┐
│ section head   │                                 │
│                │                                 │
│ ┌────────────┐ │ (Artwork | Calendar)            │
│ │ SLIDER     │ │ [JAN][FEB][MAR][APR][MAY][JUN][JUL]
│ │ 8:11       │ │ [AUG][SEP][OCT][NOV][DEC][13?]  │ chips wrap into 2 rows
│ │            │ │ ┌─────────────────────────────┐ │
│ │            │ │ │ caption tile                │ │
│ └────────────┘ │ └─────────────────────────────┘ │
│                │          [sticker]              │
└────────────────┴─────────────────────────────────┘
```
On desktop the section head sits above both columns, the slider takes 5 columns and the controls take 7.

---

## 04 · Your stories — Rice

**Mobile**
```
04 · Your stories
200+ of you put it on your story.
Last year the calendar went up in 1,500 homes…

Tap your city.
(◯)(◯)(◯)(◯)(◯)→                         story circles, 72px, sideways scroll
 BBSR CTC SBP BLR HYD

══════ moving wall row 1  ← ═══════       full-bleed, 9:16 phone frames, tilted
══════ moving wall row 2  → ═══════
                  [Add yours sticker]

┌────────┐┌────────┐┌────────┐           counter strip: 3 tiles in a row
│ 200+   ││ 1,500  ││ 22     │           Disko numbers, Inter labels
│creators││ homes  ││states  │
│        ││        ││ + USA  │
└────────┘└────────┘└────────┘
```

**Desktop:** the head takes 7 columns; the city circles are left-aligned under it in one row. The wall runs full width at 220 px card width, and the counter strip is three equal tiles of 4 columns each.

---

## 05 · Creators on camera — Ink

**Mobile**
```
05 · On camera
Ask them, not me.
Six creators got the 2026 calendar…

┌─────────┐┌──                        swipe row, snap, 1.2 cards visible
│ VIDEO   ││                            9:16, rice border, turmeric shadow
│ 9:16    ││
│         ││
│ name    ││                            bottom overlay: ink 70% gradient-free
│ @handle ││                            band (flat ink at 80%)
│ "pull"  ││
│ Watch ↗ ││
└─────────┘└──
```

**Desktop:** three cards visible, with arrow buttons (icon buttons) at the top right of the section head to page the row.

The "Collab" badge sits at the top left of a card when a collab was paid or gifted.

---

## 06 · Order now — Rice

**Mobile**
```
06 · ORDER NOW                            Disko, the one all-caps title
2027 Odia Calendar · [ବାର ମାସେ ତେର ପରବ SVG small]

┌──────────────────────────────┐          product image tile, swaps
│   [ family pack photo ]      │          with the selected option
└──────────────────────────────┘

┌──────────────────────────────┐          option card (selected)
│[thumb] Family Pack (x3)   (●)│          3px chandua border + chandua shadow
│        ₹749  [Best value ·   │
│               ₹250 a box]    │
│ For Maa, Bou and that one…   │
└──────────────────────────────┘
┌──────────────────────────────┐          option card
│[thumb] Single Box         (○)│
│        ₹299  ₹339 after…     │
│ One box, twelve parbas…      │
└──────────────────────────────┘

( −   1   + )                             stepper
3 boxes · ₹749 · free shipping            live total, Inter 600

[   Let's Odia This            →   ]      primary, chandua, full width
Ships from the first week of November.
Not shipped by 15 November? Full refund.

┌────────┐┌────────┐┌────────┐            trust badges: 3 small tiles
│ truck  ││ lock   ││ shield │
│ Free   ││ Secure ││ Free   │
│shipping││Razorpay││replace │
└────────┘└────────┘└────────┘
Book it now, or say "pare dekhibi"…       nudge, --t-small
214 of 500 left.                          only when under 300
```

**Desktop: the Bloom-style buy layout**
```
┌──────────────── 7 cols ─────────────────┬────────── 5 cols (sticky) ──────────┐
│ ┌─────────────────────┐ ┌─────────────┐ │ ┌────────────────────────────────┐ │
│ │                     │ │ card fronts │ │ │ 06 · ORDER NOW                 │ │
│ │   BIG PRODUCT       │ │ fanned      │ │ │ subtitle                       │ │
│ │   (2 × 2)           │ └─────────────┘ │ │ [option card: Family]          │ │
│ │                     │ ┌─────────────┐ │ │ [option card: Single]          │ │
│ │                     │ │ printed card│ │ │ ( − 1 + )   3 boxes · ₹749     │ │
│ └─────────────────────┘ │ proof       │ │ │ [ Let's Odia This → ]          │ │
│ ┌──────────┐┌─────────┐ └─────────────┘ │ │ ships / refund line            │ │
│ │sealed 13 ││ Soubh w/│                 │ │ [badge][badge][badge]          │ │
│ │          ││ 2026    │                 │ │ nudge · remaining              │ │
│ └──────────┘└─────────┘                 │ └────────────────────────────────┘ │
└─────────────────────────────────────────┴────────────────────────────────────┘
```
- The buy card is a rice tile with `--sh-lg`, `position: sticky; top: 80px`.
- Gallery tiles use real photos only: the box mockup, a printed card proof, the sealed 13th, and Soubh with the 2026 deck.

**Checkout sheet** ("Let's Odia This" opens it): a bottom sheet on mobile, a 480 px card on desktop.
```
Where should it go?
Name ___________
WhatsApp number ___________
Email ___________
Pincode ______   → City ______ State ______ (auto-filled, editable)
Address line ___________
Landmark ___________
Gift note (optional) ___________
[ Pay ₹749 → ]
🔒 Secure payment by Razorpay
```

---

## 07 · Bulk and gifting — Red

**Mobile**
```
07 · Bulk and gifting
Ordering for the whole parivar?           Disko h2, rice
Or the whole office?

┌──────────────────────────────┐          rice tile, --sh-lg
│ Your office has 40 Odias and │          Disko h3, ink
│ zero festival vibes. Fix that│
│                              │
│ For teams, Odia associations…│          body
│ (Teams)(Associations)        │          chips (static, decorative labels
│ (Societies)(Return gifts)    │          taken from the copy)
│ Ten boxes or more, and I'll… │
│ [ Request a quote → ]        │          primary (chandua on rice tile)
│ Or just WhatsApp me ↗        │          text link
└──────────────────────────────┘
```

**Desktop:** the head takes 6 columns on the left and the tile takes 6 columns on the right, rotated 1°.

---

## 08 · Questions — Rice

**Mobile:** the head, then the accordion as stacked paper tiles with 12 px gaps.
**Desktop:** the head takes 4 columns on the left (sticky), the accordion takes 8 columns on the right.

The "କ'ଣ ଅଛି? What's in the box?" question sets the Odia part in Anek Odia 600.

---

## Sticky order bar

```
┌──────────────────────────────────────┐
│ Batch 1 · from ₹250 a box [Pre-order→]│  ink, 64px + safe area
└──────────────────────────────────────┘
```
- It appears when the hero leaves the viewport and hides while 06 is visible.
- It is the same on desktop, centred at max 720 px wide with a 2 px turmeric border, `--r-pill`, and 16 px off the bottom.

---

## Footer — Red

```
        Made in Odisha, for everyone          Disko h2, centred
             who misses it.

IAMSOUBH
Instagram @iamsoubh · WhatsApp · Email
Contact · Shipping · Refunds and cancellation · Terms · Privacy · About
© 2026 [legal name as on Razorpay]
```
The links are in Inter 15 px with 44 px tap rows on mobile, stacked.

---

## Thank-you page (`/thank-you`) — Red

```
┌──────────────────────────────┐
│ You're in.                   │  rice tile, Disko h2
│ Order 212 of 500.            │  Disko price size, chandua
│ Ships from the first week of │
│ November.                    │
│ [ Join the WhatsApp community]│
│ [ Download your story template]
│ [ Send to family on WhatsApp ]│
└──────────────────────────────┘
```

---

## Sold-out state (one flag flips all of these)

| Place | Becomes |
|---|---|
| Hero chips | One rice tile: "All 500 are gone. Thank you, Odisha." |
| Hero button | "Join batch 2" → scrolls to 06 |
| 06 | Title "Batch 1 is sold out.", the waitlist line, one WhatsApp field, "Tell me first" button. The option cards are hidden |
| Sticky bar | "Batch 1 sold out · Join batch 2 →" |
| 07 | Unchanged (bulk ships with batch 2) |
