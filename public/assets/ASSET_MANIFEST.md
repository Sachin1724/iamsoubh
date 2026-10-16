# IAMSOUBH Odia Viral Calendar 2027 — Asset Architecture & Manifest

This document provides a comprehensive structural guide to all static assets, media, fonts, and vector graphics used across the IAMSOUBH 2027 Odia Viral Calendar web application.

---

## Directory Overview

```text
public/
├── assets/
│   ├── bento/            # Bento showcase card PNGs & crops
│   │   └── odia_bento_card_pngs/ # 4 themed showcase illustrations (Raja, Manda Pitha, Rath Yatra, Boita Bandana)
│   ├── brand/            # Official brand marks, avatar, and extracted motifs
│   │   ├── calogo.png          # Main IAMSOUBH calendar brand logo
│   │   ├── soubh-avatar.png    # Soubhagya creator avatar for trust badges
│   │   ├── odia-hero-title.webp# High-res vector-accurate Odia calligraphy render
│   │   └── extracted/          # Extracted SVG flora, borders, and leaf strips
│   ├── motifs/           # Cultural Odia motifs, jhoti art, marigolds & mandalas
│   │   ├── vecteezy-mandala.png      # Top-left rotating mandala accent
│   │   ├── marigold-editorial.jpg    # Editorial genda phula photography
│   │   ├── odissi-dancer.jpg         # Classical Odissi mudra photography
│   │   ├── odia-jhoti-corner.svg     # Traditional floor-art corner flourish
│   │   ├── odia-jhoti-mandala.svg    # Traditional circular rice-paste mandala
│   │   └── mandala-laser-1200.png    # Mask image for FAQ watermark glow
│   ├── months/           # Monthly calendar card visuals
│   │   ├── calendar-back.webp        # Back-of-card calendar grid format
│   │   └── ratha-yatra-front.webp    # Ratha Yatra month feature card
│   ├── parba/            # 13th mystery parba visual assets
│   │   └── 13th-parba-sealed.webp    # Sealed envelope with gold foil seal
│   ├── previews/         # High-resolution design composites & reference crops
│   ├── product/          # 3D package renders, cards fan, and unboxing shots
│   │   ├── hero-client-product-hq.webp # Hero focal packaging + desk stand render
│   │   ├── hero-product-seamless.webp  # Seamless shadow transparent product render
│   │   ├── cards-fan-hero.webp         # Fanned festival card deck showcase
│   │   ├── cards-fanned.webp           # What's Inside fanned cards view
│   │   ├── odia-new-year-card.webp     # Pana Sankranti bonus card visual
│   │   ├── stickers-sheet.webp         # 24 Odia pop-culture sticker sheet
│   │   ├── thank-you-note.webp         # Hand-signed creator note
│   │   ├── box-open.webp               # Open magnetic keepsake box
│   │   └── Main-[1-6]-1024x833.png     # Packaging and box angle renders
│   ├── reviews/          # Authentic buyer photo reviews (38 items)
│   │   └── review-01.webp ... review-38.webp # Real customer desk setups & unboxing
│   ├── scene/            # Konark heritage line-art, palm foliage & architectural depth
│   │   ├── konark-sun-temple-chariot.png # Authentic Konark chariot etching background
│   │   ├── konark-lineart.png            # Vector line-art wheel mask for FAQ section
│   │   ├── konark-wheel.webp             # High-detail stone wheel relief
│   │   ├── foliage-left-cluster.webp     # Tropical palm & hibiscus framing
│   │   ├── foliage-right-cluster.webp    # Right side tropical foliage framing
│   │   └── palms-background.webp         # Subtle ambient palm backdrop
│   ├── videos/           # Creator unboxing and review UGC videos
│   │   ├── creator-01.mp4 ... creator-06.mp4 # Vertical 9:16 unboxing clips
│   │   └── poster-01.webp ... poster-06.webp # Optimized video cover poster frames
│   ├── folk-pattern-tile.png  # Odia folk-weave repeating texture tile
│   └── [concept cards & icons] # Raja, Rath Yatra, Nuakhai, Boita, Manabasa cards
├── patterns/             # Handloom and temple borders
│   ├── border-sambalpuri-horizontal.svg # Authentic Sambalpuri ikat horizontal border
│   ├── border-sambalpuri-vertical.svg   # Authentic Sambalpuri ikat vertical border
│   ├── border-ikat.svg                  # Bandha ikat geometric border
│   └── border-pattachitra.svg           # Traditional Pattachitra floral wave border
└── fonts/                # Web fonts served statically
    ├── Bigdream.ttf            # Condensed bold display font for hero headlines
    ├── BricolageGrotesque.ttf  # Modern expressive font for all subtexts & callouts
    ├── DiskoPhonic-Regular.woff2 / .ttf # Odia-styled display headline face
    ├── akshar.ttf              # Clean Indian subcontinent sans-serif
    └── jaya.ttf                # Traditional Odia script display font
```

---

## Detailed Category Catalog

### 1. Brand Assets (`/assets/brand/`)
- **`calogo.png`** (41.7 KB): The official IAMSOUBH calendar logo. Consumed by [`Header.tsx`](file:///d:/Projects/calenderweb/src/components/Header.tsx) and [`Footer.tsx`](file:///d:/Projects/calenderweb/src/components/Footer.tsx).
- **`razorpay-logo.svg`** & **`razorpay-icon.svg`**: Official Razorpay vector brandmark and two-tone icon used in [`PreorderSection.tsx`](file:///d:/Projects/calenderweb/src/components/PreorderSection.tsx) for payment security reassurance.
- **`soubh-avatar.png`** (65.7 KB): Round creator profile portrait of Soubhagya. Consumed in [`BuyerStories.tsx`](file:///d:/Projects/calenderweb/src/components/BuyerStories.tsx).
- **`odia-hero-title.webp`** (88.1 KB): Hand-crafted Odia script title "ବାର ମାସରେ ତେର ପର୍ବ". Used as high-contrast hero center art.
- **`extracted/`**: Granular SVG flourishes, border bands, and leaf strips used in ambient particle decoration [`Ambient.tsx`](file:///d:/Projects/calenderweb/src/components/Ambient.tsx).

### 2. Heritage & Scene Elements (`/assets/scene/`)
- **`konark-sun-temple-chariot.png`** (277.8 KB): Sourced from heritage archives; authentic Konark Sun Temple chariot etching with stone wheels, horses, and temple spire. Positioned at `bottom: 0` in [`Hero.tsx`](file:///d:/Projects/calenderweb/src/components/Hero.tsx) to anchor the headline.
- **`konark-lineart.png`** (114.9 KB): High-contrast mask image used in [`FaqSection.tsx`](file:///d:/Projects/calenderweb/src/components/FaqSection.tsx) for glowing temple wheel watermarks.
- **`foliage-left-cluster.webp` & `foliage-right-cluster.webp`**: Ambient framing foliage on desktop viewport edges.

### 3. Cultural Motifs (`/assets/motifs/`)
- **`vecteezy-mandala.png`** (273.3 KB): Fine-line geometric mandala. Positioned top-left in the hero with continuous 120s slow rotation (`animate-[spin_120s_linear_infinite]`).
- **`odia-jhoti-corner.svg`**: Rice-paste (jhoti chita) corner framing element used across [`Hero.tsx`](file:///d:/Projects/calenderweb/src/components/Hero.tsx), [`PreorderSection.tsx`](file:///d:/Projects/calenderweb/src/components/PreorderSection.tsx), and [`CreatorVideos.tsx`](file:///d:/Projects/calenderweb/src/components/CreatorVideos.tsx).
- **`odia-jhoti-mandala.svg`**: Central circular jhoti medallion used as background ambient watermarks in [`BuyerStories.tsx`](file:///d:/Projects/calenderweb/src/components/BuyerStories.tsx) and [`BulkSection.tsx`](file:///d:/Projects/calenderweb/src/components/BulkSection.tsx).
- **`marigold-editorial.jpg` & `odissi-dancer.jpg`**: High-resolution cultural photography for social proof cards and story sections.

### 4. Product Renders (`/assets/product/`)
- **`hero-client-product-hq.webp`** (142 KB): High-fidelity 3D mockup of the calendar box, wooden easel stand, and cards. Used in [`Hero.tsx`](file:///d:/Projects/calenderweb/src/components/Hero.tsx) and [`PreorderSection.tsx`](file:///d:/Projects/calenderweb/src/components/PreorderSection.tsx).
- **`cards-fanned.webp`**: Fanned deck composition illustrating the 12 festival cards in [`WhatsInside.tsx`](file:///d:/Projects/calenderweb/src/components/WhatsInside.tsx).
- **`stickers-sheet.webp`**: Visual representation of the viral Odia pop-culture sticker bonus pack.
- **`box-open.webp`**: Unboxed calendar presentation used in bulk gifting tiers [`BulkSection.tsx`](file:///d:/Projects/calenderweb/src/components/BulkSection.tsx).

### 5. Patterns & Borders (`/patterns/`)
- **`border-sambalpuri-horizontal.svg`** & **`border-sambalpuri-vertical.svg`**: Vector Sambalpuri ikat borders with traditional fish (*matsya*), conch (*sankha*), and geometric ikat weave patterns.
- **`border-pattachitra.svg`**: Curvilinear Pattachitra floral wave border.
- **`folk-pattern-tile.png`**: Repeating 160px micro-textured canvas tile applied to all major section backgrounds for rich tactile feel.

### 6. Customer Social Proof (`/assets/reviews/`)
- 38 WebP images (`review-01.webp` through `review-38.webp`) containing genuine Instagram and WhatsApp user reviews, desk setups, and unboxing photos. Rendered dynamically via [`src/data/customer-reviews.ts`](file:///d:/Projects/calenderweb/src/data/customer-reviews.ts).

### 7. Video UGC (`/assets/videos/`)
- 6 vertical format MP4 videos (`creator-01.mp4` through `creator-06.mp4`) with matching low-latency WebP posters (`poster-01.webp` through `poster-06.webp`). Rendered in [`CreatorVideos.tsx`](file:///d:/Projects/calenderweb/src/components/CreatorVideos.tsx) with custom play/pause/mute controls.

### 8. Typography System (`/fonts/` & `/src/app/fonts/`)
- **`Bigdream.ttf`**: Modern bold condensed sans font used for the headline lockup (`BARA MASA` & `TERA PARBA`).
- **`BricolageGrotesque.ttf`**: Expressive grotesque typeface loaded via `next/font/local` in `layout.tsx` (`--font-bricolage`). Powers all subtexts, category markers, and editorial captions (`.font-subtext`, `.font-bricolage`).
- **`DiskoPhonic-Regular.woff2`**: Secondary headline display font with sharp ink-traps.
