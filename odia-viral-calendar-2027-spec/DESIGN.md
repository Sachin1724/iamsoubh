# Design System — Odia Viral Calendar 2027

## 1. Design objective
Create a bold, culturally rooted, product-first landing page that feels like a contemporary independent brand rather than a generic store template. Use the personality and playful editorial energy of the OATSIDE reference, plus the structured product presentation and purchase clarity of the HIPPEAS references. Use original Odia cultural art and the client's assets; do not imitate either brand's exact layout or identity.

## 2. Brand idea
**For everyone who misses Odisha without saying it.**

The calendar is a collectible product and a reminder of home. The experience should balance:
- Cultural richness: Odia festival art, Pattachitra/Pipili/Sambalpuri-inspired pattern language where appropriate and licensed/created for this project.
- Product clarity: packaging, cards, contents, price, shipping, and pre-order CTA are immediately understandable.
- Playful editorial design: large condensed headlines, confident color blocks, short cheeky copy, small annotations, and occasional hand-drawn stars or motifs.
- Trust: real product photography, verified 2026 proof, real testimonials with permission, clear policies.

## 3. Color tokens
Use these as initial design tokens. Validate against final packaging/artwork before production.

| Token | Hex | Usage |
|---|---|---|
| `--color-chandua-red` | `#8F1D26` | Main hero, footer, brand ground |
| `--color-deep-red` | `#74151D` | Darker contrast panels |
| `--color-turmeric` | `#F4D34F` | Primary CTA, highlights, ribbons |
| `--color-parrot` | `#9ACB69` | Feature panels, secondary accents |
| `--color-rice` | `#F8F2E8` | Main content background |
| `--color-ink` | `#241A18` | Primary text |
| `--color-muted` | `#6D5D57` | Secondary text |
| `--color-line` | `#D8C9B9` | Subtle separators |
| `--color-white` | `#FFFFFF` | Checkout and light surfaces |
| `--color-success` | `#236B48` | Confirmed success state only |
| `--color-error` | `#B42318` | Form errors |

Do not use every color in every section. Keep a clear hierarchy: red is the brand anchor, rice-white is the reading surface, turmeric is the action color, and green is an occasional section accent.

## 4. Typography
- Large Odia display title: use the supplied title artwork as SVG. Never retype or recreate the lettering.
- Odia body text: Anek Odia or Noto Sans Oriya; verify conjuncts on actual devices.
- English display: a bold condensed display family similar in character to Oswald/Anton/Bebas Neue, subject to license and readability.
- Body/UI: Inter or a comparable highly legible sans-serif.
- Headline line-height: compact, but never clip glyphs.
- Body line-height: comfortable (roughly 1.45–1.65).
- Use real text for body copy, not screenshots of text.

## 5. Shape, borders, and texture
- Rounded product cards: approximately 12–20px radius.
- Larger editorial panels: 18–28px radius.
- Prefer subtle 1px warm separators over thick black borders.
- Use light paper grain and folk-inspired line art as restrained decoration; decorative layers must not reduce text contrast or increase initial page weight significantly.
- Buttons should be high-contrast, rounded/pill-like, with clear hover, focus, pressed, loading, and disabled states.

## 6. Layout
- Design mobile-first at 375px wide.
- Content max width on desktop: about 1200–1320px.
- Mobile side padding: 18–22px.
- Desktop side padding: 32–56px depending on viewport.
- Use asymmetrical editorial compositions on desktop; stack cleanly on mobile.
- Product photography should dominate the hero, but title, offer, and CTA must remain visible without a long hunt.
- Sticky mobile bottom bar: price + primary action, safe-area aware.
- Keep all page sections in one seamless page; no separate cart flow.

## 7. Interaction and motion
Only three decorative interactions are part of the richer direction:
1. Product box reveal/slide-out.
2. Festival card flip between artwork and calendar side.
3. Mystery card shuffle/reveal that does not disclose a selectable card before purchase.

For the pre-order MVP, prioritize the hero/product, card swipe, story viewer, purchase form, and FAQ. Keep animation short and optional. Respect `prefers-reduced-motion`; no essential information may depend on animation.

## 8. Accessibility
- Minimum target size 44×44px.
- Visible keyboard focus.
- Semantic headings and landmarks.
- Alt text for meaningful images; empty alt for decoration.
- Form fields have visible labels, not placeholder-only labels.
- Text contrast should meet WCAG AA where feasible.
- Avoid autoplaying testimonial stories. Reduced-motion preference disables automatic movement.
- The sticky bar must not obscure focused fields or the footer.

## 9. Responsive behavior
- Mobile: single column, horizontally swipeable festival/product cards, bottom sticky CTA, story viewer sized to viewport.
- Tablet: two-column product and order sections where space permits.
- Desktop: split hero, wider gallery, testimonials in a row, purchase section split between offer and order form.
- At narrow widths, prevent horizontal page overflow; horizontal carousels must be contained and clearly swipeable.

## 10. Do not do
- No generic SaaS gradients or purple/blue default theme.
- No copied OATSIDE/HIPPEAS logos, copy, or photography.
- No fake urgency or fabricated live stock.
- No fake customer testimonials.
- No promise of the wooden stand on the pre-order page until confirmed.
- No large video or heavy animation blocking the first render.
