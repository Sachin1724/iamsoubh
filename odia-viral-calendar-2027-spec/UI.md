# UI Specification — Pre-order MVP

## Page behavior
One continuous, mobile-first landing page. Main goal: a visitor arriving from Instagram can understand the offer and start an order quickly. Use a sticky mobile purchase bar. The page does not need a cart or account system.

## Global header
- Left: supplied Odia title/logo artwork.
- Navigation: About, What's inside, Stories, FAQ (anchor links; collapse on mobile).
- Right: primary “Order Now” button.
- Header may be sticky on desktop if it remains compact. On mobile, avoid competing with the bottom sticky bar.

## Section 1 — Hero
**Purpose:** communicate that the 2027 edition is back, show the product, expose the offer and CTA.

Content:
- Eyebrow: `2027 Edition · Pre-orders open`
- Headline: `The Odia Viral Calendar is back.`
- Odia title: supplied SVG artwork for `ବାର ମାସେ ତେର ପରବ` (confirm exact artwork/spelling with owner).
- Body: `Last year it went viral before it even shipped. 1,500 homes, 22 states and the USA later, it's back for 2027, and it's louder.`
- CTA: `Let's Odia this`
- Supporting line: `Only 500 boxes in the first batch · ₹299`
- Visual: 2027 box with cards fanned out, with the 2026 red box beside it if the owner supplies a real/approved image.

Behavior:
- CTA scrolls to/open the pre-order sheet or order section and fires `InitiateCheckout`.
- Do not add a countdown.
- Do not display a live remaining quantity at launch. Say “Only 500 boxes in the first batch.”
- Hero product image gets high priority; other images lazy-load.

## Section 2 — Sound familiar?
- Headline: `Raja came and went, and you found out from someone's story.`
- Copy: `Rath Yatra happened on TV again. Manabasa Thursday arrived and Maa asked why there was chicken in the fridge. Sound familiar?`
- Copy: `This calendar fixes that. Twelve Odia festivals, painted like the street you grew up on, sitting on your desk all year, with little Tradition Tracker boxes to tick when you actually show up.`
- Three tiles: `Every card repainted` · `A box that survives the courier` · `A sealed 13th parba`
- Visual: horizontal row of 12 card fronts; tapping a card flips to its calendar side. Card data/date accuracy must be approved.

## Section 3 — You said it better
- Heading: `You said it better than I can.`
- Subline: `1,500 boxes went out in 2026. This is what came back.`
- Story viewer: eight real 2026 stories/DMs in phone-shaped frames. Tap/swipe advances. Progress bars at top; no autoplay when reduced motion is on.
- Each story contains a real image, first name, city/state, and one short line in the buyer's own words.
- Only include stories with permission. Do not publish placeholder testimonials.
- “Where it went” chips show only locations represented by real approved stories. Selecting a chip jumps to that story.
- Closing line: `Tag @iamsoubh with your 2026 deck. You might end up here.`

## Section 4 — What's inside?
Items:
1. `12 festival cards, 8 × 11 cm, thick board, rounded corners, each with Tradition Tracker boxes`
2. `1 sealed 13th parba. One from the coast, one from the west, one from the heart of Odisha. You find out which when you tear it open.`
3. `An Odia New Year card for 14 April, ready to give to someone`
4. `A sticker sheet of Odia food and attitude`
5. `A thank-you note from me`
- Large closing line: `The box is minimal. Odisha never was.`
- Product photograph shows only confirmed included items. Do not show the wooden stand as included.

## Section 5 — The pre-order
- Heading: `500 boxes. Then the first batch closes.`
- Price: `₹299 now · ₹339 once the first batch is gone`
- Shipping: `Free anywhere in Odisha, because home should never charge delivery fees.` and `[₹49] to the rest of India.` Publish ₹49 only after confirmation.
- Dispatch: `Ships in the first week of December, so it's on your desk before 1 January.` Publish only after printer confirms in writing.
- Refund promise: `If it hasn't shipped by 15 December, you get a full refund. No forms, no follow-ups.` Publish only after owner explicitly approves.
- Gift copy: `Sending it home? Put their address at checkout. There's no price slip inside.`
- CTA: `Let's Odia this`
- Supporting line: `Pre-order now, or say "pare dekhibi" and watch 500 go without you.`

Order controls:
- Quantity stepper, minimum 1, maximum 3.
- Name, phone, full address, pincode, optional gift note.
- Validate fields and show understandable inline errors.
- Payment is through Razorpay.
- Clearly state India-only shipping for the first batch.
- On payment success, redirect to `/thank-you` if the chosen Razorpay flow supports it, otherwise show a verified success state.
- Never trust client-side success alone; rely on Razorpay's confirmed payment status/receipt.

## Section 6 — Questions
Accordion rows:
- `When does it ship?` → `First week of December, then 3 to 7 days to reach you.` (confirm before launch)
- `Can I pick my 13th parba?` → `No, it's sealed. Order three and you'll get all three.` (verify fulfillment can guarantee one of each)
- `I'm not Odia. Will I get it?` → `Every card has English too. Plenty of non-Odia friends learned what Raja is from it.`
- `Do you ship outside India?` → `Not in the first batch. Join the waitlist and you'll hear first.`
- `What if it arrives damaged?` → `Send a photo within 48 hours and I'll replace it.` (confirm policy)
- Include a bulk-order question only if a valid contact path is ready.

## Footer
- `Crafted with love, Soubhagya Ranjan`
- `@iamsoubh`
- WhatsApp contact link (owner supplies number)
- Policy links: Shipping, Refunds/Cancellation, Terms, Privacy, Contact, Pricing.
- Social links supplied by owner.
- Do not render dead links.

## Sold-out state
One config flag changes all purchase CTAs and sticky bar:
- CTA: `Join the batch 2 waitlist`
- Supporting copy: `All 500 are gone. Batch 2 opens at ₹339, and the waitlist hears first.`
- Button opens WhatsApp with a prefilled waitlist message, or an approved waitlist form.
- No payments are accepted once the batch is sold out.

## Mobile sticky bar
- Visible after initial hero/when scrolling, according to implementation preference.
- Before sell-out: `₹299` + `Let's Odia this`
- After sell-out: `Join the waitlist`
- Safe-area inset support; never cover focused form inputs.
