# Configuration and Launch Flags

Keep changeable values in one typed configuration file (for example `data/site-config.ts`). This makes non-developer edits safer.

## Proposed initial config
These values come from the October 9 pre-order brief. Items noted “confirm” must not be considered launch-approved until the owner confirms them.

```ts
export const siteConfig = {
  brandName: "The Odia Viral Calendar",
  edition: 2027,

  preorderPricePaise: 29900,       // proposed; confirm before launch
  postBatchPricePaise: 33900,       // proposed batch 2 price
  batchCap: 500,
  soldOut: false,                   // owner-controlled; do not infer from clicks
  last100MessageEnabled: false,     // enable only after owner verifies stock
  last100Message: "Last 100 boxes",

  shipDateLabel: "First week of December 2026", // confirm with printer
  refundDeadlineLabel: "15 December 2026",      // confirm refund promise
  shippingOdishaPaise: 0,
  shippingRestIndiaPaise: 4900,     // proposed ₹49; confirm
  restIndiaShippingEnabled: true,   // confirm
  indiaOnly: true,

  quantityMin: 1,
  quantityMax: 3,

  razorpayButtonId: "",
  whatsappNumber: "",
  instagramUrl: "",
  metaPixelId: "",
  siteUrl: "",
} as const;
```

## Rules
- Use integer paise for currency math; format rupees only for display.
- Shipping should be computed once in a shared helper and shown before payment.
- Do not use a hard-coded live stock counter.
- `soldOut` is a manual owner-controlled switch unless a verified inventory system is implemented.
- `last100MessageEnabled` requires owner confirmation of the actual stock.
- Empty integration IDs must disable the relevant integration gracefully in development; they must not silently pretend checkout or analytics is working.
- Never commit secret keys. Public identifiers may be exposed only when the provider documents them as public.
- Add runtime validation for config values and show a safe fallback if a required production value is missing.
