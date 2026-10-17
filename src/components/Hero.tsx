"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HeroCardsCarousel } from "@/components/HeroCardsCarousel";
import { AmbientFestiveLayer } from "@/components/AmbientFestiveLayer";
import { scrollToTarget } from "@/components/SmoothScroll";
import { EditionBadge2027 } from "@/components/EditionBadge2027";

interface HeroProps {
  onOrderClick?: () => void;
}

const TICKER_WORDS = [
  "Only 500 boxes in batch 1",
  "Ships first week of November",
  "Free shipping across India",
  "Sealed 13th parba",
];

function HeroTrustTicker() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TICKER_WORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[30px] overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -12, rotateX: 60 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 600, transformStyle: "preserve-3d" }}
          className="inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs md:text-sm text-[#8A1717] font-subtext font-semibold whitespace-nowrap cursor-pointer"
          onClick={() => setIndex((prev) => (prev + 1) % TICKER_WORDS.length)}
          title="Click to advance"
        >
          <span className="w-2 h-2 rounded-full bg-[#3E9B47] shrink-0 animate-pulse shadow-[0_0_6px_#3E9B47]" />
          <span className="tracking-wide">{TICKER_WORDS[index]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Hero({ onOrderClick }: HeroProps) {
  const handleOrder = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      scrollToTarget("#preorder");
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-between pt-24 sm:pt-28 md:pt-30 pb-4 sm:pb-6 bg-[#FAF6EE] text-[#1B1B1B] overflow-hidden"
    >
      {/* Living Cultural Ambient Layer (Warm Temple Glow, Floating Petals, Sun Sparks, Heritage Art) */}
      <AmbientFestiveLayer />

      {/* Sambalpuri Pata Vertical Handloom Borders */}
      <div
        className="absolute top-0 bottom-0 left-0 w-3 sm:w-4 md:w-5 z-25 pointer-events-none select-none opacity-90 shadow-[2px_0_8px_rgba(0,0,0,0.08)]"
        style={{
          backgroundImage: "url('/patterns/border-sambalpuri-vertical.svg')",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
        }}
        aria-hidden="true"
      />

      <div
        className="absolute top-0 bottom-0 right-0 w-3 sm:w-4 md:w-5 z-25 pointer-events-none select-none opacity-90 shadow-[-2px_0_8px_rgba(0,0,0,0.08)]"
        style={{
          backgroundImage: "url('/patterns/border-sambalpuri-vertical.svg')",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          transform: "scaleX(-1)",
        }}
        aria-hidden="true"
      />

      {/* Sambalpuri Pata Horizontal Bottom Ribbon */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 z-25 pointer-events-none select-none shadow-[0_-3px_10px_rgba(0,0,0,0.1)]"
        style={{
          backgroundImage: "url('/patterns/border-sambalpuri-horizontal.svg')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
        }}
        aria-hidden="true"
      />

      {/* Main hero content container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-20 w-full flex-1 flex flex-col justify-between items-center text-center gap-2 sm:gap-4 py-1">
        {/* Typographic Poster Header Stack with generous top breathing space */}
        <div className="flex flex-col items-center text-center relative w-full pt-3 sm:pt-6 md:pt-8">
          {/* Towering Condensed Headline: BARA MASA · The Viral Odia Calendar · TERA PARBA */}
          <div className="flex flex-col items-center text-center w-full">
            <h1 className="font-bigdream text-[clamp(3.2rem,14vw,5.8rem)] sm:text-[5.5rem] md:text-[6.8rem] lg:text-[7.8rem] font-bold tracking-tight leading-[0.82] text-[#8A1717] select-none text-center w-full">
              BARA MASA
            </h1>

            {/* Subtitle row centered between two thin horizontal decorative lines */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 w-fit mx-auto mt-1 mb-2 sm:mt-1.5 sm:mb-3 md:mt-2 md:mb-4">
              <div className="h-[1px] w-8 sm:w-12 md:w-16 bg-[#8A1717]/50 shrink-0" aria-hidden="true" />
              <span className="font-editorial italic font-bold text-xs sm:text-base md:text-lg lg:text-xl text-[#8A1717] select-none whitespace-nowrap text-center shrink-0 tracking-tight">
                The Viral Odia Calendar
              </span>
              <div className="h-[1px] w-8 sm:w-12 md:w-16 bg-[#8A1717]/50 shrink-0" aria-hidden="true" />
            </div>

            <h2 className="font-bigdream text-[clamp(3.2rem,14vw,5.8rem)] sm:text-[5.5rem] md:text-[6.8rem] lg:text-[7.8rem] font-bold tracking-tight leading-[0.82] text-[#8A1717] select-none text-center w-full">
              TERA PARBA
            </h2>
          </div>

          {/* Body narrative with clean, high-legibility UI subtext */}
          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-[#4A2E1B] max-w-md sm:max-w-lg font-subtext font-normal leading-relaxed text-center px-4">
            Last year it went viral before it even shipped. <strong className="text-[#8A1717] font-bold not-italic">1,500 homes</strong>, 22 states and the USA later, Odisha&apos;s most loved calendar is back.
          </p>

          {/* CTA action cluster: Pre-book now button + 3D text flip ticker */}
          <div className="mt-2.5 sm:mt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 relative z-10">
            <button
              type="button"
              onClick={handleOrder}
              className="group relative inline-flex items-center justify-center gap-3 bg-[#009EA8] hover:bg-[#008A93] active:bg-[#007A82] text-white font-bold text-xs sm:text-sm md:text-base pl-5 pr-2 py-1.5 min-h-[42px] sm:min-h-[46px] rounded-full border-2 border-[#1B1B1B] shadow-[3px_3px_0_#1B1B1B] active:shadow-[1px_1px_0_#1B1B1B] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer transition-all select-none"
            >
              <span>Pre-book now</span>
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-[#009EA8] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-xs">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </button>

            <HeroTrustTicker />
          </div>

          {/* 2027 Edition Archival Badge placed below Pre-booking CTA */}
          <div className="mt-3.5 sm:mt-4 mb-1 relative z-10 flex justify-center w-full">
            <EditionBadge2027 />
          </div>
        </div>

        {/* GSAP Infinite Dragging & Snapping Card Carousel */}
        <HeroCardsCarousel onOrderClick={handleOrder} />
      </div>
    </section>
  );
}
