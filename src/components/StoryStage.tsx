"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, Check, Lock } from "lucide-react";

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
  /** A big numeral above the title, for counted items. */
  count?: string;
  locked?: boolean;
  /** Button and fine print under the body. */
  cta?: { label: string; href: string; note?: string };
}

interface StoryStageProps {
  id: string;
  number: string;
  beats: StoryBeat[];
  /** Desktop only: a panel on the right that ticks off each counted beat as it arrives. */
  checklist?: { title: string };
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
      {beat.count && (
        <p className="font-gazpacho text-[3.2rem] font-bold leading-none text-turmeric sm:text-7xl">{beat.count}</p>
      )}
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
        {beat.locked && <Lock className="ml-3 inline h-[0.6em] w-[0.6em] align-baseline text-turmeric" aria-label="sealed" />}
      </h2>
      {beat.titleOr && (
        <p className="mt-2 font-odia-heading text-xl leading-[1.25] text-white/65 sm:text-3xl">{beat.titleOr}</p>
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
      {beat.cta && (
        <div className="pointer-events-auto mt-4">
          <a
            href={beat.cta.href}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-pipili-red px-7 font-gazpacho text-base font-bold text-on-dark shadow-[3px_3px_0_0_var(--color-ink)] transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            {beat.cta.label}
            <ArrowDown className="h-4 w-4" />
          </a>
          {beat.cta.note && <p className="mt-2 text-xs font-semibold text-white/80">{beat.cta.note}</p>}
        </div>
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
export function StoryStage({ id, number, beats, checklist }: StoryStageProps) {
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
        const checks = q("[data-story-check]");
        const panel = q("[data-story-panel]");
        const checkOf = (beat: number) => checks.find((c) => Number((c as HTMLElement).dataset.beat) === beat);
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
          const row = checkOf(i);
          if (row) {
            // The new row rises into the list and its box ticks; the rows above dim.
            const tick = row.querySelector("[data-tick]");
            if (panel.length && !checks.some((c) => Number((c as HTMLElement).dataset.beat) < i)) {
              tl.fromTo(panel, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, hold - 0.7);
            }
            checks.filter((c) => Number((c as HTMLElement).dataset.beat) < i).forEach((c) =>
              tl.to(c, { opacity: 0.5, duration: 0.6 }, hold - 0.7)
            );
            tl.fromTo(row, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, hold - 0.6);
            if (tick) tl.fromTo(tick, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2.5)" }, hold - 0.1);
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

  const copyCls = checklist ? "lg:mx-0 lg:ml-[5vw] lg:max-w-[min(54vw,720px)]" : "";
  const listed = beats.map((b, i) => ({ b, i })).filter(({ b }) => b.count);

  return (
    <section id={id} ref={root} className="relative h-svh overflow-hidden bg-ink">
      {beats.map((beat, i) => (
        <div key={i} data-story-img className={`absolute inset-0 ${i ? "opacity-0" : ""}`}>
          <Photo beat={beat} />
        </div>
      ))}
      <div className={SHADE} />

      <div className={`absolute inset-x-0 top-20 z-10 mx-auto h-[34%] max-w-5xl px-4 sm:top-24 sm:px-6 lg:px-8 ${copyCls}`}>
        {beats.map((beat, i) => (
          <div key={beat.title} data-story-head className={`absolute inset-x-4 top-0 sm:inset-x-6 lg:inset-x-8 ${i ? "opacity-0" : ""}`}>
            <Head beat={beat} />
          </div>
        ))}
      </div>

      <div className={`absolute inset-x-0 bottom-24 z-10 mx-auto h-[26%] max-w-5xl px-4 sm:px-6 md:bottom-14 lg:px-8 ${copyCls}`}>
        {beats.map((beat, i) => (
          <div key={beat.title} data-story-body className={`absolute inset-x-4 bottom-0 sm:inset-x-6 lg:inset-x-8 ${i ? "opacity-0" : ""}`}>
            <Body beat={beat} />
          </div>
        ))}
      </div>

      {checklist && (
        <div
          data-story-panel
          className="pointer-events-none absolute left-4 top-[32%] z-10 w-[240px] rounded-lg border border-white/20 bg-black/35 p-2.5 opacity-0 backdrop-blur-md sm:left-6 lg:left-auto lg:right-[5vw] lg:top-1/2 lg:w-[340px] lg:-translate-y-1/2 lg:rounded-2xl lg:p-6"
        >
          <p className="mb-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-turmeric lg:mb-4 lg:text-[0.7rem]">{checklist.title}</p>
          <ul className="space-y-1 lg:space-y-4">
            {listed.map(({ b, i }) => (
              <li key={i} data-story-check data-beat={i} className="flex items-start gap-2 opacity-0 lg:gap-3">
                <span className="mt-px flex h-3.5 w-3.5 shrink-0 lg:h-5 lg:w-5 items-center justify-center rounded border-2 border-turmeric">
                  <Check data-tick className="h-2.5 w-2.5 text-turmeric lg:h-3.5 lg:w-3.5" strokeWidth={3} />
                </span>
                <span className="font-gazpacho text-[0.72rem] font-bold leading-tight text-white lg:text-lg">
                  <span className="text-turmeric">{b.count}</span> {b.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        data-story-bar
        className="absolute inset-x-0 bottom-0 z-20 h-0.5 origin-left bg-turmeric"
        aria-hidden="true"
      />
    </section>
  );
}
