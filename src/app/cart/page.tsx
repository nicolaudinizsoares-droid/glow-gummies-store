"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { ProductImage } from "@/components/product-image";
import { AllergenNotice } from "@/components/allergen-notice";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/currency";
import { calculateShipping } from "@/lib/shipping";
import { semantic } from "@/styles/tokens";

export default function CartPage() {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const shipping = calculateShipping(total);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />

      <main className="flex-1 px-6 md:px-8 pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <h1
            className="text-[clamp(2rem,4vw,3rem)] mb-10"
            style={{ color: semantic.text.primary }}
          >
            Your bag
          </h1>

          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg mb-8" style={{ color: semantic.text.secondary }}>
                There is nothing in your bag yet.
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
              <ul>
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex gap-5 sm:gap-7 pb-6 mb-6 overflow-hidden"
                      style={{ borderBottom: `1px solid ${semantic.border.subtle}` }}
                    >
                      <div
                        className="w-24 h-28 sm:w-28 sm:h-32 shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: semantic.surface.sunken }}
                      >
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          width={220}
                          height={220}
                          className="h-24 w-auto object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2
                              className="text-base font-medium leading-snug"
                              style={{ color: semantic.text.primary }}
                            >
                              {item.name}
                            </h2>
                            <p className="text-xs mt-1" style={{ color: semantic.text.muted }}>
                              {item.size} · {formatPrice(item.price)} each
                            </p>
                          </div>
                          <span
                            className="text-base font-medium tabular-nums shrink-0"
                            style={{ color: semantic.text.primary }}
                          >
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-5">
                          <div
                            className="flex items-center"
                            style={{ border: `1px solid ${semantic.border.default}` }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="px-3 py-2"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-9 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="px-3 py-2"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-60"
                            style={{ color: semantic.text.muted }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm mt-2"
                  style={{ color: semantic.text.primary }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue shopping
                </Link>
              </ul>

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
                  Summary
                </h2>

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
                      {shipping.cost === null
                        ? shipping.label
                        : shipping.cost === 0
                          ? "Free"
                          : formatPrice(shipping.cost)}
                    </dd>
                  </div>
                  <div
                    className="flex justify-between items-baseline pt-4 mt-1"
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

                <button
                  className="w-full mt-7 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
                >
                  Checkout
                </button>
                <p className="text-xs text-center mt-3" style={{ color: semantic.text.muted }}>
                  Shipping and taxes calculated at checkout.
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
