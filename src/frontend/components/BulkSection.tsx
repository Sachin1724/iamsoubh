"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const TIERS = [
  { count: "10+", perk: "A price that makes sense" },
  { count: "50+", perk: "Bulk price, one invoice" },
  { count: "100+", perk: "Our best price. We sort the rest on WhatsApp" },
];

export function BulkSection({ onRequestQuote }: { onRequestQuote: () => void }) {
  return (
    <section
      id="bulk"
      className="halftone relative overflow-clip bg-pipili-red py-20 text-on-dark scroll-mt-24 sm:py-32"
    >
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="reveal">
          <div className="mb-3 flex items-baseline gap-3 text-turmeric">
            <span className="font-gazpacho text-xl font-bold sm:text-2xl">07</span>
            <span className="text-xs font-bold uppercase tracking-wider sm:text-sm">Bulk and gifting</span>
          </div>

          <h2 className="max-w-[16ch] font-gazpacho text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] text-cream sm:text-5xl lg:text-6xl">
            Ordering for the whole parivar? Or the whole office?
          </h2>

          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-on-dark/85">
            Your office has 40 Odias and zero festival vibes. Fix that. For teams, Odia associations, housing
            societies, wedding return gifts, and a new-year gift that isn&apos;t another diary. Ten boxes or more, and
            I&apos;ll send you a price that makes sense.
          </p>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-6 border-t border-white/20 pt-6">
            {TIERS.map((t) => (
              <div key={t.count}>
                <dt className="font-gazpacho text-2xl font-bold text-turmeric">{t.count}</dt>
                <dd className="mt-1 text-sm leading-snug text-on-dark/75">{t.perk}</dd>
              </div>
            ))}
          </dl>

          <button
            onClick={onRequestQuote}
            className="mt-8 inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-full bg-turmeric px-7 font-gazpacho text-base font-bold text-ink transition-transform active:scale-[0.97]"
          >
            Request a quote
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="reveal mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-3xl bg-cream shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
            <Image
              src="/assets/product%20mockup/View%204.png"
              alt="The festival cards"
              width={900}
              height={600}
              sizes="(max-width: 1024px) 90vw, 520px"
              className="h-auto w-full scale-[1.6] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
