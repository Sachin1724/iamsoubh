"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site-config";
import { track, trackOnce } from "@/frontend/lib/track";
import { cta } from "@/frontend/components/ui/cta";

type Status = {
  status: string;
  orderNumber: number | null;
  boxes: number;
  product: string;
  amountInr?: number;
};

// Every box gets one of three sealed 13th parbas at random. Guessing which one
// is the one thing there is left to do while waiting for November.
const PARBAS = ["Sahi Jata", "Sitalsasthi", "Gajalaxmi Puja"];

/** Shown once the payment lands: a thank-you from Soubh and a nudge to follow. */
function ThanksPopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="thanks-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center text-ink shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/5"
        >
          <X className="h-4 w-4" />
        </button>
        <Image
          src="/assets/brand/soubh-avatar.png"
          alt="Soubh"
          width={88}
          height={88}
          className="mx-auto h-[88px] w-[88px] rounded-full object-cover ring-4 ring-turmeric"
        />
        <h2 id="thanks-title" className="mt-4 font-gazpacho text-2xl font-bold leading-tight">
          Thank you for purchasing from us!
        </h2>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/65">
          Thank you for buying the calendar. Stay following @iamsoubh so you don&apos;t miss any new updates.
        </p>
        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-6 w-full ${cta("red")}`}
        >
          Follow @iamsoubh on Instagram
        </a>
        <button type="button" onClick={onClose} className="mt-3 text-sm font-medium text-ink/55 underline underline-offset-4">
          Maybe later
        </button>
      </div>
    </div>
  );
}

function ParbaGuess() {
  const [guess, setGuess] = useState<string | null>(null);

  return (
    <div className="mt-8 rounded-2xl border border-rice/25 bg-black/15 p-5">
      <p className="text-sm font-bold text-turmeric">
        Which 13th parba do you think you&apos;ll get?
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {PARBAS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setGuess(p)}
            aria-pressed={guess === p}
            className={`min-h-[44px] rounded-full border px-4 text-sm font-bold transition-colors ${
              guess === p
                ? "border-turmeric bg-turmeric text-ink"
                : "border-rice/40 text-rice hover:border-turmeric"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      {guess && (
        <p className="mt-3 text-sm text-rice/90">
          {guess} it is. We&apos;ll find out in November!
        </p>
      )}
    </div>
  );
}

function ThankYouBody() {
  const orderId = useSearchParams().get("o");
  const [fetched, setData] = useState<Status | null>(null);
  // Local preview of the paid screen: /thank-you?o=preview (never in production).
  const preview = orderId === "preview" && process.env.NODE_ENV !== "production";
  const data: Status | null = preview
    ? { status: "paid", orderNumber: null, boxes: 1, product: "single", amountInr: 329 }
    : fetched;
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!orderId || preview) return;
    let tries = 0;
    let stop = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/order-status?o=${orderId}`);
        if (res.ok) {
          const d: Status = await res.json();
          if (stop) return;
          setData(d);
          // Payment confirmation can lag the redirect; keep checking while it is held.
          if (d.status !== "held") return;
        }
      } catch {
        // keep polling
      }
      if (++tries >= 10) {
        setTimedOut(true);
        return;
      }
      if (!stop) setTimeout(poll, 2000);
    };

    poll();
    return () => {
      stop = true;
    };
  }, [orderId, preview]);

  const paid = data?.status === "paid";
  const overflow = data?.status === "overflow";

  // Fire Purchase once per order, so a reload never counts a second sale.
  useEffect(() => {
    if (!paid || !orderId || !data) return;
    trackOnce(`purchase-${orderId}`, () =>
      track(
        "Purchase",
        "purchase",
        {
          value: data.amountInr ?? undefined,
          currency: "INR",
          transaction_id: orderId,
          contents: [{ id: data.product, quantity: data.boxes }],
        },
        orderId
      )
    );
  }, [paid, orderId, data]);

  const [thanksClosed, setThanksClosed] = useState(false);

  return (
    <main className="min-h-screen bg-brand text-rice flex items-center justify-center px-5 py-20">
      <div className="w-full max-w-lg text-center">
        {overflow ? (
          <>
            <h1 className="font-disko text-4xl sm:text-5xl">That was close.</h1>
            <p className="mt-4 text-base text-rice/90">
              Your payment came in just after the last box went. Soubh will refund you in full
              within 48 hours.
            </p>
          </>
        ) : paid ? (
          <>
            <h1 className="font-disko text-4xl sm:text-5xl">You&apos;re in.</h1>
            {data!.orderNumber && (
              <p className="font-disko mt-2 text-2xl text-turmeric">
                Order {data!.orderNumber} of {siteConfig.batchCap}
              </p>
            )}
            <p className="mt-4 text-base text-rice/90">
              Ships from the {siteConfig.shipDateInline}. We will message your tracking link
              the day it leaves.
            </p>
            <ParbaGuess />
            {!thanksClosed && <ThanksPopup onClose={() => setThanksClosed(true)} />}
          </>
        ) : timedOut ? (
          <>
            <h1 className="font-disko text-4xl sm:text-5xl">Still confirming.</h1>
            <p className="mt-4 text-base text-rice/90">
              Your payment is going through. Razorpay will send your receipt once it lands.
              Nothing more to do here.
            </p>
          </>
        ) : (
          <p className="font-disko text-2xl">Confirming your payment…</p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[52px] px-6 rounded-full bg-turmeric text-ink font-disko text-lg inline-flex items-center justify-center border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] press"
            style={{ boxShadow: "5px 5px 0 0 #1B1B1B" }}
          >
            Follow @iamsoubh
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              "I just pre-ordered the Odia Viral Calendar 2027. Bara masa tera parba."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[52px] px-6 rounded-full bg-transparent text-rice font-disko text-lg inline-flex items-center justify-center border border-on-dark/20"
          >
            Send to family
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouBody />
    </Suspense>
  );
}
