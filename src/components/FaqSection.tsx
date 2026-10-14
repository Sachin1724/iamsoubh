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
      className="py-16 sm:py-24 bg-[#F6EFE2] text-[#1B1B1B] relative overflow-hidden scroll-mt-24"
    >
      {/* 1. Folk Background Pattern Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "200px",
        }}
      />

      {/* 2. Left Faint Temple Spire Sketch with Gentle Breathing Motion */}
      <div
        className="absolute top-12 -left-10 sm:left-4 w-[280px] sm:w-[360px] h-[480px] pointer-events-none select-none opacity-15 mix-blend-multiply z-0 animate-temple-breathe"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/temple-konark.webp"
          alt=""
          fill
          className="object-contain object-top"
        />
      </div>

      {/* 3. Right Red Hibiscus Floral Cluster with Soft Wind-Sway */}
      <div
        className="absolute top-16 -right-12 sm:-right-16 w-[220px] sm:w-[300px] h-[340px] sm:h-[440px] pointer-events-none select-none z-10 animate-sway-soft-right"
        aria-hidden="true"
      >
        <Image
          src="/assets/scene/foliage-right-corner.webp"
          alt=""
          fill
          className="object-contain object-right-top drop-shadow-xl"
        />
      </div>

      {/* 4. Main Section Container */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-20">
        
        {/* Header Block */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="font-gazpacho text-[#C4A882] text-xl sm:text-2xl font-bold block mb-1">
            08
          </span>
          <h2 className="font-gazpacho text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#8A1717] leading-none">
            QUESTIONS
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#1B1B1B]/80 font-medium">
            The short answers to the long ones.
          </p>
        </div>

        {/* One row-wise grid, so the two columns stay on the same baselines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 items-start">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="self-start border-b border-[#D5C7B3]">
                <button
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1B1B1B] hover:text-[#8A1717] cursor-pointer transition-colors"
                >
                  <span>{faq.question}</span>
                  <Plus
                    className="w-4 h-4 text-[#8A1717] shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  />
                </button>
                {/* 0fr → 1fr animates the height without measuring it */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-xs sm:text-sm text-[#1B1B1B]/80 leading-relaxed font-medium">
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
