import { products, siteConfig } from "@/config/site-config";
import { PinnedList } from "@/frontend/components/PinnedList";

const ITEMS = [
  { count: "12", title: "festival cards", body: "A painting on the front, the month's dates on the back." },
  { count: "1", title: "sealed 13th parba", body: "One of three. You meet yours when the box lands." },
  { count: "1", title: "Odia New Year postcard", body: "Pana Sankranti wishes, ready to send home." },
  {
    count: "1",
    title: "premium surprise sticker set",
    body: "Parba art for your laptop and your diary. A different surprise in every box.",
  },
];

/** Section 03. The contents of the box as one list over a single photo. */
export function InsideTheBox() {
  return (
    <PinnedList id="inside-calendar" number={3} image="/assets/story/flatlay.jpg" position="55% 40%">
      <h2 className="font-gazpacho text-3xl font-bold leading-tight text-white sm:text-5xl">What you get inside.</h2>
      <p className="mb-5 mt-1 text-[0.85rem] font-light italic text-white/80 sm:text-base">
        Everything in the box, in the order you will find it.
      </p>
      <ul className="space-y-3 sm:space-y-5">
        {ITEMS.map((it) => (
          <li key={it.title} className="flex items-baseline gap-3 sm:gap-4">
            <span className="w-10 shrink-0 font-gazpacho text-3xl font-bold leading-none text-turmeric sm:w-16 sm:text-5xl">
              {it.count}
            </span>
            <span>
              <span className="block font-gazpacho text-lg font-bold leading-tight text-white sm:text-2xl">{it.title}</span>
              <span className="block text-[0.8rem] font-light italic leading-snug text-white/80 sm:text-base">{it.body}</span>
            </span>
          </li>
        ))}
      </ul>
      <a
        href="#preorder"
        className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-pipili-red px-7 font-gazpacho text-base font-bold text-on-dark shadow-[3px_3px_0_0_var(--color-ink)] transition-all active:translate-x-[2px] active:translate-y-[2px]"
      >
        Pre-order now
      </a>
      <p className="mt-2 text-xs font-semibold text-white/80">
        From ₹{products.gift.perBox} a box · {siteConfig.freeDeliveryLabel}
      </p>
    </PinnedList>
  );
}
