// Stock lives in env: change NEXT_PUBLIC_BATCH_CAP and redeploy. The count of
// boxes sold comes live from Razorpay, so the cap is the only number to set.
const envNum = (v: string | undefined, fallback: number) => (Number(v) > 0 ? Number(v) : fallback);

export const siteConfig = {
  brandName: "The Odia Viral Calendar",
  edition: 2027,
  odiaTitle: "ବାର ମାସେ ତେର ପରବ",
  tagline: "For everyone who misses Odisha without saying it.",

  batchCap: envNum(process.env.NEXT_PUBLIC_BATCH_CAP, 500),
  counterThreshold: envNum(process.env.NEXT_PUBLIC_COUNTER_THRESHOLD, 300),
  soldOut: false,

  shipDateLabel: "First week of November 2026",
  // Same date set mid-sentence, so November keeps its capital.
  shipDateInline: "first week of November 2026",
  refundDeadlineLabel: "15 November 2026",

  freeShippingIndia: true,
  indiaOnly: true,
  freeDeliveryLabel: "Free delivery anywhere in India",
  // Goes on every order line and in the checkout copy. One number, one place.
  donationPerBox: 10,
  donationCause: "children's education",

  author: "Soubhagya Ranjan",
  handle: "@iamsoubh",

  // Razorpay checks these against the registered account. Fill before launch —
  // the policy pages render a visible TO CONFIRM marker while they are blank.
  legalName: "",
  businessAddress: "",
  supportEmail: "hello@iamsoubh.com",
  gstIncluded: true,
  instagramUrl: "https://instagram.com/iamsoubh",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
} as const;

// Prices come from env (NEXT_PUBLIC_ so the page and the server agree). Each
// reference is written out in full because Next only inlines literal names.
// Changing one needs a rebuild/redeploy; the fallbacks are the batch 1 prices.
const PRICE_1 = envNum(process.env.NEXT_PUBLIC_PRICE_1_BOX, 329);
const PRICE_3 = envNum(process.env.NEXT_PUBLIC_PRICE_3_PLUS, 283);
const PRICE_10 = envNum(process.env.NEXT_PUBLIC_PRICE_10_PLUS, 250);

export const products = {
  single: {
    id: "single" as const,
    name: "Calendar Box",
    price: PRICE_1,
    strikePrice: envNum(process.env.NEXT_PUBLIC_PRICE_AFTER_BATCH, 339),
  },
} as const;

/** Per-box price by how many boxes are in the order: it steps down, never resets. */
export const TIERS = [
  { from: 10, price: PRICE_10 },
  { from: 3, price: PRICE_3 },
  { from: 1, price: PRICE_1 },
] as const;
export const boxPrice = (boxes: number) => TIERS.find((t) => boxes >= t.from)!.price;
export const lowestBoxPrice = TIERS[0].price;
export const MAX_BOXES = 20;

export type ProductId = keyof typeof products;
export type SiteConfig = typeof siteConfig;
