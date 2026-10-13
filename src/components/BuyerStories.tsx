"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { testimonials, StoryItem, cityCodeMap } from "@/data/testimonials";
import { StoryViewer } from "./StoryViewer";

const SEEN_KEY = "odia-2027-seen-cities";

// Tilts strictly between -3° and +3° per specification
const TILTS = [-2.4, 1.8, -1.2, 2.6, -2.1, 1.5, -2.8, 2.2, -1.7, 2.5, -2.3, 1.9];

export function BuyerStories() {
  const [viewer, setViewer] = useState<{ stories: StoryItem[]; index: number } | null>(null);
  const [seen, setSeen] = useState<string[]>([]);

  useEffect(() => {
    try {
      setSeen(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"));
    } catch {
      // Ignore — ring colour is an enhancement, not critical state.
    }
  }, []);

  const markSeen = useCallback((city: string) => {
    setSeen((cur) => {
      if (cur.includes(city)) return cur;
      const next = [...cur, city];
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Filter out any blank or incomplete stories at build/run time so blanks never render
  const validStories = useMemo(() => {
    return testimonials.filter((s) => s && s.city && s.name && s.quote);
  }, []);

  // Group stories by city (only cities in brief, with valid stories)
  const cities = useMemo(() => {
    const map = new Map<string, StoryItem[]>();
    for (const s of validStories) {
      const list = map.get(s.city) ?? [];
      list.push(s);
      map.set(s.city, list);
    }
    return [...map.entries()];
  }, [validStories]);

  // Wall cards: enough cards so the drifting animation never shows a seam
  const wall = useMemo(() => {
    const out: StoryItem[] = [];
    while (out.length < 20 && validStories.length > 0) {
      out.push(...validStories);
    }
    return out.slice(0, 20);
  }, [validStories]);

  const openCity = (cityStories: StoryItem[]) =>
    setViewer({ stories: cityStories, index: 0 });

  const openOne = (story: StoryItem) =>
    setViewer({ stories: validStories, index: validStories.indexOf(story) });

  return (
    <section
      id="stories"
      className="relative py-16 sm:py-24 bg-[#F6EFE2] text-[#1B1B1B] overflow-hidden scroll-mt-24"
      style={{ scrollMarginTop: "96px" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Desktop 7-col / 5-col header with proof counters beside heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: 7 columns for Section Number, Titles, and City Circles */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Big 04 Section Number clearly rendered above title */}
            <span className="font-disko block text-[64px] sm:text-[96px] leading-none text-[#C4A882]/75 select-none">
              04
            </span>
            <p className="text-sm font-semibold -mt-2 sm:-mt-3 mb-2 text-[#8A1717]">
              04 · Your stories
            </p>

            <h2 className="font-disko text-3xl sm:text-5xl leading-[1.05] text-[#1B1B1B]">
              200+ of you put it on your story.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#4A4642] max-w-xl">
              Last year the calendar went up in 1,500 homes. You posted it, and I screenshotted every
              single one.
            </p>

            {/* Tap your city + 80px story circles */}
            <div className="mt-8 w-full">
              <p className="text-sm font-semibold text-[#1B1B1B] mb-3">Tap your city.</p>
              <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-3 pt-1 -mx-2 px-2">
                {cities.map(([city, list]) => {
                  const viewed = seen.includes(city);
                  const cityCode = cityCodeMap[city] || city.slice(0, 4).toUpperCase();
                  const firstStory = list[0];
                  const hasSharpImage = Boolean(firstStory?.image && !firstStory.image.includes("story-"));

                  return (
                    <button
                      key={city}
                      onClick={() => openCity(list)}
                      className="shrink-0 flex flex-col items-center gap-1.5 cursor-pointer press group"
                      aria-label={`View ${list.length} stories from ${city}`}
                    >
                      {/* 80px circle per feedback #7 */}
                      <span
                        className="w-[80px] h-[80px] rounded-full p-[3px] flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{
                          background: viewed
                            ? "#9A948C"
                            : "linear-gradient(135deg, #C8221A, #E0A526)",
                        }}
                      >
                        <span className="w-full h-full rounded-full overflow-hidden border-2 border-[#F6EFE2] relative bg-[#FFFAF0] flex flex-col items-center justify-center p-1 text-center shadow-inner">
                          {hasSharpImage ? (
                            <Image
                              src={firstStory.image}
                              alt={city}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <>
                              <span className="font-disko text-base text-[#1B1B1B] font-bold leading-none">
                                {cityCode}
                              </span>
                              <span className="text-[9px] text-[#8A1717] font-bold mt-0.5 tracking-wider uppercase">
                                {list.length} Stories
                              </span>
                            </>
                          )}
                        </span>
                      </span>
                      <span className="text-xs font-semibold text-[#1B1B1B] max-w-[84px] truncate text-center">
                        {city}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: 5 columns for Counter Strip beside heading per feedback #6 */}
          <div className="lg:col-span-5 w-full mt-2 lg:mt-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 deal-stagger">
              <Counter value="200+" label="creators" />
              <Counter value="1,500" label="homes" />
              <div className="col-span-2">
                <Counter value="22" label="states + USA" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moving wall — two rows drifting opposite ways, tap any to open it */}
      {/* Uses exact CSS classes .wall, .wall-row, .wall-tile specified in prompt */}
      <div className="wall marquee-pause">
        <WallRow stories={wall} direction="left" onPick={openOne} />
        <WallRow stories={[...wall].reverse()} direction="right" onPick={openOne} />
      </div>

      {/* "Add yours" sticker */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-end">
          <p
            className="animate-sticker-settle bg-[#E0A526] text-[#1B1B1B] text-sm font-semibold px-4 py-2.5 rounded-md border-2 border-[#1B1B1B] max-w-[280px] shadow-[3px_3px_0_#1B1B1B] -rotate-1 hover:rotate-0 transition-transform cursor-default"
          >
            Got last year&apos;s calendar on your wall? Tag @iamsoubh and your story could be up
            here next.
          </p>
        </div>
      </div>

      {viewer && (
        <StoryViewer
          stories={viewer.stories}
          startIndex={viewer.index}
          onClose={() => setViewer(null)}
          onViewed={markSeen}
        />
      )}
    </section>
  );
}

function WallRow({
  stories,
  direction,
  onPick,
}: {
  stories: StoryItem[];
  direction: "left" | "right";
  onPick: (s: StoryItem) => void;
}) {
  // Rendered twice so the translate loop meets itself with no visible jump.
  const doubled = useMemo(() => [...stories, ...stories], [stories]);

  return (
    <div className="overflow-hidden w-full">
      <div
        className={`wall-row ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {doubled.map((s, i) => {
          const tilt = TILTS[i % TILTS.length];
          const hasSharpImage = Boolean(s.image && !s.image.includes("story-"));

          return (
            <button
              key={`${s.id}-${i}`}
              onClick={() => onPick(s)}
              aria-label={`Open story from ${s.city}`}
              className="wall-tile press focus:outline-none focus:ring-2 focus:ring-[#8A1717]"
              style={{
                transform: `rotate(${tilt}deg)`,
              }}
            >
              {hasSharpImage ? (
                <img
                  src={s.image}
                  alt={`${s.city} story`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <CleanStoryPlaceholder story={s} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Clean placeholder tile per feedback #1:
// Rice-white tile with city name and "Story coming" in small text
function CleanStoryPlaceholder({ story }: { story: StoryItem }) {
  const cityCode = cityCodeMap[story.city] || story.city.slice(0, 4).toUpperCase();

  return (
    <div className="w-full h-full bg-[#FFFAF0] flex flex-col justify-between p-4 relative select-none text-left">
      {/* Top bar with handle and status dot */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#8A1717] tracking-tight truncate max-w-[110px]">
          {story.handle}
        </span>
        <span className="w-2 h-2 rounded-full bg-[#E0A526] shrink-0" />
      </div>

      {/* Center content */}
      <div className="my-auto flex flex-col items-center justify-center text-center py-2">
        <div className="w-10 h-10 rounded-full bg-[#F6EFE2] border border-[#1B1B1B]/15 flex items-center justify-center mb-2 text-[#C8221A] shadow-xs">
          <span className="font-disko text-base">{cityCode}</span>
        </div>
        <span className="font-disko text-xl text-[#1B1B1B] leading-tight block">
          {story.city}
        </span>
        <span className="text-[10px] font-bold text-[#8A1717] mt-1 tracking-wider uppercase bg-[#F6EFE2] px-2 py-0.5 rounded-full border border-[#1B1B1B]/15">
          Story coming
        </span>
        {story.quote && (
          <p className="mt-3 text-[11px] italic text-[#4A4642] leading-snug line-clamp-3 px-1">
            &ldquo;{story.quote}&rdquo;
          </p>
        )}
      </div>

      {/* Bottom tag */}
      <div className="pt-2 border-t border-[#1B1B1B]/10 flex items-center justify-between text-[10px] text-[#4A4642]/70 font-mono">
        <span>2026 WALL</span>
        <span>2027</span>
      </div>
    </div>
  );
}

function Counter({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="rounded-2xl bg-[#FFFAF0] border-2 border-[#1B1B1B] p-4 sm:p-5 text-center transition-transform hover:-translate-y-0.5"
      style={{ boxShadow: "4px 4px 0 0 #1B1B1B" }}
    >
      <span className="font-disko block text-3xl sm:text-4xl lg:text-5xl leading-none text-[#1B1B1B]">
        {value}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-[#4A4642] mt-1.5 block">
        {label}
      </span>
    </div>
  );
}
