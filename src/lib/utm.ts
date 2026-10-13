"use client";

const KEY = "odia-2027-utm";

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
};

/**
 * Captures UTM tags on first landing and keeps them for the session, so an
 * order still credits its channel after the visitor has clicked around.
 */
export function captureUtm() {
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Utm = {
      source: q.get("utm_source") ?? undefined,
      medium: q.get("utm_medium") ?? undefined,
      campaign: q.get("utm_campaign") ?? undefined,
      content: q.get("utm_content") ?? undefined,
    };
    if (Object.values(found).some(Boolean)) {
      sessionStorage.setItem(KEY, JSON.stringify(found));
    }
  } catch {
    // No UTMs is a normal state, not an error.
  }
}

export function getUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
