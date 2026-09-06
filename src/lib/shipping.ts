// Shipping configuration.
//
// This exists because the shipping numbers were left over from when the store
// priced in rupees: free over 999, otherwise a flat 50. Those were sensible as
// rupees. Read as dollars they charge $50 to ship a $30 bottle, and the free
// threshold is 33 times the price of the only product.
//
// Glow has not set a real shipping policy yet, so rather than invent rates the
// cart shows "Calculated at checkout", which is honest and standard. When the
// real policy exists, set mode to "flat" and fill in the numbers here; nothing
// else needs to change.

export type ShippingMode = "at_checkout" | "flat";

export const SHIPPING: {
  mode: ShippingMode;
  /** Charged when the subtotal is below freeThreshold. Used when mode is "flat". */
  flatRate: number;
  /** Subtotal at or above which shipping is free. Used when mode is "flat". */
  freeThreshold: number;
} = {
  mode: "at_checkout",
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
