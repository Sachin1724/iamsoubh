"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let globalLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return globalLenis;
}

// True while a scroll we started ourselves (nav link, button) is running.
let steering = false;
/** Lets the header ignore scrolls we started ourselves. */
export const isSteering = () => steering;

export function scrollToTarget(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
  if (typeof window === "undefined") return;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  if (globalLenis) {
    steering = true;
    globalLenis.scrollTo(el as HTMLElement, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
      onComplete: () => {
        steering = false;
      },
    });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's motion preferences. ?nosmooth hands scrolling back to the
    // browser so screenshot tools can step down the page.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).has("nosmooth")
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0.9,
      infinite: false,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Own rAF until GSAP arrives, then Lenis rides GSAP's ticker so the pinned
    // story stages and Lenis read the same scroll position on the same frame.
    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    let stopTicker: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      // Phone address bars show and hide while scrolling; recalculating every pin on
      // that resize is what made sections jump. Heights are svh-based, so skip it.
      ScrollTrigger.config({ ignoreMobileResize: true });
      cancelAnimationFrame(rafId);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);
      stopTicker = () => gsap.ticker.remove(tick);
    })();

    // Smoothly route native hash anchor link clicks through Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          steering = true;
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: 0,
            duration: 1.3,
            onComplete: () => {
              steering = false;
            },
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelled = true;
      cancelAnimationFrame(rafId);
      stopTicker?.();
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  return <>{children}</>;
}
