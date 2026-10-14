"use client";

import { useCallback, useRef } from "react";

/**
 * Mouse-tracked 3D tilt plus a foil highlight, written straight to CSS custom
 * properties so a moving pointer never triggers a React render.
 *
 * Pair with the `.tilt-card` / `.foil` classes in globals.css.
 */
export function useTilt(maxDeg = 10) {
  const ref = useRef<HTMLElement | null>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${(0.5 - py) * 2 * maxDeg}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 2 * maxDeg}deg`);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--foil", "1");
    },
    [maxDeg]
  );

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--foil", "0");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
