// What Shopify actually says about our products. Temporary: delete once
// checkout works.
//
// Every question that has stalled this integration -- which product the code
// resolves, whether Shopify considers it sellable, whether a second copy of it
// exists -- is answerable from the Storefront API in one request, and is
// invisible from the Shopify admin. This asks, and prints the answers in
// plain words.
//
// Read-only. It cannot change anything in Shopify, and the token it uses is
// the public storefront one already present in every page of the site.

"use client";

import { useEffect, useState } from "react";

import { loadShopifySdk, type ShopifyProduct } from "@/lib/shopify-sdk";
import { SHOPIFY_BUY, SHOPIFY_PRODUCT_BY_LOCAL_ID, SKU_BY_LOCAL_ID } from "@/lib/shopify-buy";

interface Row {
  title: string;
  productId: string;
  variantId: string;
  sku: string;
  available: boolean;
}

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; rows: Row[]; configuredResolved: boolean };

const digits = (raw: string) => {
  let id = raw;
  if (!id.startsWith("gid://") && /^[A-Za-z0-9+/=]+$/.test(id)) {
    try {
      const decoded = window.atob(id);
      if (decoded.startsWith("gid://")) id = decoded;
    } catch {
      /* not base64 */
    }
  }
  return id.match(/(\d+)\s*$/)?.[1] ?? raw;
};

export default function ShopifyCheckPage() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    (async () => {
      try {
        const sdk = await loadShopifySdk();
        const client = sdk.buildClient({
          domain: SHOPIFY_BUY.domain,
          storefrontAccessToken: SHOPIFY_BUY.storefrontAccessToken,
        });

        // Does the id the code is configured with still resolve?
        let configuredResolved = false;
        const gid = `gid://shopify/Product/${SHOPIFY_BUY.productId}`;
        for (const candidate of [gid, window.btoa(gid), SHOPIFY_BUY.productId]) {
          try {
            const p = await client.product.fetch(candidate);
            if (p?.variants?.length) {
              configuredResolved = true;
              break;
            }
          } catch {
            /* try the next spelling */
          }
        }

        // Everything the storefront token can see, so a duplicate is obvious.
        const products: ShopifyProduct[] = await client.product.fetchAll(50);
        const rows: Row[] = [];
        for (const p of products) {
          for (const v of p.variants ?? []) {
            rows.push({
              title: p.title ?? "(untitled)",
              productId: p.id ? digits(p.id) : "?",
              variantId: v.id ? digits(v.id) : "?",
              sku: v.sku || "(no SKU)",
              available: v.available !== false,
            });
          }
        }
        setState({ kind: "ready", rows, configuredResolved });
      } catch (err) {
        setState({ kind: "error", message: (err as Error).message });
      }
    })();
  }, []);

  const expectedSku = SKU_BY_LOCAL_ID["GLW-HSN-001"];
  const configuredId = SHOPIFY_PRODUCT_BY_LOCAL_ID["GLW-HSN-001"];

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px", fontSize: 15, lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Shopify check</h1>
      <p style={{ color: "#666", marginBottom: 28 }}>
        Temporary page. Delete once checkout works.
      </p>

      <p style={{ marginBottom: 20 }}>
        The site is configured to sell Shopify product <code>{configuredId}</code>,
        or failing that whatever carries SKU <code>{expectedSku}</code>.
      </p>

      {state.kind === "loading" && <p style={{ color: "#666" }}>Asking Shopify…</p>}

      {state.kind === "error" && (
        <p style={{ color: "#c5221f" }}>
          <strong>Could not reach Shopify:</strong> {state.message}
        </p>
      )}

      {state.kind === "ready" && (
        <>
          <p style={{ marginBottom: 20 }}>
            <strong style={{ color: state.configuredResolved ? "#137333" : "#c5221f" }}>
              {state.configuredResolved ? "PASS" : "FAIL"}
            </strong>{" "}
            {state.configuredResolved
              ? "the configured product id still exists."
              : "the configured product id no longer exists — the SKU fallback is carrying checkout."}
          </p>

          <h2 style={{ fontSize: 17, margin: "24px 0 10px" }}>
            Everything Shopify will show this site ({state.rows.length})
          </h2>

          {state.rows.length === 0 && (
            <p style={{ color: "#c5221f" }}>
              Shopify returned no products at all. Nothing is published to the Buy
              Button sales channel, which is why checkout says sold out.
            </p>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "8px 10px 8px 0" }}>Product</th>
                  <th style={{ padding: "8px 10px" }}>SKU</th>
                  <th style={{ padding: "8px 10px" }}>Variant</th>
                  <th style={{ padding: "8px 10px" }}>Sellable?</th>
                </tr>
              </thead>
              <tbody>
                {state.rows.map((r) => (
                  <tr key={r.variantId} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px 10px 8px 0" }}>
                      {r.title}
                      <div style={{ color: "#888", fontSize: 12 }}>id {r.productId}</div>
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <code>{r.sku}</code>
                      {r.sku === expectedSku && (
                        <div style={{ color: "#137333", fontSize: 12 }}>← the one we sell</div>
                      )}
                    </td>
                    <td style={{ padding: "8px 10px" }}><code>{r.variantId}</code></td>
                    <td style={{ padding: "8px 10px", color: r.available ? "#137333" : "#c5221f", fontWeight: 600 }}>
                      {r.available ? "YES" : "NO"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 24, borderTop: "1px solid #ddd", paddingTop: 16, color: "#666" }}>
            A row saying <strong>NO</strong> is Shopify refusing to sell that variant —
            the same refusal the checkout reports as out of stock. Two rows with the
            same SKU means a duplicate product, and the site may be using the wrong one.
          </p>
        </>
      )}
    </main>
  );
}
