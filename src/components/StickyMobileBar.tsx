"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/config/site-config";
import { useStock } from "@/lib/useStock";

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
      document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B1B1B] border-t-2 border-[#E0A526] px-4 py-2.5 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto w-full min-w-0">
        
        {/* Smart Auto-sizing Price & Batch Info */}
        <div className="flex flex-col min-w-0 justify-center">
          {soldOut ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E0A526]">
              <span className="w-2 h-2 rounded-full bg-[#E0A526] animate-pulse" />
              <span className="truncate">Batch 1 Sold Out</span>
            </div>
          ) : (
            <>
              {/* Status Eyebrow */}
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#E0A526] leading-none mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E9B47] animate-pulse shrink-0" />
                <span className="truncate">
                  {showCounter && stock ? `${stock.remaining} left in Batch 1` : "Batch 1 · Fast Selling"}
                </span>
              </div>

              {/* Price Display: Never wraps awkwardly */}
              <div className="flex items-baseline gap-1 text-[#F6EFE2] leading-none">
                <span className="text-[11px] sm:text-xs text-[#F6EFE2]/75 font-medium shrink-0">
                  from
                </span>
                <span className="font-gazpacho text-base sm:text-lg font-bold text-[#E0A526] leading-none">
                  ₹{products.family.perBox}
                </span>
                <span className="text-[10px] sm:text-xs text-[#F6EFE2]/60 font-normal shrink-0">
                  / box
                </span>
              </div>
            </>
          )}
        </div>

        {/* Smart Responsive Action Button: Guaranteed single-line, auto-scales padding */}
        <button
          type="button"
          onClick={handleOrder}
          className="shrink-0 whitespace-nowrap bg-[#C8221A] hover:bg-[#A31812] active:scale-95 text-[#F6EFE2] font-gazpacho text-sm sm:text-base font-bold px-5 py-2.5 rounded-full border-2 border-[#F6EFE2] shadow-[2px_2px_0_0_#E0A526] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
        >
          <span>{soldOut ? "Join Batch 2" : "Pre-order"}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
}
