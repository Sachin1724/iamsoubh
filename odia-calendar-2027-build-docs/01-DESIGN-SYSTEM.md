# 01 · Design System

**The idea in one line:** the 2026 deep-red festival ground, with rice-white cards laid on it like the calendar cards pulled out of the box. The cards have thick ink outlines, hard shadows and rounded corners.

This is a **neo-brutalist bento** look. It is built from three moves, used consistently:

1. Every content block is a **tile**: rounded, with a 2 px ink border and a hard offset shadow with no blur.
2. **Flat, saturated colour** comes from the 2026 palette, with no gradients.
3. **Handmade texture** comes from a line-art pattern on the red ground, Pattachitra and ikat border strips between sections, and a light paper grain over everything.

There is one memorable thing per screen: the box photo in the hero, the card slider in 03, the order card in 06. Everything around it stays quiet.

---

## 1. Colour

Starting values. Soubh confirms the exact hex values against the 2026 page and the box print files.

| Token | Name | Hex | Use |
|---|---|---|---|
| `--c-red` | Deep red (ground) | `#8A1717` | Main page ground (hero, bulk section, footer), with the line-art pattern |
| `--c-red-line` | Pattern line | `#A2271F` | Line-art pattern strokes on the deep red (low contrast, texture only) |
| `--c-chandua` | Chandua red | `#C8221A` | Primary buttons on light surfaces, selected states, price highlights |
| `--c-turmeric` | Turmeric yellow | `#E0A526` | Ticks, stickers, primary button on deep red, small highlights |
| `--c-parrot` | Parrot green | `#3E9B47` | Section 03 ground, success states, "Best value" badge |
| `--c-ink` | Black | `#1B1B1B` | Text on light, all borders, all hard shadows, sections 02 and 05 |
| `--c-rice` | Rice white | `#F6EFE2` | Light section ground, tiles on dark grounds, text on dark |
| `--c-paper` | Paper | `#FFFAF0` | Tiles sitting on a rice-white section (so the tile reads above the ground) |
| `--c-muted` | Ink 70% | `#4A4642` | Secondary text on light surfaces |

### Contrast (checked)

| Pair | Ratio | Rule |
|---|---|---|
| Rice on deep red | 8.3 | Any size |
| Ink on rice | 15.1 | Any size |
| Rice on ink | 15.1 | Any size |
| Rice on chandua | 5.0 | Any size (buttons OK) |
| Ink on turmeric | 7.9 | Any size |
| Ink on parrot | 4.9 | Any size. **Use ink, not rice, for text on parrot green** |
| Rice on parrot | 3.1 | Large display text only (24 px+), never body |
| Turmeric on deep red | 4.3 | Large display text only (24 px+), never body |

### Surfaces

Each section uses one surface. Each surface has fixed rules, so components never need one-off colours.

| Surface | Ground | Text | Tile | Tile border | Tile shadow | Primary button |
|---|---|---|---|---|---|---|
| **Red** | `--c-red` + pattern | rice | rice | ink | ink | turmeric fill, ink text, ink border, ink shadow |
| **Ink** | `--c-ink` | rice | rice | ink | turmeric | chandua fill, rice text, rice border, turmeric shadow |
| **Parrot** | `--c-parrot` | ink | rice | ink | ink | chandua fill, rice text, ink border, ink shadow |
| **Rice** | `--c-rice` | ink | paper | ink | ink | chandua fill, rice text, ink border, ink shadow |

---

## 2. Typography

Three families, each with one clear job.

| Role | Family | Source | Notes |
|---|---|---|---|
| Display | **Disko Phonic** Regular | `/public/fonts/DiskoPhonic-Regular.woff2` (self-hosted, subset, 19 KB) | Headlines, section numbers, prices, button labels, wordmark, stickers |
| Body | **Inter** 400 / 500 / 600 / 700 | Google Fonts or self-hosted (variable) | Paragraphs, labels, form fields, FAQ, small print |
| Odia text | **Anek Odia** 400 / 600 | Google Fonts | Any typed Odia (e.g. "କ'ଣ ଅଛି?", the subtitle in 06) |
| Odia titles | SVG artwork | `/public/lettering/*.svg` | ବାର ମାସେ ତେର ପରବ is **never typed in a web font** |

### Disko Phonic: what to know

- It is a **wide, heavy retro display face** with soft terminals. It works in both caps and sentence case. Sentence case reads friendlier, so use it for titles. Keep all-caps for short words only, like "ORDER NOW" in the 06 title.
- There is only **one weight**. Set `font-synthesis: none` so browsers never fake a bold or italic.
- It has **no ₹ sign and no arrows** (→ ↓ ↗). Handle them like this:
  - **₹**: wrap it in `<span class="rupee">₹</span>`, set in Inter 800 at 0.82em, so it sits deliberately beside the Disko numerals instead of as a random fallback glyph.
  - **Arrows**: always use inline SVG icons (section 7), never text glyphs.
- It is wide. At 375 px a 40 px headline fits about 14–15 characters a line, so plan line breaks for the hero title.
- **Licence:** the file metadata says *"Just for personal use"*. A commercial and web licence from Alit Design is required before launch (see README).

### @font-face

```css
@font-face {
  font-family: "Disko Phonic";
  src: url("/fonts/DiskoPhonic-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0020-007E, U+00A0-00FF, U+2013-2014, U+2018-201D, U+2022, U+2026;
}
```

Preload it in `<head>`, because the hero title depends on it:

```html
<link rel="preload" href="/fonts/DiskoPhonic-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

### Type scale

The sizes are fluid between 375 px and 1280 px.

| Token | Family | Size (mobile → desktop) | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `--t-hero` | Disko | 40 → 96 px | 0.95 | -0.01em | Hero title |
| `--t-num` | Disko | 72 → 128 px | 0.85 | -0.02em | Section numbers "01" to "08" |
| `--t-h2` | Disko | 32 → 64 px | 1.0 | -0.01em | Section titles |
| `--t-h3` | Disko | 22 → 30 px | 1.1 | 0 | Tile titles, option names, video names |
| `--t-price` | Disko | 36 → 56 px | 1.0 | 0 | Prices in 06, totals |
| `--t-btn` | Disko | 18 → 20 px | 1.0 | 0.01em | Button labels |
| `--t-sticker` | Disko | 15 → 17 px | 1.15 | 0 | Tilted stickers |
| `--t-lead` | Inter 500 | 18 → 22 px | 1.45 | -0.005em | The one short line under each title |
| `--t-body` | Inter 400 | 16 → 18 px | 1.55 | 0 | Paragraphs, FAQ answers |
| `--t-label` | Inter 600 | 14 → 15 px | 1.3 | 0.01em | Eyebrows, chips, field labels, badges |
| `--t-small` | Inter 400 | 13 → 14 px | 1.45 | 0 | Small print, under-button lines |

Rules:

- Body line length stays under about 65 characters (`max-width: 36rem` on paragraphs).
- Eyebrows such as "01 · Pre-orders open" are set in sentence case in Inter 600, never all caps.
- Romanised Odia words in copy (*eita kebe?*, *pare dekhibi*, *manda pitha*) are set in **Inter italic**.
- There are no exclamation marks or emoji in UI copy, and no em dashes in page copy.

---

## 3. Space, grid, breakpoints

**Spacing scale (4 px base):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.

| | Mobile (375) | Tablet (768) | Desktop (1024+) |
|---|---|---|---|
| Columns | 4 | 8 | 12 |
| Gutter (page edge) | 20 px | 32 px | 48 px |
| Grid gap (between tiles) | 12 px | 16 px | 20 px |
| Section padding (top / bottom) | 64 px | 88 px | 112 px |
| Max content width | — | — | 1200 px |

Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`. **Design at 375 first.**

---

## 4. Shape, border, shadow

The radius changes with hierarchy. Not everything uses the same radius.

| Token | Value | Used on |
|---|---|---|
| `--r-tile` | 16 px mobile, 22 px desktop | Bento tiles, option cards, video cards |
| `--r-inner` | 12 px | Images inside tiles, inputs |
| `--r-pill` | 999 px | Buttons, chips, stepper, badges |
| `--r-sheet` | 24 px (top corners only) | Bottom sheets |
| `--r-sticker` | 6 px | Stickers (rotated) |
| `--r-phone` | 18 px | Story screenshots in the wall (phone shape) |

| Token | Value |
|---|---|
| `--bw` | 2 px solid ink (default border on tiles, buttons, chips, inputs) |
| `--bw-strong` | 3 px (selected option card, hero box tile) |
| `--sh-sm` | `3px 3px 0 0 var(--shadow-c)` (chips, stepper, small buttons) |
| `--sh-md` | `5px 5px 0 0 var(--shadow-c)` (tiles, primary buttons) |
| `--sh-lg` | `8px 8px 0 0 var(--shadow-c)` (hero box tile, order card, open sheets on desktop) |

`--shadow-c` is ink on every surface except **Ink**, where it is turmeric.

**Press state.** On press, a button or tile moves into its shadow: `transform: translate(3px,3px)` with the shadow reduced by the same amount, over 120 ms. This "physical" press is the signature micro-interaction and is used everywhere. **Never use soft blurred shadows.**

---

## 5. Texture

1. **Line-art pattern** on the **Red** surface: `/public/patterns/line-art.svg`, strokes in `--c-red-line` on `--c-red`, tile size about 240 px. It is texture only, so it should never compete with text. It is rebuilt as SVG from Pipli appliqué and Pattachitra motifs, never stock clip art.
2. **Border strips** between sections that change surface: a 20–28 px tall SVG strip, repeated horizontally. Alternate a Pattachitra border and a Sambalpuri ikat border, drawn in the two neighbouring section colours plus ink. Files: `border-pattachitra.svg`, `border-ikat.svg`.
3. **Paper grain** on every section at 5% opacity:

```css
.section { position: relative; isolation: isolate; }
.section::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 1;
  opacity: .05; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
.section > * { position: relative; z-index: 2; }
```

On the Ink surface, use `mix-blend-mode: screen` at 4% opacity so the grain shows.

---

## 6. Components

### Section head (used by all 8 sections)

```
 07                      ← --t-num, Disko, tinted (see below)
 07 · Bulk and gifting   ← eyebrow, Inter 600, exactly as written in 03-COPY.md
 Ordering for the whole  ← --t-h2, Disko
 parivar? Or the whole
 office?
 One short line.         ← --t-lead, Inter 500
```

Section number tint per surface: on Red use `#A8302A`, on Ink `#3A3633`, on Parrot `#62B56A`, on Rice `#E6D8BF`. The number sits **behind** the top of the title and overlaps it by about 0.3em, so the head reads as one block and not as a label above a heading.

### Buttons

| Variant | Spec |
|---|---|
| **Primary (pill)** | Height ≥ 52 px, padding 0 24 px, `--t-btn`, surface primary colours (see the Surfaces table), `--bw`, `--sh-md`, SVG arrow 20 px after the label with an 8 px gap. Full width on mobile in 06 and in sheets |
| **Secondary** | Same shape, transparent fill, surface text colour, `--bw` in the text colour, no shadow |
| **Text link** | Inter 600, underline 2 px offset 4 px, with an SVG arrow when the copy has one |
| **Icon button** | 44 × 44 circle, rice fill, ink border, `--sh-sm` (header bag and menu, sheet close) |

States: hover lifts by `translate(-1px,-1px)` with the shadow growing 1 px (desktop only). Press uses the press state above. Disabled is 45% opacity with no shadow. Focus is a 3 px outline in turmeric (on dark) or chandua (on light) with a 3 px offset.

### Chips

Height 36 px (44 px tap area), `--r-pill`, `--t-label`, `--bw`, paper or rice fill.
- **Selected**: ink fill, rice text.
- **Info chips** in the hero: rice fill, ink text, a small turmeric dot before the text, no shadow.

### Tile

`--r-tile`, `--bw`, `--sh-md`, padding 20 px mobile and 28 px desktop, fill per surface. Images inside a tile use `--r-inner` with a 2 px ink border.

### Sticker

Turmeric fill, ink text in `--t-sticker`, `--bw`, `--r-sticker`, `--sh-sm`, rotated between -4° and 5°, max-width 220 px. It may overlap a tile edge by up to 16 px. Used for the month sticker lines in 03, the handwritten "2026 → 2027" tag in the hero, and the "Add yours" sticker in 04.

### Badge

`--r-pill`, 26 px tall, Inter 700 12–13 px.
- **Best value**: parrot fill, ink text.
- **Collab**: rice fill, ink text, 1.5 px border.
- **Sold out**: ink fill, rice text.

### Option card (06)

Paper fill, `--bw`, `--r-tile`, `--sh-md`. Thumbnail on the left (72 px, `--r-inner`), with the name (`--t-h3`), price (`--t-price` scaled to 32 px) and description (`--t-small`) to the right. A radio sits top right: a 24 px circle with a 2 px ink border, filled chandua with a rice centre dot when selected.
**Selected**: `--bw-strong` in chandua and the shadow becomes `--sh-lg` in chandua.

### Stepper

A pill, 52 px tall: [ − ] [ count ] [ + ]. Each button is 44 × 44, and the count is in Disko at 22 px. At the upper limit, "+" is replaced by the text link "10 or more? Get a bulk price".

### Inputs

52 px tall, paper fill, `--bw`, `--r-inner`, Inter 16 px (never smaller, so iOS does not zoom). The label sits above in `--t-label`.
- **Focus**: border chandua plus `--sh-sm` in chandua.
- **Error**: chandua border with an error line below in `--t-small`, chandua 700.

### Accordion (08)

Each item is a tile row: question in Inter 700 18 px, with a plus icon in a 32 px circle on the right that rotates 45° when open. The answer is `--t-body`. One item opens at a time. Rows are separated by 12 px gaps, not hairlines.

### Bottom sheet (06 checkout, 07 quote)

On mobile: rice fill, `--r-sheet` top corners, 2 px ink top border, a grab handle (40 × 4 ink pill), max height 92 dvh, and its own scroll. The backdrop is ink at 55%.
On desktop: a 480 px centred card with `--bw`, `--r-tile` and `--sh-lg`.

### Sticky order bar (mobile; desktop also bottom)

64 px plus the safe area, ink fill, rice text, 2 px turmeric top border. The left side shows "Batch 1 · from ₹250 a box" in Inter 600 15 px. The right side has a primary button (chandua, compact 44 px).

### Header

56 px, sticky. Transparent over the hero, then a deep red fill with a 2 px ink bottom border once scrolled past 40 px. The IAMSOUBH wordmark sits on the left in Disko 22 px, rice. On the right are the bag and menu icon buttons. The menu opens a full-screen rice sheet listing the eight sections as large Disko links with their numbers.

---

## 7. Icons

Inline SVG, 24 px grid, 2 px stroke, round caps and joins, `currentColor`.
Needed: `arrow-right`, `arrow-down`, `arrow-up-right`, `bag`, `menu`, `close`, `plus`, `minus`, `play`, `sound-on`, `sound-off`, `chevron-left`, `chevron-right`, `check-hand` (a hand-drawn tick, see 04), `whatsapp`, `instagram`, `mail`, `lock`, `truck`, `shield`.

---

## 8. Motion tokens

| Token | Value | Use |
|---|---|---|
| `--d-press` | 120 ms | Button and tile press |
| `--d-fast` | 200 ms | Chip changes, crossfades, accordion |
| `--d-base` | 320 ms | Sheets, sticky bar, toggles |
| `--d-slow` | 600 ms | Hero entrance only |
| `--ease` | `cubic-bezier(.2,.8,.2,1)` | Default |
| `--ease-sheet` | `cubic-bezier(.32,.72,0,1)` | Sheets and the sticky bar |

There is **one orchestrated entrance**, in the hero: the box tile drops in with a 2° rotation settle, then the chips pop in one by one, all within 900 ms. No other sections fade or slide in on scroll except the four lines in section 02, which the copy requires. All motion respects `prefers-reduced-motion` (see `04-INTERACTIONS.md`).

---

## 9. tokens.css

```css
:root{
  --c-red:#8A1717; --c-red-line:#A2271F; --c-chandua:#C8221A; --c-turmeric:#E0A526;
  --c-parrot:#3E9B47; --c-ink:#1B1B1B; --c-rice:#F6EFE2; --c-paper:#FFFAF0; --c-muted:#4A4642;

  --f-display:"Disko Phonic","Inter",system-ui,sans-serif;
  --f-body:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --f-odia:"Anek Odia","Noto Sans Oriya",sans-serif;

  --t-hero:clamp(2.5rem,1.45rem + 4.5vw,6rem);
  --t-num:clamp(4.5rem,3.1rem + 6vw,8rem);
  --t-h2:clamp(2rem,1.17rem + 3.55vw,4rem);
  --t-h3:clamp(1.375rem,1.17rem + .9vw,1.875rem);
  --t-price:clamp(2.25rem,1.73rem + 2.2vw,3.5rem);
  --t-btn:clamp(1.125rem,1.07rem + .22vw,1.25rem);
  --t-lead:clamp(1.125rem,1rem + .55vw,1.375rem);
  --t-body:clamp(1rem,.95rem + .22vw,1.125rem);
  --t-label:.9rem; --t-small:.84rem;

  --r-tile:16px; --r-inner:12px; --r-pill:999px; --r-sheet:24px; --r-sticker:6px; --r-phone:18px;
  --bw:2px; --bw-strong:3px; --shadow-c:var(--c-ink);

  --d-press:120ms; --d-fast:200ms; --d-base:320ms; --d-slow:600ms;
  --ease:cubic-bezier(.2,.8,.2,1); --ease-sheet:cubic-bezier(.32,.72,0,1);
  --gutter:20px; --gap:12px;
}
/* Re-declared on every surface so each one picks up its own --shadow-c
   (a var() inside a custom property resolves where it is declared, not where it is used) */
:root,[class*="surface-"]{
  --sh-sm:3px 3px 0 0 var(--shadow-c); --sh-md:5px 5px 0 0 var(--shadow-c); --sh-lg:8px 8px 0 0 var(--shadow-c);
}
@media (min-width:768px){ :root{ --gutter:32px; --gap:16px; } }
@media (min-width:1024px){ :root{ --r-tile:22px; --gutter:48px; --gap:20px; } }

html{ font-family:var(--f-body); font-synthesis:none; -webkit-text-size-adjust:100%; }
.display{ font-family:var(--f-display); font-weight:400; }
.rupee{ font-family:var(--f-body); font-weight:800; font-size:.82em; margin-right:.04em; }
.surface-red{ background:var(--c-red) url(/patterns/line-art.svg) repeat; color:var(--c-rice); --shadow-c:var(--c-ink); }
.surface-ink{ background:var(--c-ink); color:var(--c-rice); --shadow-c:var(--c-turmeric); }
.surface-parrot{ background:var(--c-parrot); color:var(--c-ink); --shadow-c:var(--c-ink); }
.surface-rice{ background:var(--c-rice); color:var(--c-ink); --shadow-c:var(--c-ink); }
```
