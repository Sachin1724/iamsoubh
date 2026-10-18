export const siteConfig = {
  brandName: "The Odia Viral Calendar",
  edition: 2027,
  odiaTitle: "ବାର ମାସେ ତେର ପରବ",
  tagline: "For everyone who misses Odisha without saying it.",

  batchCap: 500,
  counterThreshold: 300,
  soldOut: false,

  shipDateLabel: "First week of November 2026",
  // Same date set mid-sentence, so November keeps its capital.
  shipDateInline: "first week of November 2026",
  refundDeadlineLabel: "15 November 2026",

  freeShippingIndia: true,
  indiaOnly: true,
  freeDeliveryLabel: "Free delivery anywhere in India",

  author: "Soubhagya Ranjan",
  handle: "@iamsoubh",

  // Razorpay checks these against the registered account. Fill before launch —
  // the policy pages render a visible TO CONFIRM marker while they are blank.
  legalName: "",
  businessAddress: "",
  supportEmail: "",
  gstIncluded: true,
  instagramUrl: "https://instagram.com/iamsoubh",
  whatsappNumber: "+919876543210",
  whatsappWaitlistUrl:
    "https://wa.me/919876543210?text=Hi%20Soubh%2C%20please%20add%20me%20to%20the%20Odia%20Calendar%202027%20waitlist",
  whatsappBulkUrl:
    "https://wa.me/919876543210?text=Hi%20Soubh%2C%20I%27d%20like%20a%20quote%20for%20bulk%20boxes%20of%20the%202027%20calendar",

  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
} as const;

export const products = {
  single: {
    id: "single" as const,
    name: "Single Box",
    boxes: 1,
    price: 299,
    pricePaise: 29900,
    strikePrice: 339,
    maxQty: 9,
    payButtonLabel: "Let's Odia this",
    parcelImage: "/assets/product/parcel-1.webp",
    description: "One box for you. 12 cards and a sealed 13th.",
  },
  family: {
    id: "family" as const,
    name: "Family Pack (x3)",
    boxes: 3,
    price: 749,
    pricePaise: 74900,
    perBox: 250,
    maxQty: 3,
    badge: "Save ₹148",
    payButtonLabel: "Odia-fy the family",
    parcelImage: "/assets/product/parcel-3.webp",
    description: "For Maa, Bapa and you.",
  },
  gift: {
    id: "gift" as const,
    name: "Gift Pack (x5)",
    boxes: 5,
    price: 1149,
    pricePaise: 114900,
    perBox: 230,
    maxQty: 1,
    badge: "Best value · Save ₹346",
    payButtonLabel: "Odia-fy everyone",
    parcelImage: "/assets/product/parcel-5.webp",
    description: "Keep one, gift four.",
  },
} as const;

export type ProductId = keyof typeof products;
export type SiteConfig = typeof siteConfig;
