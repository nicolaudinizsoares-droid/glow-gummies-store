// Loading Shopify's Buy SDK, once.
//
// Shared by the /buy widget and by the cart's handoff to Shopify checkout.
// Both need the same script, and two components mounting together must wait on
// one script tag rather than racing to append two -- hence the promise at
// module scope.

"use client";

export interface ShopifyVariant {
  id: string;
}

export interface ShopifyProduct {
  variants: ShopifyVariant[];
}

export interface ShopifyCheckout {
  webUrl: string;
}

export interface BuyButtonUI {
  createComponent: (type: string, options: Record<string, unknown>) => Promise<unknown>;
}

export interface ShopifyClient {
  product: { fetch: (id: string) => Promise<ShopifyProduct> };
  checkout: {
    create: (input: {
      lineItems: { variantId: string; quantity: number }[];
    }) => Promise<ShopifyCheckout>;
  };
}

export interface ShopifySDK {
  buildClient: (config: { domain: string; storefrontAccessToken: string }) => ShopifyClient;
  UI?: { onReady: (client: ShopifyClient) => Promise<BuyButtonUI> };
}

declare global {
  interface Window {
    ShopifyBuy?: ShopifySDK;
  }
}

const SDK_URL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

let sdkPromise: Promise<ShopifySDK> | null = null;

export function loadShopifySdk(): Promise<ShopifySDK> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("The Shopify SDK is browser-only."));
  }
  if (window.ShopifyBuy?.UI) return Promise.resolve(window.ShopifyBuy);

  sdkPromise ??= new Promise<ShopifySDK>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    const script = existing ?? document.createElement("script");

    const settle = () => {
      if (window.ShopifyBuy) resolve(window.ShopifyBuy);
      else reject(new Error("The Shopify SDK loaded but did not register."));
    };

    script.addEventListener("load", settle);
    script.addEventListener("error", () =>
      reject(new Error("Could not load the Shopify SDK.")),
    );

    if (!existing) {
      script.async = true;
      script.src = SDK_URL;
      document.head.appendChild(script);
    } else if (window.ShopifyBuy) {
      // Already finished loading before this listener was attached.
      settle();
    }
  });

  return sdkPromise;
}
