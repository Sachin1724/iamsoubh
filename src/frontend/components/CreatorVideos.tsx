"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight, Gift, ArrowRight } from "lucide-react";
import { creators } from "@/frontend/data/creators";
import { SectionArt } from "@/frontend/components/SectionArt";
import { trackGA } from "@/frontend/lib/track";
import { CreatorGiftModal } from "@/frontend/components/CreatorGiftModal";
import { highlightCentre } from "@/frontend/lib/highlightCentre";
import { cta } from "@/frontend/components/ui/cta";

const SPEED_PX_PER_SEC = 25;

export function CreatorVideos() {
  const [unmuted, setUnmuted] = useState<string | null>(null);
  const [creatorModalOpen, setCreatorModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const paused = useRef(false);
  // Auto-drift stays off until this time, so an arrow press or a swipe is not
  // fought by the next animation frame.
  const holdUntil = useRef(0);
  const hold = (ms = 4000) => {
    holdUntil.current = performance.now() + ms;
  };

  // The card nearest the middle of the screen is the highlighted one.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    return highlightCentre(el);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
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

    let raf = 0;
    let last = performance.now();
    // Kept as a float: at 25px/s a frame is ~0.4px, which scrollLeft alone rounds away.
    let pos = el.scrollLeft;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft; // the user moved it
      if (isVisible && !paused.current && now > holdUntil.current) {
        const half = el.scrollWidth / 2;
        pos = (pos + (dt * SPEED_PX_PER_SEC) / 1000) % half;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    hold(5000);
    // One card per press, measured from the real layout.
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : 300;
    // The list is doubled for the endless drift; stepping back from the very
    // start wraps to the matching spot in the second copy first.
    if (direction === "left" && el.scrollLeft < step) el.scrollLeft += el.scrollWidth / 2;
    el.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") {
      hold(); // native touch scrolling does the work
      return;
    }
    if (e.button !== 0) return;
    isDragging.current = true;
    paused.current = true;
    startX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    paused.current = false;
  };

  return (
    <section
      id="creators" data-snap
      className="halftone [--ht-at:0%_100%] relative flex h-svh flex-col pt-[5.25rem] pb-[5.5rem] md:pb-6 lg:h-auto lg:min-h-svh lg:justify-center lg:py-20 bg-ink text-on-dark scroll-mt-24 overflow-hidden"
    >

      {/* Folk pattern texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none bg-repeat z-0"
        style={{ backgroundImage: "url('/assets/folk-pattern-tile.png')", backgroundSize: "180px" }}
        aria-hidden="true"
      />

      {/* A big lotus, half off the left edge */}
      <SectionArt name="lotus" className="z-0 text-white opacity-[0.07]" />

      {/* 4. Main Section Content */}
      <div className="flex min-h-0 w-full min-w-0 max-w-7xl flex-1 flex-col mx-auto px-4 sm:px-6 lg:block lg:flex-none lg:px-8 relative z-20">
        <div className="mb-3 flex shrink-0 flex-col justify-between gap-2 sm:mb-6 md:flex-row md:items-end">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-turmeric/85">
                From the creators
              </span>
            </div>

            <h2 data-scroll-rise className="font-gazpacho text-[1.7rem] sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-turmeric">
              Hear it from the creators.
            </h2>
            <p className="mt-2 text-sm sm:mt-3 sm:text-lg text-on-dark/90 max-w-xl font-subtext font-normal leading-relaxed">
              Six creators opened the box on camera. Here&apos;s what they said.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs text-on-dark/60 hidden sm:inline">
              Swipe to see more
            </span>
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full bg-white/10 text-turmeric border border-white/25 hover:border-turmeric flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              aria-label="Previous creators"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-white/10 text-turmeric border border-white/25 hover:border-turmeric flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              aria-label="Next creators"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Video Carousel — aligned with edge bleed */}
        <div className="relative min-h-0 flex-1 mx-[calc(50%-50vw)] lg:flex-none overflow-hidden">
          <div
            ref={scrollContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => {
              isDragging.current = false;
              paused.current = false;
            }}
            className="flex gap-4 sm:gap-6 overflow-x-auto h-full py-3 lg:h-auto lg:py-6 no-scrollbar cursor-grab active:cursor-grabbing select-none relative z-20"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x pan-y",
            }}
          >
            {[...creators, ...creators].map((c, i) => (
              <div
                key={`${c.postId}-${i}`}
                className="h-full shrink-0 scale-95 opacity-60 transition duration-300 data-[active]:scale-105 data-[active]:opacity-100 lg:h-auto lg:w-[calc((100vw-7.5rem)/6)]"
              >
                <CreatorCard
                  creator={c}
                  unmuted={unmuted === c.postId}
                  onToggleSound={() =>
                    setUnmuted((cur) => (cur === c.postId ? null : c.postId))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Short clickable line for creators */}
        <div className="mt-2 shrink-0 text-center sm:mt-4 lg:mt-7">
          <button
            type="button"
            onClick={() => setCreatorModalOpen(true)}
            className="inline-flex items-center gap-2 text-sm sm:text-base text-rice hover:text-white transition-colors cursor-pointer group"
          >
            <span className="font-medium">Are you a creator?</span>
            <span className="font-bold text-ink bg-turmeric px-2.5 py-0.5 rounded-md underline underline-offset-4 decoration-2 decoration-ink group-hover:bg-[#f5b833] active:scale-95 transition-all">
              Get 1 free →
            </span>
          </button>
        </div>
      </div>

      {/* Creator Gifting Application Modal */}
      <CreatorGiftModal
        open={creatorModalOpen}
        onClose={() => setCreatorModalOpen(false)}
      />
    </section>
  );
}

function CreatorCard({
  creator,
  unmuted,
  onToggleSound,
}: {
  creator: (typeof creators)[number];
  unmuted: boolean;
  onToggleSound: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const postUrl = `https://www.instagram.com/reel/${creator.postId}/`;

  useEffect(() => {
    const el = cardRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    // Only the highlighted card plays: decoding six videos at once dropped frames.
    const slot = el.parentElement;
    if (!slot) return;
    let onScreen = false;
    let playing = false;
    const sync = () => {
      const want = onScreen && slot.hasAttribute("data-active");
      if (want === playing) return;
      playing = want;
      if (want) {
        video.play().catch(() => {});
        trackGA("video_play", { creator: creator.handle || creator.postId });
      } else {
        video.pause();
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    const mo = new MutationObserver(sync);
    io.observe(el);
    mo.observe(slot, { attributes: true, attributeFilter: ["data-active"] });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [creator.handle, creator.postId]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !unmuted;
  }, [unmuted]);

  return (
    <div
      ref={cardRef}
      className="relative flex h-full flex-col lg:h-auto lg:w-full shrink-0 rounded-2xl overflow-hidden bg-ink border border-turmeric/40 hover:border-turmeric in-data-active:border-2 in-data-active:border-turmeric transition-all duration-300 group"
    >
      <div className="relative aspect-[9/16] h-full lg:h-auto lg:w-full bg-[#0F0F0F]">
        {creator.video ? (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full cursor-pointer"
            aria-label="Watch reel on Instagram"
          >
            <video
              ref={videoRef}
              src={creator.video}
              poster={creator.poster}
              muted
              loop
              playsInline
              preload="none"
              className="w-full h-full object-cover"
            />
          </a>
        ) : (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-[#0F0F0F] group"
            aria-label="Watch on Instagram"
          >
            <div className="relative w-full h-full">
              {creator.poster && (
                <Image
                  src={creator.poster}
                  alt={creator.name || "Creator"}
                  fill
                  sizes="(max-width: 640px) 260px, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="w-14 h-14 rounded-full bg-turmeric text-ink flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </span>
              </div>
            </div>
          </a>
        )}

        {creator.collab && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rice text-ink border border-ink">
            Collaborator
          </span>
        )}

        {creator.video && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSound();
            }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
            aria-label={unmuted ? "Mute" : "Unmute"}
          >
            {unmuted ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Handle and the real reel, sitting on the video itself */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10">
          <span className="mb-2 block truncate text-xs font-bold text-turmeric">
            {creator.handle ? `@${creator.handle.replace(/^@/, "")}` : "On Instagram"}
          </span>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`pointer-events-auto ${cta("gold", "sm")} h-9! min-h-9! gap-1.5! px-3! text-xs!`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            Watch
          </a>
        </div>
      </div>
    </div>
  );
}
