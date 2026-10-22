"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const noop = () => () => {};
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { scrollToTarget } from "@/frontend/components/SmoothScroll";
import { StoryItem } from "@/frontend/data/testimonials";
import { trackGA } from "@/frontend/lib/track";

const STORY_MS = 5000;

export function StoryViewer({
  stories,
  startIndex,
  onClose,
  onViewed,
}: {
  stories: StoryItem[];
  startIndex: number;
  onClose: () => void;
  onViewed: (city: string) => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  // false on the server, true in the browser: the portal needs document.body.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const current = stories[index];

  const next = useCallback(() => {
    setProgress(0);
    setIndex((i) => {
      if (i + 1 >= stories.length) {
        onClose();
        return i;
      }
      return i + 1;
    });
  }, [stories.length, onClose]);

  const prev = useCallback(() => {
    setProgress(0);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  // Mark the city seen as soon as one of its stories is open.
  useEffect(() => {
    if (!current) return;
    onViewed(current.city);
    trackGA("story_open", { city: current.city, handle: current.handle });
  }, [current, onViewed]);

  // Auto-advance. Reduced motion gets arrows only, never a timer.
  useEffect(() => {
    if (paused || reduced.current) return;
    const started = Date.now();
    const id = setInterval(() => {
      const pct = (Date.now() - started) / STORY_MS;
      if (pct >= 1) {
        next();
      } else {
        setProgress(pct);
      }
    }, 50);
    return () => clearInterval(id);
  }, [index, paused, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, next, prev]);

  if (!current || !mounted) return null;

  const hasSharpImage = Boolean(current.image && !current.image.includes("story-"));

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Story from ${current.handle}`}
      className="fixed inset-0 z-[9999] bg-ink/95 backdrop-blur-md flex flex-col justify-between py-2 sm:py-4 px-3 sm:px-6 cursor-pointer select-none"
      onClick={onClose}
    >
      {/* Prominent Desktop Close / Back to Website Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Back to website"
        className="hidden sm:flex fixed top-3 right-3 sm:top-5 sm:right-6 z-[10001] items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#2A2A2A]/90 hover:bg-brand text-rice border border-white/20 text-xs sm:text-sm font-bold transition-all cursor-pointer group"
      >
        <span className="hidden sm:inline">Back to website</span>
        <X className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform" />
        <span className="hidden sm:inline-block text-[10px] text-white/60 bg-black/40 px-1.5 py-0.5 rounded font-mono">
          ESC
        </span>
      </button>

      {/* Top progress bars and story meta */}
      <div
        className="max-w-md w-full mx-auto relative z-10 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-1 p-2 shrink-0">
          {stories.map((s, i) => (
            <div key={s.id} className="h-1 flex-1 rounded-full bg-rice/25 overflow-hidden">
              <div
                className="h-full bg-rice"
                style={{
                  width: i < index ? "100%" : i === index ? `${progress * 100}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Top bar with handle, city, and close */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2 shrink-0">
          <div className="min-w-0 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-turmeric text-ink font-bold text-xs flex items-center justify-center shrink-0 border border-ink">
              {current.handle.replace("@", "").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <a
                href={`https://instagram.com/${current.handle.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-rice hover:underline hover:text-turmeric transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {current.handle}
              </a>
              {current.city && (
                <p className="text-xs text-rice/70">{current.city} · {current.stateOrCountry}</p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close stories"
            className="w-10 h-10 rounded-full bg-rice text-ink border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center justify-center press cursor-pointer hover:bg-white"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main 9:16 frame */}
      <div
        className="relative flex-1 min-h-0 max-w-sm w-full mx-auto flex items-center justify-center my-auto z-10 cursor-default"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        {hasSharpImage ? (
          <div className="w-full h-full relative aspect-[9/16] rounded-2xl overflow-hidden border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)]">
            <Image
              src={current.image}
              alt={current.quote || `Story from ${current.handle}`}
              fill
              sizes="(max-width: 640px) 100vw, 440px"
              className="object-cover"
              priority
            />
          </div>
        ) : (
          /* Clean 9:16 Placeholder card */
          <div
            className="w-full h-full max-h-[780px] aspect-[9/16] rounded-2xl bg-[#FFFAF0] border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex flex-col justify-between p-6 select-none relative overflow-hidden"
            style={{ boxShadow: "5px 5px 0 0 #E0A526" }}
          >
            {/* Top motif accent */}
            <div className="flex items-center justify-between text-xs text-brand font-bold uppercase tracking-wider">
              <span>{current.handle}</span>
              <span className="bg-turmeric/30 text-brand px-2 py-0.5 rounded-full border border-brand/20">
                2026 Wall
              </span>
            </div>

            {/* Center story content */}
            <div className="my-auto text-center flex flex-col items-center py-6">
              <div className="w-16 h-16 rounded-full bg-rice border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] flex items-center justify-center mb-4 text-chandua">
                <span className="font-disko text-2xl">
                  {current.handle.replace("@", "").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="font-disko text-3xl sm:text-4xl text-ink leading-tight mb-2">
                {current.handle}
              </h3>
              <span className="inline-block text-xs font-bold text-brand uppercase tracking-widest bg-rice px-3 py-1 rounded-full border border-ink/15 mb-6">
                Story coming
              </span>

              {current.quote && (
                <div className="bg-rice border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] rounded-xl p-4 text-left max-w-xs">
                  <p className="text-sm sm:text-base italic text-ink leading-relaxed">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <p className="text-xs font-bold text-brand mt-2 text-right">
                    — {current.name} ({current.handle})
                  </p>
                </div>
              )}
            </div>

            {/* Bottom bar */}
            <div className="pt-3 border-t-2 border-ink/15 text-center">
              <p className="text-xs text-muted font-semibold">
                Tap anywhere to advance · 2027 Calendar On Sale
              </p>
            </div>
          </div>
        )}

        {/* Tap zones: Left 35% to prev, Right 65% to next */}
        <button
          onClick={prev}
          aria-label="Previous story"
          className="absolute inset-y-0 left-0 w-[35%] cursor-pointer z-10"
        />
        <button
          onClick={next}
          aria-label="Next story"
          className="absolute inset-y-0 right-0 w-[65%] cursor-pointer z-10"
        />
      </div>

      {/* Pre-order bottom bar */}
      <div
        className="relative z-10 max-w-sm w-full mx-auto cursor-default shrink-0 mt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onClose();
            scrollToTarget("#preorder");
          }}
          className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-turmeric text-ink border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] font-bold text-sm press cursor-pointer hover:bg-white transition-colors"
        >
          <span>Buy the 2027 Calendar</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Desktop navigation chevrons and instructions */}
      <div
        className="relative z-10 max-w-lg w-full mx-auto cursor-default shrink-0 pb-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden sm:flex justify-between items-center px-4 pb-2">
          <button
            onClick={prev}
            className="px-4 py-2 rounded-full bg-[#2A2A2A] text-rice text-xs font-bold flex items-center gap-1 hover:bg-[#3A3A3A] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs text-rice/60">
            {index + 1} of {stories.length}
          </span>
          <button
            onClick={next}
            className="px-4 py-2 rounded-full bg-[#2A2A2A] text-rice text-xs font-bold flex items-center gap-1 hover:bg-[#3A3A3A] cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-rice/50 text-center hidden sm:block pointer-events-none select-none">
          Click anywhere outside or press ESC to return to main page
        </p>
      </div>
    </div>,
    document.body
  );
}
