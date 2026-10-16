"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTilt } from "@/components/ui/use-tilt";

const HERO_CARDS = [
  { src: "/assets/manabasa-card.png", alt: "Manabasa Gurubara card" },
  { src: "/assets/raja-card.png", alt: "Raja Parba card" },
  { src: "/assets/rath-yatra-card.png", alt: "Rath Yatra card" },
  { src: "/assets/nuakhai-card.png", alt: "Nuakhai card" },
  { src: "/assets/boita-bandana-card.png", alt: "Boita Bandana card" },
  { src: "/assets/pana-sankranti-card.png", alt: "Pana Sankranti card" },
];

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
    <div className="flex items-center justify-center min-h-[32px] overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -12, rotateX: 60 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ perspective: 600, transformStyle: "preserve-3d" }}
          className="inline-flex items-center justify-center gap-2 text-[11.5px] sm:text-sm text-[#8A1717] font-bricolage font-semibold whitespace-nowrap cursor-pointer"
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
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(2);
  const touchStartX = React.useRef(0);
  const tilt = useTilt(8);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 35) {
      setActiveIndex((prev) => (prev - 1 + HERO_CARDS.length) % HERO_CARDS.length);
    } else if (diffX < -35) {
      setActiveIndex((prev) => (prev + 1) % HERO_CARDS.length);
    }
  };

  const getCircularDiff = (index: number, active: number, total: number) => {
    let diff = index - active;
    while (diff > total / 2) diff -= total;
    while (diff < -total / 2) diff += total;
    return diff;
  };

  const getCardPlacementClass = (diff: number) => {
    if (diff === 0) {
      return "z-30 opacity-100 scale-105 -translate-y-2 sm:-translate-y-4 translate-x-0 cursor-default blur-0";
    }
    if (diff === -1) {
      return "z-20 opacity-95 scale-[0.93] translate-y-2 sm:translate-y-3 -translate-x-[75px] sm:-translate-x-[150px] md:-translate-x-[180px] lg:-translate-x-[205px] blur-0 hover:opacity-100";
    }
    if (diff === 1) {
      return "z-20 opacity-95 scale-[0.93] translate-y-2 sm:translate-y-3 translate-x-[75px] sm:translate-x-[150px] md:translate-x-[180px] lg:translate-x-[205px] blur-0 hover:opacity-100";
    }
    if (diff === -2) {
      return "z-10 opacity-65 scale-[0.84] translate-y-5 sm:translate-y-7 -translate-x-[148px] sm:-translate-x-[290px] md:-translate-x-[350px] lg:-translate-x-[395px] blur-[2px] hover:blur-0 hover:opacity-100";
    }
    if (diff === 2) {
      return "z-10 opacity-65 scale-[0.84] translate-y-5 sm:translate-y-7 translate-x-[148px] sm:translate-x-[290px] md:translate-x-[350px] lg:translate-x-[395px] blur-[2px] hover:blur-0 hover:opacity-100";
    }
    return "z-0 opacity-0 pointer-events-none scale-75 translate-y-12 blur-sm";
  };

  const handleOrder = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-between pt-14 sm:pt-16 md:pt-20 pb-8 bg-[#FAF6EE] text-[#1B1B1B] overflow-hidden"
    >
      {/* Tactile handmade paper fiber texture & faint folk watermark */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-repeat z-0"
        style={{ backgroundImage: "url('/assets/folk-pattern-tile.png')", backgroundSize: "160px" }}
      />

      {/* Rotating Mandala Artwork (Top Left Corner) */}
      <div
        className="absolute -top-20 sm:-top-28 md:-top-36 -left-20 sm:-left-28 md:-left-36 w-[340px] sm:w-[460px] md:w-[580px] aspect-square pointer-events-none select-none z-0 opacity-[0.075] md:opacity-[0.09] mix-blend-multiply"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/vecteezy-mandala.png"
          alt=""
          fill
          sizes="(max-width: 640px) 40vw, 360px"
          loading="lazy"
          className="object-contain animate-[spin_50s_linear_infinite]"
          style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(85%) saturate(3400%) hue-rotate(345deg)" }}
        />
      </div>

      {/* Antique Parchment Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(138,23,23,0.025)_75%,rgba(70,25,10,0.065)_100%)]"
        aria-hidden="true"
      />

      {/* Konark Sun Temple Chariot Architectural Line Art Illustration */}
      <div
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-[min(1100px,115vw)] aspect-[709/367] pointer-events-none select-none z-0 mix-blend-multiply opacity-[0.065] md:opacity-[0.085]"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/konark-sun-temple-chariot.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1100px"
          className="object-contain object-bottom"
          style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(85%) saturate(3400%) hue-rotate(345deg)" }}
        />
      </div>

      {/* Traditional Jhoti Corner Motif (Bottom Right Watermark) */}
      <div
        className="absolute bottom-6 sm:bottom-10 right-4 sm:right-12 w-[180px] sm:w-[240px] aspect-square pointer-events-none select-none z-0 opacity-[0.045] md:opacity-[0.06]"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/odia-jhoti-corner.svg"
          alt=""
          fill
          sizes="(max-width: 640px) 30vw, 200px"
          className="object-contain"
          style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(85%) saturate(3400%) hue-rotate(345deg)" }}
        />
      </div>

      {/* Sambalpuri Pata Vertical Handloom Borders */}
      <div
        className="absolute top-0 bottom-0 left-0 w-3 sm:w-4 md:w-5 z-25 pointer-events-none select-none opacity-85 shadow-[2px_0_8px_rgba(0,0,0,0.08)]"
        style={{
          backgroundImage: "url('/patterns/border-sambalpuri-vertical.svg')",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
        }}
        aria-hidden="true"
      />

      <div
        className="absolute top-0 bottom-0 right-0 w-3 sm:w-4 md:w-5 z-25 pointer-events-none select-none opacity-85 shadow-[-2px_0_8px_rgba(0,0,0,0.08)]"
        style={{
          backgroundImage: "url('/patterns/border-sambalpuri-vertical.svg')",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          transform: "scaleX(-1)",
        }}
        aria-hidden="true"
      />

      {/* Sambalpuri Pata Horizontal Bottom Ribbon (Anchoring the Entire Hero) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-9 sm:h-11 z-25 pointer-events-none select-none shadow-[0_-3px_10px_rgba(0,0,0,0.1)]"
        style={{
          backgroundImage: "url('/patterns/border-sambalpuri-horizontal.svg')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
        }}
        aria-hidden="true"
      />

      {/* Main hero content container */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-20 w-full flex-1 flex flex-col justify-between items-center text-center gap-3 sm:gap-6 py-2">
        {/* Typographic Poster Header Stack */}
        <div className="flex flex-col items-center text-center relative w-full pt-1 sm:pt-3">
          {/* Eyebrow badge: 2027 EDITION */}
          <div className="mb-2 sm:mb-2.5 relative z-10 flex justify-center w-full">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-[#8A1717]/35 bg-[#8A1717]/5 text-[#8A1717] text-[11px] sm:text-xs font-bold tracking-widest uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A1717] animate-pulse shrink-0" />
              <span>2027 EDITION</span>
            </div>
          </div>

          {/* Towering Condensed Headline: BARA MASA · The Viral Odia Calendar · TERA PARBA */}
          <div className="flex flex-col items-center text-center w-full">
            <h1 className="font-bigdream text-[clamp(3.8rem,17vw,6.8rem)] sm:text-[6rem] md:text-[7.5rem] lg:text-[9rem] font-bold tracking-tight leading-[0.84] text-[#8A1717] select-none text-center w-full mt-2 sm:mt-3">
              BARA MASA
            </h1>

            {/* Subtitle row centered between two thin horizontal decorative lines */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 w-fit mx-auto mt-[6px] mb-[18px] sm:mt-2 sm:mb-6 md:mt-2.5 md:mb-7">
              <div className="h-[1px] w-9 sm:w-14 md:w-20 bg-[#8A1717]/50 shrink-0" aria-hidden="true" />
              <span className="font-bricolage italic font-semibold sm:font-bold text-sm sm:text-lg md:text-xl lg:text-2xl text-[#8A1717] select-none whitespace-nowrap text-center shrink-0 tracking-tight">
                The Viral Odia Calendar
              </span>
              <div className="h-[1px] w-9 sm:w-14 md:w-20 bg-[#8A1717]/50 shrink-0" aria-hidden="true" />
            </div>

            <h2 className="font-bigdream text-[clamp(3.8rem,17vw,6.8rem)] sm:text-[6rem] md:text-[7.5rem] lg:text-[9rem] font-bold tracking-tight leading-[0.84] text-[#8A1717] select-none text-center w-full">
              TERA PARBA
            </h2>
          </div>

          {/* Body narrative */}
          <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-base text-[#5A3825] max-w-md sm:max-w-lg font-bricolage italic font-medium leading-relaxed text-center px-4">
            Last year it went viral before it even shipped. <strong className="text-[#8A1717] font-bold not-italic">1,500 homes</strong>, 22 states and the USA later, Odisha&apos;s most loved calendar is back.
          </p>

          {/* CTA action cluster: Pre-book now button + 3D text flip ticker */}
          <div className="mt-3.5 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
            <button
              type="button"
              onClick={handleOrder}
              className="group relative inline-flex items-center justify-center gap-3 bg-[#009EA8] hover:bg-[#008A93] active:bg-[#007A82] text-white font-bold text-sm sm:text-base pl-6 pr-2 py-1.5 min-h-[44px] sm:min-h-[48px] rounded-full border-2 border-[#1B1B1B] shadow-[4px_4px_0_#1B1B1B] active:shadow-[1px_1px_0_#1B1B1B] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer transition-all select-none"
            >
              <span>Pre-book now</span>
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#009EA8] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-xs">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </button>

            <HeroTrustTicker />
          </div>
        </div>

        {/* Stepped 5-Card Stage */}
        <div
          className="w-full max-w-5xl self-center flex flex-col items-center justify-end sm:mt-auto pb-3 sm:pb-4 relative z-20"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cards Stage Container with Subtle Edge Fade Gradient Mask */}
          <div className="relative w-full h-[355px] sm:h-[400px] md:h-[440px] lg:h-[475px] flex items-center justify-center [mask-image:linear-gradient(to_right,transparent_0,black_20px,black_calc(100%-20px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_20px,black_calc(100%-20px),transparent_100%)]">
            {HERO_CARDS.map((c, i) => {
              const diff = getCircularDiff(i, activeIndex, HERO_CARDS.length);
              const placementClass = getCardPlacementClass(diff);
              const isCenter = diff === 0;

              return (
                <div
                  key={c.src}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`w-[235px] sm:w-[260px] md:w-[285px] lg:w-[305px] aspect-[3/4] absolute transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] select-none cursor-pointer ${placementClass}`}
                >
                  <div
                    onPointerMove={isCenter ? tilt.onPointerMove : undefined}
                    onPointerLeave={isCenter ? tilt.onPointerLeave : undefined}
                    className={`w-full h-full p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-[#1B1B1B] bg-[#1B1B1B] transition-all duration-300 relative ${
                      isCenter
                        ? "shadow-[0_12px_28px_-6px_rgba(40,15,5,0.22),0_24px_45px_-10px_rgba(40,15,5,0.16),0_4px_10px_rgba(0,0,0,0.08)]"
                        : Math.abs(diff) === 1
                        ? "shadow-[0_8px_20px_-4px_rgba(40,15,5,0.14),0_16px_30px_-8px_rgba(40,15,5,0.10)] hover:scale-[0.98]"
                        : "shadow-[0_4px_12px_-2px_rgba(40,15,5,0.08)] hover:scale-[0.92]"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-4px)] overflow-hidden bg-[#FFFDF7] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                      <Image
                        src={c.src}
                        alt={c.alt}
                        width={420}
                        height={560}
                        sizes="(max-width: 640px) 240px, (max-width: 1024px) 285px, 310px"
                        priority={Math.abs(diff) <= 1}
                        className="w-full h-full object-cover"
                      />

                      {/* Refined Dark Glass Accession Badge on Center Card */}
                      {isCenter && (
                        <div className="absolute top-2 right-2 bg-[#1B1B1B]/85 text-[#FFE066] text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-xs shadow-xs flex items-center gap-1 z-30 pointer-events-none">
                          <span>2027 Parba</span>
                          <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}


          </div>

          {/* Indicator dots for quick navigation */}
          <div className="flex items-center gap-1.5 mt-3 select-none z-30">
            {HERO_CARDS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Show card ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === i
                    ? "w-6 h-1.5 bg-[#8A1717]"
                    : "w-1.5 h-1.5 bg-[#8A1717]/25 hover:bg-[#8A1717]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
