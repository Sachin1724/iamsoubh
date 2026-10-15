# Smartphone Interface & Component Cutting Fixes Implementation Plan

> **For Claude / Antigravity:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or direct execution to implement this plan task-by-task.

**Goal:** Eliminate all element cut-offs, overlapping elements, unpadded horizontal rails, and viewport edge collisions across all components on smartphone devices (360px - 420px viewports).

**Architecture:** Audit-driven mobile-first refinement across 7 key components (`BuyerStories`, `StoryViewer`, `Header`, `PreorderSection`, `BulkSection`, `StickyMobileBar`, `RootLayout`). Implement `snap-x snap-mandatory` with proper scroll padding, container edge bleed, responsive chip & card dimensions, collision clearance with fixed headers, and safe-area insets.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v4, Lucide React, Framer Motion.

---

### Task 1: Fix BuyerStories Sticky Note & Header Collision on Mobile
**Files:**
- Modify: `src/components/BuyerStories.tsx:220-260`

**Problem:** On mobile screens (< 1024px), the yellow sticky note (`Got your box? Tag @iamsoubh...`) sits in an awkward floating position with `rotate-2` and collides with or is partially obscured by the fixed red navbar pill when scrolling to `#stories`.
**Solution:**
- On mobile (`< lg`), position the sticky note cleanly in-flow below the description paragraph with `mt-4` and gentle centered/start orientation, avoiding upward protrusion.
- Add adequate `scroll-mt-28` to the `#stories` section so anchored links or scroll-spies never position section content underneath the sticky navbar.

---

### Task 2: Fix BuyerStories Filter Chips & Highlight Circles Track Clipping
**Files:**
- Modify: `src/components/BuyerStories.tsx:270-285` (Highlight circles track)
- Modify: `src/components/BuyerStories.tsx:365-386` (Filter tabs bar)

**Problem:** 
1. In the filter pills bar (`Unboxing (10)`, `Desk Setup (10)`, etc.), the first chip on the far left gets clipped (only a tiny sliver visible), and the last chip on the right is cut flush against the screen border with no right margin.
2. The highlight circles track needs clear start alignment and trailing spacer so the last highlight bubble doesn't stick to the screen edge.
**Solution:**
- Replace `-mx-4 px-4` with structured wrapper: `relative -mx-4 sm:-mx-6 lg:mx-0` and inner track `px-4 sm:px-6 lg:px-0`.
- Add scroll padding `scroll-pl-4 sm:scroll-pl-6` and a trailing spacer element `<div className="w-4 shrink-0" aria-hidden />` so the last chip always has comfortable right margin.
- Ensure the active chip indicator doesn't crop or overflow its pill boundaries.

---

### Task 3: Fix BuyerStories Carousel Cards Sizing & Snap Alignment
**Files:**
- Modify: `src/components/BuyerStories.tsx:428-525`

**Problem:**
1. Cards have fixed width `w-[240px]`. On a 360px–390px mobile phone, this displays 1 full card and a confusing ~100px fragment of the second card.
2. Lack of `snap-mandatory` means cards stop midway across the screen, cutting user handles and images in half.
3. Card header: On 240px cards, the city badge + handle + checkmark + index counter (`1/45`) gets cramped, truncating handles prematurely.
4. Bottom clearance: The quote and location at the bottom of the card can be obscured by `StickyMobileBar` (`z-40`).
**Solution:**
- Update card width to `w-[80vw] sm:w-[280px] md:w-[310px] shrink-0 snap-start` with `snap-x snap-mandatory` on the parent track.
- Add `scroll-pl-4 sm:scroll-pl-6` and trailing spacer so the last card finishes with margin.
- Polish card top bar flexbox: `min-w-0 flex-1 truncate` for username, `shrink-0` for city & index badges.
- Increase carousel bottom padding from `pb-6` to `pb-8 sm:pb-6` to guarantee clearance above the docked mobile CTA bar.

---

### Task 4: Fix StoryViewer Duplicate Close Button on Mobile Screens
**Files:**
- Modify: `src/components/StoryViewer.tsx:104-118`

**Problem:** 
On mobile phones, `StoryViewer` renders TWO close buttons at `top-3 right-3`:
1. The fixed desktop "Back to website / ESC" button.
2. The in-story round close button in the top progress bar.
They sit right on top of each other, creating an ugly visual glitch and touch conflict.
**Solution:**
- Add `hidden sm:flex` to the fixed desktop button (`line 111`).
- Only render the in-story round close button on mobile viewports.

---

### Task 5: Fix PreorderSection Mobile Badge & Address Grid Clipping
**Files:**
- Modify: `src/components/PreorderSection.tsx:245-265`
- Modify: `src/components/PreorderSection.tsx:348-368`
- Modify: `src/components/PreorderSection.tsx:438-465`

**Problem:**
1. In the Family Pack card, the "BEST VALUE · SAVE ₹108" badge is positioned at `-top-3 right-4`. In certain mobile viewports, cards can clip the badge if overflow is not explicitly handled.
2. Reassurance badges (`Free shipping`, `Secure payment`, `Free replacement`) sit in `grid-cols-3` which crushes text into 4 narrow wrapped lines on 360px screens.
3. In the optional delivery address drawer, `Pincode`, `City`, and `State` are in `grid-cols-3 gap-2`. On a 360px phone, each input is only ~90px wide, clipping placeholder labels.
**Solution:**
- Ensure Family Pack card has `overflow-visible` and the badge has `z-10`.
- In Reassurance badges, use responsive typography `text-[8.5px] sm:text-[10px]` with `leading-tight` and compact padding.
- In Address drawer, change grid to `grid-cols-1 sm:grid-cols-3 gap-2.5` (or Pincode taking 1st row, City & State sharing 2nd row on mobile) so input values and placeholders are never clipped.

---

### Task 6: Fix StickyMobileBar Safe-Area Clearance on Main Page
**Files:**
- Modify: `src/app/page.tsx:30`

**Problem:** 
`<main>` only has `pb-20 md:pb-0` (80px padding). `StickyMobileBar` is ~68px + iOS home indicator safe area (`env(safe-area-inset-bottom)`), totaling ~92px. On mobile, the footer copyright line and policy links are partially covered by the docked mobile bar when scrolled to the bottom.
**Solution:**
- Update `src/app/page.tsx` line 30 to `pb-28 md:pb-0` to guarantee complete clearance for the docked mobile footer bar.

---

### Task 7: Add Explicit Viewport Config in RootLayout
**Files:**
- Modify: `src/app/layout.tsx:78-95`

**Problem:** 
Next.js 14/15 requires an explicit exported `viewport` object for proper mobile scaling and safe-area handling.
**Solution:**
- Export `viewport: Viewport` with `width: "device-width"`, `initialScale: 1`, `maximumScale: 5`, and `themeColor: "#8A1717"`.

---

## Verification Plan

### Automated Verification:
- Run `npx tsc --noEmit` to ensure zero TypeScript / syntax errors.
- Run `npm run build` or test rendering in dev server.

### Manual / Browser Verification Checklist:
- [x] Viewport 360px (Samsung Galaxy / small Android):
  - [x] Check `Header` does not overlap the yellow note in `BuyerStories`.
  - [x] Check filter chips start at left margin with no clipped buttons and end with margin.
  - [x] Check story cards snap cleanly without half-cut cards or clipped user handles.
  - [x] Open a story: Verify only 1 close button is visible in top right.
  - [x] Check `PreorderSection`: Pincode/City/State inputs are comfortable and readable.
  - [x] Scroll to very bottom: Verify Footer copyright text is 100% visible above `StickyMobileBar`.
- [x] Viewport 390px (iPhone 14/15/16):
  - [x] Verify smooth horizontal scrolling, touch snapping, and edge-to-edge bleed.
