"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { lowestBoxPrice } from "@/config/site-config";
import { useStock } from "@/frontend/lib/useStock";
import { scrollToTarget } from "@/frontend/components/SmoothScroll";
import { cta } from "@/frontend/components/ui/cta";

interface StickyMobileBarProps {
  onOrderClick?: () => void;
}

export function StickyMobileBar({ onOrderClick }: StickyMobileBarProps) {
  const [visible, setVisible] = useState(false);
  const { soldOut } = useStock();

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
      className={`md:hidden fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-2xl border-[1.5px] border-ink bg-[#FAF6EE] py-2.5 pl-4 pr-2.5 shadow-[3px_3px_0_0_#1B1B1B] transition-all duration-300 ease-out [padding-bottom:calc(0.625rem+env(safe-area-inset-bottom))] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="relative min-w-0">
        {soldOut ? (
          <>
            <p className="text-sm font-bold leading-tight text-ink">Batch 1 sold out</p>
            <p className="mt-0.5 truncate text-xs text-ink/60">Batch 2 opens soon</p>
          </>
        ) : (
          <>
            <p className="truncate text-sm font-bold leading-tight text-ink">
              Batch 1 · from ₹{lowestBoxPrice} a box
            </p>
            <p className="mt-0.5 truncate text-xs text-ink/60">Free delivery all over India</p>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handleOrder}
        tabIndex={visible ? 0 : -1}
        className={`relative shrink-0 ${cta("red", "sm")}`}
      >
        {soldOut ? "Join batch 2" : "Buy Now"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </aside>
  );
}
