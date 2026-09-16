// Shopify's Buy Button, wearing Glow's clothes.
//
// The snippet Shopify generates is a self-executing script that appends itself
// to <head> and writes into an element by id. Dropped into a React tree as-is
// it would run once per mount, never clean up after itself, and render in
// Shopify's default styling -- a rounded blue button and system type that
// belong to no part of this site.
//
// So: the SDK is loaded once per page and shared, the component is torn down
// when it unmounts, and every visible surface is restyled from the same design
// tokens the rest of the storefront uses. What Shopify supplies is the cart
// and the checkout; what it looks like is ours.

"use client";

import { useEffect, useRef, useState } from "react";

import { SHOPIFY_BUY, MONEY_FORMAT } from "@/lib/shopify-buy";
import { primitive, semantic } from "@/styles/tokens";

interface BuyButtonUI {
  createComponent: (type: string, options: Record<string, unknown>) => Promise<unknown>;
  destroyComponent?: (type: string, id: string) => void;
}

interface ShopifyBuySDK {
  buildClient: (config: { domain: string; storefrontAccessToken: string }) => unknown;
  UI?: { onReady: (client: unknown) => Promise<BuyButtonUI> };
}

declare global {
  interface Window {
    ShopifyBuy?: ShopifyBuySDK;
  }
}

const SDK_URL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

/**
 * One load per page, shared by every instance. Held at module scope rather
 * than in state because two components mounting together must wait on the same
 * script tag, not race to append two.
 */
let sdkPromise: Promise<ShopifyBuySDK> | null = null;

function loadSdk(): Promise<ShopifyBuySDK> {
  if (window.ShopifyBuy?.UI) return Promise.resolve(window.ShopifyBuy);

  sdkPromise ??= new Promise<ShopifyBuySDK>((resolve, reject) => {
    // An existing tag means another instance is already loading it; wait on
    // that one rather than adding a second.
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    const script = existing ?? document.createElement("script");

    const done = () => {
      if (window.ShopifyBuy) resolve(window.ShopifyBuy);
      else reject(new Error("Shopify SDK loaded but did not register."));
    };

    script.addEventListener("load", done);
    script.addEventListener("error", () => reject(new Error("Could not load the Shopify SDK.")));

    if (!existing) {
      script.async = true;
      script.src = SDK_URL;
      document.head.appendChild(script);
    }
  });

  return sdkPromise;
}

/* Glow's type and colour, expressed in the shape Shopify's styling API wants. */
const FONT_STACK = "Inter, system-ui, -apple-system, sans-serif";

const buttonStyle = {
  "background-color": primitive.navy[800],
  "color": primitive.neutral[0],
  "border-radius": "0",
  "font-family": FONT_STACK,
  "font-size": "12px",
  "font-weight": "600",
  "letter-spacing": "0.18em",
  "text-transform": "uppercase",
  "padding": "16px 40px",
  ":hover": { "background-color": primitive.navy[700] },
  ":focus": { "background-color": primitive.navy[700] },
};

const options = {
  product: {
    styles: {
      product: {
        "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" },
        "text-align": "left",
      },
      title: {
        "font-family": "'Playfair Display', Georgia, serif",
        "font-size": "22px",
        "font-weight": "400",
        "color": primitive.navy[800],
      },
      price: {
        "font-family": FONT_STACK,
        "font-size": "18px",
        "color": primitive.navy[800],
      },
      compareAt: { "font-family": FONT_STACK, "color": primitive.neutral[500] },
      button: buttonStyle,
      quantityInput: {
        "font-family": FONT_STACK,
        "font-size": "14px",
        "color": primitive.navy[800],
      },
    },
    // Shopify's iframe cannot see the page's webfonts, so the faces it needs
    // are named here. Playfair carries the product title, Inter everything
    // else -- the same pairing the rest of the storefront uses.
    googleFonts: ["Inter:400,600", "Playfair Display:400"],
    text: { button: "Add to cart" },
  },
  productSet: {
    styles: { products: { "@media (min-width: 601px)": { "margin-left": "0" } } },
  },
  modalProduct: {
    contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
    styles: {
      product: {
        "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0px", "margin-bottom": "0px" },
      },
      button: buttonStyle,
      title: { "font-family": "'Playfair Display', Georgia, serif", "color": primitive.navy[800] },
      price: { "font-family": FONT_STACK, "color": primitive.navy[800] },
    },
    googleFonts: ["Inter:400,600", "Playfair Display:400"],
    text: { button: "Add to cart" },
  },
  cart: {
    styles: {
      button: buttonStyle,
      title: { "font-family": FONT_STACK, "color": primitive.navy[800] },
      subtotal: { "font-family": FONT_STACK, "color": primitive.navy[800] },
      cart: { "background-color": primitive.cream[50] },
      footer: { "background-color": primitive.cream[50] },
    },
    googleFonts: ["Inter:400,600"],
    text: { total: "Subtotal", button: "Checkout" },
  },
  toggle: {
    styles: {
      toggle: {
        "background-color": primitive.navy[800],
        ":hover": { "background-color": primitive.navy[700] },
        ":focus": { "background-color": primitive.navy[700] },
      },
      count: { "font-family": FONT_STACK, "font-weight": "600" },
    },
    googleFonts: ["Inter:400,600"],
  },
  option: {},
};

export const ShopifyBuyButton = ({ className }: { className?: string }) => {
  const node = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // React mounts effects twice in development. Without this the SDK renders
    // two buttons into the same node.
    if (started.current || !node.current) return;
    started.current = true;

    // Captured now: by the time cleanup runs the ref may already point
    // elsewhere, and the element to empty is the one this effect filled.
    const target = node.current;
    let cancelled = false;

    loadSdk()
      .then((sdk) => {
        if (cancelled || !sdk.UI) return;
        const client = sdk.buildClient({
          domain: SHOPIFY_BUY.domain,
          storefrontAccessToken: SHOPIFY_BUY.storefrontAccessToken,
        });
        return sdk.UI.onReady(client).then((ui) => {
          if (cancelled) return;
          return ui.createComponent("product", {
            id: SHOPIFY_BUY.productId,
            node: target,
            moneyFormat: MONEY_FORMAT,
            options,
          });
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      // Leave the node empty rather than holding a half-built widget if this
      // unmounts mid-load.
      target.innerHTML = "";
      started.current = false;
    };
  }, []);

  if (failed) {
    return (
      <p className={className} style={{ color: semantic.text.secondary, fontSize: 14 }}>
        The shop could not be loaded right now. Please try again shortly.
      </p>
    );
  }

  // min-height reserves the space the widget will occupy, so the rest of the
  // page does not jump when it finishes loading.
  return <div ref={node} className={className} style={{ minHeight: 220 }} />;
};
