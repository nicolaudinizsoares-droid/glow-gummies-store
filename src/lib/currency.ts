// Single source of truth for how money is displayed.
//
// The storefront previously hardcoded a rupee symbol in 31 places across six
// files, then displayed USD while the store was set up to charge CAD. It is
// CAD now -- en-CA renders that as "$35.00", so nothing on the page looks
// different, it is simply no longer claiming a currency the customer will not
// be billed in.
//
// These constants control display only. The amount actually charged is
// Shopify's, set in the Shopify product. Change the currency here and in
// Shopify together, or the page will quote one and the checkout take another.

export const CURRENCY = "CAD";
export const LOCALE = "en-CA";

const formatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
});

/** Format a numeric amount as a display price, e.g. 24.99 -> "$24.99". */
export function formatPrice(amount: number): string {
  return formatter.format(amount);
}
