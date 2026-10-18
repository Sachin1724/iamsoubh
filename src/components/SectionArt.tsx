import React from "react";

/**
 * One big Pipili-appliqué line drawing per section, cropped off an edge.
 * Drawn inline rather than loaded as files: they are a handful of paths, they
 * take the section's own line colour through `stroke`, and there is nothing to
 * ship or go missing. Swap a `<path>` for an <Image> if Soubh draws real ones.
 */
export type ArtName = "wheel" | "ikat" | "jhoti" | "appliqué" | "lotus" | "umbrellas";

/** Two decimals is plenty for a line drawing, and it hydrates identically. */
const at = (centre: number, radius: number, angle: number, fn: (n: number) => number) =>
  (centre + fn(angle) * radius).toFixed(2);

const ART: Record<ArtName, { box: string; wrap: string; paths: React.ReactNode }> = {
  // Konark wheel, half off the right edge
  wheel: {
    box: "0 0 200 200",
    wrap: "absolute top-1/2 -right-[45%] sm:-right-[22%] w-[90vw] max-w-[620px] -translate-y-1/2",
    paths: (
      <>
        <circle cx="100" cy="100" r="92" />
        <circle cx="100" cy="100" r="74" />
        <circle cx="100" cy="100" r="30" />
        <circle cx="100" cy="100" r="12" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI * 2) / 16;
          return (
            <line
              key={i}
              x1={at(100, 30, a, Math.cos)}
              y1={at(100, 30, a, Math.sin)}
              x2={at(100, 74, a, Math.cos)}
              y2={at(100, 74, a, Math.sin)}
            />
          );
        })}
        {Array.from({ length: 32 }, (_, i) => {
          const a = ((i + 0.5) * Math.PI * 2) / 32;
          return (
            <circle key={i} cx={at(100, 83, a, Math.cos)} cy={at(100, 83, a, Math.sin)} r="4" />
          );
        })}
      </>
    ),
  },
  // Sambalpuri ikat motifs running down the left edge
  ikat: {
    box: "0 0 100 400",
    wrap: "absolute top-0 -left-10 sm:left-0 h-full w-[180px] sm:w-[220px]",
    paths: (
      <>
        {Array.from({ length: 6 }, (_, i) => {
          const y = 34 + i * 66;
          return (
            <g key={i}>
              <path d={`M20 ${y} L50 ${y - 24} L80 ${y} L50 ${y + 24} Z`} />
              <path d={`M34 ${y} L50 ${y - 11} L66 ${y} L50 ${y + 11} Z`} />
              <path d={`M8 ${y + 33} H92`} />
            </g>
          );
        })}
      </>
    ),
  },
  // Jhoti in two corners only — the calm sections
  jhoti: {
    box: "0 0 120 120",
    wrap: "absolute -top-6 -left-6 w-40 sm:w-56",
    paths: (
      <>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI * 2) / 8;
          return (
            <ellipse
              key={i}
              cx={at(60, 30, a, Math.cos)}
              cy={at(60, 30, a, Math.sin)}
              rx="16"
              ry="9"
              transform={`rotate(${(i * 360) / 8} ${at(60, 30, a, Math.cos)} ${at(60, 30, a, Math.sin)})`}
            />
          );
        })}
        <circle cx="60" cy="60" r="12" />
      </>
    ),
  },
  // Appliqué elephants, parrots and a sun along the bottom
  "appliqué": {
    box: "0 0 420 110",
    wrap: "absolute bottom-0 left-0 w-full",
    paths: (
      <>
        {/* elephant */}
        <path d="M30 96 V70 a26 20 0 0 1 52 0 V96 M44 96 V78 M68 96 V78 M82 72 q14 -4 16 10 q2 12 -8 14" />
        <circle cx="46" cy="66" r="3" />
        {/* parrot */}
        <path d="M150 96 q-14 -10 -8 -30 q6 -20 26 -20 q16 0 18 16 q2 14 -12 20 l-6 14 Z M168 60 l12 -6 l-10 -4" />
        <circle cx="162" cy="58" r="2.5" />
        {/* sun */}
        <circle cx="250" cy="60" r="22" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI * 2) / 12;
          return (
            <line
              key={i}
              x1={at(250, 26, a, Math.cos)}
              y1={at(60, 26, a, Math.sin)}
              x2={at(250, 36, a, Math.cos)}
              y2={at(60, 36, a, Math.sin)}
            />
          );
        })}
        {/* second elephant, mirrored */}
        <path d="M390 96 V70 a26 20 0 0 0 -52 0 V96 M376 96 V78 M352 96 V78 M338 72 q-14 -4 -16 10 q-2 12 8 14" />
        <circle cx="374" cy="66" r="3" />
        <path d="M0 104 H420" />
      </>
    ),
  },
  // A big lotus, half off the left edge
  lotus: {
    box: "0 0 200 200",
    wrap: "absolute top-1/2 -left-[45%] sm:-left-[20%] w-[90vw] max-w-[600px] -translate-y-1/2",
    paths: (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d="M100 100 q-22 -40 0 -86 q22 46 0 86 Z"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={`i${i}`}
            d="M100 100 q-14 -26 0 -54 q14 28 0 54 Z"
            transform={`rotate(${i * 30 + 15} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="12" />
      </>
    ),
  },
  // Appliqué umbrellas along the top
  umbrellas: {
    box: "0 0 420 90",
    wrap: "absolute top-0 left-0 w-full",
    paths: (
      <>
        <path d="M0 6 H420" />
        {[60, 160, 260, 360].map((x) => (
          <g key={x}>
            <path d={`M${x - 44} 44 a44 38 0 0 1 88 0 Z`} />
            <path d={`M${x - 44} 44 q11 14 22 0 q11 14 22 0 q11 14 22 0 q11 14 22 0`} />
            <path d={`M${x} 6 V44 M${x} 44 V84`} />
          </g>
        ))}
      </>
    ),
  },
};

export function SectionArt({
  name,
  className = "",
  flip = false,
}: {
  name: ArtName;
  className?: string;
  flip?: boolean;
}) {
  const art = ART[name];
  return (
    <div
      className={`pointer-events-none select-none ${art.wrap} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={art.box}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-full w-full ${flip ? "-scale-x-100" : ""}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {art.paths}
      </svg>
    </div>
  );
}
