"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site-config";
import { track, trackOnce } from "@/lib/track";

type Status = {
  status: string;
  orderNumber: number | null;
  boxes: number;
  product: string;
  amountInr?: number;
};

function ThankYouBody() {
  const orderId = useSearchParams().get("o");
  const [data, setData] = useState<Status | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!orderId) return;
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
  }, [orderId]);

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
              Ships from the {siteConfig.shipDateLabel.toLowerCase()}. Your tracking link reaches
              you on WhatsApp and email the day it leaves.
            </p>
          </>
        ) : timedOut ? (
          <>
            <h1 className="font-disko text-4xl sm:text-5xl">Still confirming.</h1>
            <p className="mt-4 text-base text-rice/90">
              Your payment is going through. You&apos;ll get a WhatsApp from Soubh once it lands.
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
            className="min-h-[52px] px-6 rounded-full bg-turmeric text-ink font-disko text-lg inline-flex items-center justify-center border-2 border-ink press"
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
            className="min-h-[52px] px-6 rounded-full bg-transparent text-rice font-disko text-lg inline-flex items-center justify-center border-2 border-rice"
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
