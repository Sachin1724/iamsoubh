"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, InertiaPlugin);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface HeroCardItem {
  src: string;
  alt: string;
  name: string;
  odia: string;
  month: string;
}

export const HERO_CARDS_DATA: HeroCardItem[] = [
  {
    src: "/assets/manabasa-card.png",
    alt: "Manabasa Gurubara card",
    name: "Manabasa Gurubara",
    odia: "ମାଣବସା ଗୁରୁବାର",
    month: "Margashira",
  },
  {
    src: "/assets/raja-card.png",
    alt: "Raja Parba card",
    name: "Raja Parba",
    odia: "ରଜ ପରବ",
    month: "Asadha",
  },
  {
    src: "/assets/rath-yatra-card.png",
    alt: "Rath Yatra card",
    name: "Rath Yatra",
    odia: "ରଥ ଯାତ୍ରା",
    month: "Shravana",
  },
  {
    src: "/assets/nuakhai-card.png",
    alt: "Nuakhai card",
    name: "Nuakhai",
    odia: "ନୂଆଖାଇ",
    month: "Bhadrav",
  },
  {
    src: "/assets/boita-bandana-card.png",
    alt: "Boita Bandana card",
    name: "Boita Bandana",
    odia: "ବୋଇତ ବନ୍ଦାଣ",
    month: "Kartika",
  },
  {
    src: "/assets/pana-sankranti-card.png",
    alt: "Pana Sankranti card",
    name: "Pana Sankranti",
    odia: "ପଣା ସଂକ୍ରାନ୍ତି",
    month: "Baisakha",
  },
];

const TOTAL_CARDS = HERO_CARDS_DATA.length;

function getCircularDiff(cardIndex: number, progress: number): number {
  let diff = (cardIndex - progress) % TOTAL_CARDS;
  while (diff > TOTAL_CARDS / 2) diff -= TOTAL_CARDS;
  while (diff < -TOTAL_CARDS / 2) diff += TOTAL_CARDS;
  return diff;
}

interface HeroCardsCarouselProps {
  onOrderClick?: () => void;
}

export function HeroCardsCarousel({ onOrderClick }: HeroCardsCarouselProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dragProxyRef = useRef<HTMLDivElement>(null);

  // Active festival index (0 to 5)
  const [activeIndex, setActiveIndex] = useState(2); // Start centered on Rath Yatra
  const [isHovered, setIsHovered] = useState(false);

  // Animation and progress tracking refs
  const progressRef = useRef(2); // Initial progress = 2 (Rath Yatra)
  const proxyProgressRef = useRef({ progress: 2 });
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dotFillRef = useRef<HTMLSpanElement | null>(null);

  // Calculate responsive horizontal step between cards
  const getStepWidth = useCallback(() => {
    if (typeof window === "undefined") return 190;
    const width = window.innerWidth;
    if (width < 640) return 150;
    if (width < 768) return 175;
    if (width < 1024) return 205;
    return 225;
  }, []);

  // Update card positions, scale, opacity, 3D angle, and z-index based on progress
  const updateCards = useCallback(
    (currentProgress: number) => {
      const stepWidth = getStepWidth();

      HERO_CARDS_DATA.forEach((_, i) => {
        const cardEl = cardsRef.current[i];
        if (!cardEl) return;

        const diff = getCircularDiff(i, currentProgress);
        const absDiff = Math.abs(diff);

        // Continuous horizontal offset in pixels relative to center
        const x = diff * stepWidth;

        // Real depth. The track is transform-style: preserve-3d, so painting
        // order comes from computed 3D depth and zIndex is inert -- without a
        // translateZ every card sits at z=0 and DOM order decides who covers
        // whom, which puts side cards on top of the centre one.
        const z = -absDiff * 140;

        // Perspective already shrinks the receding cards, so scale only trims
        // what is left.
        const scale = Math.max(0.82, 1.02 - absDiff * 0.06);
        const y = -6 + absDiff * 12;

        // 3D perspective angle
        const rotateY = diff * -12;

        // Opacity + optical recede, so side cards sink into the backdrop art
        const opacity = absDiff >= 2.2 ? 0 : Math.max(0, 1 - Math.pow(absDiff / 2.2, 1.4));
        // Stacking order: center is highest
        const zIndex = Math.round(50 - absDiff * 12);

        gsap.set(cardEl, {
          x,
          y,
          z,
          scale,
          rotateY,
          opacity,
          zIndex,
        });
      });

      // Update active festival index
      const normalized = ((Math.round(currentProgress) % TOTAL_CARDS) + TOTAL_CARDS) % TOTAL_CARDS;
      setActiveIndex((prev) => (prev !== normalized ? normalized : prev));
    },
    [getStepWidth]
  );

  // Smooth cubic spring transition to target progress. Duration grows with the
  // distance travelled, so a 3-card dot jump does not finish as fast as a
  // 1-card arrow step.
  const animateToProgress = useCallback(
    (targetProgress: number, duration?: number) => {
      const distance = Math.abs(targetProgress - progressRef.current);
      const resolved = duration ?? Math.min(1.15, 0.45 + distance * 0.16);

      gsap.to(proxyProgressRef.current, {
        progress: targetProgress,
        duration: prefersReducedMotion() ? 0 : resolved,
        ease: "power3.out",
        overwrite: true,
        onUpdate() {
          progressRef.current = proxyProgressRef.current.progress;
          updateCards(progressRef.current);
        },
      });
    },
    [updateCards]
  );

  // Initialize Draggable and position cards on mount
  useEffect(() => {
    if (!stageRef.current || !dragProxyRef.current) return;

    // Initial positioning
    updateCards(progressRef.current);

    // Entrance: deal the cards out of a single stack instead of popping them
    // into their final slots.
    if (!prefersReducedMotion()) {
      const ordered = [...cardsRef.current]
        .map((el, i) => ({ el, absDiff: Math.abs(getCircularDiff(i, progressRef.current)) }))
        .filter((c): c is { el: HTMLDivElement; absDiff: number } => Boolean(c.el))
        .sort((a, b) => b.absDiff - a.absDiff);

      gsap.from(
        ordered.map((c) => c.el),
        {
          x: 0,
          y: 34,
          z: -260,
          rotateY: 0,
          rotation: -4,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.07,
          clearProps: "rotation",
        }
      );
    }

    let startProgress = 0;
    let hasDragged = false;

    const draggable = Draggable.create(dragProxyRef.current, {
      type: "x",
      trigger: stageRef.current,
      cursor: "grab",
      activeCursor: "grabbing",
      dragClickThreshold: 5,
      inertia: true,
      onPress() {
        hasDragged = false;
        startProgress = progressRef.current;
        gsap.killTweensOf(proxyProgressRef.current);
      },
      onDrag() {
        hasDragged = true;
        const stepWidth = getStepWidth();
        // Dragging left (x decreases) increases progress (advances forward)
        const delta = (this.startX - this.x) / stepWidth;
        const current = startProgress + delta;
        progressRef.current = current;
        proxyProgressRef.current.progress = current;
        updateCards(current);
      },
      onThrowUpdate() {
        const stepWidth = getStepWidth();
        const current = startProgress + (this.startX - this.x) / stepWidth;
        progressRef.current = current;
        proxyProgressRef.current.progress = current;
        updateCards(current);
      },
      onThrowComplete() {
        // Land on a whole card: inertia carries the flick, this squares it up.
        animateToProgress(Math.round(progressRef.current), 0.35);
      },
      onDragEnd() {
        // No flick (a slow release gives inertia nothing to throw): snap here.
        if (!hasDragged || this.isThrowing) return;
        animateToProgress(Math.round(progressRef.current));
      },
    })[0];

    // Handle window resize
    const handleResize = () => {
      updateCards(progressRef.current);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      draggable?.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [updateCards, getStepWidth, animateToProgress]);

  // Prev / Next actions
  const handlePrev = useCallback(() => {
    animateToProgress(Math.round(progressRef.current) - 1);
  }, [animateToProgress]);

  const handleNext = useCallback(() => {
    animateToProgress(Math.round(progressRef.current) + 1);
  }, [animateToProgress]);

  // Click on a dot indicator
  const handleDotClick = useCallback(
    (targetIndex: number) => {
      const current = ((Math.round(progressRef.current) % TOTAL_CARDS) + TOTAL_CARDS) % TOTAL_CARDS;
      let diff = targetIndex - current;
      if (diff > TOTAL_CARDS / 2) diff -= TOTAL_CARDS;
      if (diff < -TOTAL_CARDS / 2) diff += TOTAL_CARDS;
      animateToProgress(Math.round(progressRef.current) + diff);
    },
    [animateToProgress]
  );

  // Click directly on a card
  const handleCardClick = useCallback(
    (cardIndex: number) => {
      const diff = getCircularDiff(cardIndex, progressRef.current);

      // If clicked on active center card, trigger action
      if (Math.abs(diff) < 0.3) {
        if (onOrderClick) {
          onOrderClick();
        } else {
          document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      // If clicked on a flanking card, snap it to center
      animateToProgress(Math.round(progressRef.current + diff));
    },
    [onOrderClick, animateToProgress]
  );

  // Gentle idle autoplay (paused on hover, focus or reduced-motion)
  useEffect(() => {
    if (isHovered || prefersReducedMotion()) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      // Paused: show the active dot solid rather than half-swept.
      if (dotFillRef.current) gsap.set(dotFillRef.current, { scaleX: 1 });
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      animateToProgress(Math.round(progressRef.current) + 1, 0.7);
    }, 4800);

    // Same 4.8s on the active dot, so the next advance is visible coming.
    const fill = dotFillRef.current;
    const sweep = fill
      ? gsap.fromTo(
          fill,
          { scaleX: 0 },
          { scaleX: 1, duration: 4.8, ease: "none", repeat: -1, transformOrigin: "left center" }
        )
      : null;

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      sweep?.kill();
      if (fill) gsap.set(fill, { scaleX: 0 });
    };
  }, [isHovered, activeIndex, animateToProgress]);

  // Idle float on whichever card is centred, so the stage is never fully static
  useEffect(() => {
    const cardEl = cardsRef.current[activeIndex];
    if (!cardEl || prefersReducedMotion()) return;

    const inner = cardEl.firstElementChild;
    if (!inner) return;

    const float = gsap.to(inner, {
      y: -3,
      rotation: 0.4,
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      float.kill();
      gsap.set(inner, { y: 0, rotation: 0 });
    };
  }, [activeIndex]);

  const currentFestival = HERO_CARDS_DATA[activeIndex] || HERO_CARDS_DATA[0];

  return (
    <div
      ref={stageRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="2027 festival calendar cards"
      className="w-full max-w-5xl self-center flex flex-col items-center justify-end pb-1 sm:pb-2 relative z-20 touch-pan-y select-none"
    >
      {/* Hidden Draggable Proxy */}
      <div ref={dragProxyRef} className="absolute invisible pointer-events-none" aria-hidden="true" />

      {/* 3D Perspective Stage (Zero background overlays for pure seamless blending) */}
      <div
        className="relative w-full h-[290px] sm:h-[330px] md:h-[365px] lg:h-[395px] flex items-center justify-center overflow-visible"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Floating Left Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous festival card"
          className="absolute left-1 sm:left-4 md:left-8 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cream hover:bg-white text-ink border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center transition-all cursor-pointer hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {/* Floating Right Arrow */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next festival card"
          className="absolute right-1 sm:right-4 md:right-8 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cream hover:bg-white text-ink border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center transition-all cursor-pointer hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {/* 6 Authentic Festival Cards */}
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          {HERO_CARDS_DATA.map((card, i) => {
            const isCenterSpotlight = activeIndex === i;

            return (
              <div
                key={card.name}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                onClick={() => handleCardClick(i)}
                aria-hidden={!isCenterSpotlight}
                className="w-[195px] sm:w-[225px] md:w-[250px] lg:w-[265px] aspect-[3/4] absolute top-1/2 left-1/2 -ml-[97px] sm:-ml-[112px] md:-ml-[125px] lg:-ml-[132px] -mt-[130px] sm:-mt-[150px] md:-mt-[166px] lg:-mt-[176px] cursor-grab active:cursor-grabbing [transform-style:preserve-3d] will-change-transform"
              >
                <div
                  className={`w-full h-full p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-ink bg-ink transition-shadow duration-300 relative ${
                    isCenterSpotlight
                      ? "shadow-[0_16px_36px_-6px_rgba(40,15,5,0.28),0_28px_50px_-10px_rgba(40,15,5,0.18)]"
                      : "shadow-[0_6px_16px_-4px_rgba(40,15,5,0.12)]"
                  }`}
                >
                  <div className="relative w-full h-full rounded-[calc(1rem-2px)] sm:rounded-[calc(1.5rem-4px)] overflow-hidden bg-cream shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                    <Image
                      src={card.src}
                      alt={card.alt}
                      width={420}
                      height={560}
                      sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 270px"
                      priority={i < 4}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />

                    {/* Dark Glass Accession Badge on Center Spotlight */}
                    {isCenterSpotlight && (
                      <div className="absolute top-2 right-2 bg-ink/85 text-gold text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-xs shadow-xs flex items-center gap-1 z-30 pointer-events-none">
                        <span>2027 Parba</span>
                        <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Festival Calligraphic Caption & Month Tag */}
      <div className="mt-1 text-center select-none flex items-center justify-center gap-2" aria-live="polite">
        <span className="text-[10px] sm:text-xs font-subtext font-bold text-brand tracking-wider uppercase bg-brand/8 px-2.5 py-0.5 rounded-full border border-brand/20">
          {currentFestival.name}
        </span>
        <span className="text-brand/40 font-bold">·</span>
        <span lang="or" className="font-odia text-xs sm:text-sm font-bold text-ink/85">
          {currentFestival.odia}
        </span>
      </div>

      {/* Indicator dots for the 6 authentic festivals */}
      <div className="flex items-center gap-1.5 mt-1.5 select-none z-30">
        {HERO_CARDS_DATA.map((card, i) => (
          <button
            key={card.name}
            type="button"
            onClick={() => handleDotClick(i)}
            aria-label={`Show ${card.name}`}
            aria-current={activeIndex === i}
            className={`transition-all duration-300 rounded-full cursor-pointer overflow-hidden relative ${
              activeIndex === i
                ? "w-6 h-1.5 bg-brand/25 shadow-xs"
                : "w-1.5 h-1.5 bg-brand/25 hover:bg-brand/50"
            }`}
          >
            {activeIndex === i && (
              <span
                ref={dotFillRef}
                className="absolute inset-0 bg-brand origin-left scale-x-0 rounded-full"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
