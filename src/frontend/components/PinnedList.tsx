"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

interface PinnedListProps {
  id: string;
  /** Section number; earlier sections are measured first. */
  number: number;
  /** Bento collage behind the list; it drifts sideways in an endless loop. */
  collage: { src: string; span: string }[];
  children: ReactNode;
}

/**
 * A pinned section over a faded bento collage that loops sideways forever. The
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
          { opacity: 0.65, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } }
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
      <div data-pl-img className="absolute inset-0 flex items-center opacity-65">
        <div className="flex h-full w-max animate-marquee-x will-change-transform">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden="true"
              className="grid h-full shrink-0 grid-flow-col-dense grid-rows-4 auto-cols-[23svh] sm:grid-rows-3 sm:auto-cols-[26svh] gap-1.5 p-1.5 pr-0"
            >
              {collage.map((c, i) => (
                <div key={c.src} className={`relative overflow-hidden rounded-lg ${c.span}`}>
                  <Image src={c.src} alt="" fill sizes="25svh" unoptimized priority={copy === 0 && i < 4} className="object-cover" />
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
        <div data-pl-list className="mx-auto w-full max-w-3xl rounded-2xl bg-black/60 p-5 backdrop-blur-md [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
