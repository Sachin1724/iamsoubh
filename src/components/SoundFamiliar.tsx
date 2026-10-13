"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Ambient } from "@/components/Ambient";

const LINES = [
  "Raja came and went, and you found out from someone's story.",
  'Maa asked if you ate manda pitha on Gamha. You said "haan". You did not.',
  "You know Rath Yatra is in July. You find out the date when it starts trending.",
  "Your flatmate still thinks Nuakhai is a typo.",
];

export function SoundFamiliar() {
  const ref = useRef<HTMLUListElement>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLanded(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="sound-familiar"
      className="surface-ink relative pt-10 sm:pt-14 pb-16 sm:pb-22 bg-[#1B1B1B] text-[#F6EFE2] scroll-mt-24 overflow-hidden"
      style={{ scrollMarginTop: "96px" }}
    >
      <Ambient variant="leaves" count={11} className="text-[#E0A526]" />

      {/* Traditional Odia Golden Filigree Corner Borders */}
      <div className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 pointer-events-none select-none z-0 opacity-80" aria-hidden="true">
        <Image
          src="/assets/brand/extracted/extracted_svg/corner-borders/corner-borders_028.svg"
          alt=""
          width={145}
          height={150}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 pointer-events-none select-none z-0 opacity-80 -scale-x-100" aria-hidden="true">
        <Image
          src="/assets/brand/extracted/extracted_svg/corner-borders/corner-borders_028.svg"
          alt=""
          width={145}
          height={150}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 pointer-events-none select-none z-0 opacity-60 -scale-y-100" aria-hidden="true">
        <Image
          src="/assets/brand/extracted/extracted_svg/corner-borders/corner-borders_028.svg"
          alt=""
          width={145}
          height={150}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 pointer-events-none select-none z-0 opacity-60 -scale-x-100 -scale-y-100" aria-hidden="true">
        <Image
          src="/assets/brand/extracted/extracted_svg/corner-borders/corner-borders_028.svg"
          alt=""
          width={145}
          height={150}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        <span className="font-disko block text-[64px] sm:text-[96px] leading-none text-[#3A3633] select-none">
          02
        </span>
        <p className="text-sm font-semibold -mt-3 mb-2">02 · Sound familiar?</p>

        <h2 className="font-disko text-3xl sm:text-5xl leading-[1.05] max-w-3xl">
          For everyone who misses Odisha without saying it.
        </h2>

        <ul ref={ref} className="mt-10 space-y-5 max-w-2xl">
          {LINES.map((line, i) => (
            <li
              key={line}
              className={landed ? "animate-line-land" : "opacity-0"}
              style={landed ? { animationDelay: `${i * 160}ms` } : undefined}
            >
              <span className="flex gap-4 text-lg sm:text-xl leading-relaxed">
                <span className="font-disko shrink-0 text-[#E0A526]">{i + 1}</span>
                <span>{line}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="reveal mt-10 font-disko text-2xl sm:text-3xl text-[#E0A526] max-w-2xl leading-snug">
          This calendar keeps the dates, so you don&apos;t have to fake it.
        </p>

        <p className="reveal mt-5 text-base sm:text-lg leading-relaxed text-[#F6EFE2]/85 max-w-2xl">
          One parba a month, right where you&apos;ll see it. Every card has two boxes on the back.
          Tick them when you actually show up, not when you watch it on someone&apos;s story.
        </p>
      </div>
    </section>
  );
}
