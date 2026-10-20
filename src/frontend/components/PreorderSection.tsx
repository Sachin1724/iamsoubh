"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ShieldCheck, MapPin, Truck, GraduationCap } from "lucide-react";
import { MockupSlider } from "@/frontend/components/MockupSlider";
import { siteConfig, products, ProductId } from "@/config/site-config";
import { startCheckout } from "@/frontend/lib/checkout";
import { useStock } from "@/frontend/lib/useStock";
import { openMail } from "@/frontend/lib/mailto";

export interface OrderData {
  product: ProductId;
  quantity: number;
  boxes: number;
  fullName?: string;
  phone: string;
  email?: string;
  total: number;
}

interface PreorderSectionProps {
  onRequestQuote?: () => void;
}

const PACKS = ["single", "family", "gift"] as const;
const ORDERS = PACKS.flatMap((id) =>
  Array.from({ length: products[id].maxQty }, (_, i) => ({
    product: id,
    quantity: i + 1,
    boxes: products[id].boxes * (i + 1),
    price: products[id].price * (i + 1),
  }))
);
const MAX_WANTED = Math.max(...ORDERS.map((o) => o.boxes));

export function PreorderSection({ onRequestQuote }: PreorderSectionProps) {
  const { stock, soldOut, showCounter } = useStock();
  const reduceMotion = useReducedMotion();

  const morph = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.7 };

  const [wanted, setWanted] = useState(1);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  // Every way to buy is one pack at one quantity. The page takes the cheapest
  // that covers the boxes asked for, so someone asking for 8 is handed the
  // 9-box answer when it costs less, and says so.
  const best = ORDERS.filter((o) => o.boxes >= wanted).sort(
    (a, b) => a.price - b.price || a.boxes - b.boxes
  )[0];
  const { product, quantity, boxes, price: total } = best;
  const saving = products.single.price * boxes - total;
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
      { product, quantity, boxes, phone, total },
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
            <MockupSlider
              className="-mx-4 sm:mx-0"
              imageClassName="aspect-4/3 lg:aspect-square"
            />

            <p className="text-center text-sm text-on-light/70 lg:text-left">
              12 festival cards, a sealed 13th parba, a postcard, stickers and a note.
            </p>
          </div>

          {/* The choices */}
          <div className="lg:py-4">
            {soldOut ? (
              <Waitlist />
            ) : (
            <>
            <h2 className="font-gazpacho text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Get your 2027 calendar
            </h2>
            <p className="mt-1.5 font-odia text-base text-pipili-red sm:text-lg">
              {siteConfig.odiaTitle}
            </p>

            {/* Price leads, the way a shop does it */}
            <div className="mt-5 flex items-baseline gap-3">
              <motion.span layout transition={morph} className="font-gazpacho text-4xl font-bold tracking-[-0.02em]">
                ₹{total.toLocaleString("en-IN")}
              </motion.span>
              {boxes > 1 && (
                <span className="text-sm font-semibold text-on-light/65">
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

            {/* Step one: one grouped control. How many on top, the pack the page picked below. */}
            <div className="mt-6 space-y-3 rounded-2xl bg-on-light/[0.04] p-3 sm:p-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold">Boxes</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="One fewer box"
                    disabled={wanted <= 1}
                    onClick={() => setWanted((n) => Math.max(1, n - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm transition-transform active:scale-90 disabled:opacity-35"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-gazpacho text-xl font-bold tabular-nums">{wanted}</span>
                  <button
                    type="button"
                    aria-label="One more box"
                    disabled={wanted >= MAX_WANTED}
                    onClick={() => setWanted((n) => Math.min(MAX_WANTED, n + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm transition-transform active:scale-90 disabled:opacity-35"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 rounded-xl bg-on-light/[0.06] p-1">
                {PACKS.map((id) => ({
                  id,
                  label: `Buy ${products[id].boxes}`,
                  price: products[id].price,
                  set: products[id].boxes,
                })).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={product === o.id}
                    onClick={() => setWanted(o.set)}
                    className={`rounded-lg py-2.5 text-center transition-all active:scale-[0.97] ${
                      product === o.id ? "bg-white shadow-sm" : "text-on-light/60"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{o.label}</span>
                    <span className="block font-gazpacho text-base font-bold">₹{o.price}</span>
                  </button>
                ))}
              </div>
            </div>
            {boxes > wanted && (
              <p className="mt-2 text-center text-sm text-on-light/70">
                That's {boxes} boxes, and it costs less than {wanted}.
              </p>
            )}

            {onRequestQuote && (
              <button
                type="button"
                onClick={onRequestQuote}
                className="mt-4 text-sm font-semibold text-pipili-red underline underline-offset-4"
              >
                Need 10 or more? Get a bulk price
              </button>
            )}

            {/* Step three: where it goes */}
            <form onSubmit={handleSubmit} id="shipping-form" className="mt-10">
              <div className="space-y-5">
                <div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={`${field} ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && (
                    <span className="mt-1 block text-sm text-red-600">{errors.phone}</span>
                  )}
                </div>
                <p className="text-sm text-on-light/70">
                  Just your mobile number. Razorpay sends an OTP to it and fills in your saved address.
                </p>
              </div>

              {payError && (
                <p className="mt-4 text-sm font-semibold text-red-700">{payError}</p>
              )}

              {/* What the order gives, stated as the real number for this order */}
              <div className="mt-8 flex items-start gap-3 rounded-2xl bg-parrot/10 p-4">
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
                className="mt-8 flex min-h-[60px] w-full items-center justify-center rounded-full bg-pipili-red px-8 font-gazpacho text-lg font-bold text-on-dark transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {paying ? "Opening Razorpay…" : `Buy Now · ₹${total.toLocaleString("en-IN")}`}
              </button>

              {/* The three things a buyer checks before paying, in one row */}
              <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-on-light/80">
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

              <p className="mt-4 text-sm leading-relaxed text-on-light/70">
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    openMail("Waitlist", wa, { WhatsApp: wa });
    setDone(true);
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
            className="flex min-h-[52px] w-full items-center justify-center rounded-full bg-pipili-red font-gazpacho text-base font-bold text-on-dark transition-all active:scale-[0.98] disabled:bg-on-light/10 disabled:text-on-light/35"
          >
            Tell me first
          </button>
        </form>
      )}
    </>
  );
}
