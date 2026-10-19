"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AmbientFestiveLayer } from "@/components/AmbientFestiveLayer";
import { scrollToTarget } from "@/components/SmoothScroll";

// The product, and the two views that flank it. The outer pair is cropped by
// the fold on purpose: something is always left to scroll to.
const SHELF = [
  { src: "/assets/product%20mockup/View%201.png", alt: "The cards, fanned out" },
  { src: "/assets/product%20mockup/Calendar%20PNG.png", alt: "The 2027 festival cards" },
  { src: "/assets/product%20mockup/View%204.png", alt: "The cards, stacked" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      // A context so every tween and its inline styles are reverted together.
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        const parts = q("[data-hero-part]");
        const lettering = q("[data-hero-lettering]");
        const cards = q("[data-hero-card]");
        const copy = q("[data-hero-copy]");

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        intro
          .fromTo(
            parts,
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.07, clearProps: "transform" }
          )
          .fromTo(
            lettering,
            { clipPath: "inset(100% 0% 0% 0%)", y: 18, autoAlpha: 0 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              clearProps: "clipPath,transform",
            },
            0.08
          )
          .fromTo(
            cards,
            { y: 32, scale: 0.97, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.65, stagger: 0.06 },
            0.32
          );

        // The three shots leave at different rates, so the shelf has depth.
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 0 },
            {
              y: [-30, -60, -90][i] ?? -50,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
              },
            }
          );
        });

        // The words step back as the section leaves.
        gsap.fromTo(
          copy,
          { y: 0, opacity: 1 },
          {
            y: -36,
            opacity: 0.25,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      }, el);

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-pipili-cream pt-14 sm:pt-20 md:pt-24 text-on-light"
    >
      {/* Background festive linework */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-35" aria-hidden="true">
        <AmbientFestiveLayer />
      </div>

      <div
        data-hero-copy
        className="relative z-20 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6 md:px-8"
      >
        {/* Archival Catalog Registration Badge */}
        <div data-hero-part className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 border border-[#1B1B1B]/40 bg-[#FAF6EE] px-3 py-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#1B1B1B]/85 shadow-[1px_1px_0_0_#1B1B1B] rounded-none">
            <span className="inline-block h-1.5 w-1.5 bg-[#8A1717]" />
            <span>EDITION ୨୦୨୭ · FIRST FOLIO PRINTING</span>
          </div>
        </div>

        {/* Drawn Odia lettering mark */}
        <h1 className="mt-2.5 sm:mt-3 w-full">
          <span className="sr-only">Bara Masa Tera Parba — the 2027 Odia calendar</span>
          <Image
            data-hero-lettering
            src="/assets/product-logo-v2.png"
            alt="Bara Masa Tera Parba"
            width={782}
            height={383}
            priority
            className="mx-auto h-auto w-[60%] max-w-[260px] select-none sm:w-[46%] sm:max-w-[340px]"
          />
        </h1>

        {/* Hairline-framed Romanized Subtitle */}
        <div
          data-hero-part
          className="mt-1 flex items-center justify-center gap-2.5 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.24em] text-[#1B1B1B]/65"
        >
          <span className="h-px w-5 sm:w-8 bg-[#1B1B1B]/25" />
          <span>BARA MASA · TERA PARBA</span>
          <span className="h-px w-5 sm:w-8 bg-[#1B1B1B]/25" />
        </div>

        {/* Archival provenance text */}
        <p
          data-hero-part
          className="mt-2 max-w-[36ch] sm:max-w-[42ch] text-balance text-center font-subtext text-xs sm:text-[14px] leading-snug text-on-light/85"
        >
          In <strong className="font-bold text-on-light">1,500+ homes</strong> across 22 states & the USA. The original Odia festival desk calendar, in letterpress print for 2027.
        </p>

        {/* Sharp Letterpress CTA & Dispatch Plate */}
        <div data-hero-part className="mt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => scrollToTarget("#preorder")}
            className="inline-flex items-center gap-2 px-5 py-2 sm:py-2.5 bg-[#8A1717] hover:bg-[#6E1212] active:translate-x-[1px] active:translate-y-[1px] text-[#FAF6EE] border border-[#1B1B1B] font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0_0_#1B1B1B] transition-all cursor-pointer rounded-none select-none"
          >
            <span className="font-bold">PRE-ORDER · ₹250</span>
            <span className="text-[#E0A526] font-mono text-sm leading-none">→</span>
          </button>
          
          <div className="inline-flex items-center border border-[#1B1B1B]/30 bg-[#FAF6EE]/90 px-3 py-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#1B1B1B]/75 rounded-none">
            <span>FREE SHIPPING INDIA</span>
          </div>
        </div>

        {/* Architectural Specification Ledger: Fills the vertical void with intentional editorial craftsmanship */}
        <div
          data-hero-part
          className="mt-3.5 sm:mt-4 w-full max-w-md border border-[#1B1B1B]/25 bg-[#FAF6EE]/85 shadow-[2px_2px_0_0_rgba(27,27,27,0.06)] rounded-none"
        >
          {/* Ledger Index Strip */}
          <div className="flex items-center justify-between border-b border-[#1B1B1B]/15 px-3 py-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#1B1B1B]/60">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-1 bg-[#8A1717]" />
              SPECIFICATION LEDGER
            </span>
            <span>REF: OD-CAL-2027</span>
          </div>

          {/* 3-Column Architectural Specs */}
          <div className="grid grid-cols-3 divide-x divide-[#1B1B1B]/15 text-center font-mono">
            <div className="px-2 py-1.5 sm:py-2">
              <div className="text-[11px] sm:text-xs font-bold text-[#8A1717] tracking-tight">12 PLATES</div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#1B1B1B]/65">Linen Texture</div>
            </div>
            <div className="px-2 py-1.5 sm:py-2">
              <div className="text-[11px] sm:text-xs font-bold text-[#8A1717] tracking-tight">13TH PARBA</div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#1B1B1B]/65">Wax Sealed</div>
            </div>
            <div className="px-2 py-1.5 sm:py-2">
              <div className="text-[11px] sm:text-xs font-bold text-[#8A1717] tracking-tight">SOLID WOOD</div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#1B1B1B]/65">Teak Easel</div>
            </div>
          </div>
        </div>

        {/* Folio Plate Marker above Cards */}
        <div
          data-hero-part
          className="mt-2.5 flex items-center justify-center gap-2 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.24em] text-[#1B1B1B]/50"
        >
          <span>┌</span>
          <span>PLATE 01 : MAKAR SANKRANTI · ୨୦୨୭</span>
          <span>┐</span>
        </div>
      </div>

      {/* The shelf: the product centred, its two views cropped by the fold */}
      <div className="relative z-10 flex w-full flex-1 items-end justify-center gap-0 sm:gap-2">
        {SHELF.map((shot, i) => {
          const middle = i === 1;
          return (
            <div
              key={shot.src}
              data-hero-card
              className={`relative ${
                middle
                  ? "aspect-square w-[104%] translate-y-1 sm:aspect-4/3 sm:w-[74%] sm:translate-y-4 lg:w-[66%]"
                  : "hidden aspect-4/3 w-[30%] translate-y-20 opacity-90 lg:block"
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                priority={middle}
                sizes={middle ? "(max-width: 640px) 104vw, 700px" : "36vw"}
                className="object-contain object-bottom drop-shadow-[0_20px_36px_rgba(90,15,20,0.22)]"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

