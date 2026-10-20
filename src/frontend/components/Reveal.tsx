"use client";

import { useEffect } from "react";

/**
 * One observer for every `.reveal` element on the page, so sections opt in with a
 * class alone — no per-component refs or imports.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      for (const el of document.querySelectorAll(".reveal:not(.is-in), .reveal-stagger:not(.is-in), .reveal-spring:not(.is-in), .reveal-spring-stagger:not(.is-in)")) {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      }
    };
    scan();

    // ponytail: re-scan on DOM growth; swap for a per-component ref if this ever shows up in a profile.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
