"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/config/site-config";
import { useStock } from "@/lib/useStock";
import { scrollToTarget } from "@/components/SmoothScroll";

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
      const pastHero = window.scrollY > 300;
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

  if (!visible) return null;

  return (
    <aside
      aria-label="Quick order"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink border-t-2 border-turmeric px-4 py-2.5 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto w-full min-w-0">
        
        {/* Smart Auto-sizing Price & Batch Info */}
        <div className="flex flex-col min-w-0 justify-center">
          {soldOut ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-turmeric font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-turmeric shrink-0" />
              <span className="truncate">Batch 1 Sold Out</span>
            </div>
          ) : (
            <>
              {/* Status Eyebrow */}
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-turmeric leading-none mb-0.5 font-mono">
                <span className="w-1.5 h-1.5 bg-parrot shrink-0" />
                <span className="truncate">
                  {showCounter && stock ? `${stock.remaining} left in Batch 1` : "Batch 1 · Fast Selling"}
                </span>
              </div>

              {/* Price Display: Never wraps awkwardly */}
              <div className="flex items-baseline gap-1 text-rice leading-none">
                <span className="text-xs text-rice/75 font-medium shrink-0">
                  from
                </span>
                <span className="font-gazpacho text-base sm:text-lg font-bold text-turmeric leading-none">
                  ₹{products.family.perBox}
                </span>
                <span className="text-xs text-rice/60 font-normal shrink-0">
                  / box
                </span>
              </div>
            </>
          )}
        </div>

        {/* Smart Responsive Action Button: Crisp rectangular letterpress plate */}
        <button
          type="button"
          onClick={handleOrder}
          className="shrink-0 whitespace-nowrap bg-chandua hover:bg-[#A31812] active:translate-x-[1px] active:translate-y-[1px] text-rice font-mono uppercase tracking-widest text-xs font-bold px-4 py-2.5 rounded-none border border-turmeric shadow-[2px_2px_0_0_#000] transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none"
        >
          <span>{soldOut ? "Join Batch 2" : "Pre-order"}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
}
