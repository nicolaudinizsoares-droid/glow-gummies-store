// Slide-over cart.

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";

import { ProductImage } from "@/components/product-image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/currency";
import { calculateShipping } from "@/lib/shipping";
import { semantic } from "@/styles/tokens";

export const CartSidebar = () => {
  const { items, total, isOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const shipping = calculateShipping(total);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(10, 29, 54, 0.35)" }}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[400px] flex flex-col"
            style={{ backgroundColor: semantic.surface.page }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <header
              className="flex items-center justify-between px-6 h-16 shrink-0"
              style={{ borderBottom: `1px solid ${semantic.border.subtle}` }}
            >
              <h2
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em]"
                style={{ color: semantic.text.primary }}
              >
                Your bag {items.length > 0 && `(${items.length})`}
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 -mr-2 rounded-full transition-colors hover:bg-black/5"
              >
                <X className="w-4 h-4" style={{ color: semantic.text.primary }} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <p className="text-base mb-6" style={{ color: semantic.text.secondary }}>
                  Your bag is empty.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="px-8 py-3.5 text-[0.75rem] tracking-[0.18em] uppercase font-semibold"
                  style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
                >
                  Shop Glow
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.22 }}
                        className="flex gap-4 pb-5 mb-5 overflow-hidden"
                        style={{ borderBottom: `1px solid ${semantic.border.subtle}` }}
                      >
                        <div
                          className="w-20 h-20 shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: semantic.surface.sunken }}
                        >
                          <ProductImage
                            src={item.image}
                            alt={item.name}
                            width={160}
                            height={160}
                            className="h-16 w-auto object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium leading-snug mb-0.5"
                            style={{ color: semantic.text.primary }}
                          >
                            {item.name}
                          </p>
                          <p className="text-xs mb-3" style={{ color: semantic.text.muted }}>
                            {item.size}
                          </p>

                          <div className="flex items-center justify-between gap-2">
                            <div
                              className="flex items-center"
                              style={{ border: `1px solid ${semantic.border.default}` }}
                            >
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label={`Decrease quantity of ${item.name}`}
                                className="px-2 py-1.5"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label={`Increase quantity of ${item.name}`}
                                className="px-2 py-1.5"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className="text-sm font-medium tabular-nums"
                                style={{ color: semantic.text.primary }}
                              >
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                aria-label={`Remove ${item.name}`}
                                className="p-1 transition-opacity hover:opacity-60"
                              >
                                <Trash2 className="w-3.5 h-3.5" style={{ color: semantic.text.muted }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer
                  className="px-6 py-5 shrink-0"
                  style={{ borderTop: `1px solid ${semantic.border.subtle}` }}
                >
                  <dl className="space-y-2 mb-5 text-sm">
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
                      className="flex justify-between pt-3 text-base"
                      style={{ borderTop: `1px solid ${semantic.border.subtle}` }}
                    >
                      <dt className="font-medium" style={{ color: semantic.text.primary }}>
                        Total
                      </dt>
                      <dd
                        className="font-[family-name:var(--font-playfair)] text-xl tabular-nums"
                        style={{ color: semantic.text.primary }}
                      >
                        {formatPrice(total + (shipping.cost ?? 0))}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="block w-full py-4 text-center text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
                  >
                    View bag
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
