"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/config/site-config";
import { useStock } from "@/lib/useStock";

interface StickyMobileBarProps {
  onOrderClick: () => void;
}

export function StickyMobileBar({ onOrderClick }: StickyMobileBarProps) {
  const [visible, setVisible] = useState(false);
  const { stock, soldOut, showCounter } = useStock();

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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B1B1B] border-t-2 border-[#E0A526] p-3 safe-area-pb"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          {soldOut ? (
            <span className="text-sm font-semibold text-[#F6EFE2]">Batch 1 sold out</span>
          ) : (
            <>
              <span className="text-sm font-semibold text-[#F6EFE2]">
                Batch 1 · from <span className="rupee">₹</span>
                {products.family.perBox} a box
              </span>
              {showCounter && (
                <span className="text-[10px] text-[#F6EFE2]/70 animate-digit-roll">
                  {stock!.remaining} left
                </span>
              )}
            </>
          )}
        </div>

        <button
          onClick={onOrderClick}
          className="bg-[#C8221A] text-[#F6EFE2] font-disko text-base px-6 min-h-[44px] rounded-full flex items-center gap-1.5 border-2 border-[#F6EFE2] press cursor-pointer"
          style={{ boxShadow: "3px 3px 0 0 #E0A526" }}
        >
          <span>{soldOut ? "Join batch 2" : "Pre-order"}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
}
