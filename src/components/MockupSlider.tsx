"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The product, in the views Soubh shot. Scroll-snap carries the swipe; the
 * dots are the way to change it where there is no thumb. One list, used by
 * both the Inside the box section and the order section.
 */
export const MOCKUPS = [
  { src: "/assets/product%20mockup/View%204.png", alt: "The 2027 festival cards" },
  { src: "/assets/product%20mockup/View%201.png", alt: "The 2027 festival cards, fanned out" },
  { src: "/assets/product%20mockup/Calendar%20PNG.png", alt: "A festival card, close up" },
];

export function MockupSlider({
  className = "",
  imageClassName = "",
  sizes = "(max-width: 1024px) 100vw, 560px",
  priority = false,
}: {
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      const i = Math.round(rail.scrollLeft / rail.clientWidth);
      setActive(Math.max(0, Math.min(MOCKUPS.length - 1, i)));
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left: i * rail.clientWidth, behavior: reduce ? "auto" : "smooth" });
    setActive(i);
  };

  return (
    <div className={className}>
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MOCKUPS.map((m, i) => (
          <div key={m.src} className={`relative w-full shrink-0 snap-center ${imageClassName}`}>
            <Image
              src={m.src}
              alt={m.alt}
              fill
              priority={priority && i === 0}
              sizes={sizes}
              className="scale-[1.3] object-contain drop-shadow-[0_24px_40px_rgba(90,15,20,0.18)] lg:scale-[1.45]"
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {MOCKUPS.map((m, i) => (
          <button
            key={m.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`View ${i + 1}`}
            aria-current={active === i}
            className="flex h-8 w-8 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all ${
                active === i ? "h-2.5 w-2.5 bg-pipili-red" : "h-2 w-2 bg-on-light/25"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
