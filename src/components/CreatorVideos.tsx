"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { creators } from "@/data/creators";
import { trackGA } from "@/lib/track";

// ponytail: fixed drift speed; expose as a prop if a second carousel needs its own.
const SPEED_PX_PER_SEC = 25;

export function CreatorVideos() {
  const [unmuted, setUnmuted] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Slow continuous drift. The list is rendered twice so scrollLeft can wrap at the
  // halfway mark without a visible jump; drag/arrows still move the same scrollLeft.
  const paused = useRef(false);
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!paused.current) {
        const half = el.scrollWidth / 2;
        el.scrollLeft = (el.scrollLeft + (dt * SPEED_PX_PER_SEC) / 1000) % half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
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
      id="creators"
      className="surface-ink relative py-16 sm:py-24 bg-[#1B1B1B] text-[#F6EFE2] scroll-mt-24"
      style={{ scrollMarginTop: "96px" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-disko block text-[64px] sm:text-[96px] leading-none text-[#3A3633] select-none">
              05
            </span>
            <p className="text-sm font-semibold -mt-3 mb-2 text-[#E0A526]">05 · On camera</p>
            <h2 className="font-disko text-3xl sm:text-5xl leading-[1.05]">Ask them, not me.</h2>
            <p className="mt-3 text-base sm:text-lg text-[#F6EFE2]/85 max-w-xl">
              Six creators got the 2026 calendar. Here&apos;s what happened when it landed.
            </p>
          </div>

          {/* Navigation Controls: Arrow buttons for web/desktop */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs text-[#F6EFE2]/60 hidden sm:inline">
              Swipe or click arrows
            </span>
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full bg-[#FFFAF0] text-[#1B1B1B] border-2 border-[#1B1B1B] shadow-[3px_3px_0_#E0A526] hover:shadow-[4px_4px_0_#E0A526] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center cursor-pointer transition-all"
              style={{ boxShadow: "3px 3px 0 0 #E0A526" }}
              aria-label="Previous creators"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-[#FFFAF0] text-[#1B1B1B] border-2 border-[#1B1B1B] shadow-[3px_3px_0_#E0A526] hover:shadow-[4px_4px_0_#E0A526] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center cursor-pointer transition-all"
              style={{ boxShadow: "3px 3px 0 0 #E0A526" }}
              aria-label="Next creators"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Touch-scrollable on smartphone & click/drag scrollable on desktop */}
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
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar px-5 sm:px-8 cursor-grab active:cursor-grabbing select-none"
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x pan-y",
        }}
      >
        {[...creators, ...creators].map((c, i) => (
          <div key={`${c.postId}-${i}`} className="shrink-0">
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

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          trackGA("video_play", { creator: creator.handle || creator.postId });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [creator.handle, creator.postId]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !unmuted;
  }, [unmuted]);

  return (
    <div
      ref={cardRef}
      className="relative w-[260px] sm:w-[300px] shrink-0 rounded-2xl overflow-hidden bg-[#1B1B1B] border-2 border-[#F6EFE2]"
      style={{ boxShadow: "5px 5px 0 0 #E0A526" }}
    >
      <div className="relative aspect-[9/16] bg-[#2A2522]">
        {creator.video ? (
          <video
            ref={videoRef}
            src={creator.video}
            poster={creator.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-[#2A2522]"
            aria-label="Watch on Instagram"
          >
            <span className="w-14 h-14 rounded-full bg-[#E0A526] text-[#1B1B1B] flex items-center justify-center border-2 border-[#1B1B1B]">
              <Play className="w-6 h-6 fill-current" />
            </span>
          </a>
        )}

        {creator.collab && (
          <span className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F6EFE2] text-[#1B1B1B] border-2 border-[#1B1B1B]">
            Collab
          </span>
        )}

        {creator.video && (
          <button
            onClick={onToggleSound}
            aria-label={unmuted ? "Mute video" : "Unmute video"}
            className="absolute top-2 right-2 w-10 h-10 rounded-full bg-[#F6EFE2] text-[#1B1B1B] border-2 border-[#1B1B1B] flex items-center justify-center press cursor-pointer hover:bg-white transition-colors"
          >
            {unmuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 stroke-[2.5]" />}
          </button>
        )}

        {/* Flat ink band */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1B1B1B]/85 backdrop-blur-xs p-3 border-t border-[#F6EFE2]/10">
          {creator.name ? (
            <>
              <p className="font-disko text-lg leading-tight text-[#F6EFE2]">{creator.name}</p>
              <p className="text-xs text-[#F6EFE2]/70">{creator.handle}</p>
              {creator.pullLine && (
                <p className="mt-1 text-sm text-[#F6EFE2] line-clamp-2">{creator.pullLine}</p>
              )}
            </>
          ) : (
            <p className="text-xs font-bold text-[#E0A526]">
              [TO CONFIRM: name, handle, pull line]
            </p>
          )}

          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs font-semibold underline underline-offset-4 text-[#E0A526] hover:text-[#F6EFE2] transition-colors"
          >
            Watch on Instagram ↗
          </a>
        </div>
      </div>
    </div>
  );
}
