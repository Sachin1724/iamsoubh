"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

interface PinnedListProps {
  id: string;
  /** Section number; earlier sections are measured first. */
  number: number;
  /** Photos scattered behind the list; the strip drifts sideways in an endless loop. */
  collage: string[];
  children: ReactNode;
}

// Hand-placed loose stack for one 220svh-wide strip: left (svh), top (%),
// width (svh), aspect. Straight edges, varied sizes, like a moodboard. Two
// strips side by side make the sideways loop seamless.
const SCATTER = [
  { x: 2, y: 10, w: 26, a: "4 / 3" },
  { x: 8, y: 58, w: 16, a: "1" },
  { x: 32, y: 4, w: 14, a: "3 / 4" },
  { x: 30, y: 46, w: 22, a: "4 / 3" },
  { x: 50, y: 18, w: 15, a: "1" },
  { x: 56, y: 62, w: 13, a: "3 / 4" },
  { x: 70, y: 6, w: 22, a: "4 / 3" },
  { x: 74, y: 44, w: 17, a: "3 / 4" },
  { x: 96, y: 22, w: 14, a: "1" },
  { x: 96, y: 64, w: 20, a: "4 / 3" },
  { x: 116, y: 4, w: 18, a: "3 / 4" },
  { x: 120, y: 50, w: 15, a: "1" },
  { x: 140, y: 14, w: 24, a: "4 / 3" },
  { x: 142, y: 56, w: 19, a: "4 / 3" },
  { x: 168, y: 6, w: 13, a: "1" },
  { x: 170, y: 36, w: 18, a: "3 / 4" },
  { x: 194, y: 12, w: 21, a: "4 / 3" },
  { x: 192, y: 60, w: 15, a: "1" },
];

/**
 * A pinned section over a loose stack of photos that loops sideways forever that loops sideways forever. The
 * collage fades in as the section arrives; the children rise over it as one
 * block. Reduced motion: static collage and list.
 */
export function PinnedList({ id, number, collage, children }: PinnedListProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=200%",
            pin: true,
            pinSpacing: true,
            refreshPriority: -number,
            scrub: 0.1,
          },
        });
        // Fades in over the approach, so the collage is already there when it pins.
        gsap.fromTo(
          "[data-pl-img]",
          { opacity: 0 },
          { opacity: 0.9, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } }
        );
        tl.to("[data-pl-hint]", { autoAlpha: 0, duration: 0.3 }, 0);
        tl.fromTo("[data-pl-list]", { y: () => window.innerHeight }, { y: 0, duration: 1.3 })
          .to({}, { duration: 0.8 }); // hold: text rests at centre before the section unpins
      }, el);

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [number]);

  return (
    <section id={id} ref={root} className="relative h-svh overflow-hidden bg-ink">
      <div
        data-pl-img
        className="absolute inset-0 opacity-90 [--s:0.6] sm:[--s:1] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]"
      >
        {/* Only transform animates, on its own layer: the compositor runs it at the display's frame rate. */}
        <div className="flex h-full w-max animate-marquee-x [backface-visibility:hidden] will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden="true" className="relative h-full w-[calc(220svh*var(--s))] shrink-0">
              {SCATTER.map((t, i) => (
                <div
                  key={i}
                  className="absolute overflow-hidden rounded-md"
                  style={{
                    left: `calc(${t.x}svh * var(--s))`,
                    top: `${t.y}%`,
                    width: `calc(${t.w}svh * var(--s))`,
                    aspectRatio: t.a,
                  }}
                >
                  <Image
                    src={collage[i % collage.length]}
                    alt=""
                    fill
                    sizes="25svh"
                    unoptimized
                    priority={copy === 0 && i < 4}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
      {/* Until the copy rises, the collage alone can read as the whole section. */}
      <p
        data-pl-hint
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-1 text-sm font-medium uppercase tracking-[0.2em] text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] motion-reduce:hidden"
        aria-hidden="true"
      >
        <span className="animate-bounce text-lg">↑</span>
        <span className="sm:hidden">Swipe up</span>
        <span className="hidden sm:inline">Scroll</span>
      </p>
      <div className="absolute inset-0 z-10 flex items-center px-4">
        <div data-pl-list className="mx-auto w-full max-w-3xl rounded-2xl bg-black/75 p-5 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
