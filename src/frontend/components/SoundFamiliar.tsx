"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const LINES = [
  "For everyone who misses Odisha without saying it.",
  "Raja came and went. You found out from someone's story.",
  "You watched Rath Yatra on reels. From 1,000 km away. Again.",
  "Maa asked, \"Pitha khailu?\" You said yes. Your last pitha was months ago.",
  "You wished Maa for Pana Sankranti. A day late.",
];

/**
 * One pinned photo; on scroll it blurs and the whole list rises over it as a
 * single block (not line-by-line pages). Reduced motion: static blurred list.
 */
export function SoundFamiliar() {
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
            end: "+=160%",
            pin: true,
            pinSpacing: true,
            refreshPriority: -2,
            scrub: 0.35,
          },
        });
        tl.to("[data-sf-img]", { filter: "blur(7px)", scale: 1.06, duration: 1 }, 0)
          .to("[data-sf-shade]", { opacity: 1, duration: 1 }, 0)
          .fromTo("[data-sf-list]", { y: () => window.innerHeight }, { y: 0, duration: 1.3 }, 0);
      }, el);

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section id="sound-familiar" ref={root} className="relative h-svh overflow-hidden bg-ink">
      <div data-sf-img className="absolute inset-0 will-change-[filter]">
        <Image
          src="/assets/story/street.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectPosition: "50% 35%" }}
          className="object-cover"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/55" />
      <div data-sf-shade className="pointer-events-none absolute inset-0 bg-black/45 opacity-0" />

      <div className="absolute inset-0 z-10 flex items-center">
        <div data-sf-list className="mx-auto w-full max-w-3xl px-5 pt-16 sm:px-6">
          <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-wider text-turmeric">Sound familiar?</p>
          <ul className="space-y-3 sm:space-y-5">
            {LINES.map((line) => (
              <li key={line} className="flex gap-3 font-gazpacho text-[1.05rem] font-bold leading-snug text-white sm:text-2xl">
                <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-turmeric" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-white/25 pt-4 sm:mt-8 sm:pt-6">
            <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wider text-turmeric">This is why we made it</p>
            <p className="font-gazpacho text-2xl font-bold leading-tight text-turmeric sm:text-4xl">
              This calendar keeps the dates for you.
            </p>
            <p className="mt-2 max-w-[44ch] text-[0.85rem] font-light italic leading-snug text-white/85 sm:text-base">
              One card for every month. Keep it on your desk, and when you celebrate, tick the box on the back.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
