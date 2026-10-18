import React from "react";
import Image from "next/image";
import { Lock, ArrowDown } from "lucide-react";
import { siteConfig } from "@/config/site-config";

/**
 * Section 03. One big picture of the cards, and the contents of the box as a
 * list you can read in four seconds. No background footage, no tiles, no
 * second column of ornament: the cards carry the section.
 */
const CONTENTS = [
  { count: "12", name: "festival cards", note: "A painting on the front, the month's dates on the back." },
  { count: "1", name: "sealed 13th parba", note: "One of three. You meet yours when the box lands.", sealed: true },
  { count: "1", name: "Odia New Year postcard", note: "Pana Sankranti wishes, ready to send home." },
  { count: "1", name: "sticker sheet", note: "Parba art for your laptop and your diary." },
  { count: "1", name: "thank-you card", note: "Handwritten, in every box." },
];

export function InsideTheBox() {
  return (
    <section
      id="inside-calendar"
      className="relative z-10 overflow-clip bg-pipili-cream pb-24 pt-28 text-on-light scroll-mt-28 sm:pb-32 sm:pt-36"
    >
      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-gazpacho text-xl font-bold sm:text-2xl">03</span>
          <span className="text-xs font-bold uppercase tracking-wider sm:text-sm">
            Inside the box
          </span>
        </div>

        <h2 className="u-display reveal-spring max-w-[16ch] font-gazpacho font-bold">
          12 months. 13 festivals.
        </h2>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 sm:mt-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          {/* The cards, as large as the column allows */}
          <div
            data-scroll-media
            className="relative -mx-4 aspect-[5/4] sm:mx-0 sm:aspect-4/3 lg:sticky lg:top-28"
          >
            <Image
              src="/assets/product%20mockup/View%204.png"
              alt="The 2027 festival cards"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className="scale-[1.3] object-contain drop-shadow-[0_18px_30px_rgba(90,15,20,0.2)] sm:scale-[1.4] lg:scale-[1.55]"
            />
          </div>

          {/* What you get, as a list, with the sealed card as the one accent */}
          <div>
            <ul className="reveal-spring-stagger">
              {CONTENTS.map((item) => (
                <li
                  key={item.name}
                  className={`-mx-3 flex gap-5 rounded-xl px-3 py-4 transition-colors ${
                    item.sealed ? "bg-gold/40" : "hover:bg-on-light/[0.04]"
                  }`}
                >
                  <span className="u-figure w-8 shrink-0 font-gazpacho text-[1.75rem] font-bold leading-none text-pipili-red">
                    {item.count}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-gazpacho text-lg font-bold leading-[1.15] tracking-[-0.012em]">
                      {item.name}
                      {item.sealed && <Lock className="h-3.5 w-3.5 shrink-0 text-pipili-red" />}
                    </span>
                    <span className="mt-1 block max-w-[38ch] text-[0.9375rem] leading-[1.5] text-on-light/70">
                      {item.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#preorder"
              className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-pipili-red px-6 font-gazpacho text-base font-bold text-on-dark shadow-[4px_4px_0_0_var(--color-ink)] transition-all hover:shadow-[5px_5px_0_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px]"
            >
              Pre-order now
              <ArrowDown className="h-4 w-4" />
            </a>

            <p className="mt-4 text-center text-[0.9375rem] font-semibold text-on-light/70 lg:text-left">
              From ₹230 a box · {siteConfig.freeDeliveryLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
