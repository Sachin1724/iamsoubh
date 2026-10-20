import React from "react";
import { Lock, ArrowDown } from "lucide-react";
import { siteConfig } from "@/config/site-config";
import { StoryStage, type StoryBeat } from "@/components/StoryStage";

/**
 * Section 03. A short pinned story of the box, then the contents as a list
 * you can read in four seconds.
 */
const BEATS: StoryBeat[] = [
  {
    image: "/assets/story/card-january.jpg",
    position: "50% 45%",
    title: "12 months. 13 festivals.",
    body: "A painting on the front, the month's dates on the back.",
  },
  {
    image: "/assets/story/box-hand.jpg",
    position: "45% 55%",
    title: "One card stays sealed.",
    body: "The 13th parba. One of three. You meet yours when the box lands.",
  },
  {
    image: "/assets/story/flatlay.jpg",
    position: "55% 40%",
    title: "And a few things for home.",
    body: "A New Year postcard, a sticker sheet, a handwritten thank-you.",
    accent: true,
  },
];

const CONTENTS = [
  { count: "12", name: "festival cards", note: "A painting on the front, the month's dates on the back." },
  { count: "1", name: "sealed 13th parba", note: "One of three. You meet yours when the box lands.", sealed: true },
  { count: "1", name: "Odia New Year postcard", note: "Pana Sankranti wishes, ready to send home." },
  { count: "1", name: "sticker sheet", note: "Parba art for your laptop and your diary." },
  { count: "1", name: "thank-you card", note: "Handwritten, in every box." },
];

export function InsideTheBox() {
  return (
    <>
      <StoryStage id="inside-calendar" number="03" beats={BEATS} />

      <section id="inside-list" className="relative z-10 bg-pipili-cream py-16 text-on-light sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-6 font-gazpacho text-[2rem] font-bold leading-[1.05] text-pipili-red sm:text-5xl">
            What you get inside.
          </h2>
          <ul>
            {CONTENTS.map((item) => (
              <li
                key={item.name}
                className={`-mx-3 flex gap-5 rounded-xl px-3 py-4 ${item.sealed ? "bg-gold/40" : ""}`}
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

          <p className="mt-4 text-center text-[0.9375rem] font-semibold text-on-light/70">
            From ₹230 a box · {siteConfig.freeDeliveryLabel}
          </p>
        </div>
      </section>
    </>
  );
}
