"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Text3DFlip from "@/registry/magicui/text-3d-flip";
import { siteConfig } from "@/config/site-config";

interface HeroProps {
  onOrderClick: () => void;
}

export function Hero({ onOrderClick }: HeroProps) {
  // Where the spotlight sits, in percent of the hero. Centre-right until the
  // pointer takes over, so touch devices still see the product lit.
  const [light, setLight] = React.useState({ x: 70, y: 45 });

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setLight({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <section
      id="hero"
      onPointerMove={onPointerMove}
      className="relative pt-28 sm:pt-32 pb-6 sm:pb-8 bg-gradient-to-b from-[#C8221A] via-[#851922] to-[#8A1717] text-[#F6EFE2] overflow-hidden"
    >
      {/* Background folk pattern & subtle ambient glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
        style={{ backgroundImage: "url('/assets/folk-pattern-tile.png')", backgroundSize: "180px" }}
      />
      {/* Dynamic interactive spotlight moving smoothly with mouse pointer */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${light.x}%`,
          top: `${light.y}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(224, 165, 38, 0.22) 0%, rgba(200, 34, 26, 0.08) 50%, transparent 75%)",
        }}
      />

      {/* Decorative White Mandala Art (Top Right) */}
      <div
        className="absolute -top-24 sm:-top-32 md:-top-40 -right-24 sm:-right-32 md:-right-40 w-[380px] sm:w-[520px] md:w-[660px] lg:w-[780px] aspect-square pointer-events-none select-none z-0 opacity-25 md:opacity-30"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/mandala-white-1200.webp"
          alt=""
          fill
          sizes="(max-width: 640px) 40vw, 320px"
          priority
          className="object-contain animate-spin-slow"
        />
      </div>

      {/* Decorative White Mandala Art (Bottom Left) - Contained strictly within red hero */}
      <div
        className="absolute -bottom-24 sm:-bottom-32 md:-bottom-40 -left-24 sm:-left-32 md:-left-40 w-[340px] sm:w-[460px] md:w-[580px] lg:w-[680px] aspect-square pointer-events-none select-none z-0 opacity-20 md:opacity-25"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/mandala-white-1200.webp"
          alt=""
          fill
          sizes="(max-width: 640px) 40vw, 320px"
          className="object-contain animate-spin-slow"
          style={{ animationDirection: "reverse" }}
        />
      </div>

      {/* Main hero content aligned with site-wide max-w-7xl container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Copy leads on the left, product answers it on the right */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start text-left pt-0 relative">
            {/* Eyebrow badge & Mobile sticker container */}
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E0A526]/40 bg-black/20 text-[#E0A526] text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#E0A526] animate-pulse" />
                <span>2027 EDITION · PRE-ORDERS OPEN</span>
              </div>

              {/* Mobile sticker + Jagannath sticker badge */}
              <div className="sm:hidden flex items-center gap-2">
                <div className="inline-flex items-center bg-[#3E9B47] text-[#1B1B1B] font-black text-[10px] uppercase px-2.5 py-1 rounded-full border border-[#1B1B1B] shadow-xs">
                  <span>SAME ODIA HEART · NEW STORIES</span>
                </div>
                <div
                  className="inline-flex items-center p-1 bg-[#F6EFE2] rounded-md border border-[#1B1B1B]"
                  style={{ boxShadow: "2px 2px 0 0 #1B1B1B" }}
                >
                  <Image
                    src="/assets/brand/extracted/extracted_svg/nature-temple/nature-temple_040.svg"
                    alt="Jagannath sticker"
                    width={28}
                    height={34}
                    className="w-4 h-5 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Editorial Headline: Disko Phonic Font */}
            <div className="relative inline-block z-10">
              <h1 className="font-disko text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-normal tracking-tight leading-[0.96] text-white">
                <span className="block whitespace-normal sm:whitespace-nowrap">
                  The Odia <span className="text-[#E0A526] drop-shadow-sm">Viral</span>
                </span>
                <span className="block whitespace-normal sm:whitespace-nowrap text-white">
                  Calendar is back.
                </span>
              </h1>

              {/* Desktop Angled Stickers: "SAME ODIA HEART" + Jagannath sticker */}
              <div className="hidden sm:flex flex-col items-center gap-2.5 absolute -top-8 -right-16 md:-right-20 lg:-right-24 pointer-events-none z-20">
                {/* Same Odia Heart badge */}
                <div className="animate-sticker-settle">
                  <div
                    className="bg-[#3E9B47] text-[#1B1B1B] font-black text-xs uppercase px-3.5 py-1.5 rounded-md border-2 border-[#1B1B1B] flex flex-col items-center leading-tight"
                    style={{ boxShadow: "3px 3px 0 0 #1B1B1B" }}
                  >
                    <span className="tracking-wide">SAME ODIA</span>
                    <span className="text-[10px] text-[#8A1717] font-bold">HEART</span>
                    <span className="tracking-wide">NEW STORIES</span>
                  </div>
                </div>

                {/* Jagannath sticker below the Same Odia Heart badge */}
                <div className="animate-sticker-settle" style={{ animationDelay: "150ms" }}>
                  <div
                    className="bg-[#F6EFE2] p-1.5 rounded-md border-2 border-[#1B1B1B] flex flex-col items-center justify-center -rotate-3 hover:rotate-0 transition-transform"
                    style={{ boxShadow: "3px 3px 0 0 #1B1B1B" }}
                  >
                    <Image
                      src="/assets/brand/extracted/extracted_svg/nature-temple/nature-temple_040.svg"
                      alt="Jagannath sticker"
                      width={68}
                      height={82}
                      priority
                      className="w-12 h-14 md:w-14 md:h-16 object-contain select-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live text rather than artwork, so it stays crisp at any size.
                Broken after two words so it stacks like the lettering it replaces. */}
            <p
              lang="or"
              className="font-odia-display mt-2 sm:mt-3 text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-[#F6EFE2] relative z-10"
            >
              {(() => {
                const w = siteConfig.odiaTitle.split(" ");
                return (
                  <>
                    <span className="block">{w.slice(0, 2).join(" ")}</span>
                    <span className="block">{w.slice(2).join(" ")}</span>
                  </>
                );
              })()}
            </p>

            {/* Body paragraph */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-lg md:text-xl text-[#F6EFE2]/90 max-w-xl font-normal leading-relaxed relative z-10">
              Last year it went viral before it even shipped. <strong className="text-white font-semibold">1,500 homes</strong>, 22 states and the USA later, it&apos;s back for 2027, and it&apos;s louder.
            </p>

            {/* CTA action cluster */}
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto relative z-10">
            <button
              onClick={onOrderClick}
              className="group relative inline-flex items-center justify-center gap-3 bg-[#E0A526] text-[#1B1B1B] font-disko text-lg sm:text-xl px-8 min-h-[52px] rounded-full border-2 border-[#1B1B1B] press lift cursor-pointer shrink-0"
              style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
            >
              <span>Let&apos;s Odia this</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2.5 text-xs sm:text-base text-[#F6EFE2] font-medium min-h-[36px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3E9B47] shrink-0 animate-pulse shadow-[0_0_8px_#3E9B47]" />
              <Text3DFlip
                words={[
                  "Only 500 boxes in batch 1",
                  "Ships first week of November",
                  "Free shipping across India",
                  "Sealed 13th parba",
                ]}
                rotateDirection="top"
                staggerDuration={0.03}
                staggerFrom="first"
                transition={{ type: "spring", damping: 25, stiffness: 160 }}
                interval={3200}
                className="font-semibold text-white tracking-wide"
                textClassName="text-white"
                flipTextClassName="text-[#E0A526]"
              />
            </div>
          </div>
          </div>

          {/* Product: right on desktop, under the copy on phones */}
          <div className="order-1 lg:order-2 lg:col-span-5 scene flex justify-center lg:justify-end">
            <Image
              src="/assets/product/cards-fan-hero.webp"
              alt="The 2027 festival cards, fanned out"
              width={783}
              height={729}
              priority
              className="w-[280px] sm:w-[380px] lg:w-full max-w-[460px] h-auto card-3d"
              style={{
                // Leans toward the pointer, so the fan feels like a real object.
                transform: `rotateX(${(50 - light.y) * 0.1}deg) rotateY(${(light.x - 50) * 0.12}deg)`,
                filter: "drop-shadow(12px 16px 0 rgba(27,27,27,.3))",
              }}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
