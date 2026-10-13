# 09 · Build Prompt

Paste the prompt below as the first message in Cursor, Claude Code or Lovable, with this whole folder in the project at `/docs`. Then build **phase by phase**, checking each phase on a real phone before moving on.

---

## The prompt

```
You are building a single-page, mobile-first pre-order site for "The Odia Viral Calendar 2027"
by @iamsoubh. The full spec is in /docs. Read these files before writing any code, in order:

  /docs/00-README.md               decisions, open items, repo layout
  /docs/01-DESIGN-SYSTEM.md        colours, type, tokens, components (tokens.css is in there)
  /docs/02-LAYOUT-AND-SECTIONS.md  every section's layout, mobile and desktop
  /docs/03-COPY.md                 all copy, word for word
  /docs/04-INTERACTIONS.md         behaviour of every moving part
  /docs/05-CHECKOUT-AND-BACKEND.md Razorpay, Supabase tally, functions, fallback mode
  /docs/06-CONFIG-AND-CONTENT.md   config file, content JSON, assets
  /docs/07-TRACKING-SEO-POLICIES.md
  /docs/08-QA-AND-LAUNCH.md

Hard rules:
- Stack: Astro + Tailwind (static output) on Vercel, serverless functions in /api, Supabase for the tally.
  Interactive parts are small vanilla-JS or Preact islands. No animation or carousel libraries.
- Design at 375 px first. Tap targets ≥ 44 px. Respect prefers-reduced-motion everywhere.
- Look: neo-brutalist bento on the 2026 palette. Rounded tiles, 2 px ink borders, hard offset
  shadows (no blur, ever), deep-red line-art ground, rice-white tiles. Use only the tokens in
  01-DESIGN-SYSTEM.md; do not invent colours, radii or shadows.
- Fonts: "Disko Phonic" (self-hosted /public/fonts/DiskoPhonic-Regular.woff2) for display,
  Inter for body, Anek Odia for typed Odia. font-synthesis: none. Disko has no ₹ or arrow glyphs:
  wrap ₹ in <span class="rupee"> and use inline SVG arrows.
- The Odia title ବାର ମାସେ ତେର ପରବ is always /public/lettering/title.svg, never typed.
- All copy, prices, dates, limits and links come from src/config/site.config.ts and
  src/content/*. Nothing hard-coded in components. Use the copy in 03-COPY.md exactly.
  No exclamation marks or emoji in UI copy.
- Prices are always recalculated on the server. Paid status only comes from a verified
  signature (verify-payment or the webhook). Never show an invented stock number.
- Use placeholder images (correct aspect ratios, labelled) until real assets arrive.

Work in these phases and stop after each one for review:
  1. Project setup, tokens.css, fonts, surfaces, section shells with the border strips,
     header, footer, sticky bar (no logic yet). Show me 375 px and 1280 px.
  2. Sections 01, 02, 08 with final copy and the hero entrance.
  3. Section 03: slider, toggle, month chips, ticks, stickers, 13? state.
  4. Section 04: story circles, story viewer, moving wall, counter strip.
  5. Section 05: video row with the autoplay rules.
  6. Section 06 UI: option cards, stepper, live total, badges, checkout sheet with validation
     and the pincode lookup. Then section 07 and the quote popup.
  7. Backend: Supabase SQL from 05, /api functions, Razorpay test mode, the webhook,
     /thank-you, the sold-out states, payment-buttons fallback mode.
  8. Tracking, SEO, Open Graph, policy pages.
  9. QA pass against 08-QA-AND-LAUNCH.md and report what fails.

Start with phase 1.
```

---

## Phase review checklist (use after every phase)

- [ ] Looked at it on a real phone at 375 px, not only devtools.
- [ ] No soft shadows, no gradients except the story ring, no new colours.
- [ ] Copy matches `03-COPY.md` exactly, and nothing is hard-coded.
- [ ] Reduced motion checked.
- [ ] Keyboard checked.
- [ ] Lighthouse mobile run, and the numbers noted.
