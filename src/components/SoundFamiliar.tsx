import { FamiliarCards, type FamiliarCard } from "@/components/FamiliarCards";

// Placeholder artwork: the bento cards already in the project. Soubh's four
// new ones drop straight in here, nothing else changes.
const FAMILIAR_CARDS: FamiliarCard[] = [
  {
    id: "raja",
    line: "Raja came and went. You found out from someone's story.",
    image: "/assets/bento/odia_bento_card_pngs/bento_01_raja_swing_clean.png",
    width: 949,
    height: 336,
    wide: true,
  },
  {
    id: "pitha",
    line: "Maa asked, 'Pitha khailu?' You said yes. Your last pitha was months ago.",
    image: "/assets/bento/odia_bento_card_pngs/bento_02_manda_pitha_clean.png",
    width: 476,
    height: 691,
  },
  {
    id: "rath",
    line: "You watched Rath Yatra on reels. From 1,000 km away. Again.",
    image: "/assets/bento/odia_bento_card_pngs/bento_03_rath_yatra_clean.png",
    width: 474,
    height: 373,
  },
  {
    id: "pana",
    line: "You wished Maa for Pana Sankranti. A day late.",
    image: "/assets/bento/odia_bento_card_pngs/bento_04_boita_bandana_clean.png",
    width: 474,
    height: 320,
  },
];

export function SoundFamiliar() {
  return (
    <section
      id="sound-familiar"
      className="relative pt-24 sm:pt-36 pb-24 sm:pb-36 bg-pipili-indigo text-on-dark scroll-mt-28 overflow-x-clip"
    >
      {/* Deep indigo vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(31,45,102,0) 35%, rgba(12,18,45,0.55) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Folk pattern texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-repeat z-0"
        style={{ backgroundImage: "url('/assets/folk-pattern-tile.png')", backgroundSize: "180px" }}
        aria-hidden="true"
      />

      {/* Sketch plates, cropped off the corners */}
      <div
        className="absolute -top-16 -right-20 sm:-right-10 md:right-0 w-[380px] sm:w-[500px] md:w-[620px] aspect-square pointer-events-none select-none z-0 opacity-[0.08] sm:opacity-[0.11]"
        style={{
          backgroundImage: "url('/assets/scene/sound-familiar-right-cream.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-20 sm:-left-12 md:left-2 w-[340px] sm:w-[460px] md:w-[560px] aspect-square pointer-events-none select-none z-0 opacity-[0.06] sm:opacity-[0.08]"
        style={{
          backgroundImage: "url('/assets/scene/sound-familiar-left-cream.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 w-[140px] sm:w-[200px] md:w-[240px] aspect-square pointer-events-none select-none z-0 opacity-[0.10] sm:opacity-[0.13]"
        style={{
          backgroundImage: "url('/assets/scene/sound-familiar-sketches-cream.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-[140px] sm:w-[200px] md:w-[240px] aspect-square pointer-events-none select-none z-0 opacity-[0.08] sm:opacity-[0.11] rotate-180"
        style={{
          backgroundImage: "url('/assets/scene/sound-familiar-sketches-gold.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        aria-hidden="true"
      />

      {/* 2. Main Content Container */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-3 flex items-baseline gap-3">
          <span className="font-gazpacho text-xl font-bold text-turmeric sm:text-2xl">02</span>
          <span className="text-xs font-bold uppercase tracking-wider text-turmeric sm:text-sm">
            Sound familiar?
          </span>
        </div>

        <h2 className="u-display reveal-spring max-w-[22ch] text-[1.6rem] font-gazpacho font-bold text-cream sm:max-w-[26ch] sm:text-[clamp(2.25rem,6vw,4.25rem)]">
          For everyone who misses Odisha without saying it.
        </h2>

        {/* The four lines, as cards you can open. Artwork swaps in FAMILIAR_CARDS. */}
        <div className="mt-10 sm:mt-14">
          <FamiliarCards cards={FAMILIAR_CARDS} />
          <p className="mt-4 text-center text-xs font-semibold text-on-dark/60">
            Tap a card to see it bigger
          </p>
        </div>

        {/* Bottom Punchline */}
        <div className="reveal-spring mt-16 max-w-3xl sm:mt-24">
          <p className="u-display font-gazpacho font-bold text-turmeric">
            This calendar keeps the dates for you.
          </p>
          <p data-scroll-words className="u-statement mt-5 max-w-[34ch] text-on-dark/85">
            One card for every month. Keep it on your desk, and when you celebrate, tick the box on
            the back.
          </p>
        </div>

      </div>
    </section>
  );
}
