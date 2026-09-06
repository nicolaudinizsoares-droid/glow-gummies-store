'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2, CheckCircle } from "lucide-react";
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { colors } from '@/styles/colors'
import Link from 'next/link'
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/currency";

export const CartSidebar = () => {
  const { items, total, itemCount, isOpen, closeCart, updateQuantity, removeFromCart } = useCart()
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastItemCount, setLastItemCount] = useState(itemCount);

  // Show success animation when items are added
  useEffect(() => {
    if (itemCount > lastItemCount && isOpen) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
    setLastItemCount(itemCount);
  }, [itemCount, lastItemCount, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closeCart}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <ShoppingBag
                    className="w-5 h-5"
                    style={{ color: colors.brand.goldenDawn }}
                  />
                  <h2 className="text-lg font-semibold">Shopping Cart</h2>
                  {itemCount > 0 && (
                    <span
                      className="text-white text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: colors.brand.goldenDawn }}
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCart}
                  className="h-8 w-8 p-0 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Item added to cart!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Add some products to get started
                    </p>
                    <Button
                      onClick={closeCart}
                      className="glass-morphism hover:glass-morphism-hover"
                      style={{ backgroundColor: colors.brand.goldenDawn }}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-morphism p-4 rounded-xl"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-gradient-to-br from-sage-green/20 to-soft-sand-beige/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="text-xs text-gray-400 text-center px-1">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-1">
                              {item.size && `Size: ${item.size}`}
                              {item.sku && ` • SKU: ${item.sku}`}
                            </p>
                            <div className="flex items-center justify-between">
                              <span
                                className="font-semibold text-sm"
                                style={{ color: colors.brand.goldenDawn }}
                              >
                                {formatPrice((item.price * item.quantity))}
                              </span>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 glass-morphism hover:glass-morphism-hover"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      Math.max(0, item.quantity - 1)
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium min-w-[2rem]">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 glass-morphism hover:glass-morphism-hover"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  disabled={item.quantity >= 99} // Amazon-style quantity limit
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 ml-1 text-red-500 hover:bg-red-50"
                                  onClick={() => removeFromCart(item.id)}
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-400 mt-1">
                                {formatPrice(item.price)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: colors.brand.goldenDawn }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Link href="/cart" onClick={closeCart}>
                      <Button
                        className="w-full glass-morphism hover:glass-morphism-hover"
                        style={{ backgroundColor: colors.brand.goldenDawn }}
                      >
                        View Cart
                      </Button>
                    </Link>
                    <Button className="w-full glass-morphism hover:glass-morphism-hover bg-sage-green text-white">
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
