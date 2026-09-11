// Stripe, server side only.
//
// "server-only" is not decoration: it makes the build fail if this module is
// ever imported from a client component, which is the mistake that would put a
// secret key in the browser bundle. The key is read from the environment and
// never written down anywhere in this repository.

import "server-only";

import Stripe from "stripe";

let client: Stripe | null = null;

/** True when a secret key is configured. Lets routes fail cleanly, not loudly. */
export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  if (!client) {
    client = new Stripe(key, {
      // Pinned rather than floating: an API version that changes underneath a
      // deployment changes the shape of webhook payloads without a deploy.
      apiVersion: "2026-08-26.dahlia",
      appInfo: { name: "glow-gummies-store" },
    });
  }
  return client;
}

/**
 * Every PaymentIntent carries the tag the webhook uses to find, or avoid
 * re-creating, its Shopify order. One place so the two sides cannot disagree.
 */
export const shopifyTagFor = (paymentIntentId: string) => `stripe_pi_${paymentIntentId}`;
