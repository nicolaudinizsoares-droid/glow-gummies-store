// Configuration self-check. Temporary: delete once payments are working.
//
// Exists because a misconfigured deployment and a broken one look identical
// from the outside -- the checkout says "no payment processor is connected"
// whether the key is missing, misspelled, or scoped to the wrong environment.
// This reports which of those it is.
//
// It never returns a key, or any part of one beyond the public prefix that
// says test or live. Nothing here lets a reader charge, refund, or read a
// payment. The price and currency it reports are already printed on the
// storefront.

import { NextResponse } from "next/server";

import { getStripe } from "@/lib/server/stripe";

export const runtime = "nodejs";
// Read at request time, not baked in at build: the point is to report what
// this deployment can actually see right now.
export const dynamic = "force-dynamic";

/** "sk_test", "pk_live" -- enough to spot a test key in a live deployment. */
const modeOf = (key: string | undefined) =>
  key ? (key.startsWith("sk_test") || key.startsWith("pk_test") ? "test" : "live") : null;

export async function GET() {
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  const checks: Record<string, unknown> = {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
      present: Boolean(publishable),
      looksRight: Boolean(publishable?.startsWith("pk_")),
      mode: modeOf(publishable),
    },
    STRIPE_SECRET_KEY: {
      present: Boolean(secret),
      looksRight: Boolean(secret?.startsWith("sk_")),
      mode: modeOf(secret),
    },
    STRIPE_PRICE_ID: {
      present: Boolean(priceId),
      looksRight: Boolean(priceId?.startsWith("price_")),
    },
  };

  // The live price, fetched the same way checkout fetches it. This is the
  // check that catches a price that is archived, recurring, or in the wrong
  // currency -- none of which are visible from the dashboard at a glance.
  if (secret && priceId) {
    try {
      const price = await getStripe().prices.retrieve(priceId);
      checks.price = {
        ok: price.active && price.type === "one_time" && typeof price.unit_amount === "number",
        amount: typeof price.unit_amount === "number" ? price.unit_amount / 100 : null,
        currency: price.currency?.toUpperCase() ?? null,
        type: price.type,
        active: price.active,
      };
    } catch (error) {
      // The message can name Stripe objects, so it is reduced to a category.
      const raw = (error as Error).message ?? "";
      checks.price = {
        ok: false,
        problem: /No such price/i.test(raw)
          ? "No price with that ID exists in this Stripe account or mode."
          : /Invalid API Key|authentication/i.test(raw)
            ? "Stripe rejected the secret key."
            : "Could not reach Stripe.",
      };
    }
  } else {
    checks.price = { ok: false, problem: "Skipped: secret key or price ID missing." };
  }

  return NextResponse.json({ checkedAt: new Date().toISOString(), checks });
}
