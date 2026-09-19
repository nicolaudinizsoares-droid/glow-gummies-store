// The multi-buy offer.
//
// One rule, in one place, because it has to be told the same way three times
// on this site -- the cart drawer, the cart page and the checkout summary --
// and a fourth time in Shopify, which is the only one that actually takes the
// money.
//
// THE SHOPIFY HALF: this file changes what the customer is *shown*. Shopify
// charges what Shopify's own discount says. If the automatic discount there is
// removed, changed or expires, this site will quote a price the checkout does
// not honour, which is worse than having no offer at all. The two must be
// edited together:
//
//   Shopify > Discounts > Create discount > Amount off products
//     Method:            Automatic
//     Discount value:    $10 off
//     Applies to:        Glow Gummies
//     Minimum quantity:  2 items
//
// That configuration is the one this file mirrors: a single $10 off an order
// once it holds two bottles or more, not $10 off each pair.

/** Display copy for the offer, so the pitch and the maths cannot disagree. */
export const BUNDLE = {
  /** Bottles needed before the discount applies. */
  minQuantity: 2,
  /** Amount taken off the order, once, in the store's display currency. */
  amountOff: 10,
} as const;

interface QuantityLine {
  quantity: number;
}

/** Bottles in the cart, not lines: two of one product is two bottles. */
export const bottleCount = (items: QuantityLine[]) =>
  items.reduce((n, i) => n + (Number(i.quantity) || 0), 0);

/**
 * What to take off this cart, in the display currency. Zero when it does not
 * qualify.
 *
 * Capped at the subtotal so a discount can never exceed the order and show a
 * negative total -- unreachable at today's prices, but the kind of thing that
 * becomes reachable the day someone adds a cheaper product.
 */
export function bundleDiscount(items: QuantityLine[], subtotal: number): number {
  if (bottleCount(items) < BUNDLE.minQuantity) return 0;
  return Math.min(BUNDLE.amountOff, Math.max(0, subtotal));
}
