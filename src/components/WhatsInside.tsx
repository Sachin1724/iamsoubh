"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Calendar, HelpCircle, Heart, Tag, FileText } from "lucide-react";
import { WaxSeal } from "./WaxSeal";

export function WhatsInside() {
  const [active, setActive] = useState("cards");
  const contents = [
    {
      id: "cards",
      title: "12 festival cards",
      desc: "8 × 11 cm, thick board, rounded corners, each with Tradition Tracker boxes.",
      icon: Calendar,
      iconBg: "bg-[#F6EFE2] text-[#D97706]",
      image: "/assets/product/cards-fanned.webp",
      count: "12",
    },
    {
      id: "mystery",
      title: "1 sealed 13th parba",
      desc: "One from the coast, one from the west, one from the heart of Odisha. You find out which when you tear it open.",
      icon: HelpCircle,
      iconBg: "bg-[#FFE4E6] text-[#E11D48]",
      image: "/assets/13th-parba-mystery-concept.png",
      count: "01",
    },
    {
      id: "new-year",
      title: "An Odia New Year card",
      desc: "For 14 April (Pana Sankranti), ready to write on and give to someone.",
      icon: Tag,
      iconBg: "bg-[#FFEDD5] text-[#EA580C]",
      image: "/assets/product/odia-new-year-card.webp",
      count: "01",
    },
    {
      id: "stickers",
      title: "A sticker sheet",
      desc: "High-grade vinyl stickers of Odia food, slangs, and attitude for your laptop & phone.",
      icon: Sparkles,
      iconBg: "bg-[#DCFCE7] text-[#16A34A]",
      image: "/assets/product/stickers-sheet.webp",
      count: "01",
    },
    {
      id: "note",
      title: "A thank-you note",
      desc: "A personal handwritten note from Soubhagya Ranjan.",
      icon: Heart,
      iconBg: "bg-[#F3E8FF] text-[#9333EA]",
      image: "/assets/product/thank-you-note.webp",
      count: "01",
    },
  ];

  return (
    <section
      id="whats-inside"
      className="py-16 sm:py-24 bg-[#F6EFE2] text-[#1B1B1B] relative overflow-hidden scroll-mt-24"
      style={{ scrollMarginTop: "96px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Turmeric panel, so the contents list reads as its own block */}
        <div
          className="rounded-3xl bg-[#E0A526] border-2 border-[#1B1B1B] p-6 sm:p-10 lg:p-14"
          style={{ boxShadow: "8px 8px 0 0 #1B1B1B" }}
        >

        {/* Section Header */}
        <div className="reveal text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1B1B1B] mb-2">
            <span className="font-odia text-base">କ&apos;ଣ ଅଛି?</span>
            <span>· Complete 2027 Contents</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#1B1B1B] leading-none">
            What&apos;s inside?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#1B1B1B]/80 font-subtext italic font-medium">
            Every single component is crafted to survive the courier and live on your desk all year.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: pick an item, the panel on the right answers */}
          <div className="lg:col-span-6" role="tablist" aria-label="Box contents">
            <div className="space-y-3 reveal-stagger">
              {contents.map((item, i) => {
                const IconComp = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    id={`inside-tab-${item.id}`}
                    aria-selected={isActive}
                    aria-controls="inside-panel"
                    onClick={() => setActive(item.id)}
                    onMouseEnter={() => setActive(item.id)}
                    onFocus={() => setActive(item.id)}
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-[transform,box-shadow,background-color] duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B1B] ${
                      isActive
                        ? "bg-white border-[#1B1B1B] -translate-y-0.5 shadow-[5px_5px_0_0_#1B1B1B]"
                        : "bg-white/70 border-[#1B1B1B]/15 hover:bg-white shadow-[2px_2px_0_0_rgba(27,27,27,0.25)]"
                    }`}
                  >
                    <div
                      className={`relative w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                        isActive ? "scale-110 -rotate-6" : ""
                      }`}
                    >
                      <IconComp className="w-5 h-5 stroke-[2.2]" />
                      <span className="absolute -top-2 -right-2 text-[10px] font-black tabular-nums px-1.5 py-0.5 rounded-full bg-[#1B1B1B] text-[#F6EFE2]">
                        {item.count}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1B1B1B] leading-snug">
                        {item.title}
                      </h3>
                      {/* The blurb belongs to the selected row only, so the list stays scannable. */}
                      <div
                        className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
                        style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                      >
                        <p className="overflow-hidden text-xs sm:text-sm text-[#4A4642] leading-relaxed">
                          <span className="block pt-1">{item.desc}</span>
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Closing Brand Quote */}
            <div className="pt-5 px-2">
              <p className="font-display text-2xl sm:text-3xl text-[#C8221A] tracking-wide">
                &ldquo;The box is minimal. Odisha never was.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: shows whichever item is selected */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              id="inside-panel"
              role="tabpanel"
              aria-labelledby={`inside-tab-${active}`}
              className="relative w-full max-w-[520px] aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden bg-white p-4 border-2 border-[#1B1B1B] flex items-center justify-center"
              style={{ boxShadow: "8px 8px 0 0 #1B1B1B" }}
            >
              {contents.map((item) => (
                <div
                  key={item.id}
                  className={`absolute inset-4 transition-opacity duration-300 motion-reduce:transition-none ${
                    active === item.id ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={active !== item.id}
                >
                  {item.id === "mystery" ? (
                    <WaxSeal image={item.image} />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 520px"
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/product-box-concept.png";
                      }}
                    />
                  )}
                </div>
              ))}

              <div className="absolute top-5 right-5 bg-[#E0A526] text-[#1B1B1B] text-xs font-bold px-3 py-1.5 rounded-full border-2 border-[#1B1B1B] rotate-3">
                <span>{contents.find((c) => c.id === active)?.title}</span>
              </div>
            </div>
          </div>

        </div>

        </div>
      </div>
    </section>
  );
}
