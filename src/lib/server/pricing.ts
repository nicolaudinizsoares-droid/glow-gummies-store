// Authoritative pricing.
//
// The one rule this file exists to enforce: the browser never tells the server
// what anything costs. A request says "two of GLW-HSN-001"; the amount is
// worked out here, from the same products.json the storefront renders. A
// tampered request buys the same gummies at the same price as an honest one.
//
// Amounts are handled in cents, as integers, because Stripe charges in the
// currency's smallest unit and because 0.1 + 0.2 is not 0.3 in floating point.

import "server-only";

import { getProductById } from "@/lib/products";
import { CURRENCY } from "@/lib/currency";
import { calculateShipping } from "@/lib/shipping";

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
  /** Unit price in cents. */
  unitAmount: number;
  /** Unit price as a decimal string, for Shopify. */
  unitPrice: string;
}

export interface PricedOrder {
  lines: PricedLine[];
  /** Everything in cents: Stripe's unit, and safe to add up. */
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
}

/** Guards against a negative, fractional, absurd or missing quantity. */
const MAX_QUANTITY_PER_LINE = 10;

export class PricingError extends Error {}

const toCents = (amount: number) => Math.round(amount * 100);

export function priceOrder(requested: RequestedLine[]): PricedOrder {
  if (!Array.isArray(requested) || requested.length === 0) {
    throw new PricingError("The cart is empty.");
  }
  if (requested.length > 20) {
    throw new PricingError("Too many distinct items.");
  }

  const lines: PricedLine[] = requested.map((line) => {
    const product = getProductById(line.productId);
    if (!product) {
      throw new PricingError(`Unknown product: ${line.productId}`);
    }

    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
      throw new PricingError(`Invalid quantity for ${product.sku}`);
    }

    const unitAmount = toCents(product.pricing.selling_price);
    return {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity,
      unitAmount,
      unitPrice: product.pricing.selling_price.toFixed(2),
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.unitAmount * l.quantity, 0);

  // Shipping comes from the same function the cart and checkout display, so the
  // customer is never quoted one number and charged another.
  const quote = calculateShipping(subtotal / 100);
  if (quote.cost === null) {
    throw new PricingError("Shipping cost is not known for this order.");
  }
  const shipping = toCents(quote.cost);

  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: CURRENCY.toLowerCase(),
  };
}
