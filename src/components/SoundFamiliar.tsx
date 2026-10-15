import Image from "next/image";

export function SoundFamiliar() {
  return (
    <section
      id="sound-familiar"
      className="relative pt-20 sm:pt-28 pb-20 sm:pb-28 bg-[#141414] text-[#F6EFE2] scroll-mt-28 overflow-x-clip"
    >
      {/* 1. Odia Folk Pattern Texture with Deep Forest Green Tint */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "180px",
        }}
      />

      {/* 2. Main Content Container */}
      <div className="reveal max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="font-gazpacho text-[#E0A526] font-bold text-xl sm:text-2xl">
            02
          </span>
          <span className="text-[#E0A526]/50 font-light text-base sm:text-lg">
            |
          </span>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#E0A526]">
            SOUND FAMILIAR?
          </span>
        </div>

        <h2 className="font-gazpacho text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.1] max-w-2xl text-[#FFFDF7] tracking-tight">
          For everyone who misses Odisha without saying it.
        </h2>

        {/* Odia Gold Floral Divider */}
        <div className="flex items-center justify-center my-6 sm:my-8 pointer-events-none select-none" aria-hidden="true">
          <div className="h-px w-14 sm:w-28 bg-gradient-to-r from-transparent to-[#E0A526]/60" />
          <div className="mx-3 relative flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              className="w-6 h-6 sm:w-7 sm:h-7 fill-[#E0A526] drop-shadow-[0_0_8px_rgba(224,165,38,0.5)]"
            >
              <circle cx="16" cy="16" r="3" fill="#FFFDF7" />
              <path d="M16 4c1 3.5 3.5 6 7 7-3.5 1-6 3.5-7 7-1-3.5-3.5-6-7-7 3.5-1 6-3.5 7-7z" fill="#E0A526" />
              <path d="M16 8c.7 2.5 2.5 4.3 5 5-2.5.7-4.3 2.5-5 5-.7-2.5-2.5-4.3-5-5 2.5-.7 4.3-2.5 5-5z" fill="#FFE066" opacity="0.8" />
              <circle cx="16" cy="6" r="1" fill="#E0A526" />
              <circle cx="26" cy="16" r="1" fill="#E0A526" />
              <circle cx="16" cy="26" r="1" fill="#E0A526" />
              <circle cx="6" cy="16" r="1" fill="#E0A526" />
            </svg>
          </div>
          <div className="h-px w-14 sm:w-28 bg-gradient-to-l from-transparent to-[#E0A526]/60" />
        </div>

        {/* 4 Cards Bento Grid Layout */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3.5 md:gap-4">
          {/* CARD 1: Raja Festival (Wide Banner spanning 2 columns) */}
          <div className="col-span-2 relative transition-all duration-300 hover:scale-[1.008] drop-shadow-md hover:drop-shadow-[0_8px_25px_rgba(224,165,38,0.25)]">
            <span className="sr-only">
              Raja came and went, and you found out from someone&apos;s story.
            </span>
            <Image
              src="/assets/bento/odia_bento_card_pngs/bento_01_raja_swing_clean.png"
              alt="Raja came and went, and you found out from someone's story."
              width={949}
              height={336}
              className="w-full h-auto block select-none"
              priority
            />
          </div>

          {/* CARD 2: Manda Pitha on Gamha (Tall Card on Left Column) */}
          <div className="col-span-1 relative transition-all duration-300 hover:scale-[1.008] drop-shadow-md hover:drop-shadow-[0_8px_25px_rgba(224,165,38,0.25)] flex items-start">
            <span className="sr-only">
              Maa asked if you ate manda pitha on Gamha. You said &apos;haan&apos;. You did not.
            </span>
            <Image
              src="/assets/bento/odia_bento_card_pngs/bento_02_manda_pitha_clean.png"
              alt="Maa asked if you ate manda pitha on Gamha. You said 'haan'. You did not."
              width={476}
              height={691}
              className="w-full h-auto block select-none"
            />
          </div>

          {/* RIGHT COLUMN: Stack of Card 3 and Card 4 */}
          <div className="col-span-1 flex flex-col justify-between gap-2 sm:gap-3.5 md:gap-4">
            {/* CARD 3: Rath Yatra in July */}
            <div className="relative transition-all duration-300 hover:scale-[1.008] drop-shadow-md hover:drop-shadow-[0_8px_25px_rgba(224,165,38,0.25)]">
              <span className="sr-only">
                You know Rath Yatra is in July. You find out the date when it starts trending.
              </span>
              <Image
                src="/assets/bento/odia_bento_card_pngs/bento_03_rath_yatra_clean.png"
                alt="You know Rath Yatra is in July. You find out the date when it starts trending."
                width={474}
                height={373}
                className="w-full h-auto block select-none"
              />
            </div>

            {/* CARD 4: Boita Bandana */}
            <div className="relative transition-all duration-300 hover:scale-[1.008] drop-shadow-md hover:drop-shadow-[0_8px_25px_rgba(224,165,38,0.25)]">
              <span className="sr-only">
                Your flatmate still thinks Boita Bandana is a typo.
              </span>
              <Image
                src="/assets/bento/odia_bento_card_pngs/bento_04_boita_bandana_clean.png"
                alt="Your flatmate still thinks Boita Bandana is a typo."
                width={474}
                height={320}
                className="w-full h-auto block select-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Punchline */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#E0A526]/20 max-w-3xl">
          <p className="font-gazpacho text-2xl sm:text-3xl lg:text-4xl text-[#E0A526] font-bold leading-tight">
            This calendar keeps the dates, so you don&apos;t have to fake it.
          </p>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#F6EFE2]/85">
            One parba a month, right when you feel it. Every card has two faces: on the back, tick mark what you actually show up, not when you watch it on someone&apos;s story.
          </p>
        </div>

      </div>
    </section>
  );
}
