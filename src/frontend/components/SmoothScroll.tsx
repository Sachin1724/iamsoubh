"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let globalLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return globalLenis;
}

// ── Section snapping ─────────────────────────────────────────
// Snap points are the tops of [data-snap] sections, plus extra points that pinned
// sections register (their scene rest positions, which no element top marks).
const extraSnaps = new Set<() => number[]>();
export function registerSnaps(fn: () => number[]) {
  extraSnaps.add(fn);
  return () => {
    extraSnaps.delete(fn);
  };
}

function snapPoints(): number[] {
  const tops = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]")).map(
    (el) => el.getBoundingClientRect().top + window.scrollY
  );
  extraSnaps.forEach((fn) => tops.push(...fn()));
  return tops.map(Math.round).sort((a, b) => a - b);
}

// True while a scroll we started ourselves (nav link, button, snap) is running.
let steering = false;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

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

    // Magnet + flick limit. One gesture moves at most one section; when scrolling
    // settles near a section top it eases onto it. Sections taller than the screen
    // only snap at their top, so their insides still scroll freely.
    let origin: number | null = null; // snap point the current gesture started from
    let idle: ReturnType<typeof setTimeout> | undefined;
    const steer = (to: number, duration: number) => {
      steering = true;
      lenis.scrollTo(to, {
        duration,
        easing: easeOutCubic,
        lock: true,
        onComplete: () => {
          steering = false;
        },
      });
    };
    const onScroll = () => {
      if (steering) return;
      const y = lenis.scroll;
      const pts = snapPoints();
      if (!pts.length) return;
      if (origin === null) origin = pts.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));

      // Flick limit: momentum aimed past the neighbouring point stops at that point.
      const down = lenis.direction > 0;
      const next = down ? pts.find((p) => p > origin! + 2) : [...pts].reverse().find((p) => p < origin! - 2);
      if (next !== undefined && (down ? lenis.targetScroll > next : lenis.targetScroll < next)) {
        origin = null;
        steer(next, 0.7);
        return;
      }

      clearTimeout(idle);
      idle = setTimeout(() => {
        origin = null;
        if (steering) return;
        const at = lenis.scroll;
        const near = snapPoints().reduce((a, b) => (Math.abs(b - at) < Math.abs(a - at) ? b : a), Infinity);
        if (Math.abs(near - at) > 2 && Math.abs(near - at) < window.innerHeight * 0.3) steer(near, 0.6);
      }, 140);
    };
    lenis.on("scroll", onScroll);

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
      clearTimeout(idle);
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
