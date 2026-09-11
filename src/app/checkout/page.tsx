// Checkout: review the order, then hand it to Shopify.
//
// The delivery form that used to live here is gone. Shopify's checkout
// collects the address, the email and the card itself, so asking for the same
// details twice would mean typing everything again on the next page and would
// leave this site holding personal data it has no reason to keep.
//
// What stays is the part worth keeping: the order summary in Glow's styling,
// so the customer sees exactly what they are buying, for how much, before
// leaving.

"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, AlertCircle, ArrowRight } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { ProductImage } from "@/components/product-image";
import { AllergenNotice } from "@/components/allergen-notice";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/currency";
import { calculateShipping } from "@/lib/shipping";
import { track } from "@/lib/analytics";
import { checkoutUrl, shopifyConfigured } from "@/lib/shopify";
import { semantic } from "@/styles/tokens";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const shipping = calculateShipping(total);
  const [leaving, setLeaving] = useState(false);

  const lines = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
  const url = checkoutUrl(lines);
  // Configured but unmappable means a product in the cart has no Shopify
  // variant -- worth distinguishing from Shopify not being set up at all,
  // because the fix is different.
  const configured = shopifyConfigured();

  const onContinue = () => {
    if (!url) return;
    setLeaving(true);
    track({ name: "begin_checkout", value: total, items: items.length });
    window.location.assign(url);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />

      <main className="flex-1 px-6 md:px-8 pt-32 md:pt-40 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-[clamp(2rem,4vw,3rem)] mb-10" style={{ color: semantic.text.primary }}>
            Checkout
          </h1>

          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg mb-8" style={{ color: semantic.text.secondary }}>
                There is nothing to check out.
              </p>
              <Link
                href="/products"
                className="inline-block px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold"
                style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
              >
                Shop Glow Gummies
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-start">
              <div>
                <h2 className="text-xl mb-4" style={{ color: semantic.text.primary }}>
                  Secure checkout
                </h2>

                {url ? (
                  <>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: semantic.text.secondary }}>
                      Your order is ready. The next step opens our secure
                      checkout, where you will enter your delivery address and
                      payment details. Your card is handled entirely by Shopify
                      — it never touches this site.
                    </p>

                    <ol
                      className="text-sm leading-relaxed mb-8 space-y-2"
                      style={{ color: semantic.text.secondary }}
                    >
                      <li>1. Enter your delivery address</li>
                      <li>2. Pay by card</li>
                      <li>3. Get your confirmation email</li>
                    </ol>

                    <button
                      type="button"
                      onClick={onContinue}
                      disabled={leaving}
                      className="w-full flex items-center justify-center gap-2 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                      style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
                    >
                      {leaving ? (
                        "Opening secure checkout…"
                      ) : (
                        <>
                          Continue to payment — {formatPrice(total + (shipping.cost ?? 0))}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <p
                      className="flex items-center justify-center gap-1.5 text-xs mt-3"
                      style={{ color: semantic.text.muted }}
                    >
                      <Lock className="w-3 h-3" />
                      Card details are never handled by this site.
                    </p>
                  </>
                ) : (
                  <div
                    className="flex gap-3 p-5"
                    style={{
                      backgroundColor: semantic.surface.tint,
                      border: `1px solid ${semantic.border.default}`,
                    }}
                    role="status"
                  >
                    <AlertCircle
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: semantic.accent.secondary }}
                      aria-hidden="true"
                    />
                    <div className="text-sm leading-relaxed" style={{ color: semantic.text.secondary }}>
                      <strong style={{ color: semantic.text.primary }}>
                        Checkout is not available yet.
                      </strong>{" "}
                      {configured
                        ? "Something in your basket cannot be ordered online at the moment."
                        : "This store cannot take payment yet, so nothing has been charged and no order has been placed."}{" "}
                      Please try again shortly.
                    </div>
                  </div>
                )}
              </div>

              <aside
                className="p-7 lg:sticky lg:top-28"
                style={{
                  backgroundColor: semantic.surface.raised,
                  border: `1px solid ${semantic.border.subtle}`,
                }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                  style={{ color: semantic.text.primary }}
                >
                  Your order
                </h2>

                <ul className="mb-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 mb-4">
                      <div
                        className="w-16 h-16 shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: semantic.surface.sunken }}
                      >
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          width={140}
                          height={140}
                          className="h-12 w-auto object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug" style={{ color: semantic.text.primary }}>
                          {item.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: semantic.text.muted }}>
                          Qty {item.quantity}
                        </p>
                      </div>
                      <span
                        className="text-sm tabular-nums"
                        style={{ color: semantic.text.primary }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt style={{ color: semantic.text.secondary }}>Subtotal</dt>
                    <dd className="tabular-nums" style={{ color: semantic.text.primary }}>
                      {formatPrice(total)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt style={{ color: semantic.text.secondary }}>Shipping</dt>
                    <dd style={{ color: semantic.text.secondary }}>
                      {shipping.cost === null ? shipping.label : shipping.cost === 0 ? "Free" : formatPrice(shipping.cost)}
                    </dd>
                  </div>
                  <div
                    className="flex justify-between items-baseline pt-4"
                    style={{ borderTop: `1px solid ${semantic.border.default}` }}
                  >
                    <dt className="text-base font-medium" style={{ color: semantic.text.primary }}>
                      Total
                    </dt>
                    <dd
                      className="font-[family-name:var(--font-playfair)] text-2xl tabular-nums"
                      style={{ color: semantic.text.primary }}
                    >
                      {formatPrice(total + (shipping.cost ?? 0))}
                    </dd>
                  </div>
                </dl>

                {/* Final totals are Shopify's: it applies the tax and shipping
                    rules configured there, which this site does not know. */}
                <p className="text-xs mt-4" style={{ color: semantic.text.muted }}>
                  Taxes and any shipping are calculated at checkout.
                </p>

                <AllergenNotice className="mt-6" />
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
