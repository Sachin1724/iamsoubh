"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

interface PinnedListProps {
  id: string;
  /** Photos scattered behind the list; the strip drifts sideways in an endless loop. */
  collage: string[];
  /** First scene: shown on arrival, lifts away as the children rise in (stays clickable while pinned). */
  intro?: ReactNode;
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
 * Layers over a loose scatter of photos, two rows deep, looping sideways forever.
 * The collage locks in place with CSS position: sticky, and the stories and the
 * list scroll up over it as ordinary content, so the page never stops moving.
 * (A GSAP pin held the whole screen while scenes played, which felt like sticking.)
 */
export function PinnedList({ id, collage, intro, children }: PinnedListProps) {
  const root = useRef<HTMLDivElement>(null);

  // The drifting collage is one huge layer; stop it while the section is off screen.
  useEffect(() => {
    const el = root.current;
    const marquee = el?.querySelector<HTMLElement>(".animate-marquee-x");
    if (!el || !marquee) return;
    const io = new IntersectionObserver(([entry]) => {
      marquee.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // overflow-clip: the sticky layer's negative margin lets it slide one screen past
    // the section's end; clip (unlike hidden) cuts that off without breaking sticky.
    <div id={id} ref={root} className="relative overflow-clip bg-ink">
      {/* Background layer: holds still while the content passes over it. The
          negative margin lets the content start at its top instead of below it. */}
      <div className="sticky top-0 -mb-[100svh] h-svh overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 opacity-45 [--s:0.6] sm:[--s:1] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]">
          {/* Two copies of the scatter, stacked: the lower half is filled too. Only
              transform animates, on its own layer, so it runs at the display's frame rate. */}
          <div className="flex h-full w-max animate-marquee-x flex-col [backface-visibility:hidden] will-change-transform">
            {[0, 1].map((row) => (
              <div
                key={row}
                className="flex h-1/2 w-max shrink-0"
                style={{ marginLeft: row ? "calc(-110svh * var(--s))" : undefined }}
              >
                {[0, 1, 2].map((copy) => (
                  <div key={copy} className="relative h-full w-[calc(220svh*var(--s))] shrink-0">
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
                          src={collage[(i + row * 7) % collage.length]}
                          alt=""
                          fill
                          sizes="25svh"
                          priority={row === 0 && copy === 0 && i < 4}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Foreground layers: plain page flow, scrolling over the collage */}
      <div className="relative z-10">
        {intro && (
          <div id="stories" className="flex min-h-svh px-3">
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center pb-[5.5rem] pt-[5.25rem] md:pb-4">{intro}</div>
          </div>
        )}
        <div className="flex min-h-svh items-center px-4 py-24">
          <div className="reveal mx-auto w-full max-w-3xl rounded-2xl bg-black/75 p-5 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
