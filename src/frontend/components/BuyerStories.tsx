"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Eye,
  CheckCircle2,
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
import { StoryItem } from "@/frontend/data/testimonials";
import {
  CUSTOMER_REVIEWS,
  STORY_HIGHLIGHTS,
  StoryHighlight,
} from "@/frontend/data/customer-reviews";
import { StoryViewer } from "./StoryViewer";

/** `embedded`: shown inside the pinned section 2 as its first scene, as a panel (no section of its own). */
export function BuyerStories({ embedded = false }: { embedded?: boolean }) {
  // Embedded, the scene sits on the dark collage, so its text is white; standalone it is the page ink.
  const ink = embedded ? "text-white" : "text-on-light";
  const inkSoft = embedded ? "text-white/85" : "text-on-light/80";
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
      id={embedded ? undefined : "stories"}
      className={
        embedded
          ? "relative z-10 flex h-full min-h-0 flex-col text-white"
          : "relative pt-24 sm:pt-36 pb-20 sm:pb-32 bg-pipili-cream text-on-light z-10 scroll-mt-28 overflow-clip"
      }
    >


      {!embedded && (
      <>
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

      {/* Spinning mandala in two corners only */}
      <div className="absolute top-0 left-0 w-[240px] sm:w-[340px] aspect-square -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <div
          className="w-full h-full opacity-40 bg-brand animate-spin-slow"
          style={{
            maskImage: "url('/assets/motifs/mandala-laser-1200.png')",
            WebkitMaskImage: "url('/assets/motifs/mandala-laser-1200.png')",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />
      </div>

      <div className="absolute bottom-0 right-0 w-[240px] sm:w-[340px] aspect-square translate-x-1/2 translate-y-1/2 pointer-events-none select-none z-0">
        <div
          className="w-full h-full opacity-40 bg-brand animate-spin-slow"
          style={{
            animationDelay: "4s",
            maskImage: "url('/assets/motifs/mandala-laser-1200.png')",
            WebkitMaskImage: "url('/assets/motifs/mandala-laser-1200.png')",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />
      </div>

      </>
      )}

      {/* 4. Main Section Container */}
      <div className={`${embedded ? "flex min-h-0 w-full flex-1 flex-col" : ""} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20`}>
        
        {/* Header + pinned callouts: two-column on desktop */}
        <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10 ${embedded ? "mb-2 shrink-0" : "mb-5 sm:mb-6"}`}>

        {/* Header Block */}
        <div className="reveal max-w-3xl lg:flex-1">
          <div className="flex items-baseline gap-3 mb-2">
            <span className={`font-gazpacho ${ink} font-bold text-xl sm:text-2xl`}>
              04
            </span>
            <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${embedded ? "text-turmeric" : "text-on-light"}`}>
              Stories
            </span>
          </div>

          <h2 className={`font-gazpacho font-bold leading-[1.08] ${ink} ${embedded ? "text-2xl sm:text-4xl" : "text-3xl sm:text-5xl lg:text-6xl"}`}>
            Last year, 2,000+ people loved it.
          </h2>
          <p className={`${inkSoft} font-subtext font-normal leading-relaxed ${embedded ? "mt-1 text-sm sm:text-base" : "mt-3 text-base sm:text-lg"}`}>
            See what they said. Tap any card to watch the full story.
          </p>
        </div>

        {/* Pinned Callout Cards Row: Placed Left & Right, using horizontal empty space, NOT stacked */}
        <div className={`${embedded ? "hidden" : "flex"} flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 lg:gap-5 w-full lg:w-auto lg:shrink-0 lg:pt-10`}>
          {/* Card 1 on the LEFT: Yellow sticky note, pinned with up-down motion */}
          <div className="relative animate-pin-left shrink-0 max-w-[48%] sm:max-w-[280px]">
            <div
              className="absolute -top-2.5 -left-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <Pin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold fill-gold" />
            </div>
            <div className="-rotate-1 sm:-rotate-2 hover:rotate-0 transition-transform duration-300 bg-gold text-ink px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] text-xs sm:text-sm font-editorial leading-tight sm:leading-snug select-none">
              <div className="flex items-center gap-1.5 font-bold mb-0.5 sm:mb-1 text-brand">
                <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="font-sans font-bold text-xs sm:text-sm">Got your box?</span>
              </div>
              <p className="line-clamp-3 sm:line-clamp-none">
                Tag <span className="font-bold underline decoration-brand">@iamsoubh</span> in your story or reel to be featured in the 2027 hall of fame!
              </p>
            </div>
          </div>

          {/* Card 2 on the RIGHT: @iamsoubh profile card, pinned with up-down motion */}
          <div className="relative animate-pin-right shrink-0 max-w-[48%] sm:max-w-[250px]">
            <div
              className="absolute -top-2.5 -left-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <Pin className="w-3.5 h-3.5 text-gold fill-gold" />
            </div>
            <a
              href="https://www.instagram.com/iamsoubh/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open @iamsoubh on Instagram"
              className="rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-300 block select-none"
            >
              <div className="bg-cream text-ink rounded-xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] px-2.5 py-2 sm:px-3.5 sm:py-2.5 flex items-center gap-2 sm:gap-2.5 transition-all">
                <Image
                  src="/assets/brand/soubh-avatar.png"
                  alt="Soubh"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1 font-bold text-xs sm:text-sm leading-tight">
                    <span className="truncate">iamsoubh</span>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#1D9BF0] shrink-0" aria-hidden="true">
                      <path d="M12 1.5l2.4 2.1 3.2-.3.9 3.1 2.8 1.6-1.2 3 1.2 3-2.8 1.6-.9 3.1-3.2-.3L12 22.5l-2.4-2.1-3.2.3-.9-3.1L2.7 16l1.2-3-1.2-3 2.8-1.6.9-3.1 3.2.3L12 1.5zm-1.1 13.6l5.2-5.2-1.4-1.4-3.8 3.8-1.8-1.8-1.4 1.4 3.2 3.2z" />
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-ink/70 leading-tight whitespace-nowrap">
                    10K followers
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        </div>

        {/* 6. Carousel Controls & Filter Tabs Bar */}
        <div className={`flex items-center justify-end gap-4 w-full min-w-0 ${embedded ? "mb-2 shrink-0" : "mb-4 pb-2"}`}>
          
          {/* Action & Navigation Chevrons: Perfectly aligned on mobile and desktop */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
            {/* Watch Highlight Button */}
            <button
              onClick={() => handleOpenHighlightStories(activeHighlight)}
              className="px-3.5 py-1.5 rounded-full bg-turmeric text-ink border-2 border-ink font-bold text-xs flex items-center gap-1.5  hover:shadow-none transition-all cursor-pointer"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Watch</span>
            </button>

            {/* Left / Right Chevron Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`w-9 h-9 rounded-full border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center justify-center transition-all cursor-pointer ${
                  canScrollLeft
                    ? "bg-cream text-ink hover:bg-turmeric  hover:shadow-none"
                    : "bg-[#EAE1D0] text-ink/30 border-ink/30 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`w-9 h-9 rounded-full border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center justify-center transition-all cursor-pointer ${
                  canScrollRight
                    ? "bg-cream text-ink hover:bg-turmeric  hover:shadow-none"
                    : "bg-[#EAE1D0] text-ink/30 border-ink/30 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* 7. Smooth Scrolling Stories Carousel Track — full-bleed rail aligned to container */}
        <div className={`relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden ${embedded ? "min-h-0 flex-1" : ""}`}>
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
            className={`${embedded ? "h-full " : ""}reveal-stagger flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3 sm:pb-4 pt-2 px-4 sm:px-6 lg:px-8 cursor-grab active:cursor-grabbing select-none scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 [mask-image:linear-gradient(to_right,transparent_0,black_8px,black_calc(100%-8px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_8px,black_calc(100%-8px),transparent_100%)]`}
          >
            {activeStories.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => handleCardClick(idx)}
                className={`relative ${embedded ? "h-full" : "w-[76vw] sm:w-[280px] md:w-[310px] max-w-[320px]"} shrink-0 aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-ink border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group shrink-0 snap-start`}
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
                />

                {/* Top Vignette Gradient */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

                {/* Bottom Vignette Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

                {/* Top Story Header Bar */}
                <div className="absolute top-4 left-3 right-3 flex items-center justify-between text-white text-xs z-15 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs truncate max-w-[150px] sm:max-w-[170px]">
                          {story.handle}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-turmeric shrink-0 fill-turmeric/20" />
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-md">
                    {idx + 1}/{activeStories.length}
                  </span>
                </div>

                {/* Hover Click-to-Preview Pill */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/20 backdrop-blur-[2px]">
                  <div className="bg-turmeric text-ink font-bold text-xs sm:text-sm px-4 py-2 rounded-full border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                    <Eye className="w-4 h-4" />
                    <span>Click to Preview Story</span>
                  </div>
                </div>

                {/* Bottom Review Quote Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white z-15">
                  <div className="flex items-center justify-end pt-1.5 text-xs font-semibold">
                    <span className="text-white/80">Tap to expand</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-2 sm:w-4 shrink-0" aria-hidden="true" />
          </div>

          {/* Subtitle / Interaction Guide */}
          <div className={`${embedded ? "hidden" : "flex"} mt-2 flex-col sm:flex-row sm:items-center justify-between text-xs text-ink/70 px-1`}>
            <p className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>
                Showing <strong className="text-ink">{activeStories.length} verified buyer stories</strong>. Drag sideways or use arrows to scroll. Click any card to open the interactive story player.
              </span>
            </p>
            <span className="font-semibold text-brand mt-1 sm:mt-0">
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
