// Shopify Buy Button configuration.
//
// Three public values. The storefront access token is public by design: unlike
// an Admin API token it can only read published products and start a checkout,
// which is why Shopify prints it into a snippet meant to be pasted into a web
// page. It is in the repository rather than an environment variable for the
// same reason the rest of this file is -- these values must be identical in
// every environment, and a variable that is missing or misnamed fails silently.
//
// NOTE: a Buy Button sends the customer to Shopify's checkout. That checkout
// only accepts orders when the Shopify store is on a paid plan with password
// protection turned off. Until then the button renders and adds to a cart, but
// the sale cannot complete.

export const SHOPIFY_BUY = {
  domain: "rzdvw9-uk.myshopify.com",
  storefrontAccessToken: "5509ec95f0ce8c5d1c01993764bf7e72",
  /** Shopify product id for Glow Gummies. */
  productId: "10597516738741",
} as const;

/** Shopify's own money format token, decoded from the snippet's %24%7B%7B... */
export const MONEY_FORMAT = "${{amount}}";
