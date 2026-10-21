import "server-only";
import Razorpay from "razorpay";

// Built on first use, not at import time, so a build without secrets still succeeds.
let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return _razorpay;
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
