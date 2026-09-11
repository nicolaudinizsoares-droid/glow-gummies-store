// Create or update the PaymentIntent for a checkout.
//
// The client sends product ids, quantities and the delivery details it already
// collected. It does not send prices, and any it did send would be ignored --
// priceOrder works the total out from products.json. That is the whole defence
// against someone editing the request and buying at their own price.
//
// Called again on every edit of the cart, so it reuses one PaymentIntent per
// checkout session rather than leaving a trail of abandoned ones in Stripe.

import { NextResponse } from "next/server";

import { getStripe, stripeConfigured } from "@/lib/server/stripe";
import { priceOrder, PricingError, type RequestedLine } from "@/lib/server/pricing";
import { validate, type CheckoutDetails } from "@/lib/checkout";

export const runtime = "nodejs";

interface Body {
  lines?: RequestedLine[];
  details?: CheckoutDetails;
  paymentIntentId?: string;
}

export async function POST(request: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Details are optional when the intent is first created, because the card
  // box has to mount before the customer has finished typing their address.
  // They are required by the time it is confirmed, and the client sends them in
  // a second call just before that -- so validate whenever they are present.
  // A browser check is a convenience; this is the guarantee.
  if (body.details) {
    const invalid = validate(body.details);
    if (Object.keys(invalid).length > 0) {
      return NextResponse.json({ error: "Delivery details are incomplete." }, { status: 400 });
    }
  }

  let priced;
  try {
    priced = priceOrder(body.lines ?? []);
  } catch (error) {
    if (error instanceof PricingError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  const d = body.details;
  const stripe = getStripe();

  // Everything the webhook will need to build the Shopify order, carried on the
  // PaymentIntent itself. Stripe caps each metadata value at 500 characters, so
  // the lines go in as a compact "productId:qty" list rather than JSON.
  const metadata: Record<string, string> = {
    lines: priced.lines.map((l) => `${l.productId}:${l.quantity}`).join(","),
    ...(d && {
      email: d.email.trim(),
      first_name: d.firstName.trim(),
      last_name: d.lastName.trim(),
      address1: d.address1.trim(),
      address2: d.address2.trim(),
      city: d.city.trim(),
      region: d.region.trim(),
      postcode: d.postcode.trim(),
      country: d.country.trim(),
    }),
  };

  const shipping = d
    ? {
        name: `${d.firstName.trim()} ${d.lastName.trim()}`.trim(),
        address: {
          line1: d.address1.trim(),
          line2: d.address2.trim() || undefined,
          city: d.city.trim(),
          state: d.region.trim(),
          postal_code: d.postcode.trim(),
          country: d.country.trim(),
        },
      }
    : undefined;

  try {
    // Reuse the intent for this checkout when the customer changes something,
    // unless Stripe has already moved it past the point where that is allowed.
    if (body.paymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(body.paymentIntentId);
      if (existing.status === "requires_payment_method" || existing.status === "requires_confirmation") {
        const updated = await stripe.paymentIntents.update(existing.id, {
          amount: priced.total,
          currency: priced.currency,
          metadata,
          shipping,
          receipt_email: d?.email.trim(),
        });
        return NextResponse.json({
          clientSecret: updated.client_secret,
          paymentIntentId: updated.id,
          amount: updated.amount,
        });
      }
    }

    const intent = await stripe.paymentIntents.create({
      amount: priced.total,
      currency: priced.currency,
      automatic_payment_methods: { enabled: true },
      metadata,
      shipping,
      receipt_email: d?.email.trim(),
      description: priced.lines.map((l) => `${l.quantity} x ${l.name}`).join(", "),
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: intent.amount,
    });
  } catch (error) {
    // Never hand a Stripe error string to the browser: it can name internal
    // objects and configuration.
    console.error("[payment-intent]", error);
    return NextResponse.json({ error: "Could not start the payment." }, { status: 502 });
  }
}
