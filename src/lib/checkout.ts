"use client";

import { track } from "@/lib/track";
import { getUtm } from "@/lib/utm";
import type { OrderData } from "@/components/PreorderSection";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (e: string, cb: (x: unknown) => void) => void;
    };
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("checkout script failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("checkout script failed"));
    document.body.appendChild(s);
  });
}

type CheckoutResult = { ok: true } | { ok: false; message: string };

/**
 * One click from the preorder form into Magic Checkout. Razorpay collects the
 * delivery address itself and the webhook reads it back off the paid order,
 * so nothing here needs an address.
 */
export async function startCheckout(
  order: OrderData,
  onDismiss: () => void
): Promise<CheckoutResult> {
  const label =
    order.product === "family"
      ? "Odia Viral Calendar 2027 · Family Pack"
      : "Odia Viral Calendar 2027 · Single Box";

  track("InitiateCheckout", "begin_checkout", {
    value: order.total,
    currency: "INR",
    contents: [{ id: order.product, quantity: order.quantity }],
  });

  try {
    await loadCheckout();

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        product: order.product,
        qty: order.quantity,
        customer: {
          name: order.fullName,
          phone: order.phone,
          email: order.email,
          pincode: order.pincode,
          city: order.city,
          state: order.state,
          address: order.address,
          landmark: order.landmark,
          giftNote: order.giftNote,
        },
        utm: getUtm(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        message:
          data.code === "SOLD_OUT"
            ? "Batch 1 just sold out."
            : data.code === "BAD_PHONE"
              ? "Enter a valid 10-digit mobile number."
              : "Could not start the payment. Please try again.",
      };
    }

    const rzp = new window.Razorpay!({
      key: data.keyId,
      order_id: data.razorpayOrderId,
      amount: data.amount,
      currency: "INR",
      // Magic Checkout: Razorpay recognises the number and fills the address.
      one_click_checkout: true,
      show_coupons: false,
      name: "IAMSOUBH",
      description: label,
      prefill: {
        name: order.fullName || undefined,
        email: order.email || undefined,
        contact: `+91${order.phone}`,
      },
      theme: { color: "#C8221A" },
      timeout: 900,
      retry: { enabled: true },
      modal: { confirm_close: true, ondismiss: onDismiss },
      handler: async (r: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(r),
        });
        window.location.href = `/thank-you?o=${r.razorpay_order_id}`;
      },
    });

    let failed = false;
    rzp.on("payment.failed", () => {
      failed = true;
    });

    track("AddPaymentInfo", "add_payment_info", { value: order.total, currency: "INR" });
    rzp.open();

    return failed
      ? { ok: false, message: "That payment did not go through. You can try again." }
      : { ok: true };
  } catch {
    return {
      ok: false,
      message: "Could not reach the payment gateway. Check your connection and try again.",
    };
  }
}
