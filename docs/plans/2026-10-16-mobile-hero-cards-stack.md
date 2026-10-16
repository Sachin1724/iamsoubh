# Mobile Hero Cards Stack & Empty Space Refinement Implementation Plan

> **For Claude / Antigravity:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or direct execution to implement this plan task-by-task.

**Goal:** Eliminate the large empty vertical void in the smartphone hero preview by transforming the bottom cards row on mobile into a rich, centered, overlapping fanned card stack, while preserving the 6-card panoramic arc on desktop.

**Architecture:** Implement a responsive dual-layout in `src/components/Hero.tsx`. On mobile viewports (`< sm`), render a dedicated 3-to-4 card fanned deck with tailored rotational offsets, depth scaling, and foil tilt that sits directly in the central-lower hero zone. On desktop (`sm:` and above), retain the 6-card wide panoramic arc grounded at the bottom of the 100vh viewport.

**Tech Stack:** Next.js 16 App Router (RSC + Client Island), React 19, Tailwind CSS v4, Motion / CSS transforms.

---

### Task 1: Audit Mobile Dimensions & Vertical Proportions
**Files:**
- Inspect: `src/components/Hero.tsx:112-238`

**Step 1: Calculate smartphone vertical budget (360px x 800px standard viewport):**
- Fixed header + top safe area: ~70px
- Eyebrow badges + Mobile Odia Heart pill: ~45px
- Title ("The Odia Viral Calendar is back."): ~110px
- Subtitle: ~60px
- CTA Cluster (Button + 3D flip text): ~75px
- Current total copy height: ~360px
- Remaining vertical space on 800px screen: **~440px** (currently completely empty!)
- Card deck height budget: ~220px–260px, perfectly filling the middle-to-lower hero canvas without overflow.

---

### Task 2: Create Mobile Fanned Card Stack Component
**Files:**
- Modify: `src/components/Hero.tsx`

**Step 1: Define Mobile Stack Card Data:**
Select the 3–4 most iconic festival cards for the mobile stack:
- Card 1 (Left background): *Manabasa Gurubara* (`-rotate-8 -translate-x-12 translate-y-3 scale-90`)
- Card 2 (Center foreground): *Rath Yatra* (`rotate-0 translate-y-0 scale-100 z-20`)
- Card 3 (Right background): *Raja Parba* (`rotate-8 translate-x-12 translate-y-3 scale-90`)
- Optional Card 4 (Deep background): *Nuakhai* or *Boita Bandana* (`-translate-y-3 scale-85 opacity-70`)

**Step 2: Implement responsive conditional rendering:**
- On mobile (`block sm:hidden`): Display the centered fanned card deck with `w-[155px] sm:w-[175px]` cards and touch-friendly tilt/scale.
- On desktop (`hidden sm:flex`): Retain the wide 6-card panoramic arc with hover lifts.

---

### Task 3: Calibrate Vertical Rhythm & Remove Empty Void on Mobile
**Files:**
- Modify: `src/components/Hero.tsx:45-120`

**Step 1: Adjust mobile container height and padding:**
- Switch mobile from `justify-between` with `mt-auto` (which pushes cards to the very bottom) to a balanced flex column with consistent vertical rhythm:
  - Copy block: `mb-4 sm:mb-6`
  - Mobile card stack: `my-auto py-2`
  - Bottom padding: `pb-4`
- Ensures the cards occupy the central-lower canvas directly beneath the CTA, eliminating the 400px empty chasm shown in the smartphone screenshot.

---

### Task 4: Enhance Interactive Polish on Mobile Cards
**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/app/globals.css` (if needed for keyframes)

**Step 1: Add subtle floating micro-motion & tap-to-cycle:**
- Add gentle staggered floating or interactive active state so tapping a side card brings it to the front.
- Ensure Konark temple line art sits cleanly behind the fanned card stack as a subtle watermark backdrop.

---

### Task 5: Verification & Browser Subagent Testing
**Files:**
- Test URL: `http://localhost:3000`

**Step 1: Test across viewports:**
- Mobile 360x800 (Samsung Galaxy S20 / Android standard)
- Mobile 390x844 (iPhone 12/13/14/15)
- Mobile 412x915 (Pixel 7 / large Android)
- Desktop 1920x1080 & 1440x900 (verify desktop 100vh panoramic arc is preserved)
**Step 2: Verify zero layout shift, no horizontal overflow, and no empty gaps.**
**Step 3: Commit changes to `main`.**
