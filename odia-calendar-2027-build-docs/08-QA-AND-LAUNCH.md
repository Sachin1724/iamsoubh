# 08 · QA and Launch

## 1. Performance budget

Most visitors arrive from the **Instagram in-app browser on mobile data**, so speed is a sales feature, not a nice-to-have.

| Metric | Target |
|---|---|
| First screen (HTML + CSS + fonts + hero image) | **< 1 MB** |
| Whole page before videos play | **≈ 3 MB** |
| LCP (hero box image) on a mid Android, 4G | < 2.5 s |
| CLS | < 0.05 |
| INP | < 200 ms |
| JS shipped on first load | < 60 KB gzipped (Razorpay, Pixel and GA4 load later) |
| Lighthouse mobile | Performance 90+, Accessibility 95+ |

**How**
- Static HTML with Astro islands only where needed (slider, viewer, videos, order, sheets).
- Fonts: Disko Phonic woff2 (19 KB, preloaded), Inter variable (subset Latin), Anek Odia only on the weights used. `font-display: swap`.
- Hero image: preload it with `fetchpriority="high"`. Every other image is `loading="lazy"` with explicit dimensions.
- Card images after the idle callback; wall thumbs at 300 px; videos `preload="none"` until near the viewport.
- `checkout.js` is injected only when the checkout sheet opens.
- No Instagram embeds, no carousel libraries, no animation libraries.

---

## 2. Accessibility checklist

- [ ] Every interactive element is reachable and usable by keyboard, in a logical order.
- [ ] Visible focus on everything (turmeric or chandua 3 px outline).
- [ ] Dialogs (menu, story viewer, checkout, quote) trap focus, close on Esc and return focus.
- [ ] The slider has `role="slider"` with value text, and the chips are a tablist.
- [ ] Option cards are a radiogroup; the stepper count is `aria-live`.
- [ ] Colour contrast meets the table in `01-DESIGN-SYSTEM.md` (no rice text on parrot green, no turmeric body text on red).
- [ ] Every image has the alt text from `06-CONFIG-AND-CONTENT.md`; decorative items are `aria-hidden`.
- [ ] Odia text is marked `lang="or"`.
- [ ] `prefers-reduced-motion` gives the still version of every interaction (see `04-INTERACTIONS.md`).
- [ ] Videos have captions (burned in or VTT).
- [ ] Form fields have real labels, error messages are linked with `aria-describedby`, and inputs are 16 px (no iOS zoom).
- [ ] The page works at 200% zoom and at 320 px wide.

---

## 3. Test matrix

| Environment | Must pass |
|---|---|
| **Instagram in-app browser, Android** | Full order with a real ₹1 payment via UPI intent (GPay, PhonePe, Paytm), returning to /thank-you |
| **Instagram in-app browser, iPhone** | Same, UPI collect or UPI app switch, then returning |
| **WhatsApp in-app browser, Android and iPhone** | Same |
| Chrome Android (mid-range device, 4G throttled) | Full flow, Lighthouse numbers |
| Safari iPhone | Full flow, sticky bar safe area, sheets |
| Desktop Chrome, Safari, Firefox | Bento layout, keyboard-only order |
| Odia rendering | Conjuncts like ଯାତ୍ରା and ସଂକ୍ରାନ୍ତି, and "କ'ଣ ଅଛି?" in Anek Odia on all of the above |
| Reduced motion on | Every still version |
| Slow 3G | The first screen is usable before the hero image arrives |
| Storage blocked (private mode) | Viewed rings and the sheet draft fail silently, nothing breaks |

**Checkout edge cases to test (in Razorpay test mode first)**

- [ ] Two browsers race for the last 3 boxes: only one gets them, and the other sees the stock message.
- [ ] An abandoned order releases its boxes after 15 minutes.
- [ ] Dismissing Razorpay and paying again reuses the same order while the hold is valid.
- [ ] Closing the tab right after paying: the webhook still marks it paid, and the tally updates.
- [ ] Verify and webhook arriving in either order give one paid row and one order number.
- [ ] A tampered amount from the browser makes no difference (the server price wins).
- [ ] A late payment after expiry with stock gone gives `overflow` plus an alert.
- [ ] Remaining < 3 shows the family pack as sold out; 0 shows the full sold-out state.
- [ ] `forceSoldOut` flips everything without a payment.
- [ ] `checkoutMode: 'payment-buttons'` works end to end.
- [ ] The quote form lands in the email **and** the Google Sheet, and the honeypot blocks bots.
- [ ] The pincode lookup failing still lets checkout complete.

---

## 4. Sales-ready checklist

The page is sales-ready when every box is ticked. Most of these are Soubh's, not the developer's.

**Payments**
- [ ] Razorpay live, Standard Checkout working, webhook connected and verified (or, in the fallback, two Payment Buttons with stock split 350 / 50)
- [ ] Auto-capture on in Razorpay
- [ ] Config set: ₹299 single, ₹749 family pack, one shared cap of 500 boxes
- [ ] One real ₹1 test payment made, refunded, and seen landing in the right bank account
- [ ] An abandoned test order gives its boxes back after 15 minutes

**Trust**
- [ ] Shipping in the first week of November confirmed **in writing** with the printer before the page goes live
- [ ] Six policy pages live; the refund page carries the 15 November promise word for word
- [ ] Real photos on the page: box mockup, a printed card proof, Soubh with the 2026 deck
- [ ] WhatsApp number on the page, answered within a few hours during launch week
- [ ] Disko Phonic commercial and web licence bought

**Proof**
- [ ] 20–30 story screenshots sorted by city, with each person's OK, and anyone else in the frame blurred
- [ ] Written OK from all six creators to rehost their videos, plus a note of which were paid or gifted
- [ ] The 1,500 homes and 22 states figures checked against 2026 Razorpay records

**Tracking**
- [ ] Pixel and GA4 events tested before launch (Meta Events Manager and GA4 DebugView)
- [ ] One UTM link per channel, listed in a sheet

**Order operations**
- [ ] Confirmation message written for WhatsApp and email, with the November ship date in it
- [ ] Order sheet ready: order ID, product, boxes, name, phone, address, pincode, gift note
- [ ] Courier account (Shiprocket or Delhivery) set up, with pincode coverage checked against the first orders
- [ ] Packing plan: one of each 13th parba in every family pack, and the three 13ths shuffled evenly across singles
- [ ] A bulk price sheet for 10–25, 26–50, 51–100 and 100+ boxes, ready before launch so every quote goes out the same day

**Content**
- [ ] Every `[confirm]` and `[fill]` from `03-COPY.md` resolved (the build fails if one is left)

---

## 5. Launch sequence

1. **Before anything:** agree with the printer the last day a box can be paid for and still ship in the first week of November **[confirm]**. Work every date below back from that.
2. **Three days before:** tease on stories. The 2026 box next to a covered 2027 box, the line "It's back", and a countdown sticker so people can tap "remind me".
3. **Launch day, first 24 hours:** 2026 buyers get the link first, by WhatsApp broadcast and DMs, a full day before everyone else.
4. **Day two:** public launch. A reel of the box opening (a mockup is fine), a "Raja came and went" carousel, link in bio, link sticker on stories.
5. **Every day after:** reshare every buyer's story and repost one 2026 story with "this could be you". Ten to fifteen Odia creators post the art. From day three, send the bulk section to Odia associations, alumni groups and HR people.
6. **Under 300 left:** the counter switches on by itself. Post a screenshot of it as a story, then a final reminder for the last 50.

---

## 6. Reading the result

Decide what each outcome means before launch, so the numbers can't talk anyone into anything afterwards.

| Outcome | What it means | What to do |
|---|---|---|
| 500 sold within 10 days | Validated | Size the main print run for the 10,000 target and open batch 2 at ₹339, waitlist first |
| 500 sold by the time pre-orders close | Demand is real but slower | Print a smaller first run and lean harder on creators before scaling |
| Under 250 by day 14 | Not validated at this offer | Don't print at scale. Find where people drop off before changing anything |

**Where people drop off tells you what to fix:**
- Many visits but few "Let's Odia This" taps points at the page or the offer.
- Many taps but few payments points at price or checkout.
- Few visits points at reach, not the product.

**Also watch:** waitlist size after the sell-out, new buyers versus 2026 buyers (from UTMs and phone numbers matched against the 2026 list), the share of family packs, and bulk quote requests. Together these are the gifting signal.
