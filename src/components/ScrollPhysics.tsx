"use client";

import { useEffect } from "react";

/**
 * One GSAP pass for the whole page, so a section opts in with an attribute
 * instead of its own refs and imports.
 *
 *   data-scroll-media   the element grows from 0.88 to 1 as it enters, then
 *                       darkens and fades as it leaves
 *   data-scroll-words   each word of the paragraph scrubs from faint to full
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
        // No kill-all here: mm.revert() already reverts what this context made,
        // and killing every trigger also took down the pinned story stages.
      });

      cleanup = () => mm.revert();
    })();

    return () => cleanup?.();
  }, []);

  return null;
}
