"use client";

import { siteConfig } from "@/config/site-config";

export type Stock = {
  cap: number;
  remaining: number;
  soldOut: boolean;
  familyAvailable: boolean;
};

/**
 * There is no inventory service any more — Razorpay takes the order and the
 * operator ships it. Sold-out is a config flag, and the live counter is off.
 */
export function useStock() {
  return { stock: null as Stock | null, soldOut: siteConfig.soldOut, showCounter: false };
}
