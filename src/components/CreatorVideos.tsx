"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { creators } from "@/data/creators";
import { trackGA } from "@/lib/track";

const SPEED_PX_PER_SEC = 25;

export function CreatorVideos() {
  const [unmuted, setUnmuted] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const paused = useRef(false);
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
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (isVisible && !paused.current) {
        const half = el.scrollWidth / 2;
        el.scrollLeft = (el.scrollLeft + (dt * SPEED_PX_PER_SEC) / 1000) % half;
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
      className="relative py-16 sm:py-24 bg-[#0D3B2E] text-[#F6EFE2] scroll-mt-24 overflow-hidden"
    >
      {/* 1. Odia Folk Pattern Texture with Deep Forest Green Tint */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "180px",
        }}
      />

      {/* 2. Right Tropical Foliage & Red Hibiscus (Mandara) Cluster */}
      <div
        className="absolute -top-12 -right-12 sm:-right-16 md:-right-20 w-[240px] sm:w-[320px] md:w-[400px] h-[340px] sm:h-[440px] md:h-[500px] pointer-events-none select-none z-10 animate-sway-soft-right"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/foliage-right-corner.webp"
          alt=""
          fill
          className="object-contain object-right-top drop-shadow-2xl"
        />
      </div>

      {/* 3. Top Left Subtle Jhoti Motif */}
      <div
        className="absolute top-4 left-6 sm:left-12 w-32 sm:w-48 h-32 sm:h-48 pointer-events-none select-none z-0 opacity-15 animate-jhoti-shimmer"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/odia-jhoti-corner.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* 4. Main Section Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-gazpacho text-[#E0A526] font-bold text-xl sm:text-2xl">
                05
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#E0A526]/85">
                ON CAMERA
              </span>
            </div>

            <h2 className="font-gazpacho text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-[#FFFDF7]">
              Ask them, not me.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#F6EFE2]/85 max-w-xl">
              Six creators got the 2026 calendar. Here&apos;s what happened when it landed.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs text-[#F6EFE2]/60 hidden sm:inline">
              Swipe or click arrows
            </span>
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full bg-[#092D23] text-[#E0A526] border-2 border-[#E0A526]/40 hover:border-[#E0A526] flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-md"
              aria-label="Previous creators"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-[#092D23] text-[#E0A526] border-2 border-[#E0A526]/40 hover:border-[#E0A526] flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-md"
              aria-label="Next creators"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Carousel */}
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
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar px-5 sm:px-8 cursor-grab active:cursor-grabbing select-none relative z-20"
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
      className="relative w-[260px] sm:w-[290px] shrink-0 rounded-2xl overflow-hidden bg-[#092D23] border border-[#E0A526]/40 hover:border-[#E0A526] transition-all duration-300 group hover:-translate-y-1 shadow-xl"
    >
      <div className="relative aspect-[9/16] bg-[#07241C]">
        {creator.video ? (
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
        ) : (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-[#07241C] group"
            aria-label="Watch on Instagram"
          >
            <div className="relative w-full h-full">
              {creator.poster && (
                <Image
                  src={creator.poster}
                  alt={creator.name || "Creator"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="w-14 h-14 rounded-full bg-[#E0A526] text-[#0D3B2E] flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </span>
              </div>
            </div>
          </a>
        )}

        {creator.collab && (
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F6EFE2] text-[#1B1B1B] border border-[#1B1B1B] shadow-xs">
            Collaborator
          </span>
        )}

        {creator.video && (
          <button
            onClick={onToggleSound}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label={unmuted ? "Mute" : "Unmute"}
          >
            {unmuted ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Reaction and Handle Bar */}
      <div className="p-4 bg-[#092D23]/95 border-t border-[#E0A526]/20">
        <p className="text-xs sm:text-sm font-semibold text-[#FFFDF7] line-clamp-1 mb-1">
          {creator.pullLine || "Feels like home on my wall"}
        </p>
        <span className="text-[11px] font-bold text-[#E0A526] block">
          @{creator.handle || "iamsoubh"}
        </span>
      </div>
    </div>
  );
}
