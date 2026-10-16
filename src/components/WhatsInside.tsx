"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Calendar,
  HelpCircle,
  Heart,
  Tag,
  Package,
  CheckCircle2,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { WaxSeal } from "./WaxSeal";

export interface BoxGoodie {
  id: string;
  count: string;
  badge: string;
  title: string;
  odiaTitle: string;
  desc: string;
  specs: string;
  image: string;
  iconBg: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function WhatsInside() {
  const [active, setActive] = useState("cards");

  const contents: BoxGoodie[] = [
    {
      id: "cards",
      count: "12",
      badge: "CORE COLLECTIBLE",
      title: "12 Monthly Festival Cards",
      odiaTitle: "୧୨ଟି ମାସିକ ପର୍ବ କାର୍ଡ",
      desc: "8 × 11 cm thick board with curved corners. Rich Odia festival art on the front, full Odia & Gregorian dates with tradition tracker checkboxes on the back.",
      specs: "350 GSM Art Board · Matte Laminated · Rounded Corners",
      icon: Calendar,
      iconBg: "bg-[#FEF3C7] text-[#D97706]",
      image: "/assets/product/cards-fanned.webp",
    },
    {
      id: "mystery",
      count: "01",
      badge: "SECRET DROP",
      title: "The 13th Mystery Parba",
      odiaTitle: "ତେର ନମ୍ବର ରହସ୍ୟ ପର୍ବ",
      desc: "Odisha has 13 festivals in 12 months. Every box contains one secret regional festival (Coastal, Western, or Southern Odisha). You only discover which one when you crack the wax seal.",
      specs: "Golden Wax Seal Envelope · Secret Gold-Foil Card",
      icon: HelpCircle,
      iconBg: "bg-[#FFE4E6] text-[#E11D48]",
      image: "/assets/parba/13th-parba-sealed.webp",
    },
    {
      id: "stickers",
      count: "24",
      badge: "VIRAL GOODIE",
      title: "Odia Pop-Culture Sticker Sheet",
      odiaTitle: "ଓଡ଼ିଆ କଲଚର୍ ଷ୍ଟିକର୍ ଶିଟ୍",
      desc: "24 die-cut waterproof vinyl stickers of classic Odia street foods (Dahibara Aloodum, Chhena Poda, Manda Pitha), Mandira & Jagannath motifs, and slangs for your laptop, bottle & phone.",
      specs: "A5 Sheet · Waterproof Matte Vinyl · Easy-Peel Die-Cut",
      icon: Sparkles,
      iconBg: "bg-[#DCFCE7] text-[#16A34A]",
      image: "/assets/product/stickers-sheet.webp",
    },
    {
      id: "new-year",
      count: "01",
      badge: "GIFT POSTCARD",
      title: "Odia New Year Postcard",
      odiaTitle: "ପଣା ସଂକ୍ରାନ୍ତି ପୋଷ୍ଟକାର୍ଡ",
      desc: "A standalone keepsake postcard celebrating Pana Sankranti (14 April). Pre-printed festival art on the front with blank handwriting lines on the back, ready to gift to family.",
      specs: "300 GSM Textured Pulp · Writeable Matte Back",
      icon: Tag,
      iconBg: "bg-[#FFEDD5] text-[#EA580C]",
      image: "/assets/product/odia-new-year-card.webp",
    },
    {
      id: "note",
      count: "01",
      badge: "PERSONAL TOUCH",
      title: "Handwritten Creator Letter",
      odiaTitle: "ସୌଭାଗ୍ୟଙ୍କ ହାତଲେଖା ଚିଠି",
      desc: "A personal handwritten letter from creator Soubhagya Ranjan detailing why this calendar was born, its folk art roots, and a warm blessing for your home.",
      specs: "Vintage Parchment Finish · Creator Signature",
      icon: Heart,
      iconBg: "bg-[#F3E8FF] text-[#9333EA]",
      image: "/assets/product/thank-you-note.webp",
    },
    {
      id: "box",
      count: "01",
      badge: "COLLECTOR CHEST",
      title: "Magnetic Keepsake Rigid Box",
      odiaTitle: "ପ୍ରିମିୟମ୍ ସଂଗ୍ରହ ବାକ୍ସ",
      desc: "Deep crimson heavy-duty rigid gift box stamped with gold-foil temple motifs. Designed to survive shipping without a dent and live permanently on your desk or bookshelf.",
      specs: "Embossed Rigid Board · Magnetic Clasp · Gold Foil Stamped",
      icon: Package,
      iconBg: "bg-[#E0E7FF] text-[#4F46E5]",
      image: "/assets/product/box-open.webp",
    },
  ];

  const activeItem = contents.find((c) => c.id === active) || contents[0];

  return (
    <section
      id="whats-inside"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="reveal text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8A1717]/10 border border-[#8A1717]/25 text-[#8A1717] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="font-odia text-sm font-semibold">କ&apos;ଣ ଅଛି ବାକ୍ସରେ?</span>
            <span className="w-1 h-1 rounded-full bg-[#8A1717]" />
            <span>03B · What&apos;s In The Box</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#1B1B1B] leading-tight font-gazpacho">
            Every Goodie. <span className="text-[#8A1717]">Unboxed.</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#1B1B1B]/80 font-subtext italic font-medium max-w-2xl mx-auto">
            No cheap fillers or flimsy paper. Every single item inside this box is crafted to survive the courier and live proudly on your desk all year.
          </p>
        </div>

        {/* Interactive Unboxing Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: 6 Goodies List (7 cols) */}
          <div className="lg:col-span-7" role="tablist" aria-label="Box inclusions">
            <div className="space-y-2.5 sm:space-y-3">
              {contents.map((item) => {
                const IconComp = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`inside-tab-${item.id}`}
                    aria-selected={isActive}
                    aria-controls="inside-panel"
                    onClick={() => setActive(item.id)}
                    onMouseEnter={() => setActive(item.id)}
                    onFocus={() => setActive(item.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#8A1717] ${
                      isActive
                        ? "bg-white border-[#8A1717] shadow-[5px_5px_0_0_#1B1B1B] -translate-y-0.5"
                        : "bg-white/70 border-[#D5C7B3] hover:bg-white hover:border-[#1B1B1B]/40 shadow-[2px_2px_0_0_rgba(27,27,27,0.1)]"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      {/* Count / Icon Badge */}
                      <div
                        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isActive ? "scale-105 -rotate-3" : ""
                        }`}
                      >
                        <IconComp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                        <span className="absolute -top-1.5 -right-1.5 text-[9.5px] font-black px-1.5 py-0.5 rounded-full bg-[#1B1B1B] text-[#FAF6EE] shadow-sm">
                          {item.count}
                        </span>
                      </div>

                      {/* Content Body */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8A1717]/10 text-[#8A1717]">
                            {item.badge}
                          </span>
                          <span className="text-xs font-odia text-black/50 font-medium">
                            {item.odiaTitle}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#1B1B1B] leading-snug">
                          {item.title}
                        </h3>

                        {/* Accordion Revelation on active */}
                        <div
                          className="grid transition-[grid-template-rows] duration-200 ease-out"
                          style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                        >
                          <div className="overflow-hidden">
                            <p className="pt-1.5 text-xs sm:text-sm text-[#4A4642] leading-relaxed font-subtext font-normal">
                              {item.desc}
                            </p>
                            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8A1717] bg-[#F6EFE2] px-2.5 py-1 rounded-md border border-[#D5C7B3]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#3E9B47]" />
                              <span>{item.specs}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: High-Res Interactive Inspection Deck (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div
              id="inside-panel"
              role="tabpanel"
              aria-labelledby={`inside-tab-${active}`}
              className="relative w-full rounded-3xl overflow-hidden bg-white p-5 sm:p-6 border-2 border-[#1B1B1B] shadow-[6px_6px_0_0_#1B1B1B] flex flex-col items-center justify-between"
            >
              {/* Top Banner Chip */}
              <div className="w-full flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E5DAC8]">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#8A1717]">
                  {activeItem.badge}
                </span>
                <span className="text-xs font-bold text-[#1B1B1B] bg-[#E0A526] px-2.5 py-0.5 rounded-full border border-[#1B1B1B]">
                  Qty: {activeItem.count}
                </span>
              </div>

              {/* Central Visual Stage */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF6EE] border border-[#E5DAC8] flex items-center justify-center p-3">
                {contents.map((item) => (
                  <div
                    key={item.id}
                    className={`absolute inset-3 transition-opacity duration-300 ${
                      active === item.id ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
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
                        sizes="(max-width: 1024px) 90vw, 450px"
                        className="object-contain drop-shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/product/box-open.webp";
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Caption & Specs */}
              <div className="w-full mt-4 text-center">
                <h4 className="text-lg font-bold text-[#1B1B1B] leading-tight font-gazpacho">
                  {activeItem.title}
                </h4>
                <p className="text-xs text-black/70 font-subtext italic mt-1">
                  {activeItem.specs}
                </p>
                <div className="mt-3 pt-3 border-t border-[#E5DAC8] flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#8A1717]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3E9B47]" />
                  <span>100% Included in every Single & Family Box</span>
                </div>
              </div>
            </div>

            {/* Cultural Anchor Note */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#E0A526]/20 border border-[#E0A526]/50 text-center">
              <p className="font-gazpacho text-base sm:text-lg text-[#8A1717] tracking-wide font-bold">
                &ldquo;The box is minimal. Odisha never was.&rdquo;
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Specs & Material Quality Matrix */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white border-2 border-[#1B1B1B] shadow-[3px_3px_0_0_#1B1B1B] flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#8A1717] shrink-0" />
            <div>
              <p className="text-xs font-bold leading-tight">350 GSM Board</p>
              <p className="text-[10px] text-black/60 font-subtext">Sturdy, never sags on desk</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border-2 border-[#1B1B1B] shadow-[3px_3px_0_0_#1B1B1B] flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#16A34A] shrink-0" />
            <div>
              <p className="text-xs font-bold leading-tight">Waterproof Vinyl</p>
              <p className="text-[10px] text-black/60 font-subtext">24 stickers for laptop/bottle</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border-2 border-[#1B1B1B] shadow-[3px_3px_0_0_#1B1B1B] flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#E11D48] shrink-0" />
            <div>
              <p className="text-xs font-bold leading-tight">Wax-Sealed 13th</p>
              <p className="text-[10px] text-black/60 font-subtext">Secret regional parba drop</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white border-2 border-[#1B1B1B] shadow-[3px_3px_0_0_#1B1B1B] flex items-center gap-3">
            <Package className="w-5 h-5 text-[#4F46E5] shrink-0" />
            <div>
              <p className="text-xs font-bold leading-tight">Rigid Gift Box</p>
              <p className="text-[10px] text-black/60 font-subtext">Magnetic keepsake collector chest</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
