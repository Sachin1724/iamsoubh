"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Text3DFlip from "@/registry/magicui/text-3d-flip";
import { useTilt } from "@/components/ui/use-tilt";
import { GokulpShader } from "@/components/ui/GokulpShader.webgl";

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

export function Hero({ onOrderClick }: HeroProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [shaderReady, setShaderReady] = React.useState(false);
  const tilt = useTilt(9);

  React.useEffect(() => {
    // Defer WebGL compilation until after initial paint to prevent blocking LCP
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => setShaderReady(true), 150);
      return () => clearTimeout(timer);
    }
  }, []);

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
      className="relative min-h-[100dvh] lg:h-[100dvh] flex flex-col justify-between pt-20 sm:pt-24 pb-0 bg-[#8A1717] text-[#F6EFE2] overflow-hidden"
    >
      {/* Animated ASCII shader with softened brightness (no harsh glare) */}
      <div
        className={`absolute inset-0 z-0 pointer-events-none mix-blend-screen brightness-75 transition-opacity duration-700 ${
          shaderReady ? "opacity-45" : "opacity-0"
        }`}
        style={{
          maskImage: "radial-gradient(62% 40% at 50% 56%, transparent 0%, rgba(0,0,0,.5) 55%, #000 85%)",
          WebkitMaskImage: "radial-gradient(62% 40% at 50% 56%, transparent 0%, rgba(0,0,0,.5) 55%, #000 85%)",
        }}
        aria-hidden="true"
      >
        {shaderReady && <GokulpShader theme="dark" background={{ dark: "#8A1717" }} />}
      </div>
      {/* Background folk pattern matching Section 07 */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-repeat z-0"
        style={{ backgroundImage: "url('/assets/folk-pattern-tile.png')", backgroundSize: "180px" }}
      />

      {/* Konark line-art backdrop */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(1100px,120vw)] aspect-[720/360] pointer-events-none select-none z-0 opacity-15"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/konark-lineart.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1100px"
          className="object-contain object-bottom"
        />
      </div>

      {/* Decorative White Mandala Art (Top Right) — subtle watermark tone */}
      <div
        className="absolute -top-24 sm:-top-32 md:-top-40 -right-24 sm:-right-32 md:-right-40 w-[380px] sm:w-[520px] md:w-[660px] lg:w-[780px] aspect-square pointer-events-none select-none z-0 opacity-10 md:opacity-12"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/mandala-white-1200.webp"
          alt=""
          fill
          sizes="(max-width: 640px) 40vw, 320px"
          loading="lazy"
          className="object-contain animate-spin-slow"
        />
      </div>

      {/* Decorative White Mandala Art (Bottom Left) — subtle watermark tone */}
      <div
        className="absolute -bottom-24 sm:-bottom-32 md:-bottom-40 -left-24 sm:-left-32 md:-left-40 w-[340px] sm:w-[460px] md:w-[580px] lg:w-[680px] aspect-square pointer-events-none select-none z-0 opacity-8 md:opacity-10"
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

      {/* Main hero content aligned with site-wide max-w-7xl container, flex-1 to fill 100vh */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-between items-center">
        {/* Top/Center Copy Group */}
        <div className="flex flex-col items-center text-center relative max-w-3xl my-auto pt-2 sm:pt-4">
          {/* Eyebrow badge & Mobile Odia badge cluster */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2.5 sm:mb-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E0A526]/40 bg-black/25 text-[#E0A526] text-xs font-bold tracking-wider uppercase backdrop-blur-xs shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E0A526] animate-pulse" />
              <span>2027 EDITION · PRE-ORDERS OPEN</span>
            </div>

            {/* Mobile-only unified Odia Heart pill */}
            <div className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3E9B47] text-[#1B1B1B] border border-[#1B1B1B] font-black text-[10px] tracking-wide uppercase shadow-[2px_2px_0_0_#1B1B1B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B1B1B]" />
              <span>SAME ODIA HEART · NEW STORIES</span>
            </div>
          </div>

          {/* Editorial Headline: Gazpacho Font */}
          <div className="relative inline-block z-10">
            <h1 className="font-gazpacho text-[2.2rem] sm:text-5xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-black tracking-tight leading-[0.98] text-white">
              <span className="block whitespace-normal sm:whitespace-nowrap">
                The Odia <span className="text-[#E0A526] drop-shadow-sm">Viral</span>
              </span>
              <span className="block whitespace-normal sm:whitespace-nowrap text-white">
                Calendar is back.
              </span>
            </h1>

            {/* Desktop Angled Sticker: "SAME ODIA HEART" with continuous gentle float (desktop only) */}
            <div className="hidden sm:flex flex-col items-center gap-2.5 absolute -top-8 -right-16 md:-right-20 lg:-right-24 pointer-events-none z-20 animate-float-gentle">
              <div className="animate-sticker-settle">
                <div
                  className="bg-[#3E9B47] text-[#1B1B1B] font-black text-xs uppercase px-3.5 py-1.5 rounded-md border-2 border-[#1B1B1B] flex flex-col items-center leading-tight rotate-2"
                  style={{ boxShadow: "3px 3px 0 0 #1B1B1B" }}
                >
                  <span className="tracking-wide">SAME ODIA</span>
                  <span className="text-[10px] text-[#8A1717] font-bold">HEART</span>
                  <span className="tracking-wide text-[9px]">NEW STORIES</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body paragraph */}
          <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-base md:text-lg text-[#F6EFE2]/90 max-w-xl mx-auto font-normal leading-relaxed relative z-10">
            Last year it went viral before it even shipped. <strong className="text-white font-semibold">1,500 homes</strong>, 22 states and the USA later, it&apos;s back for 2027, and it&apos;s louder.
          </p>

          {/* CTA action cluster: Scroll to preorder + 3D text flip */}
          <div className="mt-3.5 sm:mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto relative z-10">
            <button
              type="button"
              onClick={handleOrder}
              className="group relative inline-flex items-center justify-center gap-3 bg-[#E0A526] hover:bg-[#EBB538] text-[#1B1B1B] font-gazpacho text-base sm:text-lg font-bold px-7 min-h-[48px] rounded-full border-2 border-[#1B1B1B] press lift cursor-pointer shrink-0 transition-all active:translate-x-[2px] active:translate-y-[2px]"
              style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
            >
              <span>Let&apos;s Odia this</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm md:text-base text-[#F6EFE2] font-medium min-h-[36px]">
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

        {/* Card row: grounded gracefully at bottom with full visibility */}
        <div className="w-full flex items-end justify-center px-2 mt-auto pb-1 sm:pb-2">
          {HERO_CARDS.map((c, i) => (
            <div
              key={c.src}
              style={{ zIndex: hovered === i ? 30 : i }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative w-[18vw] max-w-[170px] sm:max-w-[200px] md:w-[210px] lg:w-[230px] shrink-0 -ml-[5vw] first:ml-0 md:-ml-4 md:first:ml-0 transition-transform duration-500 ease-out hover:-translate-y-6 focus-within:-translate-y-6"
            >
              <div
                className="transition-transform duration-500 ease-out"
                style={{
                  // Arc: rotate about a pivot far below so cards sit on a gentle circle.
                  transform: `rotate(${(i - (HERO_CARDS.length - 1) / 2) * 4}deg)`,
                  transformOrigin: "50% 850px",
                }}
              >
                <div
                  onPointerMove={tilt.onPointerMove}
                  onPointerLeave={tilt.onPointerLeave}
                  className="tilt-card foil rounded-xl"
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={420}
                    height={560}
                    sizes="(max-width: 640px) 20vw, 220px"
                    priority={i < 2}
                    className="w-full h-auto rounded-xl border-2 border-[#1B1B1B] bg-[#F6EFE2] object-cover transition-shadow duration-500 group-hover:shadow-[0_18px_30px_rgba(27,27,27,.45)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
