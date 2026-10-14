"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Smartphone, UtensilsCrossed, Landmark, BookOpen } from "lucide-react";

const CARDS = [
  {
    icon: Smartphone,
    text: "Raja came and went, and you found out from someone's story.",
  },
  {
    icon: UtensilsCrossed,
    text: 'Maa asked if you ate manda pitha on Gamha. You said "haan". You did not.',
  },
  {
    icon: Landmark,
    text: "You know Rath Yatra is in July. You find out the date when it starts trending.",
  },
  {
    icon: BookOpen,
    text: "Your flatmate still thinks Boita Bandana is a typo.",
  },
];

export function SoundFamiliar() {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="sound-familiar"
      className="relative pt-16 sm:pt-20 pb-20 sm:pb-24 bg-[#0D3B2E] text-[#F6EFE2] scroll-mt-24 overflow-x-clip"
    >
      {/* 1. Odia Folk Pattern Texture with Deep Forest Green Tint */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "180px",
        }}
      />

      {/* 2. Flipped Tropical Foliage on Opposite (Right) Side - Small size overlapping the page joint seam */}
      <div
        className="absolute -top-[65px] sm:-top-[85px] md:-top-[100px] -right-2 sm:-right-4 md:-right-6 w-[160px] sm:w-[210px] md:w-[260px] h-[140px] sm:h-[185px] md:h-[230px] pointer-events-none select-none z-20 animate-sway-soft-right"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/foliage-right-cluster.webp"
          alt=""
          fill
          priority
          className="object-contain object-right-top drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
        />
      </div>

      {/* 3. Right Konark Carved Stone Chariot Wheel (Chakra) with Slow Rotation */}
      <div
        className="absolute -bottom-16 sm:-bottom-24 -right-16 sm:-right-24 md:-right-28 w-[340px] sm:w-[480px] md:w-[620px] h-[340px] sm:h-[480px] md:h-[620px] pointer-events-none select-none z-0 opacity-45 mix-blend-screen"
        aria-hidden="true"
      >
        <div className="relative w-full h-full animate-wheel-spin">
          <Image
            src="/assets/scene/konark-wheel.webp"
            alt=""
            fill
            className="object-contain drop-shadow-[0_0_35px_rgba(224,165,38,0.25)]"
          />
        </div>
      </div>

      {/* 4. Subtle Odia Jhoti / Chita Lotus in Top Right Corner */}
      <div
        className="absolute top-4 right-6 sm:right-12 w-32 sm:w-48 h-32 sm:h-48 pointer-events-none select-none z-0 opacity-15 animate-jhoti-shimmer"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/odia-jhoti-corner.svg"
          alt=""
          fill
          className="object-contain -scale-x-100"
        />
      </div>

      {/* 5. Main Content Container */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-gazpacho text-[#E0A526] font-bold text-xl sm:text-2xl">
            02
          </span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#E0A526]/85">
            SOUND FAMILIAR?
          </span>
        </div>

        <h2 className="font-gazpacho text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] max-w-3xl text-[#FFFDF7]">
          For everyone who misses Odisha without saying it.
        </h2>

        {/* 4 Gold-Accented Experience Cards */}
        <div
          ref={ref}
          className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl"
        >
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[#092D23]/70 border border-[#E0A526]/30 hover:border-[#E0A526]/80 hover:bg-[#092D23]/95 backdrop-blur-xs transition-all duration-300 group hover:-translate-y-1 shadow-lg ${
                  landed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <div className="shrink-0 w-11 h-11 rounded-lg bg-[#E0A526]/15 border border-[#E0A526]/40 flex items-center justify-center text-[#E0A526] group-hover:scale-110 group-hover:bg-[#E0A526] group-hover:text-[#0D3B2E] transition-all duration-300 shadow-xs">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-[#F6EFE2]/95 pt-0.5">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Punchline */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-[#E0A526]/20 max-w-3xl">
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
