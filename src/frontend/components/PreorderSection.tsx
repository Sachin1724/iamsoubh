"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ShieldCheck, MapPin, Truck, GraduationCap } from "lucide-react";
import { MockupSlider } from "@/frontend/components/MockupSlider";
import { siteConfig, products, ProductId, MAX_BOXES, boxPrice } from "@/config/site-config";
import { startCheckout } from "@/frontend/lib/checkout";
import { useStock } from "@/frontend/lib/useStock";
import { submitForm } from "@/frontend/lib/mailto";
import { cta } from "@/frontend/components/ui/cta";

export interface OrderData {
  product: ProductId;
  quantity: number;
  boxes: number;
  fullName?: string;
  phone?: string;
  email?: string;
  total: number;
}

interface PreorderSectionProps {
  onRequestQuote?: () => void;
}

export function PreorderSection({ onRequestQuote }: PreorderSectionProps) {
  const { soldOut } = useStock();
  const reduceMotion = useReducedMotion();

  const morph = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.7 };

  const [wanted, setWanted] = useState(1);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  // The per-box price steps down at 3 and again at 10, and applies to every box.
  const product: ProductId = products.single.id;
  const boxes = wanted;
  const perBox = boxPrice(boxes);
  const total = perBox * boxes;
  const saving = products.single.price * boxes - total;
  const listPrice = Math.max(products.single.strikePrice, products.single.price) * boxes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // No form fields: Razorpay Magic Checkout asks for the number (OTP) and the address itself.
    if (paying) return;
    setPaying(true);
    setPayError("");
    const result = await startCheckout(
      { product, quantity: boxes, boxes, total },
      () => setPaying(false)
    );
    if (!result.ok) {
      setPayError(result.message);
      setPaying(false);
    }
  };


  return (
    <section
      id="preorder" data-snap
      className="relative flex h-svh flex-col bg-pipili-cream pb-3 pt-[5.25rem] text-on-light scroll-mt-0 sm:pb-6 lg:h-auto lg:min-h-svh lg:justify-center lg:py-24"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:block lg:flex-none lg:px-8">
        <div className="mb-1 hidden items-baseline gap-3 [@media(min-height:960px)]:flex lg:mb-2">
          <span className="font-gazpacho text-xl font-bold sm:text-2xl">06</span>
          <span className="text-xs font-bold uppercase tracking-wider sm:text-sm">Order now</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Product gallery, like a shop page: the real shots, swipeable, always in view */}
          <div className="min-h-[30svh] [@media(max-height:700px)]:min-h-[27svh] flex-1 lg:sticky lg:top-24 lg:flex-none lg:self-start">
            <MockupSlider
              className="-mx-4 flex h-full min-h-0 flex-col sm:mx-0 lg:block lg:h-auto"
              railClassName="min-h-0 flex-1 lg:flex-none"
              imageClassName="h-full lg:h-auto lg:aspect-square"
            />
          </div>

          {/* The choices */}
          <div className="shrink-0 lg:py-4">
            {soldOut ? (
              <Waitlist />
            ) : (
            <>
            <h2 className="font-gazpacho text-[1.4rem] [@media(max-height:700px)]:text-[1.2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
              The Odia Viral Calendar 2027
            </h2>
            <p className="mt-1 font-odia text-base text-pipili-red [@media(max-height:780px)]:hidden sm:text-lg">{siteConfig.odiaTitle}</p>

            {/* Price, the way a product page shows it */}
            <div className="mt-2 [@media(max-height:700px)]:mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-on-light/10 pt-2 [@media(max-height:700px)]:pt-1">
              <motion.span layout transition={morph} className="font-gazpacho text-4xl [@media(max-height:700px)]:text-3xl font-bold tracking-[-0.02em]">
                ₹{total.toLocaleString("en-IN")}
              </motion.span>
              {/* Struck price only when it is genuinely higher: the regular per-box price
                  times the boxes, so a bigger order shows what it saves */}
              {listPrice > total && (
                <>
                  <s className="text-base text-on-light/45">₹{listPrice.toLocaleString("en-IN")}</s>
                  <span className="rounded-md bg-parrot/15 px-2 py-0.5 text-xs font-bold text-parrot">
                    {boxes >= 10 ? "Best price" : "Pack price"}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-sm text-on-light/70">
              Inclusive of all taxes · {boxes} {boxes === 1 ? "box" : "boxes"}
              {boxes > 1 && <> · ₹{perBox} a box</>}
              {saving > 0 && <span className="font-semibold text-parrot"> · you save ₹{saving}</span>}
            </p>

            {/* What is in the box, at a glance */}
            <ul className="mt-3 hidden grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-on-light/85 [@media(min-height:960px)]:grid lg:grid">
              {["12 festival cards", "Wooden easel stand", "Sealed 13th parba", "Odia New Year postcard", "Surprise sticker set"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pipili-red" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-on-light sm:text-sm">
              <Truck className="h-4 w-4 text-parrot" aria-hidden="true" />
              <span className="[@media(max-height:780px)]:hidden">Free delivery all over India · Ships first week of November</span>
              <span className="hidden [@media(max-height:780px)]:inline">Free delivery · Ships first week of November</span>
            </p>

            {/* Step one: one grouped control. How many on top, the pack the page picked below. */}
            <div className="mt-3 space-y-2 rounded-2xl bg-on-light/[0.04] p-2.5 sm:p-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold">Boxes</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="One fewer box"
                    disabled={wanted <= 1}
                    onClick={() => setWanted((n) => Math.max(1, n - 1))}
                    className="flex h-9 w-9 [@media(max-height:780px)]:h-7 [@media(max-height:780px)]:w-7 items-center justify-center rounded-full bg-white text-lg shadow-sm transition-transform active:scale-90 disabled:opacity-35"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-gazpacho text-xl font-bold tabular-nums">{wanted}</span>
                  <button
                    type="button"
                    aria-label="One more box"
                    disabled={wanted >= MAX_BOXES}
                    onClick={() => setWanted((n) => Math.min(MAX_BOXES, n + 1))}
                    className="flex h-9 w-9 [@media(max-height:780px)]:h-7 [@media(max-height:780px)]:w-7 items-center justify-center rounded-full bg-white text-lg shadow-sm transition-transform active:scale-90 disabled:opacity-35"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 rounded-xl bg-on-light/[0.06] p-1">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={wanted === n}
                    onClick={() => setWanted(n)}
                    className={`rounded-lg py-2 [@media(max-height:780px)]:py-1 text-center transition-all active:scale-[0.97] ${
                      wanted === n ? "bg-white shadow-sm" : "text-on-light/60"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {n} {n === 1 ? "Box" : "Boxes"}
                    </span>
                    <span className="block font-gazpacho text-base font-bold">₹{(boxPrice(n) * n).toLocaleString("en-IN")}</span>
                  </button>
                ))}
              </div>
            </div>
            {onRequestQuote && (
              <button
                type="button"
                onClick={onRequestQuote}
                className="mt-4 text-sm font-semibold text-pipili-red underline underline-offset-4"
              >
                Need more than {MAX_BOXES}? Get a bulk price
              </button>
            )}

            {/* Step three: where it goes */}
            <form onSubmit={handleSubmit} id="shipping-form" className="mt-3">
              <p className="hidden text-sm text-on-light/70 [@media(min-height:960px)]:block lg:block">
                Razorpay asks for your mobile number next, sends an OTP and fills in your saved address.
              </p>

              {payError && (
                <p className="mt-4 text-sm font-semibold text-red-700">{payError}</p>
              )}

              {/* What the order gives, stated as the real number for this order */}
              <div className="mt-3 hidden items-start gap-3 rounded-2xl bg-parrot/10 p-3 [@media(min-height:1040px)]:flex lg:flex">
                <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-parrot" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-on-light">
                  <span className="font-bold">
                    ₹{siteConfig.donationPerBox} from every box goes to {siteConfig.donationCause}.
                  </span>{" "}
                  This order gives ₹{(boxes * siteConfig.donationPerBox).toLocaleString("en-IN")}.
                </p>
              </div>

              <button
                type="submit"
                disabled={paying}
                className={`mt-4 w-full ${cta("red")}`}
              >
                {paying ? "Opening Razorpay…" : `Buy Now · ₹${total.toLocaleString("en-IN")}`}
              </button>

              {/* The three things a buyer checks before paying, in one row */}
              <ul className="mt-3 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-on-light/80 [@media(min-height:1040px)]:flex lg:flex">
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-parrot" aria-hidden="true" />
                  Secure payment by
                  <Image
                    src="/assets/brand/razorpay-logo.svg"
                    alt="Razorpay"
                    width={52}
                    height={11}
                    className="inline-block h-3 w-auto object-contain"
                  />
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-pipili-red" aria-hidden="true" />
                  Pan India
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Truck className="h-4 w-4 shrink-0 text-pipili-red" aria-hidden="true" />
                  Free delivery
                </li>
              </ul>

              <p className="mt-3 hidden text-sm leading-relaxed text-on-light/70 [@media(min-height:1140px)]:block lg:block">
                Razorpay collects your delivery address at checkout. Ships from the{" "}
                {siteConfig.shipDateInline}. Not shipped by 15 November, full refund. Damaged in
                transit, free replacement.
              </p>
            </form>
            </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Batch 1 is gone: one field, so Batch 2 can be announced to the people who asked. */
function Waitlist() {
  const [wa, setWa] = useState("");
  const [done, setDone] = useState(false);
  const valid = /^\d{10}$/.test(wa);

  const [failed, setFailed] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const saved = await submitForm("Waitlist", { WhatsApp: wa });
    setFailed(!saved);
    setDone(saved);
  };

  return (
    <>
      <h2 className="font-gazpacho text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
        Batch 1 is sold out.
      </h2>
      <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-on-light/75">
        Batch 2 opens soon at ₹{products.single.strikePrice}. Leave your WhatsApp and you&apos;ll hear before
        Instagram does.
      </p>

      {done ? (
        <p className="mt-6 text-base font-semibold text-parrot">Done. We&apos;ll message you first.</p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="WhatsApp number"
            value={wa}
            onChange={(e) => setWa(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="w-full rounded-2xl bg-on-light/[0.05] px-4 py-3.5 text-base text-on-light outline-none transition-shadow placeholder:text-on-light/40 focus:ring-2 focus:ring-pipili-red/60"
          />
          <button
            type="submit"
            disabled={!valid}
            className={`w-full ${cta("red")}`}
          >
            Tell me first
          </button>
          {failed && <p className="text-sm font-semibold text-chandua">That didn&apos;t go through. Please try again.</p>}
        </form>
      )}
    </>
  );
}
