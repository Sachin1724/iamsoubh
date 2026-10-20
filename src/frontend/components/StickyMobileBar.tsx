"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/config/site-config";
import { useStock } from "@/frontend/lib/useStock";
import { scrollToTarget } from "@/frontend/components/SmoothScroll";

interface StickyMobileBarProps {
  onOrderClick?: () => void;
}

export function StickyMobileBar({ onOrderClick }: StickyMobileBarProps) {
  const [visible, setVisible] = useState(false);
  const { stock, soldOut, showCounter } = useStock();

  const handleOrder = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      scrollToTarget("#preorder");
    }
  };

  useEffect(() => {
    const target = document.getElementById("preorder");

    const update = () => {
      const hero = document.getElementById("hero");
      const pastHero = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 600;
      // Never cover the real order form.
      const orderOnScreen = (() => {
        if (!target) return false;
        const r = target.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      })();
      setVisible(pastHero && !orderOnScreen);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <aside
      aria-label="Quick order"
      aria-hidden={!visible}
      className={`md:hidden fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/50 bg-white/50 py-2.5 pl-4 pr-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.25),0_10px_32px_rgba(40,10,10,0.22)] backdrop-blur-2xl backdrop-saturate-[1.8] transition-all duration-300 ease-out [padding-bottom:calc(0.625rem+env(safe-area-inset-bottom))] [@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* Glass sheen: light catching the top of the pane */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/55 via-white/10 to-transparent"
      />
      <div className="relative min-w-0">
        {soldOut ? (
          <>
            <p className="text-sm font-bold leading-tight text-ink">Batch 1 sold out</p>
            <p className="mt-0.5 truncate text-xs text-ink/60">Batch 2 opens soon</p>
          </>
        ) : (
          <>
            <p className="truncate text-sm font-bold leading-tight text-ink">
              {showCounter && stock ? `${stock.remaining} left` : "Batch 1"} · from ₹{products.gift.perBox} a box
            </p>
            <p className="mt-0.5 truncate text-xs text-ink/60">Free delivery all over India</p>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handleOrder}
        tabIndex={visible ? 0 : -1}
        className="relative inline-flex shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-xl bg-chandua px-5 py-3 font-gazpacho text-sm font-bold text-rice transition-transform active:scale-[0.97]"
      >
        {soldOut ? "Join batch 2" : "Pre-order"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </aside>
  );
}
