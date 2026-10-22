import { ArrowRight, MapPin, Truck, Wallet } from "lucide-react";
import { siteConfig } from "@/config/site-config";
import { cta } from "@/frontend/components/ui/cta";

/** Free shipping, said once and plainly, between the box and the reviews. */
export function FreeShipping() {
  return (
    <section data-snap
      id="free-shipping"
      className="halftone relative flex min-h-svh items-center overflow-hidden bg-pipili-red pb-[5.5rem] pt-[5.25rem] text-on-dark md:pb-16 sm:pt-24"
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 data-scroll-rise className="max-w-[16ch] font-gazpacho text-[2.4rem] [@media(max-height:740px)]:text-[1.9rem] font-bold leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          Free shipping anywhere in India.
        </h2>
        <p data-scroll-words className="mt-5 [@media(max-height:740px)]:mt-2 max-w-[26ch] font-gazpacho text-xl [@media(max-height:740px)]:text-base font-medium leading-snug text-on-dark/90 sm:mt-6 sm:text-3xl">
          Because home should never charge delivery fees.
        </p>

        <ul className="mt-10 [@media(max-height:740px)]:mt-4 grid gap-4 [@media(max-height:740px)]:gap-2 sm:mt-14 sm:grid-cols-3">
          <li className="flex items-start gap-3 rounded-2xl border border-white/25 p-4 [@media(max-height:740px)]:py-2.5">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-turmeric" aria-hidden="true" />
            <span className="text-sm leading-snug sm:text-base">
              <b className="block font-bold">Every state</b>
              Odisha, the metros, the small towns. All of India.
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-white/25 p-4 [@media(max-height:740px)]:py-2.5">
            <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-turmeric" aria-hidden="true" />
            <span className="text-sm leading-snug sm:text-base">
              <b className="block font-bold">₹0 delivery fee</b>
              The price you see is the price you pay.
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-white/25 p-4 [@media(max-height:740px)]:py-2.5">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-turmeric" aria-hidden="true" />
            <span className="text-sm leading-snug sm:text-base">
              <b className="block font-bold">Ships {siteConfig.shipDateInline}</b>
              Packed by hand, sent to your door.
            </span>
          </li>
        </ul>

        <a
          href="#preorder"
          className={`mt-10 [@media(max-height:740px)]:mt-5 w-full sm:w-auto ${cta("gold")}`}
        >
          Buy Now
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
