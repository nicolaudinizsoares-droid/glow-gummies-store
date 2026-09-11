// Handing the cart to Shopify's checkout.
//
// Payment happens on Shopify, not here. The customer builds a cart on this
// site, then a link carries it to Shopify's own checkout, which collects the
// address, takes the card and sends the confirmation email. Nothing on this
// site sees a card number, and there is no API call, token or secret involved
// -- the whole handoff is a URL of the form
//
//   https://<store>/cart/<variantId>:<quantity>,<variantId>:<quantity>
//
// Both values below are deliberately in the repository rather than in
// environment variables. They are public -- the store domain is where
// customers are sent, and variant ids appear in ordinary Shopify URLs -- so
// hiding them buys nothing, while an environment variable that is missing,
// misnamed, or set after the last build fails silently and is miserable to
// diagnose. Changing the store or the product is a code change, visible in
// the diff, and it either works everywhere or nowhere.

/**
 * The Shopify store's checkout domain.
 *
 * Either the myshopify.com address ("glow-gummies.myshopify.com") or a custom
 * domain that Shopify serves. NOT the storefront domain of this site.
 */
export const SHOPIFY_STORE_DOMAIN = "";

/**
 * Shopify variant id for each product id in products.json.
 *
 * The long number from the Shopify admin URL when a product variant is open:
 * .../products/1234567890/variants/9876543210 -- the second number.
 */
const VARIANT_IDS: Record<string, string> = {
  "GLW-HSN-001": "",
};

export interface CartLine {
  productId: string;
  quantity: number;
}

/** False until a store domain and at least one variant id are filled in. */
export const shopifyConfigured = () =>
  Boolean(SHOPIFY_STORE_DOMAIN) && Object.values(VARIANT_IDS).some(Boolean);

/** True when this specific product can be bought. */
export const variantIdFor = (productId: string) => VARIANT_IDS[productId] || null;

/**
 * The Shopify checkout URL for a cart, or null when anything in it cannot be
 * mapped to a Shopify variant. Null rather than a partial cart: sending
 * someone to pay for some of what they chose is worse than not sending them.
 */
export function checkoutUrl(lines: CartLine[]): string | null {
  if (!SHOPIFY_STORE_DOMAIN || lines.length === 0) return null;

  const parts: string[] = [];
  for (const line of lines) {
    const variantId = variantIdFor(line.productId);
    if (!variantId) return null;

    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    parts.push(`${variantId}:${quantity}`);
  }

  // /cart/... puts the items straight into a fresh Shopify cart and lands the
  // customer on checkout. "channel=buy_button" tells Shopify the sale came
  // from an external storefront, so it is attributed to this site rather than
  // appearing as direct traffic.
  return `https://${SHOPIFY_STORE_DOMAIN}/cart/${parts.join(",")}?channel=buy_button`;
}
