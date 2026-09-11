// Authoritative pricing.
//
// Two rules this file exists to enforce.
//
// First: the browser never tells the server what anything costs. A request says
// "two of GLW-HSN-001"; the amount is worked out here. A tampered request buys
// the same gummies at the same price as an honest one.
//
// Second: the price is whatever Stripe currently says it is. It is read from
// the Price object named by STRIPE_PRICE_ID, not from products.json and not
// from a constant in this repository, so changing the price in the Stripe
// dashboard changes what customers are charged without a deploy. products.json
// still supplies the catalogue -- which products exist, their SKU and name --
// but no longer the money.
//
// Amounts are handled in cents, as integers, because Stripe charges in the
// currency's smallest unit and because 0.1 + 0.2 is not 0.3 in floating point.

import "server-only";

import { getProductById } from "@/lib/products";
import { calculateShipping } from "@/lib/shipping";
import { getStripe } from "@/lib/server/stripe";

/** What the client is allowed to ask for: what, and how many. Never a price. */
export interface RequestedLine {
  productId: string;
  quantity: number;
}

export interface PricedLine {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  /** Unit price in cents, as Stripe currently prices it. */
  unitAmount: number;
}

export interface PricedOrder {
  lines: PricedLine[];
  /** Everything in cents: Stripe's unit, and safe to add up. */
  subtotal: number;
  shipping: number;
  total: number;
  /** Lower-case ISO code, taken from the Stripe Price. */
  currency: string;
}

/** Guards against a negative, fractional, absurd or missing quantity. */
const MAX_QUANTITY_PER_LINE = 10;

/** Something the customer did. Safe to report back to them. */
export class PricingError extends Error {}

/**
 * Something the operator did -- a missing or unusable STRIPE_PRICE_ID. The
 * customer must never see the detail, but it has to be distinguishable from a
 * bad request so the route can answer 503 rather than 400.
 */
export class PriceConfigError extends Error {}

/**
 * Which Stripe Price backs which product.
 *
 * Explicit rather than "use STRIPE_PRICE_ID for whatever was asked for": a
 * second product added to products.json without its own price would otherwise
 * be sold silently at the gummies' price. An unmapped product fails loudly
 * instead.
 */
const PRICE_ID_ENV_BY_PRODUCT: Record<string, string> = {
  "GLW-HSN-001": "STRIPE_PRICE_ID",
};

interface CatalogPrice {
  unitAmount: number;
  currency: string;
}

/**
 * Prices are cached briefly. Stripe is the source of truth, but retrieving a
 * Price on every keystroke-triggered intent update would add a network round
 * trip to each one. Five minutes is short enough that a dashboard price change
 * takes effect while you are still looking at the dashboard.
 */
const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { value: CatalogPrice; at: number }>();

async function getCatalogPrice(productId: string): Promise<CatalogPrice> {
  const envName = PRICE_ID_ENV_BY_PRODUCT[productId];
  if (!envName) {
    throw new PriceConfigError(`No Stripe price is mapped for ${productId}.`);
  }

  const priceId = process.env[envName];
  if (!priceId) {
    throw new PriceConfigError(`${envName} is not set.`);
  }

  const hit = cache.get(priceId);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return hit.value;
  }

  let price;
  try {
    price = await getStripe().prices.retrieve(priceId);
  } catch (error) {
    throw new PriceConfigError(
      `Could not retrieve Stripe price ${priceId}: ${(error as Error).message}`,
    );
  }

  // A recurring price on a one-off checkout would create a PaymentIntent that
  // charges once and never renews -- the customer pays, the subscription they
  // were implicitly sold never exists. Refuse rather than half-do it.
  if (price.type !== "one_time") {
    throw new PriceConfigError(`Stripe price ${priceId} is not a one-time price.`);
  }
  if (!price.active) {
    throw new PriceConfigError(`Stripe price ${priceId} is archived.`);
  }
  // Null for metered or "customer chooses" prices, neither of which can be
  // charged without an amount.
  if (typeof price.unit_amount !== "number") {
    throw new PriceConfigError(`Stripe price ${priceId} has no fixed unit amount.`);
  }

  const value: CatalogPrice = {
    unitAmount: price.unit_amount,
    currency: price.currency,
  };
  cache.set(priceId, { value, at: Date.now() });
  return value;
}

export async function priceOrder(requested: RequestedLine[]): Promise<PricedOrder> {
  if (!Array.isArray(requested) || requested.length === 0) {
    throw new PricingError("The cart is empty.");
  }
  if (requested.length > 20) {
    throw new PricingError("Too many distinct items.");
  }

  const lines: PricedLine[] = [];
  const currencies = new Set<string>();

  for (const line of requested) {
    const product = getProductById(line.productId);
    if (!product) {
      throw new PricingError(`Unknown product: ${line.productId}`);
    }

    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
      throw new PricingError(`Invalid quantity for ${product.sku}`);
    }

    const price = await getCatalogPrice(product.id);
    currencies.add(price.currency);

    lines.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity,
      unitAmount: price.unitAmount,
    });
  }

  // One PaymentIntent carries one currency. Mixed-currency prices would have to
  // be converted, and guessing a rate is worse than refusing.
  if (currencies.size > 1) {
    throw new PriceConfigError("Stripe prices for this cart are in different currencies.");
  }
  const currency = [...currencies][0];

  const subtotal = lines.reduce((sum, l) => sum + l.unitAmount * l.quantity, 0);

  // Shipping comes from the same function the cart and checkout display, so the
  // customer is never quoted one number and charged another.
  const quote = calculateShipping(subtotal / 100);
  if (quote.cost === null) {
    throw new PricingError("Shipping cost is not known for this order.");
  }
  const shipping = Math.round(quote.cost * 100);

  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency,
  };
}
