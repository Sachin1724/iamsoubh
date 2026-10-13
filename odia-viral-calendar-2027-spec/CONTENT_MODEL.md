# Content Model

Keep the page content separate from components. Use typed TypeScript objects. The examples below describe the schema; replace sample/empty values with verified content before launch.

## Site config
```ts
export type SiteConfig = {
  brandName: string;
  edition: number;
  preorderPricePaise: number;
  postBatchPricePaise: number;
  batchCap: number;
  soldOut: boolean;
  last100MessageEnabled: boolean;
  shipDateLabel: string;
  refundDeadlineLabel: string;
  shippingOdishaPaise: number;
  shippingRestIndiaPaise: number;
  restIndiaShippingEnabled: boolean;
  indiaOnly: boolean;
  razorpayButtonId?: string;
  whatsappNumber?: string;
  socialLinks: Record<string, string>;
};
```

## Festival card
```ts
export type FestivalCard = {
  id: string;
  month: string;
  festivalNameEn: string;
  festivalNameOr: string;
  dateLabel: string;
  dateStatus: "confirmed" | "to-confirm";
  artworkFront: string;
  calendarBack: string;
  altFront: string;
  altBack: string;
};
```
Festival dates in the September brief were explicitly subject to confirmation (including Nuakhai and Kartik Purnima). The October pre-order brief does not supply the full date table. Do not fill a complete date list from memory. Use final print-ready card data and panji validation.

## Testimonial
```ts
export type Testimonial = {
  id: string;
  firstName: string;
  city: string;
  stateOrCountry: string;
  quote: string;          // exact buyer words, short
  image: string;          // approved screenshot/photo
  alt: string;
  permissionConfirmed: boolean;
};
```
Only render items where `permissionConfirmed === true` and all required content is present. Do not invent placeholders on the live site.

## FAQ
```ts
export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  publishApproved: boolean;
};
```

## Product contents
Use a typed list with item name, description, asset path, and `confirmedIncluded` boolean. Hide any item where inclusion is not confirmed. The wooden stand is excluded from the pre-order offer until production is certain.

## Validation
- Do not render a story with no approved image/permission.
- Do not render a festival date unless confirmed by the owner and final print data.
- Do not render unconfirmed shipping or refund claims.
- All asset paths must resolve at build time.
