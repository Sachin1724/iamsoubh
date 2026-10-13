import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

// Built on first use, not at import time, so a build without secrets still succeeds.
let _supabase: SupabaseClient | null = null;
let _razorpay: Razorpay | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
  }
  return _supabase;
}

export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return _razorpay;
}

// Server-side prices. The browser never gets to say what an order costs.
export const PRICING = {
  single: { price: 299, boxesEach: 1, maxQty: 9 },
  family: { price: 749, boxesEach: 3, maxQty: 3 },
} as const;

export type ServerProduct = keyof typeof PRICING;

export function isProduct(v: unknown): v is ServerProduct {
  return v === "single" || v === "family";
}

export const forceSoldOut = () => process.env.FORCE_SOLD_OUT === "true";

export async function alert(message: string) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  } catch {
    // An alert must never fail the request it is reporting on.
  }
}
