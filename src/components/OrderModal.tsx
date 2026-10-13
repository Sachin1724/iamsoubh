"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { OrderData } from "./PreorderSection";
import { track } from "@/lib/track";
import { getUtm } from "@/lib/utm";

interface OrderModalProps {
  order: OrderData | null;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (x: unknown) => void) => void };
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("checkout script failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("checkout script failed"));
    document.body.appendChild(s);
  });
}

export function OrderModal({ order, onClose }: OrderModalProps) {
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!order) return null;

  const label =
    order.product === "family"
      ? "Odia Viral Calendar 2027 · Family Pack"
      : "Odia Viral Calendar 2027 · Single Box";

  const pay = async () => {
    setStatus("working");
    setMessage("");

    track("InitiateCheckout", "begin_checkout", {
      value: order.total,
      currency: "INR",
      contents: [{ id: order.product, quantity: order.quantity }],
    });

    try {
      await loadCheckout();

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          product: order.product,
          qty: order.quantity,
          customer: {
            name: order.fullName,
            phone: order.phone,
            pincode: order.pincode,
            city: order.city,
            state: order.state,
            address: order.address,
            giftNote: order.giftNote,
          },
          utm: getUtm(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(
          data.code === "OUT_OF_STOCK"
            ? `Only ${data.remaining} boxes left — please lower the quantity.`
            : data.code === "SOLD_OUT"
              ? "Batch 1 just sold out."
              : "Could not start the payment. Please try again."
        );
        return;
      }

      const rzp = new window.Razorpay!({
        key: data.keyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: "INR",
        name: "IAMSOUBH",
        description: label,
        prefill: { name: order.fullName, contact: `+91${order.phone}` },
        notes: { db_order_id: data.dbOrderId },
        theme: { color: "#C8221A" },
        timeout: 900,
        retry: { enabled: true },
        modal: {
          confirm_close: true,
          ondismiss: () => setStatus("idle"),
        },
        handler: async (r: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(r),
          });
          window.location.href = `/thank-you?o=${r.razorpay_order_id}`;
        },
      });

      rzp.on("payment.failed", () => {
        setStatus("error");
        setMessage("That payment did not go through. You can try again.");
      });

      track("AddPaymentInfo", "add_payment_info", {
        value: order.total,
        currency: "INR",
      });
      rzp.open();
    } catch {
      setStatus("error");
      setMessage("Could not reach the payment gateway. Check your connection and try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#1B1B1B]/55"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm your order"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md bg-[#F6EFE2] rounded-t-3xl sm:rounded-3xl overflow-hidden border-2 border-[#1B1B1B]"
        style={{ boxShadow: "8px 8px 0 0 #1B1B1B" }}
      >
        <div className="bg-[#C8221A] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-disko text-xl leading-tight">Where should it go?</h3>
            <span className="text-xs text-[#F6EFE2]/80">{label}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-11 h-11 rounded-full bg-[#F6EFE2] text-[#1B1B1B] border-2 border-[#1B1B1B] flex items-center justify-center press cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <dl className="rounded-2xl bg-white border-2 border-[#1B1B1B] p-4 space-y-2 text-sm">
            <Row label="Name" value={order.fullName} />
            <Row label="WhatsApp" value={`+91 ${order.phone}`} />
            <Row
              label="Deliver to"
              value={`${order.address}, ${order.city || ""} ${order.pincode}`.trim()}
            />
            <Row label="Boxes" value={String(order.boxes)} />
            <div className="flex justify-between pt-2 border-t-2 border-[#D8C9B9]">
              <dt className="font-bold text-[#1B1B1B]">Payable total</dt>
              <dd className="font-sans font-extrabold text-2xl text-[#C8221A] tracking-tight">
                <span className="rupee">₹</span>
                {order.total}
              </dd>
            </div>
          </dl>

          {status === "error" && (
            <p className="flex items-start gap-2 text-sm font-semibold text-[#C8221A]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {message}
            </p>
          )}

          <button
            onClick={pay}
            disabled={status === "working"}
            className="w-full min-h-[52px] rounded-full bg-[#E0A526] text-[#1B1B1B] font-disko text-lg flex items-center justify-center gap-2 border-2 border-[#1B1B1B] press cursor-pointer disabled:opacity-60"
            style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
          >
            {status === "working" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Opening Razorpay</span>
              </>
            ) : (
              <>
                <span>
                  Pay <span className="rupee">₹</span>
                  {order.total}
                </span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#4A4642]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#236B48]" />
            UPI, cards, netbanking and wallets via Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#4A4642] shrink-0">{label}</dt>
      <dd className="text-right text-[#1B1B1B] font-medium truncate">{value}</dd>
    </div>
  );
}
