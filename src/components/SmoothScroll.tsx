"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let globalLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return globalLenis;
}

export function scrollToTarget(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
  if (typeof window === "undefined") return;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  if (globalLenis) {
    globalLenis.scrollTo(el as HTMLElement, {
      offset: options?.offset ?? -40,
      duration: options?.duration ?? 1.2,
    });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Smoothly route native hash anchor link clicks through Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, { offset: -40, duration: 1.3 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  return <>{children}</>;
}
