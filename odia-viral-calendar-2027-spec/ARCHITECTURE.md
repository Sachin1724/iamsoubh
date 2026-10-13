# Technical Architecture

## 1. Scope
Static-first single landing page for the 500-box pre-order campaign. Avoid building a full store, account system, or cart. The main website brief can be layered on later.

## 2. Recommended stack
- Next.js App Router with TypeScript.
- Tailwind CSS for layout and tokens, plus small CSS modules/global CSS for bespoke artwork and motion.
- Framer Motion only where useful; CSS transitions are preferred for simple effects.
- Static rendering for content-heavy sections.
- Razorpay Payment Button or hosted Payment Page for launch, subject to account capability and verified stock behavior.
- A serverless endpoint/backend is optional for MVP only if needed for secure order creation/webhooks. Never expose Razorpay secret keys in client code.
- Host on Vercel or Netlify. Use the existing brand domain/path after the owner confirms domain and Razorpay review details.

## 3. Suggested folder structure
```text
odia-viral-calendar/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── thank-you/
│   │   └── page.tsx
│   ├── policies/
│   │   ├── shipping/page.tsx
│   │   ├── refunds/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── contact/page.tsx
│   │   └── pricing/page.tsx
│   └── api/                     # only if server-side payment flow is chosen
│       ├── create-order/route.ts
│       └── razorpay-webhook/route.ts
├── components/
│   ├── site-header.tsx
│   ├── hero-section.tsx
│   ├── festival-card-carousel.tsx
│   ├── story-viewer.tsx
│   ├── contents-section.tsx
│   ├── preorder-section.tsx
│   ├── order-form.tsx
│   ├── mobile-sticky-cta.tsx
│   ├── faq-accordion.tsx
│   └── site-footer.tsx
├── data/
│   ├── site-config.ts
│   ├── festivals.ts
│   ├── testimonials.ts
│   └── faq.ts
├── lib/
│   ├── analytics.ts
│   ├── validation.ts
│   ├── razorpay.ts               # server-only code if custom checkout is used
│   └── urls.ts
├── public/
│   ├── images/
│   ├── cards/
│   ├── stories/
│   ├── brand/
│   └── og/
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
├── next.config.ts
├── package.json
├── README.md
├── DESIGN.md
├── UI.md
├── ARCHITECTURE.md
├── WORKFLOW.md
├── COPY.md
├── CONTENT_MODEL.md
├── CONFIG.md
├── PAYMENTS.md
├── ANALYTICS_LAUNCH.md
├── ASSETS.md
└── QA_CHECKLIST.md
```

## 4. Component boundaries
- `page.tsx`: composes the single landing page; no large data arrays embedded in JSX.
- Sections: presentational components driven by typed content data.
- `site-config.ts`: prices, shipping settings, dispatch promise, batch cap, sold-out switch, links, analytics IDs.
- `order-form.tsx`: quantity, delivery details, gift note, validation, checkout initiation.
- `lib/razorpay.ts`: server-only if using custom checkout. Never import secrets into client components.
- `lib/analytics.ts`: typed event helpers; consent and privacy behavior must be reviewed before production.
- Testimonials and card content live in data files, with asset references rather than inline blobs.

## 5. Data flow
1. Static page loads from the deployment.
2. Visitor taps primary CTA.
3. Client records `InitiateCheckout` and opens/focuses the order section/sheet.
4. User enters order details and quantity.
5. Checkout is initiated through Razorpay's supported flow.
6. Razorpay handles payment UI.
7. Payment result is verified through Razorpay's supported confirmation mechanism; custom integrations verify signatures server-side.
8. Visitor sees `/thank-you` or an inline confirmed result.
9. Operations reconcile paid orders from Razorpay and prepare courier CSV.

## 6. State model
- `preorder`: order CTA available.
- `sold_out`: purchase CTA replaced with waitlist CTA.
- `payment_pending`: checkout opened; no success claim.
- `payment_success`: only after confirmed result.
- `payment_failed_or_cancelled`: clear retry path, no duplicate order claim.
- `form_invalid`: inline errors and preserved values.
- `loading`: disabled submit with visible progress.

## 7. Performance
- Hero image: optimized AVIF/WebP and responsive sizes.
- Lazy-load below-the-fold images.
- Avoid Instagram embeds; use approved static story screenshots.
- Avoid large JS carousel dependencies if native horizontal scrolling suffices.
- Keep initial transfer near 2 MB or less as a working target.
- Use static rendering wherever possible; do not require an API call just to display page copy.

## 8. Security and privacy
- Never place Razorpay secret keys in `NEXT_PUBLIC_*` variables or client bundles.
- Collect only the data required to fulfill orders.
- Do not send address, phone, gift note, or other personal data to analytics.
- Restrict access to order exports and delete/retain data according to the published privacy policy.
- If custom backend payment is implemented, verify webhook signatures and make webhook processing idempotent.
- Do not accept payment success based solely on query parameters or a client redirect.

## 9. Environment variables
Keep an `.env.example` with names only:
```dotenv
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_RAZORPAY_BUTTON_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```
Only include variables actually used. Secret values belong in deployment secrets, not committed files.
