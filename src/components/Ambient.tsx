"use client";

import { useEffect, useRef } from "react";

const LEAVES = [
  "/assets/brand/extracted/extracted_svg/leaf-strips/leaf-strips_049.svg",
  "/assets/brand/extracted/extracted_svg/leaf-strips/leaf-strips_050.svg",
  "/assets/brand/extracted/extracted_svg/leaf-strips/leaf-strips_051.svg",
];

/**
 * Decorative drifting leaves or dots behind a section. Purely ambient — it sits
 * behind the content, never takes pointer events, and stops under reduced motion.
 */
export function Ambient({
  variant = "leaves",
  count = 8,
  className = "",
}: {
  variant?: "leaves" | "dots";
  count?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Pointer parallax: one CSS variable per section, read by the drift animation.
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      el.style.setProperty("--px", `${((e.clientX - r.left) / r.width - 0.5) * 24}px`);
      el.style.setProperty("--py", `${((e.clientY - r.top) / r.height - 0.5) * 16}px`);
    };
    parent.addEventListener("pointermove", onMove, { passive: true });
    return () => parent.removeEventListener("pointermove", onMove);
  }, []);

  // Deterministic placement keeps server and client markup identical.
  const items = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 97) % 100}%`,
    top: `${(i * 61) % 100}%`,
    delay: `${(i % 6) * -2.5}s`,
    duration: `${14 + (i % 5) * 3}s`,
    scale: 0.6 + ((i % 4) * 0.2),
    src: LEAVES[i % LEAVES.length],
  }));

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`ambient pointer-events-none absolute inset-0 overflow-hidden z-0 ${className}`}
    >
      {items.map((it, i) => (
        <span
          key={i}
          className="ambient-item"
          style={{
            left: it.left,
            top: it.top,
            animationDelay: it.delay,
            animationDuration: it.duration,
            transform: `scale(${it.scale})`,
          }}
        >
          {variant === "dots" ? (
            <span className="ambient-dot" />
          ) : (
            // Masked, not <img>: the leaf then takes the section's text colour.
            <span className="ambient-leaf" style={{ maskImage: `url(${it.src})`, WebkitMaskImage: `url(${it.src})` }} />
          )}
        </span>
      ))}
    </div>
  );
}
