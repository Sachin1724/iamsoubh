"use client";

import React, { useState } from "react";
import { Plus, MessageCircle } from "lucide-react";
import { Ambient } from "@/components/Ambient";
import { faqs } from "@/data/faq";
import { siteConfig } from "@/config/site-config";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-[#F6EFE2] text-[#1B1B1B] relative overflow-hidden scroll-mt-24"
      style={{ scrollMarginTop: "96px" }}
    >
      <Ambient variant="dots" count={10} className="text-[#C8221A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Heading and Question Illustration */}
          <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-28 self-start">
            <span className="font-disko block text-[64px] sm:text-[96px] leading-none text-[#C4A882]/75 select-none">
              08
            </span>
            <p className="text-sm font-semibold -mt-2 sm:-mt-3 mb-2 text-[#8A1717]">
              08 · Questions
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#C8221A] leading-none">
              Got questions?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#4A4642] leading-relaxed">
              Everything you need to know about pre-ordering, shipping dates, and fulfillment.
            </p>

            {/* Cute Illustration Badge */}
            <div className="reveal mt-8 relative p-6 rounded-3xl bg-[#FEF3C7] border-2 border-[#E0A526] shadow-sm max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#3E9B47] text-[#1B1B1B] flex items-center justify-center font-black text-2xl shadow-xs shrink-0">
                  ?
                </div>
                <div>
                  <span className="font-bold text-sm text-[#1B1B1B] block leading-snug">
                    Still have questions?
                  </span>
                  <a
                    href={siteConfig.whatsappWaitlistUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8221A] hover:underline mt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat with Soubh on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion Rows */}
          <div className="lg:col-span-8 space-y-3 deal-stagger">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border-2 border-[#1B1B1B] bg-white overflow-hidden press"
                  style={{ boxShadow: isOpen ? "3px 3px 0 0 #1B1B1B" : "5px 5px 0 0 #1B1B1B" }}
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${faq.id}-panel`}
                    id={`${faq.id}-trigger`}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#1B1B1B] cursor-pointer hover:bg-[#FFFAF0] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#C8221A]"
                  >
                    <span>{faq.question}</span>
                    <span className="w-8 h-8 rounded-full bg-[#F6EFE2] border-2 border-[#1B1B1B] flex items-center justify-center shrink-0 text-[#1B1B1B]">
                      <Plus
                        className="w-4 h-4 transition-transform duration-200 motion-reduce:transition-none"
                        style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                      />
                    </span>
                  </button>

                  <div
                    id={`${faq.id}-panel`}
                    role="region"
                    aria-labelledby={`${faq.id}-trigger`}
                    // Collapsed panels keep their links out of the tab order.
                    inert={!isOpen}
                    className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 text-sm sm:text-base text-[#4A4642] leading-relaxed border-t-2 border-[#D8C9B9] pt-3">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
