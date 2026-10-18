"use client";

import React from "react";
import { ArrowRight, Truck } from "lucide-react";
import { AmbientFestiveLayer } from "@/components/AmbientFestiveLayer";
import { scrollToTarget } from "@/components/SmoothScroll";
import { SectionArt } from "@/components/SectionArt";
import { siteConfig } from "@/config/site-config";

interface HeroProps {
  onOrderClick?: () => void;
}

const HEADLINE =
  "font-bigdream text-[clamp(3.6rem,15vw,9rem)] font-bold tracking-tight leading-[0.82] text-on-light select-none text-center w-full block";

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
      className="relative min-h-[100dvh] flex flex-col justify-center pt-24 pb-10 sm:pt-28 sm:pb-12 bg-pipili-yellow text-on-light overflow-hidden"
    >
      {/* Konark wheel, half off the right edge */}
      <SectionArt name="wheel" className="z-0 text-line-yellow opacity-70" />

      {/* Living Cultural Ambient Layer (Warm Temple Glow, Sun Sparks, Heritage Art) */}
      <AmbientFestiveLayer />

      {/* The whole poster sits on the optical centre of the viewport */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-20 w-full flex flex-col items-center text-center">
        {/* Eyebrow: edition and scarcity in one line */}
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border border-on-light/35 bg-on-light/10 text-on-light text-xs font-bold tracking-widest uppercase shadow-xs backdrop-blur-xs">
          <span
            className="w-1.5 h-1.5 rounded-full bg-on-light animate-pulse motion-reduce:animate-none shrink-0"
            aria-hidden="true"
          />
          <span>2027 Edition · Only {siteConfig.batchCap} boxes</span>
        </div>

        {/* BARA MASA · The Viral Odia Calendar · TERA PARBA */}
        <h1 className="mt-5 w-full sm:mt-7">
          <span className={HEADLINE}>BARA MASA</span>

          {/* A 1fr-auto-1fr grid, so the two rules are always the same length
              and the italic sits dead centre whatever its width renders at. */}
          <span className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 md:gap-5 w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[27rem] mx-auto my-1.5 sm:my-2 md:my-2.5">
            <span className="h-px w-full bg-on-light/50" aria-hidden="true" />
            <span className="font-editorial italic font-bold text-sm sm:text-lg md:text-xl lg:text-2xl text-on-light select-none whitespace-nowrap text-center tracking-wide">
              The Viral Odia Calendar
            </span>
            <span className="h-px w-full bg-on-light/50" aria-hidden="true" />
          </span>

          <span className={HEADLINE}>TERA PARBA</span>
        </h1>

        <p className="mt-5 max-w-sm text-[15px] sm:text-base md:text-lg text-on-light/90 font-subtext font-normal leading-relaxed text-center text-balance">
          Last year it went viral.{" "}
          <strong className="text-on-light font-bold not-italic">1,500 homes</strong>, 22 states and
          the USA later, it&apos;s back.
        </p>

        <button
          type="button"
          onClick={handleOrder}
          className="group relative mt-6 inline-flex w-full max-w-xs items-center justify-center gap-3 bg-on-light hover:bg-[#75161c] active:bg-[#450b0f] text-pipili-cream font-bold text-base pl-6 pr-2 py-2 min-h-[54px] rounded-full border-2 border-ink shadow-[4px_4px_0_var(--color-ink)] active:shadow-[1px_1px_0_var(--color-ink)] active:translate-x-[3px] active:translate-y-[3px] cursor-pointer transition-all select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto"
        >
          <span>Pre-book now</span>
          <span className="w-9 h-9 rounded-full bg-pipili-cream text-on-light flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-xs">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </span>
        </button>

        {/* The delivery promise is always on screen, never on a rotation */}
        <p className="mt-3 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-on-light/25 bg-pipili-cream/80 px-3 py-1.5 text-xs font-bold text-on-light sm:text-xs">
          <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Free shipping all over India
        </p>

        <button
          type="button"
          onClick={() => scrollToTarget("#inside-calendar")}
          className="mt-10 text-xs font-bold uppercase tracking-widest text-on-light/70 transition-colors hover:text-on-light"
        >
          See what&apos;s inside ↓
        </button>
      </div>
    </section>
  );
}
