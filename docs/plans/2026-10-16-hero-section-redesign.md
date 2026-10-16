# Hero Section Redesign: High-End Agency & Anti-Slop Visual Architecture

> **Skills Applied:** `high-end-visual-design` (Awwwards-tier visual language, double-bezel architecture, button-in-button CTA, motion choreography) & `design-taste-frontend` (anti-slop principles, authentic cultural materiality, substance over ornament, one live thing).
> **Rule Honored:** No commits will be made until explicitly requested.

---

## 1. Executive Concept: "The Jagannath Heritage Stage"

### The Subject Idea
> *"On this page, the physical 13-parba calendar cards become a living, stepped architectural stage reminiscent of the Ratna Simhasana (the sacred raised altar), inviting the visitor into Odisha's vibrant seasonal calendar through tactile 3D interaction."*

### Vibe & Texture Archetype
- **Editorial Luxury & Folk Materiality:**
  - **Ground:** Rich royal crimson (`#8A1717`) layered with an ultra-subtle folk motif weave (`opacity-[0.08]`) and softened ASCII WebGL light dynamics.
  - **Cards & Parchment:** Double-bezel concentric ivory cards (`#FFFDF7` / `#F6EFE2`) with rich festival art and ink-black borders (`#1B1B1B`).
  - **Accent:** Royal Turmeric Gold (`#E0A526`) and Fresh Tulasi Green (`#3E9B47`).

---

## 2. Structural Blueprint & Component Architecture

### A. Eyebrows & Editorial Typography
- **Top Pill Cluster:**
  - Eyebrow tag: Micro-pill with high tracking (`tracking-[0.2em] font-bold text-[10px] sm:text-xs text-[#E0A526]`), pulsing amber dot.
  - Secondary badge: "SAME ODIA HEART · NEW STORIES" in Tulasi Green (`#3E9B47`) with a solid 2px ink border and physical hard shadow.
- **Gazpacho Editorial Headline:**
  - Proportions: Large, high-impact display font with tight tracking (`tracking-tight leading-[0.98]`).
  - Two lines maximum across viewports:
    - Line 1: `The Odia` `<span className="text-[#E0A526]">Viral</span>`
    - Line 2: `Calendar is back.`
  - Subtitle: Clear editorial statement (1,500 homes, 22 states, USA).

### B. Nested "Button-in-Button" CTA Architecture (`high-end-visual-design` §4B)
- **Primary Order Button:**
  - Outer container: Pill button (`rounded-full bg-[#E0A526] hover:bg-[#EBB538] border-2 border-[#1B1B1B] shadow-[5px_5px_0_#1B1B1B]`).
  - Text: `Let's Odia this` in bold Gazpacho font.
  - **Trailing Icon Capsule:** Instead of a naked arrow, the arrow `→` is enclosed inside its own distinct circular accent badge (`w-8 h-8 rounded-full bg-[#1B1B1B] text-[#E0A526] flex items-center justify-center group-hover:translate-x-1 transition-transform`).
- **Live 3D Flip Value Proposition:**
  - Synchronized rotating phrases (`Only 500 boxes in batch 1`, `Ships first week of November`, etc.) with pulsing green indicator.

### C. The Stepped 5-Card Stage Showcase (`high-end-visual-design` §3B & Reference Image)
- **Geometry & Hierarchy:**
  - **5 Visible Cards** overlapping symmetrically across the stage:
    1. **Center Card (`diff = 0`):**
       - Frontmost (`z-index: 30`), elevated highest (`translateY(-16px)` on desktop, `-10px` on mobile), scale `1.05`.
       - Deep ambient shadow: `shadow-[0_22px_48px_rgba(0,0,0,0.6)] ring-2 ring-[#E0A526]`.
       - Top-Right Pill Badge: Yellow pill badge `2027 Parba ↗` (matching the "Get Started ↗" pill on the teal card in the reference image).
       - Interactive 3D tilt with sheen foil.
    2. **Inner Left & Right Cards (`diff = ±1`):**
       - Layer `z-index: 20`, stepped down (`translateY(10px)`), scale `0.94`.
       - Shifted horizontally so ~50-60% of each card is visible peeking out from behind the center card.
    3. **Far Left & Right Cards (`diff = ±2`):**
       - Layer `z-index: 10`, stepped down further (`translateY(24px)`), scale `0.88`.
       - Shifted horizontally to frame the outer shoulders of the stage.
    4. **Cards are Upright (0deg tilt):**
       - Clean, vertical, modern presentation exactly mirroring the reference image.
- **Double-Bezel Card Construction (`high-end-visual-design` §4A):**
  - **Outer Shell:** Machined hardware border (`rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-[#1B1B1B]`).
  - **Inner Core:** Solid cream/parchment background (`bg-[#FFFDF7]`), high-fidelity art image, subtle inner highlight, and crisp festival typography.

### D. 3D Floating Accents & Stickers
- **Top-Left Shoulder:**
  - Floating badge: `🪷 100% ODIA SOUL` angled at `-6deg`, hovering over the left card's shoulder.
- **Top-Right Shoulder:**
  - Floating badge: `✨ 13 PARBA ART` angled at `+6deg`, hovering over the right card's shoulder.
- **Center Interactive Cue:**
  - Floating dark capsule cursor badge: `Tap any card to focus` with pointer arrow.
- **Navigation Indicators:**
  - Responsive pagination dots below the cards with active pill indicator (`w-6 h-1.5 bg-[#E0A526]`).

### E. Touch & Fluid Motion Choreography
- **Transitions:** Custom cubic-bezier timing `cubic-bezier(0.32,0.72,0,1)` for buttery smooth 500ms sliding.
- **Touch Gestures:** Mobile swipe left / swipe right (`onTouchStart`, `onTouchEnd`) smoothly shifts the carousel.
- **Click to Focus:** Tapping any card slides it to the center position.

---

## 3. Step-by-Step Implementation Checklist

- [ ] **Step 1: Refine Layout Sizing & Macro-Whitespace**
  - Adjust top copy block padding so it sits cleanly in the upper hero zone without pushing cards out of view.
  - Position cards stage with `mt-auto pb-3 sm:pb-5` to ground the cards gracefully at the bottom.
- [ ] **Step 2: Implement "Button-in-Button" Nested CTA**
  - Wrap the trailing arrow in a dedicated circular badge inside the button.
  - Add kinetic micro-translation on hover (`group-hover:translate-x-1 group-hover:-translate-y-0.5`).
- [ ] **Step 3: Enhance Double-Bezel Card Hierarchy**
  - Add concentric inner border styling and multi-layer ambient shadow to the cards.
  - Ensure center card has the `2027 Parba ↗` pill badge.
- [ ] **Step 4: Verify Floating Badges & Shoulder Clearances**
  - Confirm stickers float over the outer cards' shoulders without colliding with buttons.
  - Verify smooth `animate-float-gentle` keyframe loop.
- [ ] **Step 5: Mobile & Desktop Viewport Validation**
  - Test at mobile viewports: 390x844 and 440x956 (user's exact device).
  - Test at desktop viewports: 1280x800 and 1440x900.
  - Confirm zero horizontal overflow and no vertical cut-off.
- [ ] **Step 6: Production Build & Lint Gate**
  - Run `npm run build` to verify 0 TypeScript/Turbopack errors.
  - Leave changes uncommitted in working tree as requested.
