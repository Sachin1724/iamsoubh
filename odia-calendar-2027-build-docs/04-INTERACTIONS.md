# 04 · Interactions

Every moving part, how it behaves, how it is built, and what it does when the visitor has **reduced motion** switched on. Interactions use plain JS (or Astro islands with Preact or vanilla) to stay light. GSAP is not needed; CSS transitions, IntersectionObserver and Pointer Events cover everything.

**Global rules**
- Respect `prefers-reduced-motion: reduce` everywhere. Each item below lists its still version.
- Every tap target is at least 44 × 44 px.
- Everything works with a keyboard and a screen reader. Focus is always visible.
- Nothing auto-plays sound. Nothing blocks scrolling except open sheets.
- Analytics events named here are defined in `07-TRACKING-SEO-POLICIES.md`.

---

## 1. Hero entrance (the only orchestrated entrance)

On first paint:

| Time | Element | Effect |
|---|---|---|
| 0–600 ms | Box tile | Drops in from 24 px above, rotation settles from -6° to -2°, `--ease` |
| 300–700 ms | "2026 → 2027" sticker | Pops in with scale 0.8 → 1 |
| 500–900 ms | Info chips | Each fades in and moves up 8 px, 80 ms apart |

The title and button are **visible immediately** and never animated, so the first contentful paint is not delayed.
**Reduced motion:** everything shows in place with no animation.

---

## 2. Section 02 — four lines landing

- Each line tile starts at `opacity: 0; transform: translateY(16px) rotate(var(--tilt))` and moves to its final state when 40% of it enters the viewport (IntersectionObserver, `threshold: .4`). It plays once and never reverses.
- The turn line lands 200 ms after line 4.
- **Reduced motion:** all lines are visible, with no transition.
- **No JS:** the lines must be visible by default. Add the hidden starting class only from JS (`document.documentElement.classList.add('js')`).

---

## 3. Header and menu

- Header: after 40 px of scroll add `.is-scrolled` (deep red fill plus ink bottom border). Use a passive scroll listener with rAF or an IntersectionObserver on a 1 px sentinel.
- **Bag button:** smooth scrolls to `#order` (or jumps instantly with reduced motion) and moves focus to the 06 heading.
- **Menu button:** opens a full-screen rice sheet (`role="dialog"`, `aria-modal="true"`) listing 01–08 as large Disko links. Tapping a link closes the menu and scrolls to that section. Esc and ✕ close it, focus is trapped while it is open, and focus returns to the menu button on close.
- Anchor ids: `#hero #familiar #inside #stories #creators #order #bulk #faq`.
- Add `scroll-margin-top: 72px` to every section so the sticky header never covers a heading.

---

## 4. Sticky order bar

- It is **shown** when the hero is fully out of view and **hidden** while any part of `#order` is in view. Use two IntersectionObservers, one on the hero and one on 06.
- Show/hide: `transform: translateY(100%)` ↔ `0`, over `--d-base` with `--ease-sheet`. It hides while any sheet or menu is open.
- Add `padding-bottom: env(safe-area-inset-bottom)`, and add the bar height to the page's bottom padding so the footer is never covered.
- The left label switches between its three states (see `03-COPY.md`) from the stock state.
- The button scrolls to `#order`.
- **Reduced motion:** it appears and disappears without sliding.

---

## 5. Remaining counter

- Read the count from `GET /api/stock` (see 05). It returns `{ remaining, cap, soldOut, familyAvailable }`, cached at the edge for 30 seconds.
- Fetch once on load and again when 06 comes into view. Never poll faster than every 30 s.
- Show the count only when `remaining < config.counterThreshold` (300). Otherwise the hero chip "Only 500 boxes in batch 1" does the job.
- **Never show an invented or estimated number.** If the fetch fails, hide the counter and keep the chip.
- `soldOut: true` (or `config.forceSoldOut`) switches the whole page to the sold-out state (`02-LAYOUT-AND-SECTIONS.md`).

---

## 6. Section 03 — artwork to calendar slider

**Structure**
```html
<div class="compare" style="--pos:50%">
  <img class="back"  src="/cards/back-07.webp"  alt="Rath Yatra card, calendar side for July 2027">
  <img class="front" src="/cards/front-07.webp" alt="Rath Yatra card, painted artwork">  <!-- clipped -->
  <div class="handle" role="slider" tabindex="0" aria-label="Artwork and calendar"
       aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="Half artwork, half calendar"></div>
</div>
```
- The front image is clipped with `clip-path: inset(0 calc(100% - var(--pos)) 0 0)`, so the **artwork shows on the left and the calendar on the right**. 100% means all artwork; 0% means all calendar.
- **Drag anywhere on the card**: Pointer Events (`pointerdown` with `setPointerCapture`), `touch-action: pan-y` on the card so vertical page scroll still works, and position mapped to `--pos`.
- **Handle**: a 44 px circle (rice, ink border, `--sh-sm`) on a 3 px ink vertical line, with the "Drag to explore" hint in a small pill above it. The hint fades out after the first drag.
- **Toggle "Artwork | Calendar"**: a segmented pill. Artwork glides `--pos` to 100%, Calendar to 0%, over 320 ms. The active segment has an ink fill and rice text. When the user drags, the toggle shows neither segment as active unless `--pos` is 0 or 100.
- **Keyboard**: ← and → move 5%, Home goes to 0%, End to 100%. Update `aria-valuenow`.
- Fire `slider_drag` once per month per session.

**Month chips**
- A single `role="tablist"` row: JAN … DEC, 13?. JAN is selected first.
- Selecting a chip:
  1. Crossfades both images over 200 ms (stack the new pair on top and fade it in).
  2. Resets `--pos` to 50%.
  3. Updates the caption tile (festival, date, line), resets the two tick boxes and shows or hides the sticker.
- Each chip has `aria-controls` pointing at the caption tile. The caption tile is `aria-live="polite"`.

**Tick boxes**
- Two 32 px boxes with ink borders. Tap to toggle: a hand-drawn turmeric tick animates in with an SVG `stroke-dashoffset` over 280 ms.
- They are real `<input type="checkbox">` elements, visually styled. **They save nothing** and reset on month change.

**"13?" chip**
- Shows one sealed card image (`sealed-13.webp`, blurred with CSS `filter: blur(6px)` plus a wax seal overlay).
- Greys out the slider and toggle (`aria-disabled="true"`, 40% opacity, no pointer events) and shows the 13? caption.

**Images**
- WebP at 800 × 1100. Load January's pair eagerly (it is above or near the fold on desktop). Load the other 22 images plus the sealed card in `requestIdleCallback` (with a fallback to `setTimeout` 2 s) after `load`.

**Reduced motion:** no crossfade or glide (an instant swap), and the tick appears without the draw animation.

---

## 7. Section 04 — story circles and story viewer

**Circles**
- One per city from `stories.json`, 72 px, in a horizontal scroll row (`overflow-x: auto; scroll-snap-type: x proximity`).
- Ring: a 3 px conic gradient from deep red to turmeric with a 3 px rice gap. Once that city has been viewed, the ring turns grey (#9A948C).
- Save viewed cities in `localStorage` under the key `ovc27_viewed_cities` (wrap it in try/catch, since in-app browsers can block storage).
- The cover image is the first story of that city. The label below is Inter 600 13 px.

**Viewer (full screen)**
- `role="dialog"`, `aria-modal`, ink background, the 9:16 image centred and fitted to `100dvh`.
- **Top:** one progress bar per story in the current city (3 px, rice at 35% with a rice fill), then a row with the city name, the @handle (linking to `https://instagram.com/{handle}` in a new tab) and a ✕ button.
- **Optional one-liner** at the bottom: rice text on an 80% ink band.
- **Timing:** 5 s per story, animated with a CSS `animation` on the fill (`animation-play-state` toggles for pause).
- **Controls:**
  - Tap the right 65% for next, the left 35% for back.
  - Press and hold (> 250 ms) pauses; release resumes.
  - Swipe down (> 80 px) or ✕ or Esc closes.
  - On desktop, ← and → keys navigate, and visible chevron buttons sit outside the frame.
- After a city's last story it rolls straight into the next city's first story. After the last city, the viewer closes.
- **Preload** only the next two images (`new Image().src`).
- Body scroll is locked while open. On close, focus returns to the circle or wall item that opened it.
- Fire `story_open` with `{ city, source: 'circle' | 'wall' }`.
- **Reduced motion:** no auto-advance and no progress animation. Show previous and next arrow buttons and a "1 / 8" count.

**Data per story** (`stories.json`): `{ city, handle, image, line? }`. Each city has 6–10 stories as WebP at 1080 × 1920, about 120 KB each.

---

## 8. Section 04 — the moving wall

- Two full-bleed rows of phone-shaped tiles (9:16, 150 px wide on mobile and 220 px on desktop, `--r-phone`, 2 px ink border, `--sh-sm`), each tilted at a random angle between −4° and +4°. Generate the tilts at build time so they are stable and don't shift on hydration.
- Row 1 drifts **left** and row 2 drifts **right** at about 30 px/s. Use a CSS `@keyframes` translateX on the track only (no JS animation loop).
- The track content is duplicated once, and the animation moves by exactly -50%, so the loop has no seam. Compute the duration as `trackWidth / 30` seconds and set it as a CSS variable.
- **Pause** on `:hover` and while any pointer is down (`.is-paused { animation-play-state: paused }`), and when the section is offscreen (IntersectionObserver).
- **Tap** a screenshot to open the viewer at that story.
- 20–30 stories plus 3–4 DM screenshots. DM tiles have a small "DM" badge and do not open the viewer; they open a simple image lightbox.
- Lazy-load the wall images (`loading="lazy"`, `decoding="async"`) and use a 300 px wide WebP variant for wall tiles, not the 1080 one.
- The "Add yours" sticker sits after the wall, overlapping its bottom edge.
- **Reduced motion:** a still, single row that scrolls sideways by hand (`overflow-x: auto`, snap), with no duplication and no drift.

---

## 9. Section 05 — creator videos

- Six cards in a horizontal scroll-snap row (`scroll-snap-type: x mandatory`, each card `scroll-snap-align: start`).
  - **Mobile:** card width 82vw (about 1.2 cards visible).
  - **Desktop:** 3 cards visible, with arrow buttons paging by one card.
- Each card:
  ```html
  <video muted playsinline loop preload="none" poster="/videos/poster-01.webp">
    <source src="/videos/creator-01.mp4" type="video/mp4">
    <track kind="captions" src="/videos/creator-01.vtt" srclang="en" label="English">
  </video>
  ```
  (Or captions burned in, in which case skip the track.)
- **Autoplay rule:** play only while at least 60% of the card is visible (IntersectionObserver `threshold: .6`), and **only one at a time**. When a new one plays, pause the others.
- Set `src`/`preload` only when a card first comes near the viewport. Until then, show only the poster.
- **Tap the video** to toggle sound. The sound icon (top right) shows the state. Turning sound on for one video mutes and pauses all others.
- **Bottom overlay:** name (Disko 20 px), @handle, pull line (Inter 500) and "Watch on Instagram ↗" (opens the post in a new tab, fires `video_instagram_click`).
- "Collab" badge at the top left when `collab: true`.
- **If a creator refuses rehosting** (`rehost: false`), show the poster with a large play icon, which opens the Instagram post in a new tab. **Do not** use Instagram's embed script.
- Fire `video_play` with `{ index, handle }` on first play, whether autoplay or tap.
- **Reduced motion:** no autoplay. Show posters with a play button; tapping plays with sound.
- **Save-Data or 2G** (`navigator.connection.saveData` or `effectiveType` of `2g`): no autoplay either.

---

## 10. Section 06 — order selector

**Option cards**
- A `role="radiogroup"` with two `role="radio"` cards (or real radio inputs inside labels). The whole card is tappable. Arrow keys move the selection.
- **Family pack is selected by default.**
- Selected: 3 px chandua border, filled radio, chandua `--sh-lg`. The product image tile above or beside swaps to that option's image with a 200 ms crossfade.
- Switching options resets the quantity to 1.

**Stepper**
| Option | Min | Max | Boxes per unit | Price per unit |
|---|---|---|---|---|
| Single | 1 | 9 | 1 | ₹299 |
| Family | 1 | 3 | 3 | ₹749 |

- "−" is disabled at 1. At the max, "+" is replaced by the link **"10 or more? Get a bulk price →"**, which opens the quote popup with the range chip "10–25" preselected.
- The max is also capped by stock: `min(configMax, floor(remaining / boxesPerUnit))`.
- The count has `aria-live="polite"`.

**Live total**
- `{boxes} boxes · ₹{amount} · free shipping`, recalculated on every change. Use Indian number formatting (`toLocaleString('en-IN')`).
- This total is **display only**. The server recalculates the real amount.

**Stock states**
- `remaining < 3` → the Family card greys out with a "Sold out" badge, and Single is auto-selected.
- `remaining === 0` → the sold-out version of 06.
- If one option is marked sold out in the config, its card greys out and the other is selected.

**"Let's Odia This"**
- Fires `InitiateCheckout` (Pixel) and `begin_checkout` (GA4) with value and quantity.
- Opens the checkout sheet.

---

## 11. Checkout sheet

- **Mobile:** a bottom sheet sliding up (`--d-base`, `--ease-sheet`); swipe down on the handle area or tap the backdrop to close. **Desktop:** a centred 480 px card.
- `role="dialog"`, `aria-modal`, `aria-labelledby` the title. Focus moves to the first field and is trapped. Esc closes. The page behind does not scroll (`overflow: hidden` on `html`, plus `overscroll-behavior: contain` on the sheet).
- **The fields stay in the sheet if it is closed and reopened** (in-memory state). If storage is available, save them to `sessionStorage` too, so a failed payment does not lose the address.

**Fields and validation** (validate on blur, then live after the first error)

| Field | Input | Rule |
|---|---|---|
| Name | `autocomplete="name"` | 2–60 characters |
| WhatsApp number | `type="tel" inputmode="numeric" autocomplete="tel-national"` | Strip spaces and `+91`/`0`, then exactly 10 digits starting with 6–9 |
| Email | `type="email" autocomplete="email"` | Valid format (needed for the receipt) |
| Pincode | `inputmode="numeric" maxlength="6" autocomplete="postal-code"` | 6 digits, not starting with 0 |
| City, State | Text | Auto-filled from the pincode, editable, required |
| Address line | `autocomplete="street-address"` | At least 10 characters |
| Landmark | Text | Optional |
| Gift note | Textarea, 200 characters max with a live count | Optional |

**Pincode lookup**
- On the 6th digit, call our `/api/pincode?pin=` (a thin proxy to India Post `api.postalpincode.in`, cached), and fill the city (District) and state.
- On failure or a timeout after 3 s, leave the fields editable and show the "We couldn't find that pincode" message. **Never block checkout on this lookup.**

**"Pay ₹{amount} →"**
1. The button shows a spinner and is disabled. Fire `AddPaymentInfo` and `add_payment_info`.
2. `POST /api/create-order` with `{ product, qty, customer, giftNote, utm }`.
3. On `409 OUT_OF_STOCK`, show the stock message with the new max and update the stepper.
4. On success, open Razorpay Checkout with the returned `orderId`, amount, prefill and `timeout: 900` (see 05).
5. On a `handler` success, `POST /api/verify-payment`, then go to `/thank-you?o={orderId}`.
6. On `modal.ondismiss`, show the "Payment didn't go through. Your boxes are held for N more minutes." message, with the button active again (it reuses the same order while the hold is valid).
7. On `payment.failed`, show the failed message.

---

## 12. Quote popup (07)

- Opened from: the 07 button, the stepper's "10 or more?" link, and the "Ordering 10 or more?" FAQ answer link. It uses the same sheet component as checkout (bottom sheet on mobile, 480 px card on desktop).
- Closes on ✕, Esc, or a tap outside. Focus is trapped, and the page behind does not scroll.
- **Required:** name, WhatsApp (10 digits, `+91` optional), box range (chips, single select, `role="radiogroup"`), needed-by date (`<input type="date">` with `min` = today + 7 days), delivery city.
- **Optional:** company or group, email, anything else, printed-note checkbox.
- **Submit:** POST to Web3Forms (or the Google Apps Script endpoint) with all fields plus `source: 'quote-popup'` and the UTM values, so each request lands in Soubh's email **and** the Google Sheet.
  - Success: replace the form with the success line, using the first name.
  - Error: show the error line with the WhatsApp link.
  - Add a honeypot field (hidden `botcheck`) against spam.
- Fire `quote_open` on open, and `quote_submit` (GA4) plus `Lead` (Pixel) on success.
- **"WhatsApp me" links** open `https://wa.me/{number}?text={encoded}` with "Hi Soubh, I'd like a quote for {range} boxes of the 2027 calendar." `{range}` is the chip chosen in the open popup, or "some".

---

## 13. FAQ accordion

- Use `<details>`/`<summary>` for no-JS robustness, plus a little JS so only one item is open at a time.
- The plus icon rotates 45° when open (200 ms). The answer height animates with `grid-template-rows: 0fr → 1fr` (200 ms), or instantly with reduced motion.
- Links inside answers ("Request a quote") open the quote popup.

---

## 14. Waitlist (sold-out state)

- One WhatsApp field plus "Tell me first". It POSTs to `/api/waitlist` (or Web3Forms in fallback mode). Validate as 10 digits.
- On success, show the success line. Fire `waitlist_join` (GA4) and `Lead` (Pixel, `content_name: 'batch2_waitlist'`).
- Duplicate numbers still show success (the server dedupes).

---

## 15. Press and hover micro-interactions

- Every button and tappable tile uses the press state from `01-DESIGN-SYSTEM.md`: it moves into its shadow by 3 px over 120 ms.
- The hover lift applies on `(hover: hover)` devices only.
- No other decorative hover effects.
