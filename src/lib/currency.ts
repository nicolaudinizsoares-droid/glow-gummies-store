// Single source of truth for how money is displayed.
//
// The storefront previously hardcoded a rupee symbol in 31 places across six
// files. Glow's packaging is US-market (net weight in oz, "Made in the USA"),
// so this defaults to USD. To switch the whole store to another currency,
// change these two constants -- nothing else needs to be touched.

export const CURRENCY = "USD";
export const LOCALE = "en-US";

const formatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
});

/** Format a numeric amount as a display price, e.g. 24.99 -> "$24.99". */
export function formatPrice(amount: number): string {
  return formatter.format(amount);
}
