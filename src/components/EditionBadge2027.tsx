"use client";

import React, { useState } from "react";
import { Sparkles, Compass } from "lucide-react";

export type BadgeStyleVariant = "royal-cartouche" | "sketched-stamp" | "temple-seal";

interface EditionBadge2027Props {
  variant?: BadgeStyleVariant;
  className?: string;
  onSelectVariant?: (variant: BadgeStyleVariant) => void;
}

export function EditionBadge2027({
  variant = "royal-cartouche",
  className = "",
}: EditionBadge2027Props) {
  const [activeVariant] = useState<BadgeStyleVariant>(variant);

  // Variant 1: Royal Archival Cartouche (Recommended)
  // Double etched outline, Odia numeral medallion ୨୦୨୭, gold foil accents, and generous breathing margins
  if (activeVariant === "royal-cartouche") {
    return (
      <div className={`relative inline-flex items-center justify-center group ${className}`}>
        {/* Subtle ambient warm gold glow behind the badge */}
        <div
          className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#E0A526]/15 via-[#8A1717]/10 to-[#E0A526]/15 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />

        {/* Outer Sketched Archival Plate */}
        <div className="relative inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#FFFDF9]/95 border-2 border-[#8A1717] shadow-[3px_3px_0_0_#1B1B1B] group-hover:shadow-[4px_4px_0_0_#8A1717] group-hover:-translate-y-0.5 transition-all duration-200">
          {/* Inner hairline border for drafted double-line effect */}
          <div className="absolute inset-[2px] rounded-[10px] border border-[#8A1717]/25 pointer-events-none" aria-hidden="true" />

          {/* Authentic Odia Numeral Medallion: ୨୦୨୭ (2027 in Odia script) */}
          <div className="relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#8A1717] text-[#FAF6EE] border border-[#E0A526]/70 shadow-xs">
            {/* Miniature 8-spoke Konark Solar Wheel Vector */}
            <svg
              className="w-3 h-3 text-[#E0A526] shrink-0 animate-[spin_16s_linear_infinite]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
            </svg>
            <span className="font-odia text-sm sm:text-base font-normal tracking-wide text-[#FAF6EE] leading-none pt-0.5">
              ୨୦୨୭
            </span>
          </div>

          {/* Thin Vertical Brass Hairline Divider */}
          <div className="h-4 w-[1px] bg-[#8A1717]/30 shrink-0" aria-hidden="true" />

          {/* English Collector's Edition Headline with Sacred Om Symbol */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-[0.15em] uppercase text-[#8A1717]">
            <span>2027 COLLECTOR&apos;S EDITION</span>
            <span className="text-[#E0A526] font-serif font-bold text-xs sm:text-sm leading-none inline-block" aria-label="Om" title="Om">
              ॐ
            </span>
          </div>

          {/* Limited Run Badge (Desktop & Tablet) */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[#8A1717]/25 bg-[#8A1717]/5 text-[9px] font-mono font-semibold text-[#8A1717]/90 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A1717] animate-pulse" />
            <span>FIRST 500 BOXES</span>
          </div>
        </div>
      </div>
    );
  }

  // Variant 2: Sketched Postal Heritage Stamp (Maximalist Architectural Outline)
  if (activeVariant === "sketched-stamp") {
    return (
      <div className={`relative inline-flex items-center justify-center group ${className}`}>
        <div className="relative inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#FAF6EE] border-2 border-dashed border-[#8A1717] rounded-sm shadow-[2px_2px_0_0_#1B1B1B]">
          <div className="flex items-center gap-1 text-[10px] font-mono text-[#8A1717]/70">
            <Compass className="w-3 h-3 text-[#8A1717]" />
            <span>REF:</span>
          </div>
          <span className="font-odia text-xs font-bold text-[#8A1717] bg-[#E0A526]/20 px-1.5 py-0.5 rounded">
            ୨୦୨୭
          </span>
          <span className="font-mono text-[11px] font-bold text-[#1B1B1B] tracking-widest uppercase">
            BARA MASA · 2027 EDITION
          </span>
          <span className="text-[9px] font-mono text-[#8A1717] font-semibold border-l border-[#8A1717]/30 pl-2">
            ARCHIVAL SPEC
          </span>
        </div>
      </div>
    );
  }

  // Variant 3: Temple Brass Seal Ribbon
  return (
    <div className={`relative inline-flex items-center justify-center group ${className}`}>
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8A1717] via-[#9E1B1B] to-[#8A1717] text-[#FAF6EE] border-2 border-[#E0A526] shadow-[0_2px_8px_rgba(138,23,23,0.35)]">
        <Sparkles className="w-3.5 h-3.5 text-[#E0A526] shrink-0" />
        <span className="font-odia text-xs font-bold text-[#E0A526]">୨୦୨୭ ସଂସ୍କରଣ</span>
        <span className="text-[#E0A526]/60 text-xs">·</span>
        <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white">
          THE 2027 EDITION
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E0A526] animate-ping" />
      </div>
    </div>
  );
}
