"use client";

import { useEffect } from "react";

/**
 * One GSAP pass for the whole page, so a section opts in with an attribute
 * instead of its own refs and imports.
 *
 *   data-scroll-media   the element grows from 0.88 to 1 as it enters, then
 *                       darkens and fades as it leaves
 *   data-scroll-words   each word of the paragraph scrubs from faint to full
 *   data-scroll-rise    headline words rise into place one after another, tied
 *                       to the scroll (the Apple product-page reveal)
 *
 * Everything is gated behind gsap.matchMedia, so under
 * `prefers-reduced-motion: reduce` nothing is registered at all and every
 * element keeps its finished state.
 */
export function ScrollPhysics() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const observers: IntersectionObserver[] = [];
        const media = gsap.utils.toArray<HTMLElement>("[data-scroll-media]");

        media.forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0.88, opacity: 0.35 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 45%",
                scrub: 0.6,
              },
            }
          );

          // and back out again as it leaves the screen
          gsap.to(el, {
            opacity: 0.25,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "bottom 45%",
              end: "bottom 5%",
              scrub: 0.6,
            },
          });
        });

        // Paragraphs marked for it reveal a word at a time against the scroll.
        const copy = gsap.utils.toArray<HTMLElement>("[data-scroll-words]");
        copy.forEach((el) => {
          if (el.dataset.split === "done") return;
          const words = (el.textContent ?? "").split(/(\s+)/);
          el.textContent = "";
          const spans: HTMLSpanElement[] = [];
          for (const word of words) {
            if (!word.trim()) {
              el.appendChild(document.createTextNode(word));
              continue;
            }
            const span = document.createElement("span");
            span.textContent = word;
            el.appendChild(span);
            spans.push(span);
          }
          el.dataset.split = "done";

          gsap.fromTo(
            spans,
            { opacity: 0.15 },
            {
              opacity: 1,
              stagger: 0.12,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 0.5,
              },
            }
          );
        });
        // Headlines: each word starts a little low and clear, then rises and firms up in
        // sequence as the heading comes in. Plain-text headings only (it rewrites text).
        // Every section heading gets it too, as long as it holds only text.
        gsap.utils.toArray<HTMLElement>("[data-scroll-rise], section h2").forEach((el) => {
          if (el.dataset.split === "done" || el.childElementCount > 0) return;
          const words = (el.textContent ?? "").split(/(\s+)/);
          el.textContent = "";
          const spans: HTMLSpanElement[] = [];
          for (const word of words) {
            if (!word.trim()) {
              el.appendChild(document.createTextNode(word));
              continue;
            }
            // The outer span clips, so each word slides up from behind a line.
            const clip = document.createElement("span");
            clip.className = "inline-block overflow-hidden align-bottom pb-[0.08em]";
            const span = document.createElement("span");
            span.className = "inline-block will-change-transform";
            span.textContent = word;
            clip.appendChild(span);
            el.appendChild(clip);
            spans.push(span);
          }
          el.dataset.split = "done";

          // Timed, not scrubbed, so it plays the same at any scroll speed. An IntersectionObserver reads
          // where the heading really is, so the pinned section's spacer can't throw it off.
          const tween = gsap.fromTo(
            spans,
            { yPercent: 105, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: "power3.out", paused: true }
          );
          const io = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) tween.play();
              // Rewind only once it drops off the bottom, so scrolling back up replays it.
              else if (entry.boundingClientRect.top > 0) tween.reverse();
            },
            { threshold: 0.2 }
          );
          io.observe(el);
          observers.push(io);
        });

        // No kill-all here: mm.revert() already reverts what this context made,
        // and killing every trigger also took down the pinned story stages.
        return () => observers.forEach((io) => io.disconnect());
      });

      cleanup = () => mm.revert();
    })();

    return () => cleanup?.();
  }, []);

  return null;
}
