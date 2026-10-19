"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function BulkSection({ onRequestQuote }: { onRequestQuote: () => void }) {
  return (
    <section
      id="bulk"
      className="relative py-24 sm:py-36 bg-pipili-red text-on-dark scroll-mt-24 overflow-clip"
    >

      {/* Folk pattern texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-repeat z-0"
        style={{ backgroundImage: "url('/assets/folk-pattern-tile.png')", backgroundSize: "180px" }}
        aria-hidden="true"
      />

      {/* 3. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & CTA Column (8 Cols) */}
          <div className="reveal lg:col-span-7 flex flex-col items-start">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-gazpacho text-turmeric font-bold text-xl sm:text-2xl">
                07
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-turmeric/85">
                BULK AND GIFTING
              </span>
            </div>

            <h2 className="font-gazpacho text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-cream max-w-2xl">
              For your parivar. Or your office.
            </h2>

            <div className="mt-6 space-y-3 max-w-xl text-sm sm:text-base text-rice/90 leading-relaxed font-medium">
              <p>
                Your office has 40 Odias and zero festival vibes. Fix that.
              </p>
              <p>
                For corporate teams, coworkers, Odia associations, housing societies, wedding return-gifts, and a new-year gift that isn&apos;t another diary. Ten boxes or more, and I&apos;ll send you a price that makes sense.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onRequestQuote}
                className="py-3 px-6 rounded-full bg-turmeric hover:bg-[#cca322] text-ink font-gazpacho text-sm sm:text-base font-bold active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request a quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

            {/* Tier strip: what each volume actually gets you */}
            <div className="reveal-stagger mt-8 grid w-full max-w-xl grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { count: "10+", perk: "Coworker gifts · custom sleeve" },
                { count: "25+", perk: "Your logo on the box" },
                { count: "50+", perk: "Best price, one invoice" },
              ].map((tier) => (
                <div
                  key={tier.count}
                  className="group rounded-xl border border-turmeric/35 bg-black/15 px-3 py-3 transition-colors duration-300 hover:border-turmeric hover:bg-black/25"
                >
                  <span className="block font-gazpacho text-xl font-bold text-turmeric transition-transform duration-300 group-hover:-translate-y-0.5">
                    {tier.count}
                  </span>
                  <span className="block text-xs font-semibold leading-snug text-turmeric/85">
                    {tier.perk}
                  </span>
                </div>
              ))}
              {/* Handwritten stamp note */}
              <div className="absolute -top-5 -right-4 z-20 rotate-6 select-none animate-float-gentle transition-transform duration-500 group-hover:rotate-2">
                <div className="rounded border border-[#E6C63B] bg-gold px-3 py-2 text-xs font-editorial font-bold leading-tight text-brand shadow-md">
                  Same calendar. <br />
                  More people. <br />
                  More parba.
                </div>
              </div>
            </div>
          </div>

          {/* Right: the actual box, stacked and tilting on hover */}
          <div className="reveal lg:col-span-5 flex items-center justify-center">
            <div className="group relative w-[260px] sm:w-[320px] [perspective:1200px]">
              {/* Two shadow boxes behind, so ten boxes reads as a stack */}
              <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-2xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] bg-[#6E1214] transition-transform duration-500 ease-out group-hover:translate-x-8 group-hover:translate-y-8" />
              <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] bg-[#A8302A] transition-transform duration-500 ease-out group-hover:translate-x-4 group-hover:translate-y-4" />

              <div className="relative overflow-hidden rounded-2xl border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] bg-cream transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(6deg)_rotateY(-8deg)_translateY(-6px)]">
                <Image
                  src="/assets/product%20mockup/View%204.png"
                  alt="The festival cards"
                  width={640}
                  height={480}
                  className="h-auto w-full scale-110 object-contain"
                />
                <div className="flex items-center justify-between gap-2 bg-ink px-3 py-2">
                  <span className="font-gazpacho text-sm font-bold text-white">Bulk Parivar Pack</span>
                  <span className="rounded-full bg-turmeric px-2 py-0.5 text-xs font-black text-ink">
                    10+ BOXES
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
