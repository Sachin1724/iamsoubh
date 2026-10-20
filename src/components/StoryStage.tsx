"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface StoryBeat {
  image: string;
  /** CSS object-position, to keep the subject in frame on a portrait screen. */
  position?: string;
  kicker?: string;
  title: string;
  titleOr?: string;
  body?: string;
  bodyOr?: string;
  accent?: boolean;
}

interface StoryStageProps {
  id: string;
  number: string;
  beats: StoryBeat[];
}

function Photo({ beat }: { beat: StoryBeat }) {
  return (
    <Image
      src={beat.image}
      alt=""
      fill
      sizes="100vw"
      style={{ objectPosition: beat.position ?? "50% 50%" }}
      className="object-cover"
    />
  );
}

function Head({ beat }: { beat: StoryBeat }) {
  return (
    <>
      {beat.kicker && (
        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wider text-turmeric">
          {beat.kicker}
        </p>
      )}
      <h2
        className={`max-w-[18ch] font-gazpacho text-[1.7rem] font-bold leading-[1.08] sm:max-w-[24ch] sm:text-5xl lg:text-6xl ${
          beat.accent ? "text-turmeric" : "text-white"
        }`}
      >
        {beat.title}
      </h2>
      {beat.titleOr && (
        <p className="mt-2 font-odia-heading text-xl leading-[1.25] text-white/95 sm:text-3xl">{beat.titleOr}</p>
      )}
    </>
  );
}

function Body({ beat }: { beat: StoryBeat }) {
  return (
    <>
      {beat.bodyOr && (
        <p className="max-w-[42ch] font-odia-body text-[0.95rem] leading-[1.65] text-white/90 sm:text-base">
          {beat.bodyOr}
        </p>
      )}
      {beat.body && (
        <p className="mt-2 max-w-[38ch] text-[0.8rem] font-light italic leading-snug text-white/80 sm:text-base">
          {beat.body}
        </p>
      )}
    </>
  );
}

const SHADE =
  "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/55 pointer-events-none";

/**
 * A pinned, scroll-scrubbed story: photos cross-fade (the new one opens up
 * from a rounded inset while easing out of a zoom) and the copy travels with
 * them, rising in from below and lifting away above. With reduced motion the
 * beats just stack as plain full-bleed blocks.
 */
export function StoryStage({ id, number, beats }: StoryStageProps) {
  const root = useRef<HTMLElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return; // strict-mode remount: a second pin on the same node breaks the layout
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        const imgs = q("[data-story-img]");
        const heads = q("[data-story-head]");
        const bodies = q("[data-story-body]");
        const n = beats.length;
        // Each hand-off takes 1 unit, each hold takes 1 unit.
        const total = 2 * (n - 1) + 1;

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${n * 90}%`,
            pin: true,
            pinSpacing: true, // auto-detects false inside the flex-col <main>
            // Stages load in whatever order their chunks arrive; earlier sections must
            // be measured first so later ones start after their pin spacing.
            refreshPriority: -Number(number),
            scrub: 0.35, // Lenis already smooths the wheel; more scrub just reads as lag
          },
        });

        // Beat i holds over [2i, 2i+1]; the hand-off to i+1 runs over [2i+1, 2i+2].
        // The copy never stops: it rises in, keeps drifting up through the hold,
        // then lifts away. Bodies travel further than headings, so the two
        // layers separate in depth against the photo.
        for (let i = 0; i < n; i++) {
          const hold = 2 * i;
          if (i > 0) {
            tl.fromTo(
              imgs[i],
              { autoAlpha: 0, scale: 1.18, clipPath: "inset(10% 6% 10% 6% round 28px)" },
              { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 },
              hold - 1
            )
              .fromTo(heads[i], { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, hold - 0.7)
              .fromTo(bodies[i], { autoAlpha: 0, y: 110 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, hold - 0.7);
          }
          tl.to(heads[i], { y: -18, ease: "none", duration: 1 }, hold)
            .to(bodies[i], { y: -40, ease: "none", duration: 1 }, hold);
          if (i < n - 1) {
            tl.to(heads[i], { autoAlpha: 0, y: -90, duration: 0.6, ease: "power2.in" }, hold + 1)
              .to(bodies[i], { autoAlpha: 0, y: -150, duration: 0.6, ease: "power2.in" }, hold + 1);
          }
        }
        tl.to({}, { duration: 1 }, total - 1);
        tl.fromTo(
          q("[data-story-bar]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: total },
          0
        );
      }, el);

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [beats.length]);

  if (still) {
    return (
      <section id={id} ref={root} className="bg-ink">
        {beats.map((beat, i) => (
          <div key={beat.title} className="relative min-h-[85svh] overflow-hidden">
            <Photo beat={beat} />
            <div className={SHADE} />
            <div className="absolute inset-x-0 top-20 z-10 mx-auto max-w-5xl px-4 sm:top-24 sm:px-6 lg:px-8">
              <Head beat={beat} />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-5xl px-4 pb-24 sm:px-6 md:pb-14 lg:px-8">
              <Body beat={beat} />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section id={id} ref={root} className="relative h-svh overflow-hidden bg-ink">
      {beats.map((beat, i) => (
        <div key={i} data-story-img className={`absolute inset-0 ${i ? "opacity-0" : ""}`}>
          <Photo beat={beat} />
        </div>
      ))}
      <div className={SHADE} />

      <div className="absolute inset-x-0 top-20 z-10 mx-auto h-[34%] max-w-5xl px-4 sm:top-24 sm:px-6 lg:px-8">
        {beats.map((beat, i) => (
          <div key={beat.title} data-story-head className={`absolute inset-x-4 top-0 sm:inset-x-6 lg:inset-x-8 ${i ? "opacity-0" : ""}`}>
            <Head beat={beat} />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-20 z-10 mx-auto h-[26%] max-w-5xl px-4 sm:px-6 md:bottom-14 lg:px-8">
        {beats.map((beat, i) => (
          <div key={beat.title} data-story-body className={`absolute inset-x-4 bottom-0 sm:inset-x-6 lg:inset-x-8 ${i ? "opacity-0" : ""}`}>
            <Body beat={beat} />
          </div>
        ))}
      </div>

      <div
        data-story-bar
        className="absolute inset-x-0 bottom-0 z-20 h-0.5 origin-left bg-turmeric"
        aria-hidden="true"
      />
    </section>
  );
}
