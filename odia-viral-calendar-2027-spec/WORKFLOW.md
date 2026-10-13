# Customer Workflow and States

## Main journey
Instagram/WhatsApp link → landing page → understand product → see proof → inspect cards and contents → order CTA → enter delivery details → Razorpay → verified confirmation → thank-you/share prompt.

## First-screen requirements
Within the initial mobile viewport, the visitor should be able to identify:
- Product name and 2027 edition.
- Product box/cards.
- Pre-order price ₹299 (subject to final approval).
- 500-box first-batch cap.
- Primary CTA.
- Short social proof line, only after figures are verified.

## CTA behavior
All “Let's Odia this”, “Order Now”, and sticky CTA controls should lead to the same order section/sheet. No CTA should send visitors to an unrelated page or an unverified external payment link.

## Order form
1. Select quantity from 1–3.
2. Enter recipient name, phone, address, pincode.
3. Optionally enter gift note.
4. Review quantity, product price, shipping, and total before paying.
5. Start Razorpay checkout.
6. Show pending/loading state while opening checkout.
7. Show success only after verified confirmation.
8. On failure/cancel, retain form data where safe and allow retry.

## Gift flow
The launch brief includes a gift note and shipping to the recipient address. There is no requirement to collect the buyer's separate address. The page must clearly explain that no price slip is placed inside the box.

## Sold-out flow
- Config `soldOut = true` disables/hides checkout entry points.
- Every CTA switches to `Join the batch 2 waitlist`.
- Opens approved WhatsApp prefilled message or waitlist form.
- Never accept a new payment after sell-out.
- Do not show invented remaining-stock numbers.
- “Last 100 boxes” is a manually enabled message only when the owner confirms the count.

## Thank-you state
- Confirm the order only if payment is confirmed.
- Provide an order reference if available from Razorpay.
- Offer the WhatsApp community link and an approved share-story template.
- Do not expose other customer details.

## Error states
- Missing/invalid phone, address, pincode: inline field-level errors.
- Payment cancelled: `Payment wasn't completed. Your details are still here. You can try again.`
- Payment pending: `We're checking your payment status. Please don't pay again yet.`
- Payment failed: `Payment didn't go through. You can try again or contact us.`
- Network error: preserve form values and provide retry.
- Sold out during checkout: stop new order creation and explain the batch has closed.
