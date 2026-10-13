"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site-config";

export function BulkSection({ onRequestQuote }: { onRequestQuote: () => void }) {
  return (
    <section
      id="bulk"
      className="relative py-16 sm:py-24 bg-[#8A1717] text-[#F6EFE2] scroll-mt-24"
      style={{ scrollMarginTop: "96px" }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <span className="font-disko block text-[64px] sm:text-[96px] leading-none text-[#A8302A] select-none">
          07
        </span>
        <p className="text-sm font-semibold -mt-3 mb-2">07 · Bulk and gifting</p>

        <h2 className="font-disko text-3xl sm:text-5xl leading-[1.05] max-w-3xl">
          Ordering for the whole parivar? Or the whole office?
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-3xl reveal-stagger">
          <p className="text-base sm:text-lg leading-relaxed text-[#F6EFE2]/90">
            Your office has 40 Odias and zero festival vibes. Fix that.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-[#F6EFE2]/90">
            For teams, Odia associations, housing societies, wedding return gifts, and a new-year
            gift that isn&apos;t another diary. Ten boxes or more, and I&apos;ll send you a price
            that makes sense.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 reveal">
          <button
            onClick={onRequestQuote}
            className="min-h-[52px] px-7 rounded-full bg-[#E0A526] text-[#1B1B1B] font-disko text-lg inline-flex items-center justify-center gap-2 border-2 border-[#1B1B1B] press lift cursor-pointer"
            style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
          >
            <span>Request a quote</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <a
            href={siteConfig.whatsappBulkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4 decoration-2 text-[#F6EFE2]"
          >
            Or just WhatsApp me
          </a>
        </div>
      </div>
    </section>
  );
}
