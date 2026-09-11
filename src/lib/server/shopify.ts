// Shopify Admin API, server side only.
//
// Two jobs: find out whether an order for a given Stripe payment already
// exists, and create one if it does not. Nothing here ever runs in a browser --
// the Admin token can read and write the whole store, and is the single most
// dangerous string in this project.
//
// Plain fetch rather than a client library: three calls do not justify a
// dependency, and the GraphQL here is short enough to read.

import "server-only";

const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-07";

export const shopifyConfigured = () =>
  Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN);

export class ShopifyError extends Error {}

async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !token) throw new ShopifyError("Shopify credentials are not set.");

  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ShopifyError(`Shopify HTTP ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) throw new ShopifyError("Shopify returned no data.");
  return json.data;
}

/**
 * Resolve the variant to order from the SKU the storefront already carries.
 *
 * Deliberately not a hardcoded id. Shopify product ids and variant ids look
 * identical -- both are long numbers -- and an order created against a product
 * id fails. SKU is the value that is visibly the same in products.json and in
 * the Shopify admin, so it is the one worth trusting.
 *
 * SHOPIFY_VARIANT_ID_<SKU> overrides the lookup when a SKU does not match.
 */
export async function resolveVariantId(sku: string): Promise<string> {
  const override = process.env[`SHOPIFY_VARIANT_ID_${sku.replace(/[^A-Z0-9]/gi, "_").toUpperCase()}`];
  if (override) {
    return override.startsWith("gid://") ? override : `gid://shopify/ProductVariant/${override}`;
  }

  const data = await graphql<{
    productVariants: { nodes: { id: string; sku: string }[] };
  }>(
    `query VariantBySku($q: String!) {
       productVariants(first: 2, query: $q) { nodes { id sku } }
     }`,
    { q: `sku:${sku}` },
  );

  const exact = data.productVariants.nodes.filter((n) => n.sku === sku);
  if (exact.length === 0) {
    throw new ShopifyError(
      `No Shopify variant has SKU "${sku}". Set SHOPIFY_VARIANT_ID_${sku.replace(/[^A-Z0-9]/gi, "_").toUpperCase()} to the variant id instead.`,
    );
  }
  if (exact.length > 1) {
    throw new ShopifyError(`More than one Shopify variant has SKU "${sku}".`);
  }
  return exact[0].id;
}

/**
 * Has this payment already produced an order?
 *
 * Stripe delivers a webhook at least once, and sometimes more than once. This
 * is the check that stops a customer being sent two bottles for one payment.
 */
export async function findOrderByTag(tag: string): Promise<string | null> {
  const data = await graphql<{ orders: { nodes: { id: string }[] } }>(
    `query OrderByTag($q: String!) {
       orders(first: 1, query: $q) { nodes { id } }
     }`,
    { q: `tag:'${tag}'` },
  );
  return data.orders.nodes[0]?.id ?? null;
}

export interface OrderLine {
  variantId: string;
  quantity: number;
  /** Decimal string, e.g. "35.00". What the customer actually paid. */
  unitPrice: string;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

/**
 * Create the order, already paid.
 *
 * The price on each line is the price Stripe actually charged, not whatever
 * Shopify has the product listed at -- if the two ever drift, the customer's
 * order must reflect what left their card.
 */
export async function createPaidOrder(input: {
  email: string;
  lines: OrderLine[];
  address: OrderAddress;
  currency: string;
  tag: string;
  paymentIntentId: string;
  totalPaid: string;
}): Promise<string> {
  const data = await graphql<{
    orderCreate: {
      order: { id: string; name: string } | null;
      userErrors: { field: string[] | null; message: string }[];
    };
  }>(
    `mutation CreateOrder($order: OrderCreateOrderInput!) {
       orderCreate(order: $order) {
         order { id name }
         userErrors { field message }
       }
     }`,
    {
      order: {
        email: input.email,
        currency: input.currency.toUpperCase(),
        tags: [input.tag],
        note: `Paid via Stripe. PaymentIntent ${input.paymentIntentId}.`,
        financialStatus: "PAID",
        shippingAddress: {
          firstName: input.address.firstName,
          lastName: input.address.lastName,
          address1: input.address.address1,
          address2: input.address.address2 || null,
          city: input.address.city,
          province: input.address.province,
          zip: input.address.zip,
          country: input.address.country,
        },
        lineItems: input.lines.map((l) => ({
          variantId: l.variantId,
          quantity: l.quantity,
          priceSet: {
            shopMoney: { amount: l.unitPrice, currencyCode: input.currency.toUpperCase() },
          },
        })),
        transactions: [
          {
            kind: "SALE",
            status: "SUCCESS",
            gateway: "stripe",
            amountSet: {
              shopMoney: { amount: input.totalPaid, currencyCode: input.currency.toUpperCase() },
            },
          },
        ],
      },
    },
  );

  const { order, userErrors } = data.orderCreate;
  if (userErrors.length) {
    throw new ShopifyError(userErrors.map((e) => e.message).join("; "));
  }
  if (!order) throw new ShopifyError("Shopify created no order.");
  return order.id;
}
