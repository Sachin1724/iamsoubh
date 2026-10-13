# Payments — Razorpay Launch Plan

## Preferred launch approach
Use a Razorpay Payment Button or hosted Payment Page if it supports the required quantity, required delivery fields, stock cap, and post-payment confirmation for the client's account. The October brief recommends a Payment Button with item quantity; it also names a hosted Payment Page as fallback. Verify current Razorpay account capabilities and settings before implementation.

## Requirements
- Price: proposed ₹299 per box for batch 1; confirm before launch.
- Quantity: 1–3 boxes.
- Batch cap: 500 boxes. Stock must be enforced by Razorpay or a trusted server-side inventory mechanism, not just a front-end counter.
- Fields: recipient name, phone, full address, pincode, optional gift note.
- Shipping: free within Odisha; proposed ₹49 elsewhere in India, subject to confirmation.
- Payment methods: UPI, cards, netbanking, subject to account configuration.
- Post-payment: redirect to `/thank-you` if supported, or show a confirmed result.
- International shipping: disabled for the first batch.
- Payment test: make a real ₹1 test payment, refund it, and confirm settlement/reporting before launch.

## Important limitation
A static page cannot securely create/verify custom Razorpay orders by itself. If a custom Checkout integration is used:
1. Server creates the order using secret credentials.
2. Client opens Razorpay Checkout using the returned order ID.
3. Server verifies the Razorpay signature/payment result.
4. Webhook signatures are verified server-side.
5. Webhook/order processing is idempotent.
6. Order is marked paid only after authoritative verification.

Never expose `RAZORPAY_KEY_SECRET` or webhook secret in browser code.

## Stock and sell-out
- Set stock to 500 in the selected Razorpay product/payment configuration if supported and verified.
- Test what happens at zero stock.
- When owner toggles `soldOut`, disable all payment entry points and show the waitlist CTA.
- Do not use a fake counter or client-side-only stock decrement.
- If stock cannot be reliably enforced by the chosen payment method, add a server-side inventory/order mechanism before accepting payments.

## Order operations
- Export transactions each morning and upload to Shiprocket/Delhivery or the chosen courier.
- Keep order ID, recipient, phone, address, pincode, quantity, gift note, payment status, and fulfillment status in a restricted-access operations sheet.
- Prepare customer confirmation message for WhatsApp/email.
- Establish duplicate-payment and refund support procedures.
- Verify order-three fulfillment promise (“all three 13th parbas”) is operationally achievable before publishing.

## Launch checklist
- [ ] Razorpay button/payment page configured.
- [ ] Stock cap tested at 500 and sold-out state tested.
- [ ] Required fields and quantity 1–3 tested.
- [ ] UPI tested inside Instagram/WhatsApp in-app browsers on Android and iPhone.
- [ ] Cards and netbanking tested as available.
- [ ] ₹1 test payment completed and refunded.
- [ ] Redirect/thank-you state verified.
- [ ] Payment reconciliation and shipping CSV workflow ready.
