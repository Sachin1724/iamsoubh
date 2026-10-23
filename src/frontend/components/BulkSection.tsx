"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cta } from "@/frontend/components/ui/cta";

const TIERS = [
  { count: "10+", perk: "Custom sleeve" },
  { count: "25+", perk: "Your logo on the box" },
  { count: "50+", perk: "Best price, one invoice" },
];

export function BulkSection({ onRequestQuote }: { onRequestQuote: () => void }) {
  return (
    <section
      id="bulk" data-snap
      className="halftone relative flex min-h-[100dvh] items-center overflow-clip bg-pipili-red pb-[5.5rem] pt-[5.25rem] text-on-dark scroll-mt-0 md:pb-16 sm:pt-24"
    >
      <div className="reveal relative mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-3 flex items-baseline justify-center gap-3 text-turmeric">
          <span className="text-xs font-bold uppercase tracking-wider sm:text-sm">Bulk and gifting</span>
        </div>

        <h2 data-scroll-rise className="mx-auto max-w-[18ch] font-gazpacho text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] text-cream sm:text-5xl lg:text-6xl">
          For your parivar. Or your office.
        </h2>

        <p data-scroll-words className="mx-auto mt-5 max-w-[46ch] text-base leading-relaxed text-on-dark/85">
          Corporate teams, Odia associations, wedding return-gifts. Ten boxes or more, and I&apos;ll send you a
          price that makes sense.
        </p>

        <dl className="mx-auto mt-6 grid max-w-3xl grid-cols-3 gap-2 sm:mt-10 sm:gap-4">
          {TIERS.map((t) => (
            <div key={t.count} className="rounded-2xl border border-white/20 bg-white/5 px-2 py-3 sm:px-5 sm:py-5">
              <dt className="font-gazpacho text-xl font-bold text-turmeric sm:text-3xl">{t.count}<span className="block text-xs font-normal sm:inline sm:text-3xl sm:font-bold"> boxes</span></dt>
              <dd className="mt-1 text-xs leading-snug text-on-dark/80 sm:text-sm">{t.perk}</dd>
            </div>
          ))}
        </dl>

        <button onClick={onRequestQuote} className={`mt-6 w-full sm:mt-10 sm:w-auto ${cta("gold")}`}>
          Request a quote
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
