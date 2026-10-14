"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Lock, X } from "lucide-react";
import { festivals } from "@/data/festivals";
import { useTilt } from "@/components/ui/use-tilt";

export function MonthCarousel() {
  const [hovered, setHovered] = useState<number | null>(null);
  const tilt = useTilt(7);
  const [flipped, setFlipped] = useState<string | null>(null);
  // A 62vw card is too small to read on a phone, so a tap opens it full screen.
  const [preview, setPreview] = useState<string | null>(null);

  // Ten identical "shop to view" slabs say less than one sealed card that
  // names the number, so the locked parbas share a single panel.
  const revealed = festivals.filter((f) => f.revealed);
  const sealedCount = festivals.length - revealed.length;

  // While the sheet is open: lock the page behind it and let Escape close it.
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => mq.matches && setFlipped(null);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreview(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [preview]);
  const [selectedId, setSelectedId] = useState<string>("rath-yatra");



  return (
    <section
      id="inside-calendar"
      className="pt-16 sm:pt-20 pb-8 sm:pb-10 bg-[#F6EFE2] text-[#1B1B1B] relative z-10 scroll-mt-24 overflow-x-clip"
    >
      {/* 1. Folk Background Pattern Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "200px",
        }}
      />

      {/* 2. Background Konark Temple Spire - Placed cleanly at bottom-right with subtle breathing float */}
      <div
        className="absolute -bottom-10 -right-8 sm:-right-4 md:right-0 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[480px] h-[360px] sm:h-[460px] md:h-[560px] pointer-events-none select-none opacity-20 mix-blend-multiply z-0 animate-temple-breathe"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/temple-konark.webp"
          alt=""
          fill
          className="object-contain object-bottom-right"
        />
      </div>

      {/* 3. Enlarged Palm Tree Background - Anchored flush to the bottom-left edge without floating crop */}
      <div
        className="absolute bottom-0 -left-1 sm:-left-2 md:left-0 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[580px] h-[480px] sm:h-[620px] md:h-[740px] lg:h-[840px] pointer-events-none select-none opacity-20 md:opacity-25 mix-blend-multiply z-0 animate-palm-breeze"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/palms-tight-left.webp"
          alt=""
          fill
          className="object-contain object-bottom-left"
        />
      </div>

      {/* 4. Flipped 1st Foliage & Hibiscus Floral Accent - Brought to front over the Pattachitra strip seam with organic sway */}
      <div
        className="absolute -top-[95px] sm:-top-[115px] md:-top-[135px] -left-2 sm:-left-3 md:-left-4 w-[140px] sm:w-[170px] md:w-[200px] h-[160px] sm:h-[190px] md:h-[220px] pointer-events-none select-none z-40 animate-sway-soft"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/foliage-left-cluster.webp"
          alt=""
          fill
          className="object-contain object-left-top drop-shadow-[0_8px_18px_rgba(27,27,27,0.22)]"
        />
      </div>

      {/* 5. Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-gazpacho text-[#8A1717] font-bold text-xl sm:text-2xl">
              03
            </span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A1717]">
              INSIDE THE CALENDAR
            </span>
          </div>

          <h2 className="font-gazpacho text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-[#1B1B1B]">
            Not just dates.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#1B1B1B]/80 font-medium">
            Stories, festivals, artwork and a deeper connection to Odisha.
          </p>
        </div>

        {/* Accordion card deck */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#1B1B1B]/70 mb-3 text-center sm:text-left">
            Three parbas are open. The rest stay sealed until the box lands.
          </p>

          {/* Accordion strip: the revealed parbas, then one sealed card for the
              rest. Below lg each panel is too narrow to read, so it becomes a
              snap rail and a tap opens the full-screen preview. */}
          <div
            className="flex gap-2 h-[340px] sm:h-[400px] lg:h-[420px] w-full overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory -mx-4 px-4 lg:mx-0 lg:px-0 lg:[mask-image:none]"
            style={{
              // Edge fade, rail only; the accordion at lg needs no mask.
              maskImage:
                "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 28px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 28px), transparent 100%)",
              scrollPaddingInline: "1rem",
            }}
          >
            {revealed.map((fest, i) => {
              const open = hovered === i || (hovered === null && fest.id === selectedId);
              return (
                <button
                  key={fest.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(fest.id);
                    if (window.matchMedia("(max-width: 1023px)").matches) {
                      setPreview(fest.id);
                      return;
                    }
                    // Open it first; a second click on an open panel flips it over.
                    if (open) setFlipped((f) => (f === fest.id ? null : fest.id));
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={(e) => {
                    setHovered(null);
                    tilt.onPointerLeave(e as unknown as React.PointerEvent<HTMLElement>);
                  }}
                  onPointerMove={tilt.onPointerMove}
                  style={{ flexGrow: open ? 3 : 1 }}
                  aria-pressed={flipped === fest.id}
                  className="foil group relative w-[62vw] shrink-0 snap-center lg:w-auto lg:basis-0 lg:shrink lg:min-w-0 h-full rounded-xl border-2 border-[#1B1B1B] bg-[#FFFDF7] cursor-pointer transition-[flex-grow] duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] [perspective:1200px]"
                >
                  <span
                    className="relative block w-full h-full rounded-[10px] overflow-hidden transition-transform duration-700 [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(.22,1,.36,1)]"
                    style={{
                      transform: `rotateX(var(--rx, 0deg)) rotateY(calc(var(--ry, 0deg) + ${
                        flipped === fest.id ? "180deg" : "0deg"
                      }))`,
                    }}
                  >
                    <span className="absolute inset-0 block [backface-visibility:hidden]">
                      <Image
                        src={fest.artwork}
                        alt={fest.festivalNameEn}
                        fill
                        sizes="(max-width: 1023px) 62vw, 30vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-[#1B1B1B]/80 text-white px-3 py-2 text-left">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-[#E0A526]">
                          {fest.monthEn}
                        </span>
                        <span className="block text-sm font-bold truncate">{fest.festivalNameEn}</span>
                      </span>
                    </span>

                    {/* Back of the card: the story */}
                    <span className="absolute inset-0 flex flex-col gap-2 overflow-hidden bg-[#1B382B] text-left text-[#F6EFE2] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-[#E0A526]">
                        {fest.calendarDate}
                      </span>
                      <span className="block font-gazpacho text-xl font-bold">{fest.festivalNameEn}</span>
                      <span lang="or" className="block text-sm text-[#F6EFE2]/80">{fest.festivalNameOr}</span>
                      <span className="block text-sm leading-relaxed">{fest.flavorText}</span>
                      <span className="mt-auto flex flex-wrap gap-1.5">
                        {fest.traditions.map((trad) => (
                          <span key={trad} className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium">
                            {trad}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}

            {/* One sealed card for every parba still under wraps */}
            <button
              type="button"
              onClick={() => document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" })}
              style={{ flexGrow: hovered === -1 ? 3 : 1.4 }}
              onMouseEnter={() => setHovered(-1)}
              onMouseLeave={() => setHovered(null)}
              className="group relative w-[62vw] shrink-0 snap-center lg:w-auto lg:basis-0 lg:shrink lg:min-w-0 h-full overflow-hidden rounded-xl border-2 border-dashed border-[#8A1717]/60 bg-[#1B382B] text-[#F6EFE2] cursor-pointer transition-[flex-grow] duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)]"
            >
              <span className="absolute inset-0 opacity-25">
                <Image src="/assets/parba/13th-parba-sealed.webp" alt="" fill sizes="30vw" className="object-cover blur-[3px]" />
              </span>
              <span className="relative flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                <Lock className="h-6 w-6 text-[#E0A526]" />
                <span className="font-gazpacho text-3xl font-bold leading-none text-[#E0A526]">
                  {sealedCount}
                </span>
                <span className="text-xs font-black uppercase tracking-widest">
                  parbas still sealed
                </span>
                <span className="max-w-[22ch] text-[11px] leading-snug text-[#F6EFE2]/80">
                  Nuakhai, Manabasa, Boita Bandana and more — they open when the box lands.
                </span>
                <span className="mt-1 rounded-full bg-[#E0A526] px-3 py-1.5 text-[11px] font-black text-[#1B1B1B] transition-transform duration-300 group-hover:scale-105">
                  Pre-order to unseal →
                </span>
              </span>
            </button>
          </div>
        </div>


      {/* Phone preview: the tapped card, big enough to actually read */}
      {preview && typeof document !== "undefined" && (() => {
        const fest = festivals.find((f) => f.id === preview);
        if (!fest) return null;
        return createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-[#1B1B1B]/70 lg:hidden"
            onClick={() => setPreview(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={fest.festivalNameEn}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92dvh] w-full overflow-y-auto no-scrollbar rounded-t-3xl border-2 border-[#1B1B1B] bg-[#FFFDF7] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-wider text-[#8A1717]">
                    {fest.calendarDate}
                  </span>
                  <h3 className="font-gazpacho text-2xl font-bold">{fest.festivalNameEn}</h3>
                  <span lang="or" className="block text-sm text-[#1B1B1B]/70">
                    {fest.festivalNameOr}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  aria-label="Close preview"
                  className="shrink-0 grid h-10 w-10 place-items-center rounded-full border-2 border-[#1B1B1B] bg-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-[#1B1B1B]">
                <Image
                  src={fest.artwork}
                  alt={fest.festivalNameEn}
                  fill
                  sizes="92vw"
                  className="object-cover"
                />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#1B1B1B]/85">{fest.flavorText}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {fest.traditions.map((trad) => (
                  <span
                    key={trad}
                    className="rounded-md border border-[#D5C7B3] bg-[#F6EFE2] px-2 py-1 text-[11px] font-medium"
                  >
                    {trad}
                  </span>
                ))}
              </div>
            </div>
          </div>,
          document.body
        );
      })()}

      </div>
    </section>
  );
}
