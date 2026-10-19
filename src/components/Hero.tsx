"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
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
        {/* Edition 2027 and the red dot: no border, no box, centered */}
        <div data-hero-part className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8A1717]" />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-on-light/80">
            Edition 2027
          </span>
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

        {/* Clean copy text */}
        <p
          data-hero-part
          className="mt-2.5 max-w-[36ch] sm:max-w-[42ch] text-balance text-center font-subtext text-xs sm:text-[14px] leading-snug text-on-light/85"
        >
          In <strong className="font-bold text-on-light">1,500+ homes</strong> across 22 states & the USA. The viral calendar is back for 2027.
        </p>

        {/* CTA and Free Shipping with cart logo: no border, no box */}
        <div data-hero-part className="mt-3.5 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={() => scrollToTarget("#preorder")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8A1717] hover:bg-[#6E1212] active:translate-x-[1px] active:translate-y-[1px] text-[#FAF6EE] font-gazpacho font-bold text-xs sm:text-sm tracking-wide shadow-[2px_2px_0_0_#1B1B1B] transition-all cursor-pointer rounded-none select-none"
          >
            <span>Pre-order · ₹250</span>
            <span className="text-[#E0A526] font-mono text-sm leading-none">→</span>
          </button>
          
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-on-light/75">
            <ShoppingCart className="h-3.5 w-3.5 shrink-0 text-[#8A1717]" aria-hidden="true" />
            <span>Free shipping India</span>
          </span>
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

