// Analytics event layer.
//
// Scaffolding only. No pixel, tag or measurement ID is wired up, because that
// needs accounts and keys Glow has to create. What this gives you is a single
// place every commerce event flows through, so adding GA4, Meta, TikTok or
// anything else is one file rather than a hunt through components.
//
// Events follow the standard ecommerce names the major platforms share, so
// they map onto GA4 and Meta without renaming at the call sites.

import { CURRENCY } from "@/lib/currency";

export type AnalyticsEvent =
  | { name: "page_view"; path: string }
  | { name: "view_item"; id: string; item: string; value: number }
  | { name: "add_to_cart"; id: string; item: string; quantity: number; value: number }
  | { name: "remove_from_cart"; id: string; item: string; quantity: number; value: number }
  | { name: "view_cart"; value: number; items: number }
  | { name: "begin_checkout"; value: number; items: number }
  | { name: "purchase"; orderId: string; value: number; items: number };

type Consent = "granted" | "denied" | "unknown";

/**
 * Consent state. Nothing is sent while this is anything but "granted", so
 * wiring a real pixel here cannot start tracking before a consent banner
 * exists. Set it from whatever consent UI Glow adopts.
 */
let consent: Consent = "unknown";
export const setAnalyticsConsent = (state: Consent) => {
  consent = state;
};

/** Push an event. Currently logs in development and no-ops in production. */
export function track(event: AnalyticsEvent) {
  const payload = { ...event, currency: CURRENCY, ts: Date.now() };

  if (consent !== "granted") {
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics] withheld, consent not granted:", payload);
    }
    return;
  }

  // --- Wire real destinations here -------------------------------------
  // GA4:   window.gtag?.("event", event.name, payload)
  // Meta:  window.fbq?.("track", META_EVENT[event.name], payload)
  // TikTok:window.ttq?.track(TIKTOK_EVENT[event.name], payload)
  // ---------------------------------------------------------------------

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }
}

/**
 * Reads UTM parameters off the current URL so campaign attribution survives
 * into whatever destination is wired up later.
 */
export function readUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}
