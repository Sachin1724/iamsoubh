"use client";

import React from "react";
import Image from "next/image";

/**
 * The sealed 13th parba: an envelope under a wax seal. Click the seal and it
 * cracks in two, leaking gold light over the hidden card beneath.
 */
export function WaxSeal({ image }: { image: string }) {
  const [cracked, setCracked] = React.useState(false);

  return (
    <div className="relative h-full w-full select-none">
      {/* What is under the seal — dim and blurred until it cracks */}
      <Image
        src={image}
        alt="The sealed 13th parba"
        fill
        sizes="(max-width: 1024px) 90vw, 480px"
        className={`object-contain transition-all duration-700 ease-out ${
          cracked ? "blur-0 scale-100 opacity-100" : "blur-[6px] scale-[1.04] opacity-70"
        }`}
      />

      {/* Gold light leak escaping the broken seal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: cracked ? 1 : 0,
          background:
            "radial-gradient(42% 42% at 50% 50%, rgba(255,246,214,.92) 0%, rgba(224,165,38,.55) 32%, rgba(224,165,38,0) 68%)",
          mixBlendMode: "screen",
        }}
      />

      <button
        type="button"
        onClick={() => setCracked((c) => !c)}
        aria-pressed={cracked}
        aria-label={cracked ? "Reseal the 13th parba" : "Crack the wax seal"}
        className="group absolute inset-0 grid place-items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8A1717]"
      >
        <span className="relative block h-28 w-28 sm:h-32 sm:w-32 [perspective:700px]">
          {/* Two halves of the same seal, split down the middle */}
          {([-1, 1] as const).map((side) => (
            <span
              key={side}
              className="absolute inset-0 block transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
              style={{
                clipPath: side === -1 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
                transform: cracked
                  ? `translateX(${side * 34}px) translateY(${side === -1 ? -10 : 12}px) rotate(${side * 16}deg)`
                  : "none",
              }}
            >
              <WaxDisc />
            </span>
          ))}

          {/* Hairline crack, drawn only while the seal is whole */}
          <span
            aria-hidden="true"
            className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-[#5E0F12]/50 transition-opacity duration-300"
            style={{ opacity: cracked ? 0 : 1 }}
          />
        </span>

        <span
          className="absolute bottom-3 text-[11px] font-black uppercase tracking-widest text-[#8A1717] transition-opacity duration-300"
          style={{ opacity: cracked ? 0 : 1 }}
        >
          Crack the seal
        </span>
      </button>
    </div>
  );
}

/** The wax disc itself: Konark sun rays around Jagannath's eyes. */
function WaxDisc() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[2px_4px_6px_rgba(27,27,27,.45)]">
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#D13A2E" />
          <stop offset="55%" stopColor="#A8211B" />
          <stop offset="100%" stopColor="#6E1214" />
        </radialGradient>
      </defs>

      {/* Ragged wax edge */}
      <path
        fill="url(#wax)"
        d="M50 4c7 0 10 5 16 6s11-3 16 1 1 11 4 16 9 7 9 14-7 9-9 14 1 12-4 16-10 0-16 1-9 6-16 6-10-5-16-6-11 3-16-1-1-11-4-16-9-7-9-14 7-9 9-14-1-12 4-16 10 0 16-1 9-6 16-6z"
      />

      {/* Stamped sun rays */}
      {Array.from({ length: 16 }).map((_, i) => (
        <rect
          key={i}
          x="49"
          y="13"
          width="2"
          height="9"
          rx="1"
          fill="#5E0F12"
          opacity=".55"
          transform={`rotate(${i * 22.5} 50 50)`}
        />
      ))}

      {/* Jagannath eyes */}
      <g fill="#F6EFE2" opacity=".9">
        <ellipse cx="40" cy="48" rx="7.5" ry="5" />
        <ellipse cx="60" cy="48" rx="7.5" ry="5" />
      </g>
      <g fill="#1B1B1B">
        <circle cx="40" cy="48" r="3" />
        <circle cx="60" cy="48" r="3" />
      </g>
      <path d="M36 60q14 9 28 0" stroke="#5E0F12" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}
