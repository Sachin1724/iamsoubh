"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site-config";

export type Stock = {
  cap: number;
  remaining: number;
  soldOut: boolean;
  familyAvailable: boolean;
};

/**
 * Live box tally. Returns null until the real number arrives — the page never
 * shows an invented stock figure, so callers must handle null by hiding the counter.
 */
export function useStock() {
  const [stock, setStock] = useState<Stock | null>(null);

  useEffect(() => {
    let cancelled = false;

    // A 503 means stock is unconfigured server-side; polling it forever only spams
    // the log, so the interval stops on the first non-ok response.
    const load = () =>
      fetch("/api/stock")
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("stock"))))
        .then((d) => {
          if (!cancelled && d) setStock(d);
        })
        .catch(() => clearInterval(id));

    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return {
    stock,
    soldOut: stock?.soldOut ?? siteConfig.soldOut,
    // The counter stays hidden until the batch is genuinely running low.
    showCounter: stock !== null && stock.remaining < siteConfig.counterThreshold,
  };
}
