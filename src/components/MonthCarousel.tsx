"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Lock, X, ChevronLeft, ChevronRight, RotateCw, Check } from "lucide-react";
import { festivals } from "@/data/festivals";
import { useTilt } from "@/components/ui/use-tilt";

export function MonthCarousel() {
  const [hovered, setHovered] = useState<number | null>(null);
  const tilt = useTilt(7);
  const [flipped, setFlipped] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // Tap opens the card in full screen preview on mobile
  const [preview, setPreview] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [modalFlipped, setModalFlipped] = useState(false);
  const [dragY, setDragY] = useState(0);
  const touchStartY = React.useRef<number | null>(null);
  const isDragging = React.useRef(false);

  const handleClose = React.useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setPreview(null);
      setIsClosing(false);
      setModalFlipped(false);
      setDragY(0);
    }, 280);
  }, [isClosing]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff > 0) {
      setDragY(diff);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 75) {
      handleClose();
    } else {
      setDragY(0);
    }
    touchStartY.current = null;
    isDragging.current = false;
  };

  const openPreview = (festId: string) => {
    setIsClosing(false);
    setDragY(0);
    setModalFlipped(false);
    setPreview(festId);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = Math.min(scrollRef.current.clientWidth * 0.8, 320);
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [preview, handleClose]);
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


      {/* 5. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="reveal max-w-3xl mb-8 sm:mb-12">
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
          <p className="mt-2 text-base sm:text-lg text-[#1B1B1B]/80 font-subtext italic font-medium">
            Stories, festivals, artwork and a deeper connection to Odisha.
          </p>
        </div>

        {/* Accordion card deck */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1B1B1B]/70 text-left">
              Three parbas are open. The rest stay sealed until the box lands.
            </p>
            {/* Mobile / Tablet navigation chevrons */}
            <div className="flex lg:hidden items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous festival card"
                className="w-8 h-8 rounded-full border-2 border-[#1B1B1B] bg-white active:bg-[#E0A526] text-[#1B1B1B] flex items-center justify-center transition-all shadow-[2px_2px_0_0_#1B1B1B]"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next festival card"
                className="w-8 h-8 rounded-full border-2 border-[#1B1B1B] bg-white active:bg-[#E0A526] text-[#1B1B1B] flex items-center justify-center transition-all shadow-[2px_2px_0_0_#1B1B1B]"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Accordion strip: the revealed parbas, then one sealed card for the
              rest. Below lg each panel becomes an edge-to-edge snap rail and a tap opens the full-screen preview. */}
          <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-5 lg:gap-2 h-[380px] sm:h-[420px] lg:h-[420px] w-full overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory px-4 sm:px-6 lg:px-0 pb-3 pt-1"
              style={{
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
                        openPreview(fest.id);
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
                    className="foil group relative w-[78vw] sm:w-[280px] max-w-[320px] shrink-0 snap-start lg:w-auto lg:basis-0 lg:shrink lg:min-w-0 h-full rounded-xl border-2 border-[#1B1B1B] bg-[#FFFDF7] cursor-pointer transition-[flex-grow] duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] [perspective:1200px]"
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
                          sizes="(max-width: 1023px) 80vw, 30vw"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-[#1B1B1B]/90 backdrop-blur-md text-white px-3.5 py-2.5 text-left border-t border-white/10">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="block text-[10px] font-black uppercase tracking-wider text-[#E0A526]">
                              {fest.monthEn}
                            </span>
                            <span className="text-[10px] text-[#F6EFE2]/70 font-medium">
                              {fest.calendarDate.split("·")[0]?.trim()}
                            </span>
                          </div>
                          <span className="block text-sm sm:text-base font-bold truncate text-[#F6EFE2]">
                            {fest.festivalNameEn} <span className="font-normal text-xs text-[#E0A526] ml-1">({fest.festivalNameOr})</span>
                          </span>
                        </span>
                      </span>

                      {/* Back of the card: the story */}
                      <span className="absolute inset-0 flex flex-col gap-2 overflow-hidden bg-[#1B1B1B] text-left text-[#F6EFE2] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
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
                className="group relative w-[78vw] sm:w-[280px] max-w-[320px] shrink-0 snap-start lg:w-auto lg:basis-0 lg:shrink lg:min-w-0 h-full overflow-hidden rounded-xl border-2 border-dashed border-[#8A1717]/60 bg-[#1B1B1B] text-[#F6EFE2] cursor-pointer transition-[flex-grow] duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)]"
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

          {/* Mobile swipe helper */}
          <div className="flex lg:hidden items-center justify-between px-1 mt-2 text-[11px] text-[#1B1B1B]/70 font-medium">
            <span>Swipe or use arrows to view all parbas</span>
            <span className="text-[#8A1717] font-bold">Tap card for story →</span>
          </div>
        </div>


      {/* Phone preview: the tapped card, big enough to actually read */}
      {preview && typeof document !== "undefined" && (() => {
        const fest = festivals.find((f) => f.id === preview);
        if (!fest) return null;
        return createPortal(
          <div
            className={`fixed inset-0 z-[60] flex items-end justify-center bg-[#1B1B1B]/75 lg:hidden backdrop-blur-xs transition-opacity duration-200 ${
              isClosing ? "animate-backdrop-fade-out" : "animate-backdrop-fade-in"
            }`}
            style={{
              opacity: dragY > 0 ? Math.max(0.1, 1 - dragY / 350) : undefined,
            }}
            onClick={handleClose}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={fest.festivalNameEn}
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
                transition: isDragging.current ? "none" : dragY > 0 ? "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
              }}
              className={`max-h-[94dvh] w-full overflow-y-auto no-scrollbar rounded-t-3xl border-2 border-[#1B1B1B] bg-[#FFFDF7] p-4 pt-2.5 pb-[max(1.25rem,env(safe-area-inset-bottom))] will-change-transform ${
                isClosing
                  ? "animate-modal-slide-down"
                  : dragY === 0
                  ? "animate-modal-slide-up"
                  : ""
              }`}
            >
              {/* Pull Down Handle Bar (Touch / Drag / Swipe Down to Dismiss) */}
              <div
                className="w-full flex flex-col items-center pt-0.5 pb-2 cursor-grab active:cursor-grabbing touch-none select-none group/handle"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-12 h-1.5 rounded-full bg-[#1B1B1B]/30 group-hover/handle:bg-[#1B1B1B]/50 transition-colors" />
                <span className="text-[9px] font-semibold tracking-wider uppercase text-[#1B1B1B]/40 mt-1">
                  Pull down to close
                </span>
              </div>

              {/* Modal Top Header */}
              <div
                className="mb-2.5 flex items-start justify-between gap-3 touch-none select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-wider text-[#8A1717]">
                    {fest.calendarDate}
                  </span>
                  <h3 className="font-gazpacho text-2xl font-bold leading-tight">{fest.festivalNameEn}</h3>
                  <span lang="or" className="block text-sm text-[#1B1B1B]/70 font-odia">
                    {fest.festivalNameOr}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close preview"
                  className="shrink-0 grid h-11 w-11 place-items-center rounded-full border-2 border-[#1B1B1B] bg-white cursor-pointer hover:bg-[#F6EFE2] active:scale-95 transition-all shadow-xs"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 3D Flippable Reviewing Card Container */}
              <div
                className="relative aspect-[3/4] w-full [perspective:1200px] cursor-pointer select-none my-2 group"
                onClick={() => setModalFlipped((prev) => !prev)}
                role="button"
                tabIndex={0}
                aria-label={`Flip ${fest.festivalNameEn} card. Currently showing ${modalFlipped ? "back side (story & traditions)" : "front side (artwork)"}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setModalFlipped((prev) => !prev);
                  }
                }}
              >
                <div
                  className="relative w-full h-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(.22,1,.36,1)] shadow-xl"
                  style={{
                    transform: modalFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT SIDE: Official Artwork */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#1B1B1B] bg-[#FFFDF7] [backface-visibility:hidden]">
                    <Image
                      src={fest.artwork}
                      alt={fest.festivalNameEn}
                      fill
                      sizes="(max-width: 768px) 92vw, 400px"
                      className="object-cover"
                      priority
                    />
                    
                    {/* Floating 3D Flip Badge */}
                    <div className="absolute top-3 right-3 bg-[#1B1B1B]/80 backdrop-blur-md text-[#E0A526] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#E0A526]/50 flex items-center gap-1.5 shadow-md group-hover:scale-105 transition-transform">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Tap to 3D flip</span>
                    </div>

                    {/* Bottom Art Ribbon */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3.5 pt-8 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#E0A526]">
                          Front · Official Art
                        </span>
                        <span className="text-[10px] text-white/90 font-medium flex items-center gap-1">
                          Tap card to view back ↺
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE: Story, Traditions & Rituals Tracker */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#1B1B1B] bg-[#141414] text-[#F6EFE2] p-4 sm:p-5 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-inner">
                    {/* Odia Folk Pattern Texture Overlay */}
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
                      style={{
                        backgroundImage: "url('/assets/folk-pattern-tile.png')",
                        backgroundSize: "140px",
                      }}
                    />

                    {/* Back Header */}
                    <div className="relative z-10 flex items-start justify-between border-b border-[#E0A526]/30 pb-2.5">
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-wider text-[#E0A526]">
                          {fest.calendarDate}
                        </span>
                        <h4 className="font-gazpacho text-xl sm:text-2xl font-bold text-[#FFFDF7] leading-tight">
                          {fest.festivalNameEn}
                        </h4>
                        <span lang="or" className="block text-xs text-[#E0A526]/90 font-odia">
                          {fest.festivalNameOr}
                        </span>
                      </div>
                      <div className="bg-[#E0A526]/20 border border-[#E0A526]/50 text-[#E0A526] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <RotateCw className="w-3 h-3" />
                        <span>Back Face</span>
                      </div>
                    </div>

                    {/* Story Flavor Quote */}
                    <div className="relative z-10 my-auto py-2">
                      <div className="bg-[#0B0B0B]/85 p-3 sm:p-3.5 rounded-xl border border-[#E0A526]/25 shadow-xs">
                        <p className="text-xs sm:text-sm leading-relaxed text-[#F6EFE2]/95 italic">
                          &ldquo;{fest.flavorText}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Traditions Checklist */}
                    <div className="relative z-10 space-y-1.5 pt-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#E0A526]/90">
                        Traditions on this card:
                      </span>
                      <div className="space-y-1.5">
                        {fest.traditions.map((trad, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-[11px] sm:text-xs text-[#FFFDF7] bg-[#1A1A1A]/90 px-2.5 py-1.5 rounded-lg border border-[#E0A526]/25 shadow-xs"
                          >
                            <div className="w-4 h-4 rounded border border-[#E0A526] bg-[#E0A526]/20 flex items-center justify-center shrink-0 text-[#E0A526]">
                              <Check className="w-3 h-3" strokeWidth={2.5} />
                            </div>
                            <span className="leading-snug">{trad}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Stamp */}
                    <div className="relative z-10 pt-2.5 border-t border-[#E0A526]/25 flex items-center justify-between text-[10px] text-[#E0A526]/85 font-medium">
                      <span>BARA MASA TERA PARBA</span>
                      <span className="flex items-center gap-1 text-[#E0A526]">
                        Tap to flip front ↺
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flavor Text & Traditions (Below Card) */}
              <p className="mt-3 text-sm leading-relaxed text-[#1B1B1B]/85 italic">&ldquo;{fest.flavorText}&rdquo;</p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {fest.traditions.map((trad) => (
                  <span
                    key={trad}
                    className="rounded-md border border-[#D5C7B3] bg-[#F6EFE2] px-2 py-1 text-[11px] font-medium text-[#1B1B1B]"
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
