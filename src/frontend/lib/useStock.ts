"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site-config";

export type Stock = {
  cap: number;
  remaining: number;
  soldOut: boolean;
};

// One read shared by every component on the page.
let shared: Promise<Stock | null> | null = null;
let sharedAt = 0;

function readStock(): Promise<Stock | null> {
  if (!shared || Date.now() - sharedAt > 30_000) {
    sharedAt = Date.now();
    shared = fetch("/api/stock")
      .then((r) => (r.ok ? (r.json() as Promise<Stock>) : null))
      .catch(() => null);
  }
  return shared;
}

/**
 * Live from /api/stock, which counts Razorpay's paid orders. If that is down the
 * page behaves as if there is no counter; the cap itself is still enforced when
 * the order is created. `siteConfig.soldOut` is the manual override.
 */
export function useStock() {
  const [stock, setStock] = useState<Stock | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => readStock().then((s) => alive && setStock(s));
    load();
    const t = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const soldOut = siteConfig.soldOut || !!stock?.soldOut;
  const showCounter = !!stock && !soldOut && stock.remaining < siteConfig.counterThreshold;
  return { stock, soldOut, showCounter };
}
