import Image from "next/image";
import { SectionArt } from "@/components/SectionArt";

export function SoundFamiliar() {
  return (
    <section
      id="sound-familiar"
      className="relative pt-24 sm:pt-36 pb-24 sm:pb-36 bg-pipili-indigo text-on-dark scroll-mt-28 overflow-x-clip"
    >
      {/* 1. Odia Folk Pattern Texture with Deep Forest Green Tint */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "180px",
        }}
      />

      {/* Sambalpuri ikat motifs down the left edge */}
      <SectionArt name="ikat" className="z-0 text-line-indigo opacity-70" />

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

        {/* 4 Cards Bento Grid Layout */}
        <div className="reveal-spring-stagger mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 md:gap-5">
          {/* CARD 1: Raja Festival (Wide Banner spanning 2 columns) */}
          <div className="group col-span-2 relative overflow-hidden rounded-xl drop-shadow-md transition-[filter] duration-300 hover:drop-shadow-[0_8px_25px_rgba(224,165,38,0.25)]">
            <span className="sr-only">
              Raja came and went, and you found out from someone&apos;s story.
            </span>
            <Image
              src="/assets/bento/odia_bento_card_pngs/bento_01_raja_swing_clean.png"
              alt="Raja came and went, and you found out from someone's story."
              width={949}
              height={336}
              className="w-full h-auto block select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              priority
            />
          </div>

          {/* CARD 2: Manda Pitha on Gamha (Tall Card on Left Column) */}
          <div className="group col-span-1 relative flex items-start overflow-hidden rounded-xl drop-shadow-md transition-[filter] duration-300 hover:drop-shadow-[0_8px_25px_rgba(224,165,38,0.25)]">
            <span className="sr-only">
              Maa asked, &quot;Pitha khailu?&quot; You said yes. Your last pitha was months ago.
            </span>
            <Image
              src="/assets/bento/odia_bento_card_pngs/bento_02_manda_pitha_clean.png"
              alt="Maa asked, 'Pitha khailu?' You said yes. Your last pitha was months ago."
              width={476}
              height={691}
              className="w-full h-auto block select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>

          {/* RIGHT COLUMN: Stack of Card 3 and Card 4 */}
          <div className="col-span-1 flex flex-col justify-between gap-2 sm:gap-3.5 md:gap-4">
            {/* CARD 3: Rath Yatra in July */}
            <div className="group relative overflow-hidden rounded-xl drop-shadow-md transition-[filter] duration-300 hover:drop-shadow-[0_8px_25px_rgba(224,165,38,0.25)]">
              <span className="sr-only">
                You watched Rath Yatra on reels. From 1,000 km away. Again.
              </span>
              <Image
                src="/assets/bento/odia_bento_card_pngs/bento_03_rath_yatra_clean.png"
                alt="You watched Rath Yatra on reels. From 1,000 km away. Again."
                width={474}
                height={373}
                className="w-full h-auto block select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>

            {/* CARD 4: Boita Bandana */}
            <div className="group relative overflow-hidden rounded-xl drop-shadow-md transition-[filter] duration-300 hover:drop-shadow-[0_8px_25px_rgba(224,165,38,0.25)]">
              {/* Copy is the Pana Sankranti line; this still shows the Boita
                  Bandana art until Soubh supplies the bela pana card. */}
              <span className="sr-only">
                You wished Maa for Pana Sankranti. A day late.
              </span>
              <Image
                src="/assets/bento/odia_bento_card_pngs/bento_04_boita_bandana_clean.png"
                alt="You wished Maa for Pana Sankranti. A day late."
                width={474}
                height={320}
                className="w-full h-auto block select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
          </div>
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
