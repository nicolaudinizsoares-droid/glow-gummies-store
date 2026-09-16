// Shopify storefront configuration.
//
// Three public values. The storefront access token is public by design: unlike
// an Admin API token it can only read published products and open a checkout,
// which is why Shopify prints it into a snippet meant to be pasted into a web
// page. All of it is in the repository rather than in environment variables
// because these values must be identical in every environment, and a variable
// that is missing or misnamed fails silently -- a failure mode this project
// has already paid for once.
//
// NOTE: a Shopify checkout accepts orders only when the store is on a paid
// plan with password protection turned off. Until then a cart can be built and
// the customer sent to Shopify, but the sale cannot complete.

export const SHOPIFY_BUY = {
  domain: "rzdvw9-uk.myshopify.com",
  storefrontAccessToken: "5509ec95f0ce8c5d1c01993764bf7e72",
  /** Shopify product id for Glow Gummies, used by the /buy widget. */
  productId: "10597516738741",
} as const;

/**
 * This site's product ids, as they appear in products.json, mapped to the
 * Shopify products they are sold as.
 *
 * Explicit rather than "send everything to the one product we know about": a
 * second product added to products.json without its own entry must fail
 * visibly rather than quietly sell the gummies under another name.
 */
export const SHOPIFY_PRODUCT_BY_LOCAL_ID: Record<string, string> = {
  "GLW-HSN-001": SHOPIFY_BUY.productId,
};

/** Shopify's own money format token, decoded from the snippet's %24%7B%7B... */
export const MONEY_FORMAT = "${{amount}}";
