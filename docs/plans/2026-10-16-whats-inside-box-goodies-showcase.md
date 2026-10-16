# What's Inside The Box (Goodies Showcase) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and integrate an interactive, high-converting "What's Inside The Box · Goodies Showcase" section detailing all 6 physical inclusions that come inside every 2027 Odia Viral Calendar box, complete with real product imagery, specifications, cultural context, and interactive inspection.

**Architecture:** 
1. Upgrade [`src/components/WhatsInside.tsx`](file:///d:/Projects/calenderweb/src/components/WhatsInside.tsx) to a premium 6-item interactive unboxing experience featuring:
   - Item 1: **12 Festival Cards** (`/assets/product/cards-fanned.webp`) — 8 × 11 cm thick board with Tradition Tracker boxes.
   - Item 2: **The Sealed 13th Parba** (`/assets/parba/13th-parba-sealed.webp`) — Mystery golden wax-sealed envelope.
   - Item 3: **Odia New Year Postcard** (`/assets/product/odia-new-year-card.webp`) — Pana Sankranti (14 April) write-and-gift card.
   - Item 4: **24-Piece Vinyl Sticker Sheet** (`/assets/product/stickers-sheet.webp`) — Odia pop-culture, food, slangs & motifs.
   - Item 5: **Handwritten Thank-You Letter** (`/assets/product/thank-you-note.webp`) — Creator note from Soubhagya Ranjan.
   - Item 6: **Magnetic Keepsake Rigid Box** (`/assets/product/box-open.webp`) — Deep crimson embossed collector's chest.
2. Integrate the component into [`src/app/page.tsx`](file:///d:/Projects/calenderweb/src/app/page.tsx) directly following the Monthly Cards (`MonthCarousel`), separated by the authentic Pattachitra border strip.
3. Update navigation links in [`src/components/Header.tsx`](file:///d:/Projects/calenderweb/src/components/Header.tsx) and mobile sticky anchors to point directly to the enriched experience.
4. Adhere strictly to the project's design language: Sambalpuri motifs, Gazpacho display font, Bricolage Grotesque italics for captions, and tactile border shadows.

**Tech Stack:** Next.js 16 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS, Lucide React icons, Next/Image.

---

### Task 1: Audit & Refactor Goodies Data Model in `WhatsInside.tsx`

**Files:**
- Modify: [`src/components/WhatsInside.tsx:1-60`](file:///d:/Projects/calenderweb/src/components/WhatsInside.tsx#L1-L60)

**Step 1: Expand contents schema**
Add the 6th tangible item (`box-open.webp` — Magnetic Keepsake Rigid Box), update dimensions, badge labels ("INCLUDED FREE", "SECRET DROP", "COLLECTIBLE"), and verify all asset file paths exist.

```tsx
export interface BoxGoodie {
  id: string;
  count: string;
  badge?: string;
  title: string;
  odiaTitle: string;
  desc: string;
  specs: string;
  image: string;
  iconBg: string;
}
```

**Step 2: Verify assets on disk**
Confirm `public/assets/product/box-open.webp`, `stickers-sheet.webp`, `cards-fanned.webp`, `odia-new-year-card.webp`, `thank-you-note.webp`, and `public/assets/parba/13th-parba-sealed.webp` are accessible.

**Step 3: Test and compile**
Run: `npx tsc --noEmit`
Expected: 0 errors.

---

### Task 2: Redesign the Goodies Component UI with Interactive Bento & Spec Callouts

**Files:**
- Modify: [`src/components/WhatsInside.tsx:60-194`](file:///d:/Projects/calenderweb/src/components/WhatsInside.tsx#L60-L194)

**Design Requirements:**
1. **Section Eyebrow & Title**:
   - Eyebrow: `03B · କ'ଣ ଅଛି ବାକ୍ସରେ? · WHAT'S IN THE BOX` in crimson and amber.
   - Headline: `EVERY GOODIE. UNBOXED.` in bold Gazpacho / Bigdream condensed typography.
   - Subtitle: `No hidden surprises, no cheap inserts. Everything inside is crafted to survive the courier and live on your desk all year.` in Bricolage Grotesque italic.
2. **Interactive 2-Column Experience**:
   - **Left Column**: Scannable list of all 6 items with distinct pastel icon chips, counts (`12`, `01`, `01`, `24`, `01`, `01`), item titles, and smooth accordion-style spec revelations on hover/click.
   - **Right Column (Showcase Deck)**: Premium framed display stage (`aspect-[4/3] sm:aspect-square`) with smooth cross-fade, floating status badge (e.g. `12 Festival Cards · Thick Board`), and cultural quote: `“The box is minimal. Odisha never was.”`
3. **Quick-Glance Summary Pill Matrix**:
   - Bottom bar with 4 quick proof badges: `✓ 350 GSM Board` · `✓ Waterproof Vinyl` · `✓ Golden Wax Seal` · `✓ Keepsake Gift Packaging`.

**Step 1: Implement the upgraded JSX layout**
Replace outdated markup with the responsive 6-item bento/accordion layout with touch and keyboard accessibility (`role="tablist"` / `role="tabpanel"`).

**Step 2: Test locally**
Verify responsive behavior at 393px (mobile) and 1280px (desktop).

---

### Task 3: Mount `WhatsInside` into `src/app/page.tsx` & Align Navigation

**Files:**
- Modify: [`src/app/page.tsx:1-75`](file:///d:/Projects/calenderweb/src/app/page.tsx#L1-L75)
- Modify: [`src/components/Header.tsx:11-18`](file:///d:/Projects/calenderweb/src/components/Header.tsx#L11-L18)

**Step 1: Add dynamic import in `src/app/page.tsx`**
```tsx
const WhatsInside = dynamic(
  () => import("@/components/WhatsInside").then((m) => m.WhatsInside),
  { ssr: true }
);
```

**Step 2: Place in page hierarchy**
Place `<WhatsInside />` right after `<MonthCarousel />` (Section 03):
```tsx
{/* 03: Inside the Calendar (Dynamic Client Island) */}
<MonthCarousel />
<div className="strip strip-pattachitra" aria-hidden />

{/* 03B: What's In The Box Goodies (Dynamic Client Island) */}
<WhatsInside />
<div className="strip strip-pattachitra" aria-hidden />
```

**Step 3: Update `Header.tsx` anchor**
Confirm `What's inside` links seamlessly to `#whats-inside` or `#inside-calendar`.

---

### Task 4: Build Verification & Visual Validation

**Files:**
- Build test: `npm run build`
- Git commit

**Step 1: Run production build**
Run: `npm run build`
Expected: 0 errors, successful static generation of all pages.

**Step 2: Stage and commit**
```bash
git add src/components/WhatsInside.tsx src/app/page.tsx src/components/Header.tsx docs/plans/2026-10-16-whats-inside-box-goodies-showcase.md
git commit -m "feat(ui): add 6-item unboxing goodies showcase section to What's Inside"
```

---

## Execution Handoff
Once approved by user, switch to execution mode and implement Task 1 through Task 4.
