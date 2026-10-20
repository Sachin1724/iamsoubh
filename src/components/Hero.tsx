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

        // The phone photo drifts down against the scroll, so it trails the page.
        gsap.fromTo(
          q("[data-hero-bg]"),
          { yPercent: 0 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );

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
      {/* Phone-only photo background. Cards sit at ~58% of the image width, so the
          x position (78%) pulls them to the horizontal centre of a portrait screen. */}
      <div data-hero-bg className="absolute inset-x-0 -top-[8%] z-0 h-[124%] sm:hidden" aria-hidden="true">
        <Image
          src="/assets/hero/hero-bg-mobile.jpg"
          alt=""
          fill
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[71%_0%]"
        />
      </div>

      {/* Desktop: the overhead shot fills the hero, cards held at the centre, and the
          words sit in a column on the right over the bare stone. */}
      <div className="absolute inset-0 z-0 hidden lg:block" aria-hidden="true">
        <Image
          src="/assets/hero/hero-bg-artisan.jpg"
          alt=""
          fill
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[54%_34%]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/65 via-black/20 to-transparent" />
      </div>

      <div
        data-hero-copy
        className="absolute inset-y-0 right-[5vw] z-20 hidden w-full max-w-[300px] xl:max-w-[380px] flex-col items-end justify-center pt-16 text-right text-white lg:flex"
      >
        <div data-hero-part className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E0A526]" />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/85">Edition 2027</span>
        </div>
        <h1 className="sr-only">Bara Masa Tera Parba — the 2027 Odia calendar</h1>
        <Image
          data-hero-lettering
          src="/assets/product-logo-v2.png"
          alt=""
          width={782}
          height={383}
          preload
          className="mt-6 h-auto w-full max-w-[260px] select-none brightness-0 invert xl:max-w-[360px]"
        />
        <p data-hero-part className="mt-1 font-editorial text-lg italic text-white/90">
          by Soubh
        </p>
        <p data-hero-part className="mt-6 max-w-[34ch] font-subtext text-[15px] font-light italic leading-snug text-white/90">
          In <strong className="font-semibold">1,500+ homes</strong> across 22 states &amp; the USA. The viral calendar is back for 2027.
        </p>
        <div data-hero-part className="mt-6 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => scrollToTarget("#preorder")}
            className="inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-xl bg-[#8A1717] px-7 py-3 font-gazpacho text-sm font-bold tracking-wide text-[#FAF6EE] shadow-[2px_2px_0_0_#1B1B1B] transition-all hover:bg-[#6E1212] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <span>Pre-order · ₹250</span>
            <span className="font-mono text-sm leading-none text-[#E0A526]">→</span>
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs font-light italic text-white/85">
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Free shipping India</span>
          </span>
        </div>
      </div>

      {/* Background festive linework (tablets only: phones and desktop use photos) */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden opacity-35 sm:block lg:hidden" aria-hidden="true">
        <AmbientFestiveLayer />
      </div>

      <div
        data-hero-copy
        className="relative z-20 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 text-center sm:px-6 md:px-8 lg:hidden"
      >
        {/* Edition 2027 and the red dot: stays right at the top */}
        <div data-hero-part className="pt-1 flex items-center justify-center gap-2 text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8A1717] shrink-0" />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-on-light/80">
            Edition 2027
          </span>
        </div>

        {/* Phones: logo sits just under the edition line, text + CTA drop to the bottom.
            sm+: one centered cluster as before. */}
        <div className="flex w-full flex-1 flex-col items-center justify-between py-4 sm:my-auto sm:flex-none sm:justify-center sm:py-6">
          {/* Drawn Odia lettering mark, signed underneath */}
          <div className="w-full">
          <h1 className="w-full flex justify-center text-center">
            <span className="sr-only">Bara Masa Tera Parba — the 2027 Odia calendar</span>
            <Image
              data-hero-lettering
              src="/assets/product-logo-v2.png"
              alt="Bara Masa Tera Parba"
              width={782}
              height={383}
              preload
              className="mx-auto h-auto w-[62%] max-w-[270px] select-none sm:w-[48%] sm:max-w-[340px]"
            />
          </h1>
          <p data-hero-part className="mt-1 text-center font-editorial text-sm italic text-[#8A1717]/85 sm:text-base">
            by Soubh
          </p>
          </div>

          <div className="flex w-full flex-col items-center pb-10 sm:pb-0">
          {/* Clean copy text: white italic over the photo on phones */}
          <p
            data-hero-part
            className="mx-auto mt-3 sm:mt-3.5 w-full max-w-[36ch] sm:max-w-[42ch] text-center font-subtext text-xs sm:text-[14px] leading-snug font-light italic text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.55)] sm:font-normal sm:not-italic sm:text-on-light/85 sm:[text-shadow:none]"
          >
            In <strong className="font-normal sm:font-bold sm:text-on-light">1,500+ homes</strong> across 22 states &amp; the USA. The viral calendar is back for 2027.
          </p>

          {/* CTA and Free Shipping */}
          <div data-hero-part className="mt-4 sm:mt-5 flex flex-col items-center justify-center gap-2 text-center w-full">
            <button
              type="button"
              onClick={() => scrollToTarget("#preorder")}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#8A1717] hover:bg-[#6E1212] active:translate-x-[1px] active:translate-y-[1px] text-[#FAF6EE] font-gazpacho font-bold text-xs sm:text-sm tracking-wide shadow-[2px_2px_0_0_#1B1B1B] transition-all cursor-pointer rounded-xl select-none text-center"
            >
              <span>Pre-order · ₹250</span>
              <span className="text-[#E0A526] font-mono text-sm leading-none">→</span>
            </button>
            
            <span className="inline-flex items-center justify-center gap-1.5 text-xs font-light italic text-white sm:font-medium [text-shadow:0_1px_6px_rgba(0,0,0,0.55)] sm:not-italic sm:text-on-light/75 sm:[text-shadow:none] text-center">
              <ShoppingCart className="h-3.5 w-3.5 shrink-0 text-white sm:text-[#8A1717]" aria-hidden="true" />
              <span>Free shipping India</span>
            </span>
          </div>
          </div>
        </div>
      </div>

      {/* The shelf: the product centred, its two views cropped by the fold */}
      <div className="relative z-10 hidden w-full shrink-0 items-end sm:flex lg:hidden justify-center gap-0 sm:gap-2">
        {SHELF.map((shot, i) => {
          const middle = i === 1;
          return (
            <div
              key={shot.src}
              data-hero-card
              className={`relative ${
                middle
                  ? "aspect-square w-[100%] translate-y-1 sm:aspect-4/3 sm:w-[74%] sm:translate-y-4 lg:w-[66%]"
                  : "hidden aspect-4/3 w-[30%] translate-y-20 opacity-90 lg:block"
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes={middle ? "(max-width: 640px) 100vw, 700px" : "36vw"}
                className="object-contain object-bottom drop-shadow-[0_20px_36px_rgba(90,15,20,0.22)]"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

