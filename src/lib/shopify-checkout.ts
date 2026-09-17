// Handing this site's cart to Shopify's checkout.
//
// The customer browses, adds to the bag and reviews the order here, in Glow's
// own design. Only the payment screen is Shopify's. This module is the seam:
// it turns the local cart into a Shopify checkout and returns the URL to send
// the customer to.
//
// Everything here runs in the browser, using the same public storefront token
// as the /buy widget. No secret is involved, and nothing about the total is
// taken from this page -- Shopify prices the checkout from its own catalogue,
// so a tampered cart buys at Shopify's price or not at all.

"use client";

import { loadShopifySdk, type ShopifyClient } from "@/lib/shopify-sdk";
import { SHOPIFY_BUY, SHOPIFY_PRODUCT_BY_LOCAL_ID } from "@/lib/shopify-buy";

export interface CartLine {
  productId: string;
  quantity: number;
}

/** Raised for anything the customer should be told about, without detail. */
export class ShopifyCheckoutError extends Error {}

let client: ShopifyClient | null = null;

async function getClient(): Promise<ShopifyClient> {
  const sdk = await loadShopifySdk();
  client ??= sdk.buildClient({
    domain: SHOPIFY_BUY.domain,
    storefrontAccessToken: SHOPIFY_BUY.storefrontAccessToken,
  });
  return client;
}

/**
 * Shopify has used several spellings of a product id across SDK versions: a
 * raw numeric id, a gid:// string, and that gid base64-encoded. Which one a
 * given bundle wants is not worth guessing wrong in production, so each is
 * tried in turn and the first that resolves wins.
 */
function idCandidates(numericId: string): string[] {
  const gid = `gid://shopify/Product/${numericId}`;
  const candidates = [gid, numericId];
  try {
    candidates.splice(1, 0, window.btoa(gid));
  } catch {
    /* btoa is unavailable in some embedded webviews; the other forms remain */
  }
  return candidates;
}

const variantCache = new Map<string, string>();

async function firstVariantId(numericId: string): Promise<string> {
  const cached = variantCache.get(numericId);
  if (cached) return cached;

  const shopify = await getClient();

  for (const candidate of idCandidates(numericId)) {
    try {
      const product = await shopify.product.fetch(candidate);
      const variantId = product?.variants?.[0]?.id;
      if (variantId) {
        variantCache.set(numericId, variantId);
        return variantId;
      }
    } catch {
      /* wrong id spelling for this SDK build; try the next */
    }
  }

  throw new ShopifyCheckoutError(`No Shopify variant found for product ${numericId}.`);
}

/**
 * Shopify variant ids arrive from the SDK as a Storefront gid, sometimes
 * base64-encoded. A cart permalink wants the bare number at the end of it.
 */
function numericVariantId(raw: string): string {
  let id = raw;
  // Base64-encoded gid: decode before parsing.
  if (!id.startsWith("gid://") && /^[A-Za-z0-9+/=]+$/.test(id)) {
    try {
      const decoded = window.atob(id);
      if (decoded.startsWith("gid://")) id = decoded;
    } catch {
      /* not base64 after all; fall through and try the digits */
    }
  }
  const match = id.match(/(\d+)\s*$/);
  if (!match) {
    throw new ShopifyCheckoutError(`Could not read a variant id from "${raw}".`);
  }
  return match[1];
}

/**
 * Build the Shopify checkout URL for the given cart.
 *
 * A cart permalink -- /cart/<variantId>:<quantity> -- rather than the
 * Storefront checkout mutation. That mutation is the deprecated Checkout API,
 * and on a store created after Shopify began retiring it, it returns a
 * checkout whose line items then fail to resolve: the customer reaches a
 * payment page that says the item is no longer available while the admin shows
 * it in stock. The permalink is Shopify's own long-standing route into
 * checkout, has no API version to fall out of date, and builds the cart from
 * the same variant ids.
 *
 * Throws rather than returning a partial cart: sending someone to pay for some
 * of what they chose is worse than not sending them at all.
 */
export async function createCheckoutUrl(lines: CartLine[]): Promise<string> {
  if (lines.length === 0) {
    throw new ShopifyCheckoutError("The cart is empty.");
  }

  const parts: string[] = [];

  for (const line of lines) {
    const shopifyProductId = SHOPIFY_PRODUCT_BY_LOCAL_ID[line.productId];
    if (!shopifyProductId) {
      throw new ShopifyCheckoutError(`No Shopify product mapped for ${line.productId}.`);
    }

    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    const variantId = numericVariantId(await firstVariantId(shopifyProductId));

    // Logged so a checkout that Shopify rejects can be traced to the exact
    // variant it was built from, without guessing at the admin.
    console.info("[checkout] variant", variantId, "x", quantity);

    parts.push(`${variantId}:${quantity}`);
  }

  return `https://${SHOPIFY_BUY.domain}/cart/${parts.join(",")}`;
}
