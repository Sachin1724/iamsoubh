"use client";

type Params = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Meta standard event plus its GA4 equivalent, fired together. */
export function track(
  metaEvent: string,
  gaEvent: string,
  params: Params = {},
  eventID?: string
) {
  try {
    window.fbq?.("track", metaEvent, params, eventID ? { eventID } : undefined);
  } catch {
    // Tracking must never break a checkout.
  }
  try {
    window.gtag?.("event", gaEvent, params);
  } catch {
    // Same.
  }
}

/** GA4-only event, for interactions Meta has no standard name for. */
export function trackGA(event: string, params: Params = {}) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    // Same.
  }
}

/**
 * Fires once per key for the lifetime of the tab. Purchase must never be
 * double-counted when someone reloads the thank-you page.
 */
export function trackOnce(key: string, fn: () => void) {
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage blocked: fire anyway rather than lose the event entirely.
  }
  fn();
}
