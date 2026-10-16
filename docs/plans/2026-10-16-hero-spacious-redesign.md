# Implementation Plan: Hero Section Spacious & High-End Redesign

> **Goal:** Eliminate the giant empty space in the Hero section by significantly increasing card sizes, removing intrusive stickers that cover cards, implementing smart edge-fade depth (inspired by the reviews section), and creating a balanced, high-end agency composition.
> **Design Skills Applied:** `high-end-visual-design` & `design-taste-frontend`.
> **Rule Honored:** No git commits until explicitly requested.

---

## 1. Problem Diagnosis & Architectural Decisions

| Issue Observed | Root Cause | High-End Design Solution |
| :--- | :--- | :--- |
| **380px Empty Vertical Gap** | Small cards (`w-[136px]`, height 181px) pushed to bottom with `mt-auto`, leaving a giant red void below the CTA button. | **Increase card scale by ~45%**: Center card becomes `w-[205px]` (height 273px) on mobile, `w-[250px]` on desktop. Stage height expands to 330px, naturally filling the hero void. |
| **Stickers Covering Artwork** | `100% ODIA SOUL` and `13 PARBA ART` floating pills overlap the tops of the cards, cluttering the view. | **Remove the cluttering stickers**: Follow `design-taste-frontend` ("substance over ornament"). Let the authentic Odia festival art be the hero. |
| **Outer Edges & Depth** | Outer cards look cramped inside narrow bounds instead of feeling expansive. | **Smart Edge Fade & Depth of Field (Like Reviews)**: Outer cards extend to/past viewport edges with a smart micro-blur/fade (`opacity-65 blur-[1.5px] scale-[0.84]`), creating cinematic carousel depth. |
| **CTA & Copy Spatial Tension** | Headline, subtitle, and button are too loosely spaced from the stage. | **Unified Hero Poster Rhythm**: Balance vertical padding and flex distribution so the headline, button, and enlarged card stage feel like a cohesive, museum-tier poster. |

---

## 2. Technical Geometry & Responsive Calculations

### A. Mobile Viewport (390px - 440px wide, 844px - 956px tall)
- **Center Card (`diff = 0`):**
  - Width: `w-[200px]` (aspect 3/4 -> height 266px).
  - Transform: `translateX(0) translateY(-8px) scale(1.05)`.
  - Layer: `z-30`, `opacity: 1`, `blur-0`.
  - Shadow: `shadow-[0_24px_50px_rgba(0,0,0,0.7)] ring-2 ring-[#E0A526]/80`.
  - Sleek top-right badge: Micro-pill `2027 Parba ↗` placed neatly in the corner without blocking the flower/chariot icon.
- **Inner Flanking Cards (`diff = ±1`):**
  - Width: `w-[190px]`, height 253px.
  - Transform: `translateX(±72px) translateY(12px) scale(0.95)`.
  - Layer: `z-20`, `opacity: 0.96`, `blur-0`.
  - Overlap: ~45% of card width is clearly visible on each side of the center card.
- **Outer Flanking Cards (`diff = ±2` - Smart Fade/Blur like Reviews):**
  - Width: `w-[180px]`, height 240px.
  - Transform: `translateX(±140px) translateY(26px) scale(0.86)`.
  - Layer: `z-10`, `opacity: 0.65`, `filter: blur(1.5px)`.
  - Effect: The outer cards bleed toward and beyond the screen edges with a gentle depth-of-field softening, providing an expansive gallery feel without hard borders!

### B. Desktop Viewport (1024px to 1440px+)
- **Center Card (`diff = 0`):** `w-[245px]`, height 326px, `translateY(-16px) scale(1.06)`, `z-30`.
- **Inner Flanking Cards (`diff = ±1`):** `w-[225px]`, `translateX(±150px) translateY(10px) scale(0.95)`, `z-20`.
- **Outer Flanking Cards (`diff = ±2`):** `w-[205px]`, `translateX(±290px) translateY(28px) scale(0.86) opacity-80 blur-[1px]`, `z-10`.
- Stage container: `h-[340px] sm:h-[370px] md:h-[400px]`, perfectly proportioned on 100dvh screens.

### C. Cleaned Decorative Layer
- Remove the floating sticker pills (`100% ODIA SOUL` and `13 PARBA ART`) from the cards stage completely.
- Keep the clean floating cursor hint (`Tap any card to focus`) below the stage on desktop.
- Keep the responsive pagination dots at the bottom.

---

## 3. Step-by-Step Implementation Tasks

### Task 1: Update Card Dimensions and Transforms in `Hero.tsx`
- Replace small card widths (`w-[136px]`) with enlarged dimensions (`w-[195px] sm:w-[210px] md:w-[230px] lg:w-[245px]`).
- Update `h-[215px]` stage container to `h-[290px] sm:h-[320px] md:h-[350px] lg:h-[375px]`.
- Add smart edge depth-of-field blur: for `diff === ±2`, apply `opacity-65 blur-[1.5px] scale-[0.86]`.
- Set fluid cubic-bezier transition: `transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]`.

### Task 2: Remove Cluttering Floating Stickers
- Delete the `-top-5 sm:-top-8` sticker badges that cover the card tops.
- Refine the center card's `2027 Parba ↗` pill so it sits flush in the upper-right corner without encroaching on the central festival motif.

### Task 3: Spatial Rhythm & Void Elimination
- Adjust the vertical spacing of the top copy container (`pt-2 sm:pt-4 mb-1 sm:mb-2`) and the card stage (`mt-auto pb-2 sm:pb-4`).
- Ensure the 380px vertical dead space on mobile is completely eliminated.

### Task 4: Viewport Verification
- Verify in browser subagent on mobile viewport (412x924 and 390x844).
- Verify in browser subagent on desktop viewport (1280x800).
- Confirm zero unwanted horizontal page scroll and zero clipping.

### Task 5: Build Check
- Run `npm run build` to verify 0 errors.
- Confirm changes remain uncommitted in working tree.
