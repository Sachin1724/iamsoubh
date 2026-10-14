"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Eye,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}
import { StoryItem } from "@/data/testimonials";
import {
  CUSTOMER_REVIEWS,
  STORY_HIGHLIGHTS,
  StoryHighlight,
} from "@/data/customer-reviews";
import { StoryViewer } from "./StoryViewer";
import { StoryPhone } from "./StoryPhone";

export function BuyerStories() {
  const [activeHighlightId, setActiveHighlightId] = useState<string>("hl-all");
  const [viewer, setViewer] = useState<{ stories: StoryItem[]; index: number } | null>(null);
  // Ring on the active bubble, driven straight from the phone's rAF loop —
  // per-frame React state here cascaded into "maximum update depth".
  const ringRef = useRef<SVGCircleElement>(null);
  const RING_LEN = 2 * Math.PI * 48;
  const setRing = React.useCallback(
    (fraction: number) => {
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(RING_LEN * (1 - fraction));
      }
    },
    [RING_LEN]
  );
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isPaused = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const hasDragged = useRef(false);

  // Active highlight object
  const activeHighlight =
    STORY_HIGHLIGHTS.find((h) => h.id === activeHighlightId) ||
    STORY_HIGHLIGHTS[0];

  // Stories to display in carousel
  const activeStories =
    activeHighlightId === "hl-all"
      ? CUSTOMER_REVIEWS
      : activeHighlight.stories;

  // Check scroll positions for chevron visibility/styling
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [activeStories]);

  // Continuous horizontal auto-scroll (paused when off-screen to save CPU/battery)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);

    let rafId = 0;
    let lastTime = performance.now();
    const SPEED_PX_PER_SEC = 38; // Gentle, elegant reading pace

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Only scroll when visible, not hovered, not actively dragging, and story modal is not open
      if (isVisible && !isPaused.current && !isDragging.current && !viewer) {
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += SPEED_PX_PER_SEC * dt;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [viewer, activeStories]);

  // Smooth scroll left/right on chevron click
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -360 : 360;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Switch highlight and reset scroll
  const handleSelectHighlight = (hlId: string) => {
    setActiveHighlightId(hlId);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  // Directly open full-screen story preview for a highlight
  const handleOpenHighlightStories = (highlight: StoryHighlight) => {
    setViewer({
      stories: highlight.stories,
      index: 0,
    });
  };

  // Mouse drag handlers for buttery desktop horizontal swiping
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    isPaused.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftPos.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4;
    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    isPaused.current = false;
  };

  const handleCardClick = (index: number) => {
    if (hasDragged.current) return;
    setViewer({
      stories: activeStories,
      index,
    });
  };

  return (
    <section
      id="stories"
      className="relative pt-20 sm:pt-28 pb-14 sm:pb-20 bg-[#F6EFE2] text-[#1B1B1B] z-10 scroll-mt-24 overflow-x-clip"
    >
      {/* 1. Folk Background Pattern Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "200px",
        }}
      />

      {/* 2. 2nd Tropical Hibiscus & Palm Accent - Moved to the opposite (right) edge over the seam */}
      <div
        className="absolute -top-[95px] sm:-top-[115px] md:-top-[135px] -right-2 sm:-right-4 md:-right-6 w-[140px] sm:w-[170px] md:w-[200px] h-[160px] sm:h-[190px] md:h-[220px] pointer-events-none select-none z-40 animate-sway-soft-right"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/foliage-right-cluster.webp"
          alt=""
          fill
          className="object-contain object-right-top drop-shadow-[0_8px_18px_rgba(27,27,27,0.22)]"
        />
      </div>

      {/* 3. Subtle Odia Jhoti Mandala Accent in Background */}
      <div
        className="absolute top-1/2 -right-24 sm:-right-36 w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] -translate-y-1/2 pointer-events-none select-none opacity-10 mix-blend-multiply z-0 animate-pulse-glow"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/odia-jhoti-mandala.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* 4. Main Section Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8">

        {/* Header Block & Sticky Note */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-5 sm:mb-6">
          <div className="max-w-3xl">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-gazpacho text-[#8A1717] font-bold text-xl sm:text-2xl">
                04
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A1717]">
                CUSTOMER STORIES & REVIEWS
              </span>
            </div>

            <h2 className="font-gazpacho text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-[#1B1B1B]">
              2,000+ of you put it on your story.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#1B1B1B]/80 font-medium">
              Real screenshots from 45 buyers across Bhubaneswar, Cuttack, Bengaluru, Hyderabad, Delhi, London, and the USA. Tap any highlight or card to preview the full unboxing stories.
            </p>
          </div>

          {/* Yellow Sticky Note Callout */}
          <div className="self-start lg:self-auto rotate-2 hover:rotate-0 transition-transform duration-300 select-none shrink-0">
            <div className="bg-[#FFE066] text-[#1B1B1B] px-4 py-3 rounded-xl shadow-[4px_4px_0_0_#1B1B1B] border-2 border-[#1B1B1B] max-w-[240px] text-xs font-serif leading-snug">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-[#8A1717]">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Got your box?</span>
              </div>
              Tag <span className="font-bold underline decoration-[#8A1717]">@iamsoubh</span> in your story or reel to be featured in the 2027 hall of fame!
            </div>
          </div>
        </div>

        {/* 5. Instagram Highlights Row */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A1717]">
                Instagram Highlights
              </span>
              <span className="text-xs bg-[#E0A526]/30 text-[#8A1717] font-bold px-2 py-0.5 rounded-full border border-[#8A1717]/20">
                45 Stories
              </span>
            </div>
            <p className="text-xs text-[#1B1B1B]/60 hidden sm:block">
              Click bubble to filter · Tap play to watch story
            </p>
          </div>

          {/* Highlights Circles Horizontal Track */}
          <div className="overflow-x-auto no-scrollbar pb-3 pt-1">
            <div className="flex items-center gap-4 sm:gap-6 min-w-max">
              {STORY_HIGHLIGHTS.map((hl) => {
                const isSelected = activeHighlightId === hl.id;
                return (
                  <div
                    key={hl.id}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={() => handleSelectHighlight(hl.id)}
                  >
                    {/* Circle Avatar with Instagram Story Ring */}
                    <div
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] transition-all duration-300 group-hover:scale-105 shadow-md ${
                        isSelected
                          ? "bg-gradient-to-tr from-[#8A1717] via-[#E0A526] to-[#C8221A] ring-4 ring-[#E0A526]/50 scale-105"
                          : "bg-gradient-to-tr from-[#8A1717]/80 via-[#E0A526]/70 to-[#C8221A]/80 opacity-85 group-hover:opacity-100"
                      }`}
                    >
                      {/* Inner border spacing */}
                      <div className="w-full h-full rounded-full bg-[#FFFDF7] p-[2px] overflow-hidden">
                        <div className="w-full h-full rounded-full relative overflow-hidden bg-[#2A2522]">
                          <Image
                            src={hl.cover}
                            alt={hl.name}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                      </div>

                      {/* Progress ring, synced to the phone */}
                      {isSelected && (
                        <svg className="absolute inset-0 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke="#FFFDF7"
                            strokeWidth="4"
                            strokeLinecap="round"
                            ref={ringRef}
                            strokeDasharray={RING_LEN}
                          />
                        </svg>
                      )}

                      {/* Mini Play Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenHighlightStories(hl);
                        }}
                        title={`Watch ${hl.name} stories`}
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#8A1717] text-white border-2 border-[#FFFDF7] flex items-center justify-center shadow-md hover:bg-[#E0A526] hover:text-[#1B1B1B] hover:scale-110 transition-all cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                      </button>
                    </div>

                    {/* Highlight Title & Subtitle */}
                    <div className="text-center">
                      <span
                        className={`block text-xs sm:text-sm font-bold leading-tight transition-colors ${
                          isSelected ? "text-[#8A1717]" : "text-[#1B1B1B]"
                        }`}
                      >
                        {hl.name}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#8A1717]/80">
                        {hl.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        </div>

        {/* Live phone: plays the highlight you picked */}
        <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 mb-8 lg:mb-0">
          <StoryPhone key={activeHighlightId} stories={activeStories} onProgress={setRing} />
          <p className="mt-4 text-center text-xs font-semibold text-[#1B1B1B]/60">
            Playing <span className="text-[#8A1717]">{activeHighlight.name}</span> · tap the phone to skip, hold to pause
          </p>
        </div>
        </div>

        {/* 6. Carousel Controls & Filter Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-[#1B1B1B]/10">
          
          {/* Quick Filter Pill Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {STORY_HIGHLIGHTS.map((hl) => {
              const isSelected = activeHighlightId === hl.id;
              return (
                <button
                  key={hl.id}
                  onClick={() => handleSelectHighlight(hl.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#1B382B] text-white shadow-md border border-[#1B382B]"
                      : "bg-[#FFFDF7] text-[#1B1B1B]/80 hover:text-[#1B1B1B] border border-[#1B1B1B]/20 hover:border-[#1B1B1B]/50"
                  }`}
                >
                  {hl.name} ({hl.stories.length})
                </button>
              );
            })}
          </div>

          {/* Action & Navigation Chevrons */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Watch Highlight Button */}
            <button
              onClick={() => handleOpenHighlightStories(activeHighlight)}
              className="px-3.5 py-1.5 rounded-full bg-[#E0A526] text-[#1B1B1B] border-2 border-[#1B1B1B] font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0_#1B1B1B] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Watch {activeHighlight.name} ({activeStories.length})</span>
            </button>

            {/* Left / Right Chevron Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`w-9 h-9 rounded-full border-2 border-[#1B1B1B] flex items-center justify-center transition-all cursor-pointer ${
                  canScrollLeft
                    ? "bg-[#FFFDF7] text-[#1B1B1B] shadow-[2px_2px_0_#1B1B1B] hover:bg-[#E0A526] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                    : "bg-[#EAE1D0] text-[#1B1B1B]/30 border-[#1B1B1B]/30 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`w-9 h-9 rounded-full border-2 border-[#1B1B1B] flex items-center justify-center transition-all cursor-pointer ${
                  canScrollRight
                    ? "bg-[#FFFDF7] text-[#1B1B1B] shadow-[2px_2px_0_#1B1B1B] hover:bg-[#E0A526] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                    : "bg-[#EAE1D0] text-[#1B1B1B]/30 border-[#1B1B1B]/30 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* 7. Smooth Scrolling Stories Carousel Track — full-bleed, runs past both page edges */}
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen max-w-[100vw]">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseEnter={() => {
              isPaused.current = true;
            }}
            onTouchStart={() => {
              isPaused.current = true;
            }}
            onTouchEnd={() => {
              isPaused.current = false;
            }}
            style={{
              // First card lines up with the container; the rail still bleeds off both edges.
              paddingInline: "max(1rem, calc((100vw - 80rem) / 2 + 2rem))",
            }}
            className="reveal-stagger flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 cursor-grab active:cursor-grabbing select-none"
          >
            {activeStories.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => handleCardClick(idx)}
                className="relative w-[240px] sm:w-[280px] md:w-[310px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1B1B1B] border-2 border-[#1B1B1B] shadow-[5px_5px_0_0_#1B1B1B] hover:shadow-[8px_8px_0_0_#8A1717] hover:-translate-y-2 transition-all duration-300 cursor-pointer group shrink-0 snap-start"
              >
                {/* Phone Speaker Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-black/60 rounded-full z-20 pointer-events-none" />

                {/* Review Screenshot Image */}
                <Image
                  src={story.image}
                  alt={story.quote || `Story from ${story.handle}`}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 310px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={idx < 4}
                />

                {/* Top Vignette Gradient */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

                {/* Bottom Vignette Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

                {/* Top Story Header Bar */}
                <div className="absolute top-4 left-3 right-3 flex items-center justify-between text-white text-xs z-15">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#E0A526] text-[#1B1B1B] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#1B1B1B]">
                      {story.city.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs truncate max-w-[120px]">
                          {story.handle}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-[#E0A526] shrink-0 fill-[#E0A526]/20" />
                      </div>
                      <span className="text-[10px] text-white/70 block leading-none">
                        {story.city}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-semibold shrink-0">
                    {idx + 1}/{activeStories.length}
                  </span>
                </div>

                {/* Hover Click-to-Preview Pill */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/20 backdrop-blur-[2px]">
                  <div className="bg-[#E0A526] text-[#1B1B1B] font-bold text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-[#1B1B1B] shadow-[3px_3px_0_#1B1B1B] flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                    <Eye className="w-4 h-4" />
                    <span>Click to Preview Story</span>
                  </div>
                </div>

                {/* Bottom Review Quote Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white z-15">
                  <p className="text-xs sm:text-[13px] font-medium leading-snug line-clamp-2 text-white/95 drop-shadow-md mb-2 italic">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#E0A526] font-semibold border-t border-white/15 pt-1.5">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E0A526]" />
                      <span>{story.city}, {story.stateOrCountry}</span>
                    </div>
                    <span className="text-white/80">Tap to expand</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtitle / Interaction Guide */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#1B1B1B]/70 px-1">
            <p className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8A1717]" />
              <span>
                Showing <strong className="text-[#1B1B1B]">{activeStories.length} verified buyer stories</strong>. Drag sideways or use arrows to scroll. Click any card to open the interactive story player.
              </span>
            </p>
            <span className="font-semibold text-[#8A1717] mt-1 sm:mt-0">
              100% Real Odia Buyer Stories
            </span>
          </div>
        </div>

      </div>

      {/* Full-Screen Instagram Story Viewer Modal */}
      {viewer && (
        <StoryViewer
          stories={viewer.stories}
          startIndex={viewer.index}
          onClose={() => setViewer(null)}
          onViewed={() => {}}
        />
      )}
    </section>
  );
}
