"use client";

import React, { useState } from "react";
import {
  Truck,
  CheckCircle2,
  Undo2,
  Gift,
  ShieldCheck,
  Plus,
  Minus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { siteConfig, products, ProductId } from "@/config/site-config";
import { useStock } from "@/lib/useStock";
import { getUtm } from "@/lib/utm";

export interface OrderData {
  product: ProductId;
  quantity: number;
  boxes: number;
  fullName: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  address: string;
  giftNote: string;
  total: number;
}

interface PreorderSectionProps {
  onProceedToCheckout: (order: OrderData) => void;
  onRequestQuote?: () => void;
}

export function PreorderSection({ onProceedToCheckout, onRequestQuote }: PreorderSectionProps) {
  const { stock, soldOut, showCounter } = useStock();

  const [product, setProduct] = useState<ProductId>("family");
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const active = products[product];
  const boxes = active.boxes * quantity;
  const total = active.price * quantity;
  const atLimit = quantity >= active.maxQty;
  const familySoldOut = stock !== null && !stock.familyAvailable;

  const selectProduct = (id: ProductId) => {
    setProduct(id);
    setQuantity(1); // Switching option always resets the count.
  };

  const handlePincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setPincode(clean);
    if (clean.length !== 6) return;

    try {
      const res = await fetch(`/api/pincode?pin=${clean}`);
      if (!res.ok) return;
      const data = await res.json();
      setCity(data.city ?? "");
      setState(data.state ?? "");
    } catch {
      // Lookup is a convenience; the fields stay editable.
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Please enter your name";
    if (phone.length < 10) next.phone = "Enter a valid 10-digit mobile number";
    if (pincode.length < 6) next.pincode = "Enter a valid 6-digit pincode";
    if (!address.trim()) next.address = "Please enter the complete delivery address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onProceedToCheckout({
      product,
      quantity,
      boxes,
      fullName,
      phone,
      pincode,
      city,
      state,
      address,
      giftNote,
      total,
    });
  };

  if (soldOut) {
    return <SoldOutPanel />;
  }

  return (
    <section
      id="preorder"
      className="py-12 sm:py-20 md:py-24 bg-[#F6EFE2] text-[#1B1B1B] relative overflow-hidden scroll-mt-24"
      style={{ scrollMarginTop: "96px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: the offer */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="font-disko text-[52px] sm:text-[80px] leading-none text-[#62B56A] select-none">
              06
            </span>
            <h2 className="font-disko -mt-4 sm:-mt-6 text-3xl sm:text-5xl md:text-[54px] text-[#1B1B1B] leading-[1.05]">
              500 boxes. <br />
              Then the first batch closes.
            </h2>

            <div className="mt-6 sm:mt-8 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#C8221A] text-white tile tile-lg w-full max-w-lg">
              <div className="flex items-baseline gap-3">
                <span className="font-sans font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                  <span className="rupee">₹</span>
                  {products.single.price}
                </span>
                <span className="text-sm sm:text-lg font-bold text-[#E0A526] uppercase tracking-wide">
                  pre-order price
                </span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#F6EFE2]/80 font-medium">
                <span className="font-sans font-bold">₹{products.single.strikePrice}</span> once the first batch of 500 is gone.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 space-y-3.5 sm:space-y-4 max-w-lg deal-stagger">
              <Guarantee icon={<Truck className="w-4 h-4" />} title="Ships in the first week of November">
                Tracking reaches you on WhatsApp and email the day it leaves.
              </Guarantee>
              <Guarantee icon={<CheckCircle2 className="w-4 h-4" />} title="Free shipping across India">
                No delivery charge, anywhere in the country.
              </Guarantee>
              <Guarantee icon={<Undo2 className="w-4 h-4" />} title="Full refund if it hasn't shipped">
                By {siteConfig.refundDeadlineLabel}. No forms, no follow-ups.
              </Guarantee>
              <Guarantee icon={<Gift className="w-4 h-4" />} title="Send it home">
                Put their address at checkout. There&apos;s no price slip inside the box.
              </Guarantee>
            </div>

            <p className="mt-6 sm:mt-8 text-xs sm:text-sm italic font-medium text-[#1B1B1B]/80">
              Book it now, or say &ldquo;pare dekhibi&rdquo; and watch 500 boxes leave without you.
            </p>
          </div>

          {/* Right: the order card */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 tile tile-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#D8C9B9]/50 pb-4 mb-5">
                <div>
                  <h3 className="font-disko text-xl sm:text-2xl text-[#1B1B1B] leading-tight">
                    Order now
                  </h3>
                  <span className="text-xs text-[#4A4642] font-odia">
                    ବାର ମାସେ ତେର ପରବ
                  </span>
                </div>
                {showCounter && (
                  <div className="self-start sm:self-auto bg-[#FEF3C7] text-[#92400E] border-2 border-[#E0A526] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                    <span className="animate-digit-roll">
                      {stock!.remaining} of {stock!.cap} left
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Option cards */}
                <div
                  role="radiogroup"
                  aria-label="Choose your pack"
                  className="grid grid-cols-1 gap-3 deal-stagger"
                >
                  <OptionCard
                    id="single"
                    selected={product === "single"}
                    onSelect={selectProduct}
                    name={products.single.name}
                    price={products.single.price}
                    strike={products.single.strikePrice}
                    description={products.single.description}
                  />
                  <OptionCard
                    id="family"
                    selected={product === "family"}
                    onSelect={selectProduct}
                    name={products.family.name}
                    price={products.family.price}
                    badge={products.family.badge}
                    description={products.family.description}
                    disabled={familySoldOut}
                  />
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F6EFE2] border-2 border-[#1B1B1B]">
                  <span className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider">
                    Quantity
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-11 h-11 rounded-full bg-white border-2 border-[#1B1B1B] text-[#1B1B1B] flex items-center justify-center press disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-disko w-6 text-center text-xl text-[#1B1B1B]">
                      {quantity}
                    </span>
                    {atLimit ? (
                      <button
                        type="button"
                        onClick={onRequestQuote || (() => window.open(siteConfig.whatsappBulkUrl, "_blank"))}
                        className="text-xs font-semibold underline underline-offset-4 text-[#C8221A] max-w-[9rem] text-left cursor-pointer"
                      >
                        10 or more? Get a bulk price
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Increase quantity"
                        className="w-11 h-11 rounded-full bg-white border-2 border-[#1B1B1B] text-[#1B1B1B] flex items-center justify-center press cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <Field label="Full Name *" error={errors.fullName}>
                  <input
                    type="text"
                    placeholder="e.g. Soumya Ranjan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass(!!errors.fullName)}
                  />
                </Field>

                <Field label="WhatsApp Number *" error={errors.phone}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={inputClass(!!errors.phone)}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Pincode *" error={errors.pincode}>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="6-digit pincode"
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className={inputClass(!!errors.pincode)}
                    />
                  </Field>
                  <Field label="City / District">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputClass(false)}
                    />
                  </Field>
                </div>

                <Field label="Complete Address *" error={errors.address}>
                  <textarea
                    rows={2}
                    placeholder="House/Flat number, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={inputClass(!!errors.address)}
                  />
                </Field>

                <Field label="Gift Note (optional)">
                  <input
                    type="text"
                    placeholder="Message to write inside the box"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className={inputClass(false)}
                  />
                </Field>

                {/* Live total */}
                <div className="pt-3 border-t-2 border-[#D8C9B9] flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-[#1B1B1B]">
                    {boxes} {boxes === 1 ? "box" : "boxes"} · free shipping
                  </span>
                  <span className="font-sans font-extrabold text-[#C8221A] text-2xl tracking-tight">
                    <span className="rupee">₹</span>
                    {total}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[52px] py-4 rounded-full bg-[#E0A526] text-[#1B1B1B] font-disko text-lg flex items-center justify-center gap-2 border-2 border-[#1B1B1B] press lift cursor-pointer mt-4"
                  style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
                >
                  <span>Let&apos;s Odia This</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                <p className="text-[11px] text-center text-[#4A4642]">
                  Ships from {siteConfig.shipDateLabel.toLowerCase()}. Not shipped by{" "}
                  {siteConfig.refundDeadlineLabel}? Full refund.
                </p>

                <div className="pt-2 flex flex-col items-center gap-1 text-[11px] text-[#4A4642]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#236B48]" />
                    <span>Free shipping · Secure Razorpay payment · Free damage replacement</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OptionCard({
  id,
  selected,
  onSelect,
  name,
  price,
  strike,
  badge,
  description,
  disabled,
}: {
  id: ProductId;
  selected: boolean;
  onSelect: (id: ProductId) => void;
  name: string;
  price: number;
  strike?: number;
  badge?: string;
  description: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={`relative text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFFAF0] press cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
        selected ? "border-[3px] border-[#C8221A]" : "border-2 border-[#1B1B1B]"
      }`}
      style={{ boxShadow: selected ? "5px 5px 0 0 #C8221A" : "3px 3px 0 0 #1B1B1B" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-disko text-lg text-[#1B1B1B]">{name}</span>
            <span className="font-sans font-extrabold text-xl text-[#C8221A] tracking-tight">
              <span className="rupee">₹</span>
              {price}
            </span>
            {strike && (
              <span className="font-sans font-bold text-xs text-[#4A4642] line-through">
                <span className="rupee">₹</span>
                {strike}
              </span>
            )}
          </div>
          {badge && (
            <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3E9B47] text-[#1B1B1B] border-2 border-[#1B1B1B]">
              {badge}
            </span>
          )}
          <p className="mt-1.5 text-xs text-[#4A4642] leading-relaxed">{description}</p>
          {disabled && (
            <span className="inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1B1B1B] text-[#F6EFE2]">
              Sold out
            </span>
          )}
        </div>
        <span
          aria-hidden
          className={`shrink-0 w-6 h-6 rounded-full border-2 border-[#1B1B1B] flex items-center justify-center ${
            selected ? "bg-[#C8221A]" : "bg-white"
          }`}
        >
          {selected && <span className="w-2 h-2 rounded-full bg-[#F6EFE2]" />}
        </span>
      </div>
    </button>
  );
}

function Guarantee({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-8 h-8 rounded-full bg-[#1B1B1B] text-[#3E9B47] flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="text-sm sm:text-base font-bold text-[#1B1B1B]">{title}</h4>
        <p className="text-xs sm:text-sm text-[#1B1B1B]/80">{children}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#1B1B1B] mb-1">{label}</label>
      {children}
      {error && (
        <span className="text-[11px] text-[#C8221A] font-bold mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full px-3.5 py-3 rounded-xl border-2 text-base text-[#1B1B1B] bg-white focus:outline-none focus:border-[#C8221A] ${
    hasError ? "border-[#C8221A] bg-red-50/50" : "border-[#1B1B1B]"
  }`;

function SoldOutPanel() {
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, utm: getUtm() }),
    });
    setDone(true);
  };

  return (
    <section id="preorder" className="py-16 sm:py-24 bg-[#F6EFE2] text-[#1B1B1B]">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="font-disko text-4xl sm:text-5xl text-[#1B1B1B]">Batch 1 is sold out.</h2>
        <p className="mt-4 text-base text-[#1B1B1B]/85">
          Batch 2 opens soon at <span className="rupee">₹</span>
          {products.single.strikePrice}. Leave your WhatsApp and you&apos;ll hear before Instagram
          does.
        </p>

        {done ? (
          <p className="mt-8 font-disko text-2xl text-[#1B1B1B]">
            You&apos;re on the list. Talk soon.
          </p>
        ) : (
          <form onSubmit={join} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="tel"
              inputMode="numeric"
              required
              placeholder="WhatsApp number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex-1 px-4 py-3 rounded-full border-2 border-[#1B1B1B] text-base bg-white focus:outline-none focus:border-[#C8221A]"
            />
            <button
              type="submit"
              className="min-h-[52px] px-6 rounded-full bg-[#E0A526] text-[#1B1B1B] font-disko text-lg border-2 border-[#1B1B1B] press cursor-pointer"
              style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
            >
              Tell me first
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
