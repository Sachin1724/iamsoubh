# Odia Fonts Integration Plan: Hatalekha for Headings & Lohit Oriya for Subtext

> **Goal:** Integrate `hatalekha.ttf` (handwriting display font) for Odia headings and `Lohit-Oriya.ttf` (classic readable text font) for Odia subtext/body copy across Section 2 ("Where the Parba Begins") and the application.

**Status:** Plan ready for review — NO CODE CHANGES IMPLEMENTED YET.

---

## 1. Font Assets & Roles

| Font Name | Source Archive | Target Destination | Role in Story Section | Aesthetic Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Hatalekha** | `iamsoubh_iamge/hatalekha.zip` (`hatalekha.ttf`) | `src/app/fonts/hatalekha.ttf` | **Odia Headings & Titles** (`titleOr`, Section Title: *ପରବର ପ୍ରେରଣା*) | Authentic handwritten Odia script (*ହାତଲେଖା*). Evokes the artist sketching on stone ghats with pen and ink. |
| **Lohit Oriya** | `iamsoubh_iamge/Lohit-Oriya.zip` (`Lohit-Oriya.ttf`) | `src/app/fonts/Lohit-Oriya.ttf` | **Odia Subtext & Paragraphs** (`bodyOr`, intro text, card stories) | Clean, highly legible Unicode Odia typography. Ensures complex conjuncts (*ଯୁକ୍ତାକ୍ଷର*) and matras read effortlessly on mobile screens. |

---

## 2. Architecture & Typography Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        WHERE THE PARBA BEGINS                          │
│                                                                        │
│  [Heading - Hatalekha] : ପରବର ପ୍ରେରଣା                                  │
│  [Intro - Lohit Oriya] : ପ୍ରତ୍ୟେକ ଜାଗାର ନିଜର ଏକ କାହାଣୀ ଅଛି...          │
│                                                                        │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │ PHOTOGRAPH              │  │ [Step Title - Hatalekha]             │ │
│  │ (e.g. temple.jpg)       │  │ ଦେଖିବାରୁ ହିଁ ଆରମ୍ଭ।                  │ │
│  │                         │  │                                      │ │
│  │                         │  │ [Subtext - Lohit Oriya]              │ │
│  │                         │  │ ସକାଳର ଆଲୋକରେ ମନ୍ଦିରର ରୂପ, ପବନରେ...  │ │
│  └─────────────────────────┘  └──────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Implementation Tasks

### Task 1: Extract Font Files
- **Extract** `hatalekha.ttf` from `iamsoubh_iamge/hatalekha.zip` into `src/app/fonts/hatalekha.ttf`.
- **Extract** `Lohit-Oriya.ttf` from `iamsoubh_iamge/Lohit-Oriya.zip` into `src/app/fonts/Lohit-Oriya.ttf`.
- Verify file sizes and integrity in `src/app/fonts/`.

### Task 2: Configure Next.js Font Loaders in `src/app/layout.tsx`
- Import both local fonts using `next/font/local`:
  ```tsx
  const hatalekha = localFont({
    src: "./fonts/hatalekha.ttf",
    variable: "--font-odia-heading",
    display: "swap",
  });

  const lohitOriya = localFont({
    src: "./fonts/Lohit-Oriya.ttf",
    variable: "--font-odia-body",
    display: "swap",
  });
  ```
- Inject both font variables into the root `<html>` class list:
  ```tsx
  className={`${inter.variable} ... ${hatalekha.variable} ${lohitOriya.variable}`}
  ```

### Task 3: Declare Font Classes in `src/app/globals.css`
- Define clear utility classes in `src/app/globals.css`:
  ```css
  /* Odia Handwritten Heading Font */
  .font-odia-heading {
    font-family: var(--font-odia-heading), var(--font-odia-display), "Noto Sans Oriya", sans-serif;
  }

  /* Odia Clean Readable Body Font */
  .font-odia-body {
    font-family: var(--font-odia-body), var(--font-odia), "Noto Sans Oriya", sans-serif;
  }
  ```
- Also configure them in Tailwind CSS theme config if needed (`font-odia-heading`, `font-odia-body`).

### Task 4: Connect Typography in Section 2 (`StoryStage.tsx` & `SoundFamiliar.tsx`)
- In `src/components/StoryStage.tsx`:
  - Update `Head` component: Apply `font-odia-heading` to `beat.titleOr`.
    ```tsx
    {beat.titleOr && (
      <p className="mt-2 font-odia-heading text-xl tracking-wide leading-tight text-white/95 sm:text-3xl">
        {beat.titleOr}
      </p>
    )}
    ```
  - Update `Body` component: Apply `font-odia-body` to `beat.bodyOr`.
    ```tsx
    {beat.bodyOr && (
      <p className="max-w-[42ch] font-odia-body text-[0.95rem] leading-relaxed text-white/90 sm:text-base">
        {beat.bodyOr}
      </p>
    )}
    ```
  - Optical sizing calibration: Because handwritten fonts often render slightly more compact than geometric fonts, give `font-odia-heading` a slightly more generous `font-size` (+2px) and `leading` to prevent matra clipping.

### Task 5: Verify Conjuncts & Mobile Rendering
- Start dev server and review:
  - Complex conjuncts (*ଯୁକ୍ତାକ୍ଷର*): `ପ୍ରେରଣା`, `ମୁହୂର୍ତ୍ତରେ`, `ପର୍ବପର୍ବାଣୀରେ`, `ସୌନ୍ଦର୍ଯ୍ୟ`, `ଦୈନନ୍ଦିନ`, `ଦୃଶ୍ୟ`.
  - Matra vertical clearance (ensure top *reph* and bottom *u-kars* are not truncated by line-height).
  - Verify smooth font swapping without flash of unstyled text (FOUT).

---

## 4. Execution Checkpoint

No changes have been made to existing source code or components. Once you approve this plan, we can proceed to extract the fonts and apply them step-by-step.
