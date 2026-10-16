"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Truck,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
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
  pincode: string;
  city: string;
  state: string;
  address: string;
  landmark?: string;
  giftNote?: string;
  total: number;
}

interface PreorderSectionProps {
  onRequestQuote?: () => void;
}

export function PreorderSection({ onRequestQuote }: PreorderSectionProps) {
  const { stock, showCounter } = useStock();

  const [product, setProduct] = useState<ProductId>("family");
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Address fields live behind a drawer: Magic Checkout asks for them, so most
  // buyers never open it.
  const [showAddress, setShowAddress] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const active = products[product];
  const boxes = active.boxes * quantity;
  const total = active.price * quantity;

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
      // Lookup convenience
    }
  };

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
    const result = await startCheckout({
      product,
      quantity,
      boxes,
      fullName,
      phone,
      email,
      pincode,
      city,
      state,
      address,
      landmark,
      giftNote,
      total,
    }, () => setPaying(false));
    if (!result.ok) {
      setPayError(result.message);
      setPaying(false);
    }
  };

  return (
    <section
      id="preorder"
      className="py-16 sm:py-24 bg-[#F6EFE2] text-[#1B1B1B] relative overflow-hidden scroll-mt-24"
    >
      {/* 1. Odia Folk Pattern Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: "url('/assets/folk-pattern-tile.png')",
          backgroundSize: "200px",
        }}
      />

      {/* 2. Top-Left & Bottom-Right Odia Jhoti / Chita Sacred Art */}
      <div
        className="absolute top-4 left-4 sm:left-8 w-36 sm:w-56 h-36 sm:h-56 pointer-events-none select-none opacity-25 mix-blend-multiply z-0 animate-jhoti-shimmer"
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/odia-jhoti-corner.svg"
          alt=""
          fill
          sizes="(max-width: 640px) 144px, 224px"
          className="object-contain"
        />
      </div>

      <div
        className="absolute -bottom-8 -right-8 sm:-right-12 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none select-none opacity-20 mix-blend-multiply z-0 -scale-100 animate-jhoti-shimmer"
        style={{ animationDelay: "3s" }}
        aria-hidden="true"
      >
        <Image
          src="/assets/motifs/odia-jhoti-corner.svg"
          alt=""
          fill
          sizes="(max-width: 640px) 192px, 256px"
          className="object-contain"
        />
      </div>

      {/* 3. Main Container */}
      <div className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-gazpacho text-[#8A1717] font-bold text-xl sm:text-2xl">
            06
          </span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A1717]">
            YOUR STORIES · ORDER NOW
          </span>
        </div>

        <div className="mb-10 sm:mb-12">
          <h2 className="font-gazpacho text-3xl sm:text-5xl lg:text-6xl font-bold leading-none text-[#1B1B1B]">
            2027 Odia Calendar
          </h2>
          <span className="font-odia text-xl sm:text-2xl font-bold text-[#8A1717] mt-1 block">
            ବାର ମାସେ ତେର ପରବ
          </span>
        </div>

        {/* 3-Column Split: [Product Cluster Visual] | [Pack Selector & Pricing] | [Delivery Form] */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Column 1: Product 3D Stack Mockup (3 Cols) */}
          <div className="md:col-span-5 lg:col-span-3 flex flex-col items-center">
            <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden bg-[#EFE7D8] border-2 border-[#1B1B1B] shadow-[5px_5px_0_0_#1B1B1B] p-2 flex items-center justify-center group">
              <Image
                src="/assets/product/hero-client-product-hq.webp"
                alt="2027 Odia Viral Calendar"
                fill
                sizes="(max-width: 640px) 240px, 280px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Yellow Sticky Note on Product with subtle floating motion */}
              <div className="absolute top-4 left-3 z-20 -rotate-3 select-none animate-float-gentle">
                <div className="bg-[#FFE066] text-[#1B1B1B] px-2.5 py-1.5 rounded shadow border border-[#E6C63B] text-[10px] font-serif leading-tight">
                  A calendar for our people, wherever we are.
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Pack Selection & Pre-Order Action (4 Cols) */}
          <div className="md:col-span-7 lg:col-span-4 flex flex-col space-y-3.5 sm:space-y-4">
            
            {/* Single Box Card */}
            <div
              onClick={() => {
                setProduct("single");
                setQuantity(1);
              }}
              className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                product === "single"
                  ? "border-[#8A1717] bg-[#FFFDF7] shadow-[4px_4px_0_0_#8A1717]"
                  : "border-[#D5C7B3] bg-[#FFFDF7]/60 hover:bg-[#FFFDF7]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      product === "single"
                        ? "border-[#8A1717]"
                        : "border-[#999]"
                    }`}
                  >
                    {product === "single" && (
                      <div className="w-2 h-2 rounded-full bg-[#8A1717]" />
                    )}
                  </div>
                  <span className="font-bold text-sm text-[#1B1B1B]">
                    Single Box
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-gazpacho text-lg font-bold text-[#1B1B1B]">
                    ₹299
                  </span>
                  <span className="text-xs text-black/40 line-through ml-1.5">
                    ₹339
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#1B1B1B]/70 pl-6">
                One box, twelve parbas, and one sealed 13th you only reveal when it arrives.
              </p>
            </div>

            {/* Family Pack (x3) Card */}
            <div
              onClick={() => {
                setProduct("family");
                setQuantity(1);
              }}
              className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-visible ${
                product === "family"
                  ? "border-[#8A1717] bg-[#FFFDF7] shadow-[4px_4px_0_0_#8A1717]"
                  : "border-[#D5C7B3] bg-[#FFFDF7]/60 hover:bg-[#FFFDF7]"
              }`}
            >
              <span className="absolute -top-2.5 right-4 z-10 bg-[#E0A526] text-[#1B1B1B] text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-[#1B1B1B] shadow-xs">
                Best value
              </span>

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      product === "family"
                        ? "border-[#8A1717]"
                        : "border-[#999]"
                    }`}
                  >
                    {product === "family" && (
                      <div className="w-2 h-2 rounded-full bg-[#8A1717]" />
                    )}
                  </div>
                  <span className="font-bold text-sm text-[#1B1B1B]">
                    Family Pack (x3)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-gazpacho text-lg font-bold text-[#8A1717]">
                    ₹749
                  </span>
                  <span className="text-[11px] text-[#3E9B47] font-bold block">
                    (₹250 a box)
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#1B1B1B]/70 pl-6">
                For Maa, Bapa and that one cousin in Bengaluru. All three 13th parbas guaranteed; plus an extra sticker sheet.
              </p>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-[#FFFDF7] border-2 border-[#1B1B1B] flex items-center justify-center hover:bg-[#F6EFE2] active:scale-95 transition-transform"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-gazpacho text-base font-bold w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-8 h-8 rounded-full bg-[#FFFDF7] border-2 border-[#1B1B1B] flex items-center justify-center hover:bg-[#F6EFE2] active:scale-95 transition-transform"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bulk Inquiry Link */}
            {onRequestQuote && (
              <button
                type="button"
                onClick={onRequestQuote}
                className="text-xs text-[#8A1717] font-bold hover:underline text-right block"
              >
                10 or more? Get a bulk price →
              </button>
            )}

            {/* Summary Row */}
            <div className="pt-2 text-xs font-medium text-[#1B1B1B]/80 flex justify-between">
              <span>Total:</span>
              <span className="font-bold text-[#1B1B1B]">
                {boxes} {boxes === 1 ? "box" : "boxes"} — ₹{total} — Free shipping
              </span>
            </div>

            {/* Mobile-only jump to form button */}
            <button
              type="button"
              onClick={() => {
                document.getElementById("shipping-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="lg:hidden w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-full bg-[#8A1717] hover:bg-[#701212] text-white font-gazpacho text-sm sm:text-base font-bold shadow-[4px_4px_0_0_#1B1B1B] hover:shadow-[5px_5px_0_0_#1B1B1B] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>Continue to delivery details</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Reassurance Badges */}
            <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-3 border-t border-[#D5C7B3] text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8A1717] mb-0.5 sm:mb-1" />
                <span className="text-[8.5px] sm:text-[10px] font-bold leading-tight">Free shipping</span>
                <span className="text-[7.5px] sm:text-[8px] text-black/60 leading-tight">across India</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8A1717] mb-0.5 sm:mb-1" />
                <span className="text-[8.5px] sm:text-[10px] font-bold leading-tight">Secure payment</span>
                <span className="inline-flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-[7.5px] sm:text-[8px] text-black/60 leading-tight">by</span>
                  <Image
                    src="/assets/brand/razorpay-logo.svg"
                    alt="Razorpay"
                    width={48}
                    height={10}
                    className="h-2 sm:h-2.5 w-auto object-contain inline-block"
                  />
                </span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8A1717] mb-0.5 sm:mb-1" />
                <span className="text-[8.5px] sm:text-[10px] font-bold leading-tight">Free replacement</span>
                <span className="text-[7.5px] sm:text-[8px] text-black/60 leading-tight">if damaged</span>
              </div>
            </div>

            <p className="text-[10px] italic text-[#1B1B1B]/70 text-center">
              Ships from the first week of November. Not shipped by 15 November? Full refund.
            </p>
          </div>

          {/* Column 3: Where Should It Go Delivery Form (5 Cols) */}
          <div className="md:col-span-12 lg:col-span-5 bg-[#FFFDF7] p-4 sm:p-6 lg:p-7 rounded-2xl border-2 border-[#1B1B1B] shadow-[5px_5px_0_0_#1B1B1B] sm:shadow-[6px_6px_0_0_#1B1B1B]">
            <h3 className="font-gazpacho text-lg sm:text-xl font-bold text-[#1B1B1B] mb-4">
              Where should it go?
            </h3>

            <form id="shipping-form" onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="WhatsApp number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={`w-full px-3.5 py-3 rounded-lg bg-[#F6EFE2]/60 border text-sm font-medium focus:outline-none focus:border-[#8A1717] ${
                    errors.phone ? "border-red-500 bg-red-50" : "border-[#D5C7B3]"
                  }`}
                />
                {errors.phone ? (
                  <span className="text-[10px] text-red-600 mt-0.5 block">{errors.phone}</span>
                ) : (
                  <span className="text-[10px] text-black/55 mt-1 block">
                    Razorpay fills your saved address from this number. Order updates come on WhatsApp.
                  </span>
                )}
              </div>

              <div>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your name (optional)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F6EFE2]/60 border border-[#D5C7B3] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#8A1717]"
                />
              </div>

              {/* Everything below is optional: sending it as a gift, or a
                  delivery address Razorpay will not already know. */}
              <button
                type="button"
                onClick={() => setShowAddress((v) => !v)}
                aria-expanded={showAddress}
                className="w-full text-left text-xs font-bold text-[#8A1717] underline underline-offset-2 cursor-pointer"
              >
                {showAddress ? "Hide address & gift note" : "Sending as a gift or to another address?"}
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: showAddress ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 pt-1">
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="Email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#F6EFE2]/60 border border-[#D5C7B3] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#8A1717]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Pincode (6 digits)"
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        maxLength={6}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#F6EFE2]/60 border border-[#D5C7B3] text-xs font-medium focus:outline-none focus:border-[#8A1717]"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#F6EFE2]/60 border border-[#D5C7B3] text-xs font-medium focus:outline-none focus:border-[#8A1717]"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#F6EFE2]/60 border border-[#D5C7B3] text-xs font-medium focus:outline-none focus:border-[#8A1717]"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Address line (House, Street)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#F6EFE2]/60 border border-[#D5C7B3] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#8A1717]"
                    />
                    <input
                      type="text"
                      placeholder="Landmark (optional)"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#F6EFE2]/60 border border-[#D5C7B3] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#8A1717]"
                    />
                    <input
                      type="text"
                      placeholder="Add a gift note (optional)"
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#F6EFE2]/60 border border-[#D5C7B3] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#8A1717]"
                    />
                  </div>
                </div>
              </div>

              {payError && (
                <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-700">
                  {payError}
                </p>
              )}

              {/* Pay Razorpay Button */}
              <button
                type="submit"
                disabled={paying}
                className="w-full py-3.5 px-6 rounded-lg bg-[#E0A526] hover:bg-[#cca322] text-[#1B1B1B] font-bold text-sm sm:text-base border-2 border-[#1B1B1B] shadow-[4px_4px_0_0_#1B1B1B] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-60"
              >
                <span>{paying ? "Opening Razorpay…" : `Pay ₹${total} · UPI, cards, wallets`}</span>
              </button>

              <span className="text-[10px] text-black/60 flex items-center justify-center gap-1.5 mt-2 text-center flex-wrap">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3E9B47] shrink-0" />
                <span>Secure payment by</span>
                <Image
                  src="/assets/brand/razorpay-logo.svg"
                  alt="Razorpay"
                  width={52}
                  height={11}
                  className="h-2.5 sm:h-3 w-auto object-contain inline-block"
                />
                <span>· GPay · PhonePe · Paytm</span>
              </span>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
