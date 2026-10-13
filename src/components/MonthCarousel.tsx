"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, RotateCw, CheckSquare, Square, Calendar, Lock } from "lucide-react";
import { festivals, FestivalCard } from "@/data/festivals";
import { track, trackOnce } from "@/lib/track";

export function MonthCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [tickedTraditions, setTickedTraditions] = useState<Record<string, boolean>>({});

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const goToPreorder = () =>
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });

  const toggleFlip = (id: string) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  const toggleTradition = (e: React.MouseEvent, key: string) => {
    e.stopPropagation(); // prevent card flip
    setTickedTraditions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ViewContent fires once, when the visitor actually reaches the product section.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackOnce("viewcontent-03", () =>
          track("ViewContent", "view_item", {
            content_name: "Inside the calendar",
          })
        );
        io.disconnect();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="festivals"
      className="py-16 sm:py-24 bg-[#3E9B47] text-[#1B1B1B] relative overflow-hidden scroll-mt-24"
      style={{ scrollMarginTop: "96px" }}
    >
      
      {/* Decorative corner motifs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-disko block text-[52px] sm:text-[80px] leading-none text-[#23642B] select-none">
              03
            </span>
            <p className="text-sm font-bold -mt-2 sm:-mt-3 mb-2 text-[#1B1B1B]/90">
              03 · Inside the calendar
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#1B1B1B] leading-none">
              12 months. 12 stories.
            </h2>
            <p className="mt-3 text-base sm:text-lg font-medium text-[#8A1717]">
              Three cards are open. The other nine stay sealed until the box reaches you.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full bg-white text-[#1B1B1B] border-2 border-[#1B1B1B] press lift flex items-center justify-center cursor-pointer"
              style={{ boxShadow: "3px 3px 0 0 #1B1B1B" }}
              aria-label="Previous festivals"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-white text-[#1B1B1B] border-2 border-[#1B1B1B] press lift flex items-center justify-center cursor-pointer"
              style={{ boxShadow: "3px 3px 0 0 #1B1B1B" }}
              aria-label="Next festivals"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {festivals.map((card) => {
            const isFlipped = flippedCardId === card.id;

            // Only a few cards are shown. The rest stay shut like a closed book,
            // and pressing one takes you to the order section.
            if (!card.revealed) {
              return <SealedCard key={card.id} card={card} onBuy={goToPreorder} />;
            }

            return (
              <div
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="w-[260px] sm:w-[280px] shrink-0 snap-center cursor-pointer group perspective-1000"
              >
                {/* 3D Flip Container */}
                <div
                  className={`relative w-full h-[400px] rounded-3xl transition-transform duration-500 preserve-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  
                  {/* FRONT: Artwork & Festival Title */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl bg-white p-3.5 flex flex-col justify-between backface-hidden border-2 border-[#1B1B1B]"
                    style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
                  >
                    
                    {/* Artwork Container */}
                    <div className="relative w-full h-[280px] rounded-2xl overflow-hidden bg-[#F6EFE2]">
                      <Image
                        src={card.artwork}
                        alt={`${card.festivalNameEn} (${card.festivalNameOr})`}
                        fill
                        sizes="(max-width: 640px) 80vw, 420px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/folk-pattern-tile.png";
                        }}
                      />
                      
                      {/* Flip Hint Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <RotateCw className="w-3 h-3" />
                        <span>Flip</span>
                      </div>
                    </div>

                    {/* Odia Title & English Month */}
                    <div className="text-center py-2 flex flex-col items-center">
                      <span className="font-odia text-2xl font-bold text-[#C8221A] tracking-tight">
                        {card.festivalNameOr}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#1B1B1B]/60">
                          {card.monthEn}
                        </span>
                        <span className="text-xs text-[#1B1B1B]/40">•</span>
                        <span className="text-[11px] font-medium text-[#1B1B1B]/80">
                          {card.festivalNameEn}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* BACK: Calendar Dates & Tradition Tracker */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl bg-[#8A1717] text-[#F6EFE2] p-5 flex flex-col justify-between rotate-y-180 backface-hidden border-2 border-[#1B1B1B]"
                    style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
                  >
                    
                    <div>
                      {/* Back Header */}
                      <div className="flex items-center justify-between border-b border-white/15 pb-3">
                        <span className="font-odia text-xl font-bold text-[#E0A526]">
                          {card.festivalNameOr}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full text-white/90">
                          {card.monthEn}
                        </span>
                      </div>

                      {/* Date label */}
                      <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-[#E0A526]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{card.calendarDate}</span>
                      </div>

                      {/* Flavor text */}
                      <p className="mt-3 text-xs text-[#F6EFE2]/85 leading-relaxed italic">
                        &ldquo;{card.flavorText}&rdquo;
                      </p>

                      {/* Tradition Tracker Interactive Checklist */}
                      <div className="mt-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#3E9B47] block mb-2">
                          Tradition Tracker:
                        </span>
                        <div className="space-y-2">
                          {card.traditions.map((tradition, idx) => {
                            const tickKey = `${card.id}-${idx}`;
                            const isTicked = tickedTraditions[tickKey];

                            return (
                              <div
                                key={idx}
                                onClick={(e) => toggleTradition(e, tickKey)}
                                className="flex items-start gap-2 text-xs cursor-pointer p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                {isTicked ? (
                                  <CheckSquare className="w-4 h-4 text-[#3E9B47] shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                                )}
                                <span className={isTicked ? "line-through text-white/50" : "text-white"}>
                                  {tradition}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Back footer tap notice */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-white/60">
                      <RotateCw className="w-3 h-3" />
                      <span>Tap to flip back</span>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/** A card Soubh hasn't shown yet: shut, teasing its month, and a way to buy. */
function SealedCard({
  card,
  onBuy,
}: {
  card: FestivalCard;
  onBuy: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onBuy}
      aria-label={`${card.festivalNameEn} card is sealed — pre-order to see it`}
      className="w-[260px] sm:w-[280px] h-[400px] shrink-0 snap-center cursor-pointer press lift relative rounded-3xl overflow-hidden border-2 border-[#1B1B1B] bg-[#8A1717] text-[#F6EFE2] flex flex-col items-center justify-center gap-3 px-6 text-center"
      style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
    >
      {/* The closed page edge, so the card reads as a shut book */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-3 bg-[#1B1B1B]/35 border-r-2 border-[#1B1B1B]"
      />

      <span className="font-disko text-xs tracking-widest text-[#E0A526]">
        {card.monthEn}
      </span>
      <span className="font-odia text-2xl leading-tight">{card.festivalNameOr}</span>
      <span className="font-disko text-xl">{card.festivalNameEn}</span>

      <span className="w-12 h-12 rounded-full bg-[#E0A526] text-[#1B1B1B] border-2 border-[#1B1B1B] flex items-center justify-center mt-1">
        <Lock className="w-5 h-5" />
      </span>

      <span className="text-sm text-[#F6EFE2]/85 leading-snug">
        This one stays shut until it&apos;s in your hands.
      </span>
      <span className="text-sm font-semibold underline underline-offset-4 decoration-2">
        Pre-order to see it
      </span>
    </button>
  );
}
