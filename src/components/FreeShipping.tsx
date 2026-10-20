import { ArrowDown, MapPin, Truck, Wallet } from "lucide-react";
import { siteConfig } from "@/config/site-config";

/** Free shipping, said once and plainly, between the box and the reviews. */
export function FreeShipping() {
  return (
    <section
      id="free-shipping"
      className="relative overflow-hidden bg-pipili-red py-20 text-on-dark sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.07]"
        style={{ backgroundImage: "url('/assets/folk-pattern-tile.png')", backgroundSize: "180px" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="reveal-spring max-w-[16ch] text-[2.6rem] font-medium leading-[1.02] tracking-tight sm:text-7xl">
          Free shipping anywhere in India.
        </h2>
        <p className="reveal-spring mt-6 max-w-[22ch] text-2xl font-light leading-snug text-on-dark/90 sm:mt-8 sm:text-4xl">
          Because home should never charge delivery fees.
        </p>

        <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3">
          <li className="flex items-start gap-3 rounded-2xl border border-white/25 p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-turmeric" aria-hidden="true" />
            <span className="text-sm leading-snug sm:text-base">
              <b className="block font-bold">Every state</b>
              Odisha, the metros, the small towns. All of India.
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-white/25 p-4">
            <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-turmeric" aria-hidden="true" />
            <span className="text-sm leading-snug sm:text-base">
              <b className="block font-bold">₹0 delivery fee</b>
              The price you see is the price you pay.
            </span>
          </li>
          <li className="flex items-start gap-3 rounded-2xl border border-white/25 p-4">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-turmeric" aria-hidden="true" />
            <span className="text-sm leading-snug sm:text-base">
              <b className="block font-bold">Ships {siteConfig.shipDateInline}</b>
              Packed by hand, sent to your door.
            </span>
          </li>
        </ul>

        <a
          href="#preorder"
          className="mt-10 inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-turmeric px-8 font-gazpacho text-base font-bold text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-all active:translate-x-[2px] active:translate-y-[2px]"
        >
          Pre-order now
          <ArrowDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
