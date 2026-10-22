import Image from "next/image";
import { lowestBoxPrice, siteConfig } from "@/config/site-config";
import { cta } from "@/frontend/components/ui/cta";

const ITEMS = [
  { image: "/assets/story/card-january.jpg", title: "12 festival cards", body: "A painting on the front, the month's dates on the back." },
  {
    image: "/assets/story/flatlay.jpg",
    title: "1 wooden easel stand",
    body: "Last year, lots of you asked for one. Your card stands on the desk.",
  },
  { image: "/assets/story/box-hand.jpg", title: "1 sealed 13th parba", body: "One of three. You meet yours when the box lands." },
  { image: "/assets/story/cards-flat.jpg", title: "1 Odia New Year postcard", body: "Pana Sankranti wishes, ready to send home." },
  {
    image: "/assets/story/cards-hand.jpg",
    title: "1 premium surprise sticker set",
    body: "Parba art for your laptop and your diary. A different surprise in every box.",
  },
];

/** Section 03. The contents of the box as one list on a solid themed panel. */
export function InsideTheBox() {
  return (
    <section id="inside-calendar" data-snap className="relative flex min-h-svh items-center overflow-hidden bg-white pb-[5.5rem] pt-[5.25rem] text-ink md:pb-16 sm:pt-24">
      <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-6">
      <h2 data-scroll-rise className="mb-3 font-gazpacho text-3xl [@media(max-height:680px)]:text-2xl font-bold leading-tight text-ink sm:mb-0 sm:text-5xl">What you get inside.</h2>
      <p className="mb-5 [@media(max-height:740px)]:mb-3 [@media(max-height:680px)]:hidden mt-1 text-[0.95rem] text-ink/65 sm:text-base font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display',system-ui,sans-serif]">
        Everything in the box, in the order you will find it.
      </p>
      <ul className="space-y-3 [@media(max-height:740px)]:space-y-2 sm:space-y-5">
        {ITEMS.map((it) => (
          <li key={it.title} className="flex items-center gap-3 sm:gap-4">
            {/* Swap each photo for its own mockup shot when ready */}
            <span className="relative h-14 w-14 [@media(max-height:740px)]:h-11 [@media(max-height:740px)]:w-11 [@media(max-height:680px)]:h-9 [@media(max-height:680px)]:w-9 shrink-0 self-center overflow-hidden rounded-xl border-2 border-pipili-red/20 bg-rice/40 shadow-sm sm:h-16 sm:w-16">
              <Image src={it.image} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <span>
              <span className="block font-gazpacho text-lg [@media(max-height:680px)]:text-base font-bold leading-tight text-ink sm:text-2xl">{it.title}</span>
              <span className="block text-[0.9rem] [@media(max-height:680px)]:text-[0.8rem] leading-snug text-ink/65 sm:text-base font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display',system-ui,sans-serif]">{it.body}</span>
            </span>
          </li>
        ))}
      </ul>
      <a href="#preorder" className={`mt-8 [@media(max-height:740px)]:mt-4 w-full sm:w-auto ${cta("red")}`}>
        <span>Buy Now</span>
        <span aria-hidden="true">→</span>
      </a>
      <p className="mt-3 [@media(max-height:680px)]:mt-2 text-sm font-medium text-ink/65 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display',system-ui,sans-serif]">
        From ₹{lowestBoxPrice} a box · {siteConfig.freeDeliveryLabel}
      </p>
      </div>
    </section>
  );
}
