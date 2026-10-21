import { lowestBoxPrice, siteConfig } from "@/config/site-config";
import Image from "next/image";

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

/** Section 03. The contents of the box as one list over a single photo, no scroll effects. */
export function InsideTheBox() {
  return (
    <section id="inside-calendar" className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <Image
        src="/assets/story/flatlay.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectPosition: "55% 40%" }}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-6">
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
        className="mt-8 inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-[#8A1717] px-10 py-4 font-gazpacho text-lg font-bold tracking-wide text-[#FAF6EE] shadow-[3px_3px_0_0_#1B1B1B] transition-all hover:bg-[#6E1212] active:translate-x-[1px] active:translate-y-[1px] sm:w-auto sm:min-h-[68px] sm:text-xl"
      >
        <span>Pre-order now</span>
        <span className="font-mono text-lg leading-none text-[#E0A526]">→</span>
      </a>
      <p className="mt-3 text-sm font-semibold text-white/85">
        From ₹{lowestBoxPrice} a box · {siteConfig.freeDeliveryLabel}
      </p>
      </div>
    </section>
  );
}
