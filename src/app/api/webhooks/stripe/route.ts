// Stripe webhook. The only thing in this codebase that creates a Shopify order.
//
// Reaching the success page does not create an order, because a customer can
// open that URL directly, refresh it, or never reach it at all after paying.
// The only evidence of payment this accepts is a request Stripe signed.
//
// Duplicate protection, because Stripe delivers a webhook at least once and
// sometimes more than once. Three gates, cheapest first:
//
//   1. The PaymentIntent's own metadata. If shopify_order_id is on it, an order
//      exists and we are done -- no Shopify call at all.
//   2. A tag search in Shopify for stripe_pi_<id>. Catches the case where the
//      order was created but writing the id back failed.
//   3. The write-back itself, so gate 1 answers next time.
//
// That closes ordinary redelivery. Two deliveries arriving in the same instant
// could still pass both reads before either writes; a lock in Vercel KV would
// close that, and is worth adding if order volume ever makes it likely.

import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe, stripeConfigured, shopifyTagFor } from "@/lib/server/stripe";
import {
  createPaidOrder,
  findOrderByTag,
  resolveVariantId,
  shopifyConfigured,
  ShopifyError,
} from "@/lib/server/shopify";
import { priceOrder, type RequestedLine } from "@/lib/server/pricing";

export const runtime = "nodejs";

/** Rebuild the requested lines from the compact "id:qty,id:qty" metadata. */
function parseLines(raw: string | undefined): RequestedLine[] {
  if (!raw) return [];
  return raw
    .split(",")
    .filter(Boolean)
    .map((pair) => {
      const [productId, quantity] = pair.split(":");
      return { productId, quantity: Number(quantity) };
    });
}

async function handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
  const stripe = getStripe();
  const tag = shopifyTagFor(intent.id);

  // Gate 1
  if (intent.metadata?.shopify_order_id) {
    console.info(`[stripe-webhook] ${intent.id} already has an order; skipping.`);
    return;
  }

  if (!shopifyConfigured()) {
    // Loudly, but without failing the webhook: Stripe would retry forever and
    // the payment is already taken. This needs a human, not a retry.
    console.error(`[stripe-webhook] ${intent.id} paid but Shopify is not configured.`);
    return;
  }

  // Gate 2
  const existing = await findOrderByTag(tag);
  if (existing) {
    await stripe.paymentIntents.update(intent.id, {
      metadata: { ...intent.metadata, shopify_order_id: existing },
    });
    console.info(`[stripe-webhook] ${intent.id} already had order ${existing}; recorded.`);
    return;
  }

  const m = intent.metadata ?? {};
  // Re-price from products.json rather than trusting the amount on the intent:
  // this yields the per-line prices Shopify needs, from the same source the
  // charge was calculated from.
  const priced = priceOrder(parseLines(m.lines));

  const lines = await Promise.all(
    priced.lines.map(async (line) => ({
      variantId: await resolveVariantId(line.sku),
      quantity: line.quantity,
      unitPrice: line.unitPrice,
    })),
  );

  const orderId = await createPaidOrder({
    email: m.email ?? intent.receipt_email ?? "",
    lines,
    address: {
      firstName: m.first_name ?? "",
      lastName: m.last_name ?? "",
      address1: m.address1 ?? "",
      address2: m.address2 || undefined,
      city: m.city ?? "",
      province: m.region ?? "",
      zip: m.postcode ?? "",
      country: m.country ?? "",
    },
    currency: intent.currency,
    tag,
    paymentIntentId: intent.id,
    totalPaid: (intent.amount_received / 100).toFixed(2),
  });

  // Gate 3
  await stripe.paymentIntents.update(intent.id, {
    metadata: { ...intent.metadata, shopify_order_id: orderId },
  });

  console.info(`[stripe-webhook] ${intent.id} -> Shopify order ${orderId}`);
}

export async function POST(request: Request) {
  if (!stripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // The raw body, not the parsed one: the signature is over the exact bytes.
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    // Anything unsigned or tampered with stops here, before any order logic.
    console.warn("[stripe-webhook] rejected:", (error as Error).message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      await handlePaymentSucceeded(event.data.object);
    }
  } catch (error) {
    if (error instanceof ShopifyError) {
      // 500 so Stripe retries: Shopify being briefly unavailable should not
      // cost the customer their order.
      console.error("[stripe-webhook] Shopify:", error.message);
      return NextResponse.json({ error: "Order creation failed." }, { status: 500 });
    }
    console.error("[stripe-webhook]", error);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  // 200 for every event type, handled or not, so Stripe stops resending.
  return NextResponse.json({ received: true });
}
