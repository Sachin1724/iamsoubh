"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { registerSnaps } from "@/frontend/components/SmoothScroll";

interface PinnedListProps {
  id: string;
  /** Section number; earlier sections are measured first. */
  number: number;
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
 * A pinned section over a loose scatter of photos, two rows deep, looping sideways forever. The
 * collage fades in as the section arrives; the children rise over it as one
 * block. Reduced motion: static collage and list.
 */
export function PinnedList({ id, number, collage, intro, children }: PinnedListProps) {
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

      let tl: ReturnType<typeof gsap.timeline> | undefined;
      const ctx = gsap.context(() => {
        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: intro ? "+=280%" : "+=200%",
            pin: true,
            pinSpacing: true,
            refreshPriority: -number,
            scrub: 0.6, // a little catch-up, so scenes glide instead of snapping frame to frame
          },
        });
        // Fades in over the approach, so the collage is already there when it pins.
        gsap.fromTo(
          "[data-pl-img]",
          { opacity: 0 },
          { opacity: 0.9, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } }
        );
        if (!intro) tl.to("[data-pl-hint]", { autoAlpha: 0, duration: 0.3 }, 0);
        // Two separate scenes, never on screen together: the stories hold, lift away and are
        // gone; only then do the lines fade up from below.
        if (intro) {
          tl.to("[data-pl-scrim]", { autoAlpha: 0, duration: 0.6 }, 0.5);
          tl.to("[data-pl-intro]", { yPercent: -30, autoAlpha: 0, duration: 0.6, ease: "power1.in" }, 0.5);
        }
        tl.fromTo(
          "[data-pl-list]",
          { y: () => (intro ? window.innerHeight * 0.25 : window.innerHeight), autoAlpha: intro ? 0 : 1 },
          { y: 0, autoAlpha: 1, duration: intro ? 0.9 : 1.3 },
          intro ? 1.2 : 0
        )
          .to({}, { duration: 0.8 }); // hold: text rests at centre before the section unpins
      }, el);

      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      // Rest positions inside the pin: the first scene, and the lines once settled.
      const linesDone = intro ? 2.1 : 1.3;
      const unregister = registerSnaps(() => {
        const trig = tl?.scrollTrigger;
        if (!tl || !trig) return [];
        return [trig.start, trig.start + ((trig.end - trig.start) * linesDone) / tl.duration()];
      });
      cleanup = () => {
        unregister();
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [number, intro]);

  return (
    <section id={id} ref={root} className="relative h-svh overflow-hidden bg-ink">
      <div
        data-pl-img
        className="absolute inset-0 opacity-90 [--s:0.6] sm:[--s:1] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]"
      >
        {/* Two copies of the scatter, stacked: the lower half is filled too. Only
            transform animates, on its own layer, so it runs at the display's frame rate. */}
        <div
          className="flex h-full w-max animate-marquee-x flex-col [--dist:calc(-220svh*var(--s))] [backface-visibility:hidden] will-change-transform"
        >
          {[0, 1].map((row) => (
            <div
              key={row}
              aria-hidden="true"
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
                        unoptimized
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
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
      {/* Scrim for the stories scene: it fades out in place, so no edge ever travels across the collage */}
      {intro && (
        <div data-pl-scrim className="pointer-events-none absolute inset-0 z-[15] bg-black/60" aria-hidden="true" />
      )}
      {intro && (
        <div id="stories" data-pl-intro className="absolute inset-0 z-20 flex px-3 motion-reduce:hidden">

          <div className="mx-auto flex h-full w-full max-w-7xl flex-col pb-[5.5rem] pt-[5.25rem] md:pb-4">{intro}</div>
        </div>
      )}
      {/* Until the copy rises, the collage alone can read as the whole section. */}
      {!intro && (
      <p
          data-pl-hint
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-1 text-sm font-medium uppercase tracking-[0.2em] text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] motion-reduce:hidden"
          aria-hidden="true"
        >
          <span className="animate-bounce text-lg">↑</span>
          <span className="sm:hidden">Swipe up</span>
          <span className="hidden sm:inline">Scroll</span>
        </p>
      )}
      <div className="absolute inset-0 z-10 flex items-center px-4">
        <div data-pl-list className={`${intro ? "motion-safe:invisible " : ""}mx-auto w-full max-w-3xl rounded-2xl bg-black/75 p-5 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:p-8`}>
          {children}
        </div>
      </div>
    </section>
  );
}
