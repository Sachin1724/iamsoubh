"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { faqs } from "@/data/faq";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };


  return (
    <section
      id="faq"
      className="halftone-ink [--ht-at:0%_100%] py-24 sm:py-36 bg-pipili-yellow text-on-light relative overflow-hidden scroll-mt-24"
    >

      {/* Mandala on the top-right corner, slowly turning */}
      <div className="absolute top-0 right-0 w-[240px] sm:w-[340px] aspect-square translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <div
          className="w-full h-full opacity-30 bg-line-yellow animate-spin-slow"
          style={{
            maskImage: "url('/assets/motifs/mandala-laser-1200.png')",
            WebkitMaskImage: "url('/assets/motifs/mandala-laser-1200.png')",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />
      </div>

      {/* 4. Main Section Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header Block */}
        <div className="reveal max-w-2xl mb-12 sm:mb-16">
          <span className="font-gazpacho text-on-light/60 text-xl sm:text-2xl font-bold block mb-1">
            08
          </span>
          <h2 className="font-gazpacho text-4xl sm:text-6xl font-bold uppercase tracking-tight text-on-light leading-none">
            QUESTIONS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-on-light/80 font-subtext font-normal leading-relaxed">
            The short answers to the long ones.
          </p>
        </div>

        {/* One row-wise grid, so the two columns stay on the same baselines */}
        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-x-12 items-start">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="self-start border-b border-on-light/20">
                <button
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-on-light hover:text-pipili-red cursor-pointer transition-colors"
                >
                  <span>{faq.question}</span>
                  <Plus
                    className="w-4 h-4 text-pipili-red shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  />
                </button>
                {/* 0fr → 1fr animates the height without measuring it */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-[15px] sm:text-base text-ink/80 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
