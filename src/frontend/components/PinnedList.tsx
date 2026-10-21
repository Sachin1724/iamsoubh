"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

interface PinnedListProps {
  id: string;
  /** Section number; earlier sections are measured first. */
  number: number;
  image: string;
  position?: string;
  children: ReactNode;
}

/**
 * One pinned photo; on scroll it blurs and the children rise over it as a
 * single block (not page by page). Reduced motion: static list, no blur.
 */
export function PinnedList({ id, number, image, position = "50% 50%", children }: PinnedListProps) {
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
            end: "+=220%",
            pin: true,
            pinSpacing: true,
            refreshPriority: -number,
            scrub: 0.1,
          },
        });
        tl.to("[data-pl-img]", { filter: "blur(7px)", scale: 1.06, duration: 1 }, 0)
          .to("[data-pl-shade]", { opacity: 1, duration: 1 }, 0)
          .fromTo("[data-pl-list]", { y: () => window.innerHeight }, { y: 0, duration: 1.3 }, 0)
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
      <div data-pl-img className="absolute inset-0 will-change-[filter]">
        <Image src={image} alt="" fill sizes="100vw" style={{ objectPosition: position }} className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/55" />
      <div data-pl-shade className="pointer-events-none absolute inset-0 bg-black/45 opacity-0" />
      <div className="absolute inset-0 z-10 flex items-center">
        <div data-pl-list className="mx-auto w-full max-w-3xl px-5 sm:px-6">
          {children}
        </div>
      </div>
    </section>
  );
}
