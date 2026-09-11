// Shipping configuration.
//
// This exists because the shipping numbers were left over from when the store
// priced in rupees: free over 999, otherwise a flat 50. Those were sensible as
// rupees. Read as dollars they charge $50 to ship a $35 bottle, and the free
// threshold is 33 times the price of the only product.
//
// Glow ships free on every order, so mode is "free" and the cart shows Free
// throughout with no cost added to the total.
//
// Two other modes exist for when that changes: "flat" charges flatRate below
// freeThreshold and nothing at or above it, and "at_checkout" shows
// "Calculated at checkout" without committing to a number. Switching is a
// one-line change here; nothing else needs to move.

export type ShippingMode = "free" | "at_checkout" | "flat";

export const SHIPPING: {
  mode: ShippingMode;
  /** Charged when the subtotal is below freeThreshold. Used when mode is "flat". */
  flatRate: number;
  /** Subtotal at or above which shipping is free. Used when mode is "flat". */
  freeThreshold: number;
} = {
  mode: "free",
  flatRate: 0,
  freeThreshold: 0,
};

export interface ShippingResult {
  /** Cost to add to the subtotal, or null when it is not known yet. */
  cost: number | null;
  /** What to show on the shipping row. */
  label: string;
  /** How much more to spend to reach free shipping, when that applies. */
  remainingForFree: number | null;
}

export function calculateShipping(subtotal: number): ShippingResult {
  if (SHIPPING.mode === "free") {
    return { cost: 0, label: "Free", remainingForFree: null };
  }

  if (SHIPPING.mode === "at_checkout") {
    return { cost: null, label: "Calculated at checkout", remainingForFree: null };
  }

  const qualifies = subtotal >= SHIPPING.freeThreshold;
  return {
    cost: qualifies ? 0 : SHIPPING.flatRate,
    label: qualifies ? "Free" : "flat",
    remainingForFree: qualifies ? null : SHIPPING.freeThreshold - subtotal,
  };
}
