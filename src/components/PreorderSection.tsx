"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { siteConfig, products, ProductId } from "@/config/site-config";
import { startCheckout } from "@/lib/checkout";
import { useStock } from "@/lib/useStock";

export interface OrderData {
  product: ProductId;
  quantity: number;
  boxes: number;
  fullName: string;
  phone: string;
  email?: string;
  total: number;
}

interface PreorderSectionProps {
  onRequestQuote?: () => void;
}

// Every order Razorpay can take is one product at one quantity, so these are
// all the ways to buy. Boxes are what the buyer chooses; the pack is the
// cheapest row that covers them.
const OPTIONS = (Object.keys(products) as ProductId[]).flatMap((id) =>
  Array.from({ length: products[id].maxQty }, (_, i) => ({
    product: id,
    quantity: i + 1,
    boxes: products[id].boxes * (i + 1),
    price: products[id].price * (i + 1),
  }))
);

const MAX_BOXES = Math.max(...OPTIONS.map((o) => o.boxes));

/**
 * Cheapest way to get at least `wanted` boxes. Asking for 4 is answered with
 * the 5-box Gift Pack, because it costs less than four singles — so the extra
 * box is free and the page says so.
 */
function bestFor(wanted: number) {
  return OPTIONS.filter((o) => o.boxes >= wanted).sort(
    (a, b) => a.price - b.price || a.boxes - b.boxes
  )[0];
}

/**
 * The next rung up: more boxes at a meaningfully lower price per box, offered
 * as its own choosable row. Under ₹5 a box is not worth asking someone to
 * spend more, so it stays quiet.
 */
function nextDeal(current: { boxes: number; price: number }) {
  const perBox = current.price / current.boxes;
  return OPTIONS.filter((o) => o.boxes > current.boxes && perBox - o.price / o.boxes >= 5).sort(
    (a, b) => a.boxes - b.boxes || a.price - b.price
  )[0];
}

const QUICK_PICKS = [1, 2, 3, 5, 9];

export function PreorderSection({ onRequestQuote }: PreorderSectionProps) {
  const { stock, showCounter } = useStock();
  const reduceMotion = useReducedMotion();

  const morph = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.7 };

  const [wanted, setWanted] = useState(3);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const best = bestFor(wanted);
  const { product, quantity, boxes, price: total } = best;
  const active = products[product];
  const saving = products.single.price * boxes - total;
  const deal = nextDeal(best);
  const perBox = Math.round(total / boxes);

  const validate = () => {
    const next: Record<string, string> = {};
    // The number is all Magic Checkout needs; it collects the address itself.
    if (!/^\d{10}$/.test(phone)) next.phone = "Enter a valid 10-digit mobile number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || paying) return;
    setPaying(true);
    setPayError("");
    const result = await startCheckout(
      { product, quantity, boxes, fullName, phone, email, total },
      () => setPaying(false)
    );
    if (!result.ok) {
      setPayError(result.message);
      setPaying(false);
    }
  };

  const field =
    "w-full border-b border-on-light/25 bg-transparent py-3 text-base text-on-light placeholder:text-on-light/45 focus:border-pipili-red focus:outline-none";

  return (
    <section
      id="preorder"
      className="relative bg-pipili-cream py-24 text-on-light scroll-mt-24 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-gazpacho text-xl font-bold sm:text-2xl">06</span>
          <span className="text-xs font-bold uppercase tracking-wider sm:text-sm">Order now</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* The product, unframed, and it stays with you while you choose */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative -mx-4 aspect-square sm:mx-0 sm:aspect-4/3 lg:aspect-square">
              <Image
                key={boxes}
                src="/assets/product%20mockup/View%204.png"
                alt="The 2027 festival cards"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="animate-parcel-drop scale-[1.35] object-contain drop-shadow-[0_24px_40px_rgba(90,15,20,0.18)] lg:scale-[1.5]"
              />
            </div>
            <p className="text-center text-sm text-on-light/70 lg:text-left">
              12 festival cards, a sealed 13th parba, a postcard, stickers and a note.
            </p>
          </div>

          {/* The choices */}
          <div className="lg:py-4">
            <h2 className="font-gazpacho text-4xl font-bold leading-[1.05] sm:text-5xl">
              Get your 2027 calendar
            </h2>
            <p className="mt-2 font-odia text-lg text-pipili-red sm:text-xl">
              {siteConfig.odiaTitle}
            </p>

            {/* Price leads, the way a shop does it */}
            <div className="mt-6 flex items-baseline gap-3">
              <motion.span layout transition={morph} className="font-gazpacho text-5xl font-bold">
                ₹{total.toLocaleString("en-IN")}
              </motion.span>
              {boxes > 1 && (
                <span className="text-base font-semibold text-on-light/65">
                  ₹{perBox} a box
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-on-light/70">
              {boxes} {boxes === 1 ? "box" : "boxes"} · {siteConfig.freeDeliveryLabel}
              {saving > 0 && <span className="font-semibold text-parrot"> · you save ₹{saving}</span>}
            </p>

            {showCounter && stock !== null && (
              <p className="mt-2 text-sm font-bold text-pipili-red">
                {stock.remaining} of {stock.cap} left.
              </p>
            )}

            {/* Step one: how many */}
            <p className="mt-9 text-sm font-bold">How many boxes?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_PICKS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setWanted(n)}
                  aria-pressed={wanted === n}
                  className={`h-12 min-w-[56px] rounded-xl border px-4 font-gazpacho text-lg font-bold transition-colors ${
                    wanted === n
                      ? "border-pipili-red bg-pipili-red text-on-dark"
                      : "border-on-light/25 hover:border-on-light/60"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setWanted((n) => Math.min(MAX_BOXES, n + 1))}
                disabled={wanted >= MAX_BOXES}
                className="h-12 rounded-xl border border-on-light/25 px-4 text-sm font-semibold transition-colors hover:border-on-light/60 disabled:opacity-40"
              >
                More
              </button>
            </div>

            {/* Step two: what that works out as, and the one upgrade worth it */}
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border-2 border-pipili-red p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-gazpacho text-lg font-bold">
                    {quantity > 1 ? `${quantity} × ${active.name}` : active.name}
                  </span>
                  <span className="font-gazpacho text-lg font-bold">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="mt-1 text-sm text-on-light/70">
                  {boxes > wanted
                    ? `That's ${boxes} boxes, and it costs less than ${wanted}.`
                    : active.description}
                </p>
              </div>

              <AnimatePresence initial={false}>
                {deal && (
                  <motion.button
                    layout
                    initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                    transition={morph}
                    type="button"
                    onClick={() => setWanted(deal.boxes)}
                    className="w-full overflow-hidden rounded-2xl border border-on-light/25 p-4 text-left transition-colors hover:border-on-light/60"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-gazpacho text-lg font-bold">
                        {deal.boxes} boxes
                      </span>
                      <span className="font-gazpacho text-lg font-bold">
                        ₹{deal.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-on-light/70">
                      ₹{Math.round(deal.price / deal.boxes)} a box. You save ₹
                      {(products.single.price * deal.boxes - deal.price).toLocaleString("en-IN")} in
                      all.
                    </p>
                  </motion.button>
                )}
              </AnimatePresence>

              {onRequestQuote && (
                <button
                  type="button"
                  onClick={onRequestQuote}
                  className="text-sm font-semibold text-pipili-red underline underline-offset-4"
                >
                  Need 10 or more? Get a bulk price
                </button>
              )}
            </div>

            {/* Step three: where it goes */}
            <form onSubmit={handleSubmit} id="shipping-form" className="mt-10">
              <div className="space-y-5">
                <div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="WhatsApp number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={`${field} ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && (
                    <span className="mt-1 block text-sm text-red-600">{errors.phone}</span>
                  )}
                </div>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your name (optional)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={field}
                />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
              </div>

              {payError && (
                <p className="mt-4 text-sm font-semibold text-red-700">{payError}</p>
              )}

              <button
                type="submit"
                disabled={paying}
                className="mt-8 flex min-h-[60px] w-full items-center justify-center rounded-full bg-pipili-red px-8 font-gazpacho text-lg font-bold text-on-dark transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {paying ? "Opening Razorpay…" : `${active.payButtonLabel} · ₹${total.toLocaleString("en-IN")}`}
              </button>

              <p className="mt-4 text-sm leading-relaxed text-on-light/70">
                Razorpay collects your delivery address at checkout. Ships from the{" "}
                {siteConfig.shipDateInline}. Not shipped by 15 November, full refund. Damaged in
                transit, free replacement.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
