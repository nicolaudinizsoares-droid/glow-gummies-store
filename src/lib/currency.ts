// Single source of truth for how money is displayed.
//
// The storefront previously hardcoded a rupee symbol in 31 places across six
// files, then displayed USD while Stripe was set up to charge CAD. It is CAD
// now, matching the Stripe Price that actually charges the card -- en-CA
// renders that as "$35.00", so nothing on the page looks different, it is
// simply no longer claiming a currency the customer will not be billed in.
//
// To switch the whole store to another currency, change these two constants
// AND the currency of the Stripe Price named by STRIPE_PRICE_ID. The charge
// follows Stripe; only the display follows this file.

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

/**
 * Format an amount in the currency's smallest unit, which is how Stripe
 * reports one. Keeps the checkout's "you will be charged this" line in the
 * same shape as every other price on the site.
 */
export function formatAmount(cents: number, currency: string = CURRENCY): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
