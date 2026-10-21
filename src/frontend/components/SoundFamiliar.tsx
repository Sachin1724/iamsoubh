import { PinnedList } from "@/frontend/components/PinnedList";

// Bento layout: 24 cells of area in 4 columns (2 on phones), packed densely.
const L = "col-span-2 row-span-2", T = "row-span-2", W = "col-span-2", S = "";
const COLLAGE = [L, S, T, S, W, T, S, S, T, W, S, S, T, S, S].map((span, i) => ({
  src: `/assets/festival/f${String(i + 1).padStart(2, "0")}.webp`,
  span,
}));

const LINES = [
  "For everyone who misses Odisha without saying it.",
  "Raja came and went. You found out from someone's story.",
  "You watched Rath Yatra on reels. From 1,000 km away. Again.",
  "Maa asked, \"Pitha khailu?\" You said yes. Your last pitha was months ago.",
  "You wished Maa for Pana Sankranti. A day late.",
];

export function SoundFamiliar() {
  return (
    <PinnedList id="sound-familiar" number={2} collage={COLLAGE}>
      <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-wider text-turmeric">Sound familiar?</p>
      <ul className="space-y-3 sm:space-y-5">
        {LINES.map((line) => (
          <li key={line} className="flex gap-3 font-sans text-[1.05rem] font-semibold leading-snug text-white sm:text-2xl">
            <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-turmeric" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-white/25 pt-4 sm:mt-8 sm:pt-6">
        <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wider text-turmeric">This is why we made it</p>
        <p className="font-gazpacho text-2xl font-bold leading-tight text-turmeric sm:text-4xl">
          This calendar keeps the dates for you.
        </p>
        <p className="mt-2 max-w-[44ch] text-[0.85rem] font-light italic leading-snug text-white/85 sm:text-base">
          One card for every month. Keep it on your desk, and when you celebrate, tick the box on the back.
        </p>
      </div>
    </PinnedList>
  );
}
