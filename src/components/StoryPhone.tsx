"use client";

import React from "react";
import Image from "next/image";
import { Pause, Volume2 } from "lucide-react";
import { StoryItem } from "@/data/testimonials";
import { cityCodeMap } from "@/data/testimonials";

const STORY_MS = 5000;

interface StoryPhoneProps {
  stories: StoryItem[];
  /** 0..1 across the whole set, so the caller can draw a ring in sync. */
  onProgress?: (fraction: number) => void;
}

/** A phone-shaped Instagram story player: segmented bars, tap to skip, hold to pause.
 *  Give it a `key` tied to the set so swapping sets restarts playback. */
export function StoryPhone({ stories, onProgress }: StoryPhoneProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  // Progress is written straight to the bars; a 60fps setState here re-rendered
  // the whole phone every frame.
  const barsRef = React.useRef<HTMLDivElement>(null);
  const elapsedRef = React.useRef(0);

  React.useEffect(() => {
    if (paused || stories.length === 0) return;
    const start = performance.now() - elapsedRef.current;
    let raf = 0;
    const tick = (now: number) => {
      const e = now - start;
      if (e >= STORY_MS) {
        elapsedRef.current = 0;
        setIndex((i) => (i + 1) % stories.length);
        return;
      }
      elapsedRef.current = e;
      const bar = barsRef.current?.children[index] as HTMLElement | undefined;
      const fill = bar?.firstElementChild as HTMLElement | undefined;
      if (fill) fill.style.width = `${(e / STORY_MS) * 100}%`;
      onProgress?.((index + e / STORY_MS) / stories.length);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, paused, stories, onProgress]);

  if (stories.length === 0) return null;
  const story = stories[index];
  const go = (step: number) => {
    elapsedRef.current = 0;
    setIndex((i) => (i + step + stories.length) % stories.length);
  };

  return (
    <div className="relative mx-auto w-[min(72vw,300px)] max-h-[62vh] lg:max-h-none aspect-[9/19] rounded-[2rem] sm:rounded-[2.5rem] border-[8px] sm:border-[10px] border-[#1B1B1B] bg-[#1B1B1B] shadow-[10px_12px_0_0_rgba(27,27,27,.35)]">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 h-5 w-24 rounded-b-2xl bg-[#1B1B1B]" />

      <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-black">
        <Image
          key={story.id}
          src={story.image}
          alt={story.quote}
          fill
          sizes="300px"
          className="object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        {/* Segmented progress bars */}
        <div ref={barsRef} className="absolute inset-x-3 top-7 z-20 flex gap-1">
          {stories.map((s, i) => (
            <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <span
                className="block h-full rounded-full bg-white"
                style={{
                  width: i < index ? "100%" : "0%",
                }}
              />
            </span>
          ))}
        </div>

        {/* Author row */}
        <div className="absolute inset-x-3 top-11 z-20 flex items-center gap-2 text-white">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#E0A526] text-[9px] font-black text-[#1B1B1B]">
            {cityCodeMap[story.city]?.slice(0, 3) ?? story.city.slice(0, 3).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold">{story.handle}</span>
            <span className="block text-[10px] text-white/70">{story.city}</span>
          </span>
          {paused ? <Pause className="h-3.5 w-3.5 text-white/80" /> : <Volume2 className="h-3.5 w-3.5 text-white/80" />}
        </div>

        {/* Caption */}
        <p className="absolute inset-x-4 bottom-6 z-20 text-sm font-medium leading-snug text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.9)]">
          {story.quote}
        </p>

        {/* Tap zones: left back, right forward, hold to pause */}
        <button
          type="button"
          aria-label="Previous story"
          onClick={() => go(-1)}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          className="absolute inset-y-0 left-0 z-20 w-1/3 cursor-pointer"
        />
        <button
          type="button"
          aria-label="Next story"
          onClick={() => go(1)}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          className="absolute inset-y-0 right-0 z-20 w-2/3 cursor-pointer"
        />
      </div>
    </div>
  );
}
