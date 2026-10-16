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
  Pin,
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

export function BuyerStories() {
  const [activeHighlightId, setActiveHighlightId] = useState<string>("hl-all");
  const [viewer, setViewer] = useState<{ stories: StoryItem[]; index: number } | null>(null);
  // Ring on the active bubble, driven straight from the phone's rAF loop —
  // per-frame React state here cascaded into "maximum update depth".
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isPaused = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const hasDragged = useRef(false);
  const touchTimeout = useRef<NodeJS.Timeout | null>(null);

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
    let accumulatedScroll = el.scrollLeft;
    const SPEED_PX_PER_SEC = 38; // Gentle, elegant reading pace

    // Sync accumulated scroll when user scrolls manually (drag, touch, or chevrons)
    const onManualScroll = () => {
      if (isPaused.current || isDragging.current) {
        accumulatedScroll = el.scrollLeft;
      }
    };
    el.addEventListener("scroll", onManualScroll, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Only scroll when visible, not hovered, not actively dragging, and story modal is not open
      if (isVisible && !isPaused.current && !isDragging.current && !viewer) {
        accumulatedScroll += SPEED_PX_PER_SEC * dt;
        if (accumulatedScroll >= el.scrollWidth - el.clientWidth - 4) {
          accumulatedScroll = 0;
        }
        el.scrollLeft = accumulatedScroll;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      el.removeEventListener("scroll", onManualScroll);
    };
  }, [viewer, activeStories]);

  // Smooth scroll left/right on chevron click
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    isPaused.current = true;
    const scrollAmount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    if (touchTimeout.current) clearTimeout(touchTimeout.current);
    touchTimeout.current = setTimeout(() => {
      isPaused.current = false;
    }, 2000);
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

  const handleTouchStart = () => {
    isPaused.current = true;
    if (touchTimeout.current) clearTimeout(touchTimeout.current);
    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = "x mandatory";
    }
  };

  const handleTouchEnd = () => {
    if (touchTimeout.current) clearTimeout(touchTimeout.current);
    touchTimeout.current = setTimeout(() => {
      isPaused.current = false;
      if (scrollRef.current) {
        scrollRef.current.style.scrollSnapType = "none";
      }
    }, 1800);
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
      className="relative pt-20 sm:pt-28 pb-14 sm:pb-20 bg-[#F6EFE2] text-[#1B1B1B] z-10 scroll-mt-28 overflow-x-clip"
    >
      {/* 1. Folk Background Pattern Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "200px",
        }}
      />


      {/* 3. Subtle Odia Jhoti Mandala Accent in Background */}
      <div
        className="absolute top-1/2 -right-24 sm:-right-36 w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] -translate-y-1/2 pointer-events-none select-none opacity-10 mix-blend-multiply z-0 animate-pulse-glow"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/odia-jhoti-mandala.svg"
          alt=""
          fill
          sizes="(max-width: 640px) 176px, 288px"
          className="object-contain"
        />
      </div>

      {/* 4. Main Section Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header + pinned callouts: two-column on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10 mb-5 sm:mb-6">

        {/* Header Block */}
        <div className="reveal max-w-3xl lg:flex-1">
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
          <p className="mt-3 text-base sm:text-lg text-[#1B1B1B]/80 font-subtext italic font-medium">
            Real screenshots from <strong className="font-bold text-[#8A1717] not-italic">45 buyers</strong> across Bhubaneswar, Cuttack, Bengaluru, Hyderabad, Delhi, London, and the USA. Tap any highlight or card to preview the full unboxing stories.
          </p>
        </div>

        {/* Pinned Callout Cards Row: Placed Left & Right, using horizontal empty space, NOT stacked */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 lg:gap-5 w-full lg:w-auto lg:shrink-0 lg:pt-10">
          {/* Card 1 on the LEFT: Yellow sticky note, pinned with up-down motion */}
          <div className="relative animate-pin-left shrink-0 max-w-[48%] sm:max-w-[280px]">
            <div
              className="absolute -top-2.5 -left-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#8A1717] border-2 border-[#1B1B1B] shadow-[1.5px_1.5px_0_0_#1B1B1B] flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <Pin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE066] fill-[#FFE066]" />
            </div>
            <div className="-rotate-1 sm:-rotate-2 hover:rotate-0 transition-transform duration-300 bg-[#FFE066] text-[#1B1B1B] px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-[3px_3px_0_0_#1B1B1B] sm:shadow-[4px_4px_0_0_#1B1B1B] border-2 border-[#1B1B1B] text-[11px] sm:text-xs font-serif leading-tight sm:leading-snug select-none">
              <div className="flex items-center gap-1.5 font-bold mb-0.5 sm:mb-1 text-[#8A1717]">
                <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="font-sans font-bold text-xs sm:text-sm">Got your box?</span>
              </div>
              <p className="line-clamp-3 sm:line-clamp-none">
                Tag <span className="font-bold underline decoration-[#8A1717]">@iamsoubh</span> in your story or reel to be featured in the 2027 hall of fame!
              </p>
            </div>
          </div>

          {/* Card 2 on the RIGHT: @iamsoubh profile card, pinned with up-down motion */}
          <div className="relative animate-pin-right shrink-0 max-w-[48%] sm:max-w-[250px]">
            <div
              className="absolute -top-2.5 -left-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#8A1717] border-2 border-[#1B1B1B] shadow-[1.5px_1.5px_0_0_#1B1B1B] flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <Pin className="w-3.5 h-3.5 text-[#FFE066] fill-[#FFE066]" />
            </div>
            <a
              href="https://www.instagram.com/iamsoubh/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open @iamsoubh on Instagram"
              className="rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-300 block select-none"
            >
              <div className="bg-[#FFFDF7] text-[#1B1B1B] rounded-xl border-2 border-[#1B1B1B] shadow-[3px_3px_0_0_#1B1B1B] sm:shadow-[4px_4px_0_0_#1B1B1B] px-2.5 py-2 sm:px-3.5 sm:py-2.5 flex items-center gap-2 sm:gap-2.5 hover:shadow-[5px_5px_0_0_#8A1717] transition-all">
                <Image
                  src="/assets/brand/soubh-avatar.png"
                  alt="Soubh"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#1B1B1B] object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1 font-bold text-xs sm:text-sm leading-tight">
                    <span className="truncate">iamsoubh</span>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#1D9BF0] shrink-0" aria-hidden="true">
                      <path d="M12 1.5l2.4 2.1 3.2-.3.9 3.1 2.8 1.6-1.2 3 1.2 3-2.8 1.6-.9 3.1-3.2-.3L12 22.5l-2.4-2.1-3.2.3-.9-3.1L2.7 16l1.2-3-1.2-3 2.8-1.6.9-3.1 3.2.3L12 1.5zm-1.1 13.6l5.2-5.2-1.4-1.4-3.8 3.8-1.8-1.8-1.4 1.4 3.2 3.2z" />
                    </svg>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-[#1B1B1B]/70 leading-tight whitespace-nowrap">
                    10K followers
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        </div>

        {/* 6. Carousel Controls & Filter Tabs Bar */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-[#1B1B1B]/10 w-full min-w-0">
          
          {/* Quick Filter Pill Chips: Desktop and tablet */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar py-1 min-w-0 scroll-pl-4 sm:scroll-pl-6">
            {STORY_HIGHLIGHTS.map((hl) => {
              const isSelected = activeHighlightId === hl.id;
              return (
                <button
                  key={hl.id}
                  onClick={() => handleSelectHighlight(hl.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-[#1B1B1B] text-white shadow-md border border-[#1B1B1B]"
                      : "bg-[#FFFDF7] text-[#1B1B1B]/80 hover:text-[#1B1B1B] border border-[#1B1B1B]/20 hover:border-[#1B1B1B]/50"
                  }`}
                >
                  {hl.name} ({hl.stories.length})
                </button>
              );
            })}
          </div>

          {/* Action & Navigation Chevrons: Perfectly aligned on mobile and desktop */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
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

        {/* 7. Smooth Scrolling Stories Carousel Track — full-bleed rail aligned to container */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseEnter={() => {
              isPaused.current = true;
            }}
            onMouseLeave={() => {
              isPaused.current = false;
              handleMouseUp();
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="reveal-stagger flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-8 sm:pb-6 pt-2 px-4 sm:px-6 lg:px-8 cursor-grab active:cursor-grabbing select-none scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 [mask-image:linear-gradient(to_right,transparent_0,black_8px,black_calc(100%-8px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_8px,black_calc(100%-8px),transparent_100%)]"
          >
            {activeStories.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => handleCardClick(idx)}
                className="relative w-[76vw] sm:w-[280px] md:w-[310px] max-w-[320px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1B1B1B] border-2 border-[#1B1B1B] shadow-[5px_5px_0_0_#1B1B1B] hover:shadow-[8px_8px_0_0_#8A1717] hover:-translate-y-2 transition-all duration-300 cursor-pointer group shrink-0 snap-start"
              >
                {/* Phone Speaker Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-black/60 rounded-full z-20 pointer-events-none" />

                {/* Review Screenshot Image */}
                <Image
                  src={story.image}
                  alt={story.quote || `Story from ${story.handle}`}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 280px, 310px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={idx < 4}
                />

                {/* Top Vignette Gradient */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

                {/* Bottom Vignette Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

                {/* Top Story Header Bar */}
                <div className="absolute top-4 left-3 right-3 flex items-center justify-between text-white text-xs z-15 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-[#E0A526] text-[#1B1B1B] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#1B1B1B]">
                      {story.city.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs truncate max-w-[110px] sm:max-w-[130px]">
                          {story.handle}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-[#E0A526] shrink-0 fill-[#E0A526]/20" />
                      </div>
                      <span className="text-[10px] text-white/70 block leading-none truncate">
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
            <div className="w-2 sm:w-4 shrink-0" aria-hidden="true" />
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
