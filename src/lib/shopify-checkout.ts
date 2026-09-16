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
 * Build a Shopify checkout for the given cart and return its URL.
 *
 * Throws rather than returning a partial checkout: sending someone to pay for
 * some of what they chose is worse than not sending them at all.
 */
export async function createCheckoutUrl(lines: CartLine[]): Promise<string> {
  if (lines.length === 0) {
    throw new ShopifyCheckoutError("The cart is empty.");
  }

  const lineItems: { variantId: string; quantity: number }[] = [];

  for (const line of lines) {
    const shopifyProductId = SHOPIFY_PRODUCT_BY_LOCAL_ID[line.productId];
    if (!shopifyProductId) {
      throw new ShopifyCheckoutError(`No Shopify product mapped for ${line.productId}.`);
    }

    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    lineItems.push({ variantId: await firstVariantId(shopifyProductId), quantity });
  }

  const shopify = await getClient();
  const checkout = await shopify.checkout.create({ lineItems });

  if (!checkout?.webUrl) {
    throw new ShopifyCheckoutError("Shopify did not return a checkout URL.");
  }
  return checkout.webUrl;
}
