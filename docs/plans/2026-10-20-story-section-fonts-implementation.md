# Story Section & Odia Typography Final Implementation Plan

> **For Agent/Engineer:** Execute this plan task-by-task. Maintain existing styles, ensure no TypeScript errors, and visually verify each change.

**Goal:** Implement the "Where the Parba Begins" editorial story section with authentic documentary photography and dual Odia typography: `hatalekha.ttf` for expressive handwritten headings, and `Lohit-Oriya.ttf` for crisp, readable subtext.

**Architecture:** 
1. Unpack and place font binaries into `src/app/fonts/`.
2. Register fonts as CSS variables via Next.js `localFont` in `src/app/layout.tsx`.
3. Add utility classes (`.font-odia-heading`, `.font-odia-body`) with fallback stacks in `src/app/globals.css`.
4. Update `StoryStage.tsx` typography mappings, line heights, and optical scaling.
5. Update `SoundFamiliar.tsx` beats, ensuring exact photo-to-story alignment (01 to 06 + intro & closing).

**Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, `next/font/local`.

---

## Task 1: Extract Font Assets to `src/app/fonts/`

**Files:**
- Source: `iamsoubh_iamge/hatalekha.zip` (`hatalekha.ttf`)
- Source: `iamsoubh_iamge/Lohit-Oriya.zip` (`Lohit-Oriya.ttf`)
- Target: `src/app/fonts/hatalekha.ttf`
- Target: `src/app/fonts/Lohit-Oriya.ttf`

**Step 1: Extract the fonts**
Run in PowerShell:
```powershell
tar -xf "d:\Projects\calenderweb\iamsoubh_iamge\hatalekha.zip" -C "d:\Projects\calenderweb\src\app\fonts"
tar -xf "d:\Projects\calenderweb\iamsoubh_iamge\Lohit-Oriya.zip" -C "d:\Projects\calenderweb\src\app\fonts"
```

**Step 2: Verify extraction**
Run:
```powershell
Get-Item "d:\Projects\calenderweb\src\app\fonts\hatalekha.ttf", "d:\Projects\calenderweb\src\app\fonts\Lohit-Oriya.ttf" | Select-Object Name, Length
```
Expected: Both files present with non-zero size.

---

## Task 2: Register Local Fonts in `src/app/layout.tsx`

**Files:**
- Modify: [`src/app/layout.tsx`](file:///d:/Projects/calenderweb/src/app/layout.tsx)

**Step 1: Add `localFont` declarations**
Add the font declarations for `hatalekha` and `lohitOriya`:
```tsx
const hatalekha = localFont({
  src: "./fonts/hatalekha.ttf",
  variable: "--font-odia-heading",
  display: "swap",
  preload: true,
});

const lohitOriya = localFont({
  src: "./fonts/Lohit-Oriya.ttf",
  variable: "--font-odia-body",
  display: "swap",
  preload: true,
});
```

**Step 2: Inject variables into `<html>` className**
Update the `RootLayout` `<html>` tag:
```tsx
<html
  lang="en"
  className={`${inter.variable} ${akshar.variable} ${jaya.variable} ${gazpacho.variable} ${bigdream.variable} ${bricolage.variable} ${hatalekha.variable} ${lohitOriya.variable}`}
>
```

**Step 3: Verification**
Verify no TypeScript errors:
```powershell
npx tsc --noEmit
```

---

## Task 3: Declare Font Utilities in `src/app/globals.css`

**Files:**
- Modify: [`src/app/globals.css`](file:///d:/Projects/calenderweb/src/app/globals.css)

**Step 1: Add utility classes and CSS fallbacks**
Locate the `.font-odia` rules in `src/app/globals.css` (around line 103) and add the dedicated heading and body classes:
```css
/* Odia Handwritten Heading Typography (Hatalekha) */
.font-odia-heading {
  font-family: var(--font-odia-heading), var(--font-odia-display), var(--font-odia), "Noto Sans Oriya", sans-serif;
}

/* Odia Clean Readable Subtext/Body Typography (Lohit Oriya) */
.font-odia-body {
  font-family: var(--font-odia-body), var(--font-odia), "Noto Sans Oriya", sans-serif;
}
```

**Step 2: Verification**
Check that CSS parses cleanly without PostCSS errors in the dev server log.

---

## Task 4: Upgrade `src/components/StoryStage.tsx` Typography

**Files:**
- Modify: [`src/components/StoryStage.tsx`](file:///d:/Projects/calenderweb/src/components/StoryStage.tsx)

**Step 1: Update `Head` component**
Apply `.font-odia-heading` to `beat.titleOr` with comfortable sizing and generous line-height to accommodate top rephs (*ର୍*) and ascenders without clipping:
```tsx
function Head({ beat }: { beat: StoryBeat }) {
  return (
    <>
      {beat.kicker && (
        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wider text-turmeric">
          {beat.kicker}
        </p>
      )}
      <h2
        className={`max-w-[18ch] font-gazpacho text-[1.7rem] font-bold leading-[1.08] sm:max-w-[24ch] sm:text-5xl lg:text-6xl ${
          beat.accent ? "text-turmeric" : "text-white"
        }`}
      >
        {beat.title}
      </h2>
      {beat.titleOr && (
        <p className="mt-2 font-odia-heading text-xl leading-[1.25] text-white/95 sm:text-3xl">
          {beat.titleOr}
        </p>
      )}
    </>
  );
}
```

**Step 2: Update `Body` component**
Apply `.font-odia-body` to `beat.bodyOr` with balanced line-height for clean readability:
```tsx
function Body({ beat }: { beat: StoryBeat }) {
  return (
    <>
      {beat.bodyOr && (
        <p className="max-w-[42ch] font-odia-body text-[0.95rem] leading-[1.65] text-white/90 sm:text-base">
          {beat.bodyOr}
        </p>
      )}
      {beat.body && (
        <p className="mt-2.5 max-w-[38ch] text-[0.8rem] font-light italic leading-snug text-white/80 sm:text-base">
          {beat.body}
        </p>
      )}
    </>
  );
}
```

---

## Task 5: Align All 6 Beats & Images in `src/components/SoundFamiliar.tsx`

**Files:**
- Modify: [`src/components/SoundFamiliar.tsx`](file:///d:/Projects/calenderweb/src/components/SoundFamiliar.tsx)

**Step 1: Verify the complete sequence of story beats**
Ensure the `BEATS` array in `SoundFamiliar.tsx` maps exactly to the 6 chapters:
1. **Intro Beat:**
   - Image: `/assets/story/street.jpg` (`position: "50% 35%"`)
   - Title (EN): `Where the Parba Begins`
   - Title (OD): `ପରବର ପ୍ରେରଣା`
   - Body (EN): `Every place has a story. Sometimes, it is found in a temple, a familiar street, a festival, or a quiet moment by the water. These little details are what make Odisha feel like home.`
   - Body (OD): `ପ୍ରତ୍ୟେକ ଜାଗାର ନିଜର ଏକ କାହାଣୀ ଅଛି। କେବେ ମନ୍ଦିରରେ, କେବେ ପରିଚିତ ଗଳିରେ, କେବେ ପର୍ବପର୍ବାଣୀରେ, ଆଉ କେବେ ନଦୀକୂଳର ନିରବ ମୁହୂର୍ତ୍ତରେ। ଏହି ଛୋଟ ଛୋଟ ଦୃଶ୍ୟ ଓ ସ୍ମୃତି ହିଁ ଓଡ଼ିଶାକୁ ଆମ ମନରେ ଘର କରି ରଖେ।`
2. **Beat 01 · The temple: Where inspiration begins**
   - Image: `/assets/story/temple.jpg` (`position: "50% 40%"`)
   - Kicker: `01 · The temple`
   - Title (EN): `It starts with noticing.`
   - Title (OD): `ଦେଖିବାରୁ ହିଁ ଆରମ୍ଭ।`
   - Body (EN): `The beauty of a temple in morning light, leaves moving in the breeze, and familiar surroundings. Ordinary moments often hold beautiful stories.`
   - Body (OD): `ସକାଳର ଆଲୋକରେ ମନ୍ଦିରର ରୂପ, ପବନରେ ହଲୁଥିବା ପତ୍ର ଓ ଚାରିପାଖର ପରିଚିତ ଦୃଶ୍ୟ। ଆମ ଚାରିପାଖରେ ଥିବା ଏହି ସାଧାରଣ ମୁହୂର୍ତ୍ତଗୁଡ଼ିକ ମଧ୍ୟରେ ଲୁଚି ରହିଥାଏ ଅନେକ ସୁନ୍ଦର କାହାଣୀ।`
3. **Beat 02 · Holding the cards: A memory to keep**
   - Image: `/assets/story/cards-hand.jpg` (`position: "50% 45%"`)
   - Kicker: `02 · Holding the cards`
   - Title (EN): `A little piece of home.`
   - Title (OD): `ନିଜ ମାଟିର ଟିକିଏ ଝଲକ।`
   - Body (EN): `Some places stay in our hearts, and some memories deserve to stay close. Each card captures a little of Odisha's familiar warmth.`
   - Body (OD): `କିଛି ଦୃଶ୍ୟ ଆମ ମନରେ ରହିଯାଏ, କିଛି ସ୍ମୃତିକୁ ଆମେ ସବୁବେଳେ ପାଖରେ ରଖିବାକୁ ଚାହୁଁ। ଏହି କ୍ୟାଲେଣ୍ଡରର ପ୍ରତ୍ୟେକ କାର୍ଡ ଓଡ଼ିଶାର ସେହି ଆତ୍ମୀୟତାର ଏକ ଛୋଟ ଝଲକ।`
4. **Beat 03 · By the water: Taking time to observe**
   - Image: `/assets/story/lake.jpg` (`position: "40% 50%"`)
   - Kicker: `03 · By the water`
   - Title (EN): `Some ideas arrive quietly.`
   - Title (OD): `କିଛି ଭାବନା ନିରବରେ ଆସେ।`
   - Body (EN): `New ideas sometimes emerge beside a quiet river or in a moment spent alone. When we slow down and look around, ordinary things begin to feel different.`
   - Body (OD): `କେବେ ନଦୀକୂଳର ଶାନ୍ତ ପରିବେଶରେ, କେବେ ନିଜ ସହ କିଛି ସମୟ ବିତାଇବା ଭିତରେ ନୂଆ ଭାବନା ଜନ୍ମ ନିଏ। ଟିକେ ରହି ଚାରିପାଖକୁ ଦେଖିଲେ, ଅନେକ ଛୋଟ ଛୋଟ ଜିନିଷ ନୂଆ ଭାବେ ଦେଖାଯାଏ।`
5. **Beat 04 · The artist at work: Finding beauty in details**
   - Image: `/assets/story/steps.jpg` (`position: "50% 40%"`)
   - Kicker: `04 · The artist at work`
   - Title (EN): `Look closer. There is a story here.`
   - Title (OD): `ପାଖରୁ ଦେଖ, ଏଠି ବି ଏକ କାହାଣୀ ଅଛି।`
   - Body (EN): `Terracotta pots, old walls, people, and everyday work all have their own beauty. Each detail can inspire a new drawing.`
   - Body (OD): `ମାଟିର ହାଣ୍ଡି, ପୁରୁଣା କାନ୍ଥ, ଲୋକଙ୍କ ଜୀବନ ଓ ସେମାନଙ୍କ ଦୈନନ୍ଦିନ କାମରେ ମଧ୍ୟ ରହିଛି ଏକ ନିଆରା ସୌନ୍ଦର୍ଯ୍ୟ। ଏହି ସବୁକୁ ଧ୍ୟାନରେ ଦେଖିଲେ, ପ୍ରତ୍ୟେକ ଦୃଶ୍ୟ ଏକ ନୂଆ ଚିତ୍ରର ପ୍ରେରଣା ହୋଇପାରେ।`
6. **Beat 05 · The sketchbook: From observation to art**
   - Image: `/assets/story/sketchbook.jpg` (`position: "50% 30%"`)
   - Kicker: `05 · The sketchbook`
   - Title (EN): `Every line begins somewhere.`
   - Title (OD): `ପ୍ରତ୍ୟେକ ରେଖାର ଏକ ଆରମ୍ଭ ଥାଏ।`
   - Body (EN): `Scenes that stay in the mind slowly become lines and colours. Some ideas take shape on paper, while others become new illustrations. This is where the artistic journey begins.`
   - Body (OD): `ମନରେ ରହିଯାଇଥିବା ଦୃଶ୍ୟ ଧୀରେ ଧୀରେ ରେଖା ଓ ରଙ୍ଗର ରୂପ ନିଏ। କିଛି ଭାବନା କାଗଜରେ ଆକାର ପାଏ, ଆଉ କିଛି ଭାବନା ନୂଆ ଚିତ୍ରରେ ପରିଣତ ହୁଏ। ଏହିଠାରୁ ଆରମ୍ଭ ହୁଏ ଏକ କଳାତ୍ମକ ଯାତ୍ରା।`
7. **Beat 06 · The finished cards: A little of Odisha, kept close**
   - Image: `/assets/story/cards-flat.jpg` (`position: "40% 50%"`)
   - Kicker: `06 · The finished cards`
   - Title (EN): `Moments become parba.`
   - Title (OD): `ସ୍ମୃତିରୁ ଜନ୍ମ ନିଏ ପରବ।`
   - Body (EN): `These little inspirations become festival illustrations: twelve festival cards and one special sealed 13th parba, keeping a little of Odisha close throughout the year.`
   - Body (OD): `ଏହି ଛୋଟ ଛୋଟ ପ୍ରେରଣା ଓ ଭାବନା ମିଶି ରୂପ ନିଏ ପର୍ବପର୍ବାଣୀର ଚିତ୍ରରେ। ବାରଟି ପର୍ବର କାର୍ଡ ଓ ଗୋଟିଏ ସ୍ୱତନ୍ତ୍ର, ସିଲ୍ ହୋଇଥିବା ତ୍ରୟୋଦଶ ପରବ—ଯାହା ଆମକୁ ବର୍ଷସାରା ଓଡ଼ିଶାର କିଛି ସ୍ମୃତି ନିଜ ପାଖରେ ରଖିବାର ସୁଯୋଗ ଦିଏ।`
8. **Final Closing Transition Line:**
   - Image: `/assets/story/cards-hand.jpg` (`position: "40% 60%"`)
   - Title (EN): `Not just dates. A little of Odisha, kept close.`
   - Body (OD): `କେବଳ ତାରିଖ ନୁହେଁ। ଓଡ଼ିଶାର ଟିକିଏ ଆତ୍ମୀୟତା, ସବୁବେଳେ ପାଖରେ।`
   - `accent: true`

---

## Task 6: Visual Testing & Quality Assurance

**Step 1: Test build & TypeScript validation**
```powershell
npm run build
```
Verify that Next.js font compilation succeeds and all TTF glyphs embed properly.

**Step 2: Visual inspection on local dev server (`http://localhost:3000`)**
- Scroll into Section 02.
- Verify Hatalekha rendering on Odia titles: Check character curves, artistic handwriting look, and lack of clipping on vowel signs (*ମାତ୍ରା*).
- Verify Lohit Oriya rendering on paragraphs: Check readability, sharpness, and clean rendering of conjuncts (*ଯୁକ୍ତାକ୍ଷର*).
- Test on mobile viewport (390px / iPhone view) and desktop (1440px) to ensure no overflow.
