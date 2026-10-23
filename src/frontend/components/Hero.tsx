"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { siteConfig } from "@/config/site-config";
import { useStock } from "@/frontend/lib/useStock";
import { scrollToTarget } from "@/frontend/components/SmoothScroll";

// The hero's own call to action: a brand-red card with the line in white and a
// struck-through "Order" under it. Flat and 2D, with the site's hard ink shadow.
const HERO_CTA =
  "inline-flex cursor-pointer select-none flex-col items-center justify-center rounded-2xl bg-[#8A1717] px-8 py-3 font-sans text-white shadow-[3px_3px_0_0_#1B1B1B] transition-transform hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_0_#1B1B1B]";

export function Hero() {
  const { soldOut } = useStock();
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
        const cards: Element[] = [];
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
      id="hero" data-snap
      className="relative flex h-svh min-h-svh sm:h-auto sm:min-h-screen flex-col justify-between overflow-hidden bg-pipili-cream pt-[6.25rem] sm:pt-24 text-on-light"
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
      <div className="absolute inset-0 z-0 hidden sm:block" aria-hidden="true">
        <Image
          src="/assets/hero/hero-bg-artisan.jpg"
          alt=""
          fill
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[38%_34%] lg:object-[46%_34%] xl:object-[54%_34%]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/65 via-black/20 to-transparent" />
      </div>

      <div
        data-hero-copy
        className="absolute inset-y-0 right-[4vw] z-20 hidden w-[clamp(240px,40vw,540px)] flex-col items-end justify-center pt-16 text-right text-white sm:flex"
      >
        <h1 className="sr-only">Bara Masa Tera Parba — the 2027 Odia calendar</h1>
        <Image
          data-hero-lettering
          src="/assets/brand/logo-bmtp.svg"
          alt=""
          width={886}
          height={450}
          unoptimized
          preload
          className="mt-[2vh] h-auto w-full select-none"
        />
        <div data-hero-part className="mt-2 flex items-center gap-2">
          <span className="font-editorial text-[clamp(1rem,2vw,1.5rem)] italic text-white/90">by</span>
          <Image
            src="/assets/brand/calogo.png"
            alt="IAMSOUBH"
            width={180}
            height={50}
            className="h-[clamp(1.25rem,2.4vw,2rem)] w-auto select-none object-contain brightness-0 invert"
          />
        </div>
        <p data-hero-part className="mt-[2.5vh] max-w-[34ch] font-subtext text-[clamp(0.85rem,1.6vw,1.25rem)] font-normal leading-snug text-white/90">
          {soldOut ? (
            `All ${siteConfig.batchCap} are gone. Thank you, Odisha.`
          ) : (
            <>
              The Odia calendar you feel · Edition 2027
            </>
          )}
        </p>
        <div data-hero-part className="mt-6 flex flex-col items-end gap-2">
          <button type="button" onClick={() => scrollToTarget("#preorder")} className={HERO_CTA}>
            {soldOut ? (
              <span className="text-xl font-medium">Join batch 2</span>
            ) : (
              <>
                <span className="text-[1.6rem] font-medium leading-none tracking-[-0.02em] sm:text-3xl">Let&rsquo;s Odia This!</span>
                {/* The joke: it isn't an "order", it's an Odia thing */}
                <s className="mt-1 text-sm font-medium leading-none decoration-[1.5px]">Order</s>
              </>
            )}
          </button>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium italic text-[#F2C14E] [text-shadow:0_0_10px_rgba(224,165,38,0.65),0_0_22px_rgba(224,165,38,0.35)]">
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Free shipping all over India</span>
          </span>
        </div>
      </div>

      <div
        data-hero-copy
        className="relative z-20 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 text-center sm:px-6 md:px-8 sm:hidden"
      >

        {/* Phones: logo sits just under the edition line, text + CTA drop to the bottom.
            sm+: one centered cluster as before. */}
        <div className="flex w-full flex-1 flex-col items-center justify-between py-4 sm:my-auto sm:flex-none sm:justify-center sm:py-6">
          {/* Drawn Odia lettering mark, signed underneath */}
          <div className="w-full">
          <h1 className="w-full flex justify-center text-center">
            <span className="sr-only">Bara Masa Tera Parba — the 2027 Odia calendar</span>
            <Image
              data-hero-lettering
              src="/assets/brand/logo-bmtp-brand.svg"
              alt="Bara Masa Tera Parba"
              width={886}
              height={450}
              unoptimized
              preload
              className="mx-auto h-auto w-[72%] max-w-[315px] select-none sm:w-[52%] sm:max-w-[390px]"
            />
          </h1>
          <div data-hero-part className="mt-2 flex -translate-x-5 items-center justify-center gap-1.5">
            <span className="font-editorial text-sm italic text-[#8A1717]/85 sm:text-base">by</span>
            <Image
              src="/assets/brand/calogo.png"
              alt="IAMSOUBH"
              width={180}
              height={50}
              className="h-4 w-auto select-none object-contain sm:h-5"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(10%) sepia(40%) saturate(4000%) hue-rotate(338deg)",
              }}
            />
          </div>
          </div>

          <div className="flex w-full flex-col items-center pb-10 sm:pb-0">
          {/* Clean copy text: white italic over the photo on phones */}
          <p
            data-hero-part
            className="mx-auto mt-3 sm:mt-3.5 w-full max-w-[36ch] sm:max-w-[42ch] text-center font-subtext text-sm sm:text-base leading-snug font-light italic text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.55)] sm:font-normal sm:not-italic sm:text-on-light/85 sm:[text-shadow:none]"
          >
            {soldOut ? (
              `All ${siteConfig.batchCap} are gone. Thank you, Odisha.`
            ) : (
              <>
                The Odia calendar you feel · Edition 2027
              </>
            )}
          </p>

          {/* CTA and Free Shipping */}
          <div data-hero-part className="mt-4 sm:mt-5 flex flex-col items-center justify-center gap-2 text-center w-full">
            <button
              type="button"
              onClick={() => scrollToTarget("#preorder")}
              className={`w-full max-w-sm ${HERO_CTA}`}
            >
              {soldOut ? (
              <span className="text-xl font-medium">Join batch 2</span>
            ) : (
              <>
                <span className="text-[1.6rem] font-medium leading-none tracking-[-0.02em] sm:text-3xl">Let&rsquo;s Odia This!</span>
                {/* The joke: it isn't an "order", it's an Odia thing */}
                <s className="mt-1 text-sm font-medium leading-none decoration-[1.5px]">Order</s>
              </>
            )}
            </button>
            
            <span className="inline-flex items-center justify-center gap-1.5 text-xs font-medium italic text-[#F2C14E] [text-shadow:0_0_10px_rgba(224,165,38,0.65),0_0_22px_rgba(224,165,38,0.35)] sm:not-italic sm:text-on-light/75 sm:[text-shadow:none] text-center">
              <ShoppingCart className="h-3.5 w-3.5 shrink-0 sm:text-[#8A1717]" aria-hidden="true" />
              <span>Free shipping all over India</span>
            </span>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

