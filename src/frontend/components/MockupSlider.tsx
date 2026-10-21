"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The product, in the views Soubh shot. Scroll-snap carries the swipe; the
 * dots are the way to change it where there is no thumb. One list, used by
 * both the Inside the box section and the order section.
 */
export const MOCKUPS = [
  // `zoom` is per shot: the first two are framed with air around the cards and
  // need filling out, the third is cropped tight and must sit as it is.
  {
    src: "/assets/product%20mockup/View%204.png",
    alt: "The 2027 festival cards",
    zoom: "scale-[1.7] lg:scale-[1.6]",
  },
  {
    src: "/assets/product%20mockup/View%201.png",
    alt: "The 2027 festival cards, fanned out",
    zoom: "scale-[1.7] lg:scale-[1.6]",
  },
  {
    src: "/assets/product%20mockup/Calendar%20PNG.png",
    alt: "The January card, front and dates",
    zoom: "scale-100",
  },
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

  // Drifts to the next view every few seconds until the visitor touches the rail
  // or a dot; after that it stays where they put it.
  const stopped = useRef(false);
  const stop = () => {
    stopped.current = true;
  };
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.5 });
    io.observe(rail);
    const timer = setInterval(() => {
      if (stopped.current || !visible) return;
      const next = (Math.round(rail.scrollLeft / rail.clientWidth) + 1) % MOCKUPS.length;
      rail.scrollTo({ left: next * rail.clientWidth, behavior: "smooth" });
    }, 3200);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, []);

  const go = (i: number) => {
    stop();
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
        onPointerDown={stop}
        onWheel={stop}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MOCKUPS.map((m, i) => (
          <div key={m.src} className={`relative w-full shrink-0 snap-center overflow-hidden ${imageClassName}`}>
            <Image
              src={m.src}
              alt={m.alt}
              fill
              priority={priority && i === 0}
              sizes={sizes}
              className={`object-contain ${m.zoom}`}
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
