"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Layout Components
import { Navigation, Footer } from "@/components/website-layouts";

// Icons
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Plus,
  Minus,
  Share2,
} from "lucide-react";

// Utils and Hooks
import { colors } from "@/styles/colors";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/currency";
import {
  getProductBySlug,
  getDefaultVariant,
  getVariantBySize,
  getProductPrice,
  getAvailableSizes,
  isProductInStock,
  type Product,
  type ProductVariant,
} from "@/lib/products";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  const { addToCart } = useCart();
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Initialize selected variant with default variant
  const defaultVariant = getDefaultVariant(product);

  useEffect(() => {
    if (!selectedVariant && defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [selectedVariant, defaultVariant]);

  // Computed values
  const currentVariant = selectedVariant || defaultVariant;
  const availableSizes = getAvailableSizes(product);
  const currentPrice = getProductPrice(product, currentVariant?.sku);
  const inStock = isProductInStock(product, currentVariant?.sku);

  // Handlers
  const handleVariantChange = (size: string) => {
    const variant = getVariantBySize(product, size);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    if (!currentVariant || !inStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice.selling_price,
      category: product.category.primary,
      size: currentVariant.size,
      sku: currentVariant.sku,
      image: product.images?.primary,
      quantity: quantity,
    });
    setQuantity(1);
  };

  // Product colors
  const getCategoryKey = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      Cleanser: "cleanser",
      Serum: "serum", 
      Moisturizer: "moisturizer",
      Sunscreen: "sunscreen",
    };
    return categoryMap[category] || "cleanser";
  };

  const categoryKey = getCategoryKey(product.category.primary);
  const productColors = colors.products[categoryKey as keyof typeof colors.products] || colors.products.cleanser;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.surfaces.secondary }}
    >
      <Navigation />

      {/* Hero Section with Video Background */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.7)" }}
          onError={(e) => {
            // Hide video if it fails to load and show gradient background
            const target = e.target as HTMLVideoElement;
            target.style.display = "none";
          }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Fallback gradient background */}

        {/* Overlay for better text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${productColors.primary}40, transparent 70%)`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold mb-6 text-white"
              >
                Transform Your Skin
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed"
              >
                Discover premium skincare solutions trusted by thousands. Clean
                ingredients, proven results.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="text-white font-semibold px-8 py-4 rounded-2xl border-0 transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: productColors.primary,
                    boxShadow: colors.elevation.card,
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Breadcrumb - Apple Style */}
      <section
        className="py-4 px-4 border-b"
        style={{
          backgroundColor: colors.brand.mistWhite,
          borderColor: colors.surfaces.border,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity"
              style={{ color: colors.interactive.linkDefault }}
            >
              Home
            </Link>
            <span style={{ color: colors.text.secondary }}>/</span>
            <Link
              href="/products"
              className="hover:opacity-80 transition-opacity"
              style={{ color: colors.interactive.linkDefault }}
            >
              Products
            </Link>
            <span style={{ color: colors.text.secondary }}>/</span>
            <span style={{ color: colors.text.primary }}>
              {product.name}
            </span>
          </div>
        </div>
      </section>

      {/* Product Detail - Enhanced with Apple Colors */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images - Apple-style clean backgrounds */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: colors.brand.mistWhite,
                  boxShadow: colors.elevation.card,
                }}
              >
                <div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                  style={{ backgroundColor: productColors.primary }}
                >
                  {product.name.charAt(0)}
                </div>
              </motion.div>

              <div className="grid grid-cols-4 gap-2">
                {[product.images.primary, ...product.images.gallery].map(
                  (image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-white rounded-lg shadow-sm overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-gray-900"
                          : "border-transparent"
                      }`}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                        style={{ backgroundColor: productColors.lighter }}
                      >
                        {index + 1}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Hero Section - Simplified for Mobile */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Badge
                  className="mb-4 font-semibold px-4 py-2 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${productColors.primary}, ${productColors.lighter})`,
                    color: "white",
                    border: "none",
                  }}
                >
                  {product.category.primary}
                </Badge>

                <h1
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  {product.name}
                </h1>

                {/* Single Most Compelling Benefit - Apple-style bright card */}
                <div
                  className="p-6 rounded-2xl mb-4 border-0"
                  style={{
                    background: `linear-gradient(135deg, ${productColors.primary}15, ${productColors.lighter}10)`,
                    boxShadow: colors.elevation.card,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: productColors.primary }}
                    >
                      <span className="text-white text-lg">✨</span>
                    </div>
                    <span
                      className="font-bold text-lg"
                      style={{ color: productColors.primary }}
                    >
                      Why 1000+ customers love this
                    </span>
                  </div>
                  <p
                    className="font-medium text-lg leading-relaxed"
                    style={{ color: colors.text.primary }}
                  >
                    {product.category.tags[0]?.replace("-", " ")} • Visible
                    results in 7 days • No sticky feeling
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.reviews.average_rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">
                    {product.reviews.average_rating}
                  </span>
                  <span className="text-gray-600">
                    ({product.reviews.total_reviews} verified reviews)
                  </span>
                </div>

                {/* Mobile-First Quick Decision */}
                <div className="md:hidden bg-orange-50 p-3 rounded-lg mb-4 border border-orange-200">
                  <div className="flex items-center gap-2">
                    <div className="text-sm">⚡</div>
                    <span className="text-sm font-medium text-orange-900">
                      Quick buy: Most customers start with the 50ml size
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Price & Variants Section - Simplified Decision */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="border border-gray-200 bg-gray-50 p-6 rounded-xl"
              >
                {/* Pricing Display with Trust Signal */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span
                      className="text-3xl md:text-4xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {formatPrice(currentPrice.selling_price)}
                    </span>
                    {currentPrice.discount_percentage > 0 && (
                      <>
                        <span
                          className="text-xl md:text-2xl line-through opacity-60"
                          style={{ color: colors.text.secondary }}
                        >
                          {formatPrice(currentPrice.mrp)}
                        </span>
                        <Badge
                          className="text-white font-semibold px-3 py-2 rounded-full border-0"
                          style={{ backgroundColor: colors.semantic.success }}
                        >
                          {currentPrice.discount_percentage}% OFF
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Trust Badge - Apple-style clean design */}
                  <div
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{
                      backgroundColor: `${colors.semantic.success}15`,
                      border: `1px solid ${colors.semantic.success}30`,
                    }}
                  >
                    <Shield
                      className="h-4 w-4"
                      style={{ color: colors.semantic.success }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.semantic.success }}
                    >
                      Quality Tested
                    </span>
                  </div>
                </div>

                {/* Mobile Trust Signal */}
                <div
                  className="md:hidden flex items-center gap-2 mb-4 px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: `${colors.semantic.success}15`,
                    border: `1px solid ${colors.semantic.success}30`,
                  }}
                >
                  <Shield
                    className="h-4 w-4"
                    style={{ color: colors.semantic.success }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.semantic.success }}
                  >
                    ✓ Quality Tested • 30-Day Money Back
                  </span>
                </div>

                {/* Smart Default Suggestion - Apple-style vibrant card */}
                <div
                  className="mb-6 p-5 rounded-2xl border-0"
                  style={{
                    background: `linear-gradient(135deg, ${colors.semantic.info}10, ${colors.brand.blush}10)`,
                    boxShadow: colors.elevation.card,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.semantic.info }}
                    >
                      <span className="text-white text-lg">🎯</span>
                    </div>
                    <div>
                      <h3
                        className="font-bold text-lg mb-2"
                        style={{ color: colors.semantic.info }}
                      >
                        Recommended for first-time buyers
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: colors.text.primary }}
                      >
                        Start with our most popular size (50ml) - perfect for
                        6-8 weeks of daily use.
                        <span
                          className="font-semibold"
                          style={{ color: colors.semantic.info }}
                        >
                          {" "}
                          97% of customers who try this size come back for more.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simplified Size Selection with Smart Defaults */}
                {availableSizes.length > 1 && (
                  <div className="mb-6">
                    <label
                      className="block text-lg font-semibold mb-3"
                      style={{ color: colors.text.primary }}
                    >
                      Choose Size
                    </label>
                    <div className="space-y-3">
                      {availableSizes.map((size) => {
                        const variant = getVariantBySize(product, size);
                        const priceForSize = variant
                          ? getProductPrice(product, variant.sku)
                          : currentPrice;
                        const isSelected = currentVariant?.size === size;

                        return (
                          <div
                            key={size}
                            className={`rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]`}
                            style={{
                              border: `2px solid ${
                                isSelected
                                  ? productColors.primary
                                  : colors.text.secondary
                              }`,
                              backgroundColor: isSelected
                                ? `${productColors.primary}08`
                                : colors.brand.mistWhite,
                              boxShadow: isSelected
                                ? colors.elevation.card
                                : colors.elevation.card,
                            }}
                            onClick={() => handleVariantChange(size)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full transition-all duration-200`}
                                  style={{
                                    border: `3px solid ${
                                      isSelected
                                        ? productColors.primary
                                        : colors.text.secondary
                                    }`,
                                    backgroundColor: isSelected
                                      ? productColors.primary
                                      : "transparent",
                                  }}
                                />
                                <div>
                                  <span
                                    className="font-semibold text-lg"
                                    style={{
                                      color: colors.text.primary,
                                    }}
                                  >
                                    {size}
                                  </span>
                                  {size === "50ml" && (
                                    <Badge
                                      className="ml-2 text-xs px-2 py-1 rounded-full border-0 text-white font-medium"
                                      style={{
                                        backgroundColor:
                                          colors.semantic.warning,
                                      }}
                                    >
                                      Most Popular
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className="font-bold text-lg"
                                  style={{ color: colors.text.primary }}
                                >
                                  {formatPrice(priceForSize.selling_price)}
                                </div>
                                {size === "50ml" && (
                                  <div
                                    className="text-xs"
                                    style={{ color: colors.text.secondary }}
                                  >
                                    6-8 weeks supply
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Single Size Display */}
                {availableSizes.length === 1 && (
                  <div className="mb-6">
                    <label
                      className="block text-lg font-semibold mb-3"
                      style={{ color: colors.text.primary }}
                    >
                      Size
                    </label>
                    <Badge variant="outline" className="px-4 py-2 text-base">
                      {currentVariant?.size || product.size}
                    </Badge>
                  </div>
                )}

                {/* Simplified Stock Status with Urgency - Apple style */}
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${inStock ? "" : ""}`}
                      style={{
                        backgroundColor: inStock
                          ? colors.semantic.success
                          : colors.semantic.error,
                      }}
                    />
                    <span
                      className={`text-base font-medium`}
                      style={{
                        color: inStock
                          ? colors.semantic.success
                          : colors.semantic.error,
                      }}
                    >
                      {inStock ? "✓ In Stock - Ships Today" : "Out of Stock"}
                    </span>
                  </div>
                  {currentVariant &&
                    currentVariant.inventory.stock_quantity <=
                      currentVariant.inventory.low_stock_threshold && (
                      <div
                        className="flex items-center gap-2 mt-2 p-3 rounded-xl"
                        style={{
                          backgroundColor: `${colors.semantic.warning}15`,
                          border: `1px solid ${colors.semantic.warning}30`,
                        }}
                      >
                        <span className="text-sm">⚡</span>
                        <p
                          className="text-sm font-medium"
                          style={{ color: colors.semantic.warning }}
                        >
                          Only {currentVariant.inventory.stock_quantity} left!
                          <span
                            className="ml-1"
                            style={{ color: colors.text.primary }}
                          >
                            67 people viewed this in the last 24 hours
                          </span>
                        </p>
                      </div>
                    )}
                </div>

                {/* Apple-style Action Buttons */}
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full text-white font-semibold text-lg py-4 rounded-2xl border-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: inStock
                        ? productColors.primary
                        : colors.text.secondary,
                      opacity: inStock ? 1 : 0.6,
                      boxShadow: inStock ? colors.elevation.card : "none",
                    }}
                    onClick={handleAddToCart}
                    disabled={!inStock || !currentVariant}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {inStock
                      ? `Add to Cart - ${formatPrice(currentPrice.selling_price)}`
                      : "Out of Stock"}
                  </Button>

                  {/* Secondary Actions with Apple styling */}
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className="flex-1 rounded-2xl border-2 bg-transparent hover:bg-transparent transition-all duration-200"
                      style={{
                        borderColor: productColors.primary,
                        color: productColors.primary,
                      }}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Save for Later
                    </Button>
                    <Button
                      size="lg"
                      className="px-6 rounded-2xl border-2 bg-transparent hover:bg-transparent transition-all duration-200"
                      style={{
                        borderColor: colors.semantic.warning,
                        color: colors.semantic.warning,
                      }}
                      onClick={() =>
                        setQuantity(quantity > 1 ? quantity - 1 : 2)
                      }
                    >
                      {quantity > 1 ? `Qty: ${quantity}` : "Buy 2+"}
                    </Button>
                  </div>
                </div>

                {/* Single Size Display */}
                {availableSizes.length === 1 && (
                  <div className="mb-6">
                    <label
                      className="block text-lg font-semibold mb-3"
                      style={{ color: colors.text.primary }}
                    >
                      Size
                    </label>
                    <Badge variant="outline" className="px-4 py-2 text-base">
                      {currentVariant?.size || product.size}
                    </Badge>
                  </div>
                )}

                {/* Stock Status */}
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        inStock ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-base font-medium ${
                        inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {inStock ? "In Stock" : "Out of Stock"}
                    </span>
                    {currentVariant && (
                      <span className="text-sm text-gray-500">
                        ({currentVariant.inventory.stock_quantity} available)
                      </span>
                    )}
                  </div>
                  {currentVariant &&
                    currentVariant.inventory.stock_quantity <=
                      currentVariant.inventory.low_stock_threshold && (
                      <p className="text-sm text-orange-600 mt-1 font-medium">
                        ⚡ Only {currentVariant.inventory.stock_quantity} left
                        in stock!
                      </p>
                    )}
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <label
                    className="block text-lg font-semibold mb-3"
                    style={{ color: colors.text.primary }}
                  >
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !inStock}
                      className="w-10 h-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 border border-gray-200 rounded-md min-w-[60px] text-center text-lg font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setQuantity(
                          Math.min(
                            quantity + 1,
                            currentVariant?.inventory.stock_quantity || 1
                          )
                        )
                      }
                      disabled={
                        !inStock ||
                        (currentVariant
                          ? quantity >= currentVariant.inventory.stock_quantity
                          : false)
                      }
                      className="w-10 h-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-4">
                  <Button variant="outline" size="lg" className="flex-1">
                    <Heart className="mr-2 h-5 w-5" />
                    Save for Later
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </motion.div>

              {/* Personalization CTA - Addresses "Overwhelm" */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🤔</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-purple-900">
                      Not sure if this is right for your skin?
                    </h3>
                    <p className="text-purple-800 mb-4 text-sm">
                      Take our 2-minute skin quiz to get personalized product
                      recommendations from our dermatologists.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="flex-1 sm:flex-none"
                        style={{ backgroundColor: productColors.primary }}
                      >
                        🧬 Take Skin Quiz (2 min)
                      </Button>
                      <Button variant="outline" className="flex-1 sm:flex-none">
                        💬 Chat with Expert
                      </Button>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">
                      💡 87% of quiz-takers find their perfect match on first
                      try
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Clinical Claims & Trust Badges */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl border"
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  Clinically Proven Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">98%</div>
                    <div className="text-sm text-green-600">
                      Visible improvement in 7 days
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">100%</div>
                    <div className="text-sm text-blue-600">
                      Natural ingredients
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck
                      className="h-4 w-4"
                      style={{ color: productColors.primary }}
                    />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw
                      className="h-4 w-4"
                      style={{ color: productColors.primary }}
                    />
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield
                      className="h-4 w-4"
                      style={{ color: productColors.primary }}
                    />
                    <span>Quality Tested</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star
                      className="h-4 w-4"
                      style={{ color: productColors.primary }}
                    />
                    <span>Customer Loved</span>
                  </div>
                </div>
              </motion.div>

              {/* Routine Integration */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border"
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  Perfect for Your Routine
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center">
                      <div className="text-xl">🌅</div>
                    </div>
                    <div className="font-medium">Morning</div>
                    <div className="text-sm text-gray-600">After cleansing</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="text-xl">☀️</div>
                    </div>
                    <div className="font-medium">Day Care</div>
                    <div className="text-sm text-gray-600">
                      UV protection ready
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                      <div className="text-xl">🌙</div>
                    </div>
                    <div className="font-medium">Night</div>
                    <div className="text-sm text-gray-600">Deep repair</div>
                  </div>
                </div>
              </motion.div>

              {/* Key Ingredients Highlight */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-xl border"
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  Star Ingredients
                </h3>
                <div className="space-y-4">
                  {product.ingredients.hero_ingredients
                    .slice(0, 3)
                    .map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: productColors.primary }}
                        >
                          {ingredient.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{ingredient.name}</h4>
                            {ingredient.percentage && (
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{
                                  color: productColors.primary,
                                  borderColor: productColors.primary,
                                }}
                              >
                                {ingredient.percentage}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {ingredient.benefit}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* Before/After Results - Visual Social Proof */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-200"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2 text-green-900">
                    Real Results from Real Customers
                  </h3>
                  <p className="text-green-800 text-sm">
                    See the transformation after 4 weeks of consistent use
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    {
                      name: "Priya, 24",
                      concern: "Acne scars",
                      result: "Smoother texture",
                    },
                    {
                      name: "Ravi, 31",
                      concern: "Dark spots",
                      result: "Even skin tone",
                    },
                    {
                      name: "Anjali, 28",
                      concern: "Dullness",
                      result: "Natural glow",
                    },
                  ].map((customer, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="text-center mb-3">
                        <div
                          className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white text-xl font-bold"
                          style={{ backgroundColor: productColors.primary }}
                        >
                          {customer.name.charAt(0)}
                        </div>
                        <h4 className="font-semibold text-sm">
                          {customer.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Verified Customer
                        </p>
                      </div>

                      <div className="space-y-2 text-center">
                        <div className="bg-red-50 p-2 rounded text-xs">
                          <span className="text-red-700">
                            Before: {customer.concern}
                          </span>
                        </div>
                        <div className="text-lg">⬇️</div>
                        <div className="bg-green-50 p-2 rounded text-xs">
                          <span className="text-green-700">
                            After: {customer.result}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-700 border-green-300"
                  >
                    📸 See More Before/After Photos
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* WhatsApp Consultation - Builds Trust */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-xl text-white"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">👩‍⚕️</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">
                  Free Dermatologist Consultation
                </h2>
                <p className="mb-4 opacity-90">
                  Not sure about your skin type? Chat with our certified
                  dermatologists on WhatsApp. Get personalized advice in under
                  10 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                    💬 Chat on WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-green-600"
                  >
                    📅 Book Video Call (Free)
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-sm opacity-90">Expert Rating</div>
                <div className="text-xs opacity-75">1000+ consultations</div>
              </div>
            </div>
          </motion.div>

          {/* Smart Routine Recommendations - Enhanced Cross-selling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200"
          >
            <div className="text-center mb-8">
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: colors.text.primary }}
              >
                🧬 Your Personalized Routine
              </h2>
              <p className="text-gray-700 mb-4">
                Based on customers with similar skin profiles, here's what
                dermatologists recommend:
              </p>
              <div className="bg-yellow-100 inline-block px-4 py-2 rounded-lg">
                <span className="text-yellow-800 text-sm font-medium">
                  💡 Save {formatPrice(200)} when you buy all 3 steps together
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  name: "Gentle Cleanser",
                  price: 599,
                  originalPrice: 699,
                  category: "cleanser",
                  step: "Step 1",
                  time: "Morning & Night",
                  benefit: "Removes pollution & makeup",
                  match: "95%",
                  emoji: "🧼",
                },
                {
                  name: "This Product",
                  price: currentPrice.selling_price,
                  category: product.category.primary,
                  step: "Step 2",
                  time: "After cleansing",
                  benefit:
                    product.category.tags[0]?.replace("-", " ") ||
                    "Active treatment",
                  match: "100%",
                  emoji: "✨",
                  current: true,
                },
                {
                  name: "Moisturizing Cream",
                  price: 749,
                  originalPrice: 849,
                  category: "moisturizer",
                  step: "Step 3",
                  time: "Always last",
                  benefit: "Locks in hydration",
                  match: "92%",
                  emoji: "💧",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className={`text-center transition-all duration-300 ${
                    item.current
                      ? "ring-2 ring-green-500 bg-green-50"
                      : "hover:shadow-lg cursor-pointer hover:scale-105"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="relative">
                      {item.current && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓ In Cart
                        </div>
                      )}

                      <div className="text-4xl mb-3">{item.emoji}</div>

                      <Badge
                        className="mb-3"
                        style={{
                          backgroundColor: item.current
                            ? "#10B981"
                            : `${productColors.primary}15`,
                          color: item.current ? "white" : productColors.primary,
                        }}
                      >
                        {item.step}
                      </Badge>

                      <h3 className="font-semibold mb-2 text-lg">
                        {item.name}
                      </h3>

                      <div className="mb-3">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">{item.time}</div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <div className="text-sm font-medium mb-1">
                          {item.benefit}
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs text-green-600">
                            Skin match: {item.match}
                          </span>
                        </div>
                      </div>

                      {!item.current && (
                        <Button
                          className="w-full"
                          variant="outline"
                          style={{
                            borderColor: productColors.primary,
                            color: productColors.primary,
                          }}
                        >
                          + Add to Routine
                        </Button>
                      )}

                      {item.current && (
                        <div className="bg-green-100 p-2 rounded text-sm text-green-800 font-medium">
                          ✓ Already selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Smart Bundle Offer */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white text-center">
              <h3 className="text-xl font-bold mb-2">
                🎁 Complete Routine Bundle
              </h3>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div>
                  <span className="text-2xl font-bold">
                    {formatPrice(599 + currentPrice.selling_price + 749)}
                  </span>
                  <span className="text-lg line-through opacity-75 ml-2">
                    {formatPrice(699 + currentPrice.mrp + 849)}
                  </span>
                </div>
                <Badge className="bg-yellow-400 text-yellow-900 font-bold">
                  Save{" "}
                  {formatPrice(
                    699 +
                      currentPrice.mrp +
                      849 -
                      (599 + currentPrice.selling_price + 749)
                  )}
                </Badge>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Everything you need for healthy skin. 94% of customers see
                results within 2 weeks.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                🛒 Get Complete Routine
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Product Details */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: colors.brand.sandyBeige }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: productColors.primary }}
                  />
                  About This Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  {product.long_description}
                </p>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      How to Use
                    </h4>
                    <p className="text-blue-800">
                      {product.usage_instructions}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Format
                    </h4>
                    <p className="text-green-800">{product.format}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      Best For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.category.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-purple-700 border-purple-300"
                        >
                          {tag.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: productColors.primary }}
                  />
                  Complete Ingredient Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Hero Ingredients */}
                  <div>
                    <h4
                      className="font-semibold mb-4 text-lg"
                      style={{ color: colors.text.primary }}
                    >
                      ⭐ Hero Ingredients
                    </h4>
                    <div className="space-y-4">
                      {product.ingredients.hero_ingredients.map(
                        (ingredient, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-lg">
                                {ingredient.name}
                              </h5>
                              {ingredient.percentage && (
                                <Badge
                                  className="font-semibold"
                                  style={{
                                    backgroundColor: productColors.primary,
                                    color: "white",
                                  }}
                                >
                                  {ingredient.percentage}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {ingredient.benefit}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Supporting Ingredients */}
                  <div>
                    <h4
                      className="font-semibold mb-4 text-lg"
                      style={{ color: colors.text.primary }}
                    >
                      🌿 Complete INCI List
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.complete_inci
                          .slice(0, 8)
                          .map((ingredient, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-green-700 border-green-300 text-xs"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        {product.ingredients.complete_inci.length > 8 && (
                          <Badge
                            variant="outline"
                            className="text-gray-500 border-gray-300 text-xs"
                          >
                            +{product.ingredients.complete_inci.length - 8} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* What's NOT in it */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold mb-2 text-red-900">
                      ❌ Free From
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Parabens",
                        "Sulfates",
                        "Phthalates",
                        "Artificial Fragrances",
                        "Mineral Oil",
                      ].map((item, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-red-700 border-red-300"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Skin Types & Concerns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: productColors.primary }}
                  />
                  Perfect For Your Skin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Skin Types</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {product.skin_types.map((type) => (
                        <div
                          key={type}
                          className="flex items-center gap-2 p-3 rounded-lg"
                          style={{
                            backgroundColor: `${productColors.primary}10`,
                          }}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: productColors.primary }}
                          />
                          <span className="text-sm font-medium">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      💧 Recommended For
                    </h4>
                    <p className="text-blue-800 text-sm">
                      Best results when used consistently for 4-6 weeks as part
                      of your daily routine.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: productColors.primary }}
                  />
                  Targets Skin Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.concerns_addressed.map((concern, index) => (
                    <div
                      key={concern}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="text-lg">
                        {index === 0
                          ? "🎯"
                          : index === 1
                          ? "✨"
                          : index === 2
                          ? "🌟"
                          : "💫"}
                      </div>
                      <span className="font-medium capitalize">
                        {concern.replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    🏆 Proven Results
                  </h4>
                  <p className="text-green-800 text-sm">
                    Clinical studies show visible improvement in these concerns
                    within 2-4 weeks of regular use.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Educational Content */}
          <Card className="mt-8 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: productColors.primary }}
                />
                Expert Tips & Science
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      🧬 The Science
                    </h4>
                    <p className="text-purple-800 text-sm leading-relaxed">
                      Our advanced formula penetrates deep into the skin layers,
                      delivering active ingredients where they're needed most
                      for maximum efficacy and visible results.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">
                      ⏰ When to Apply
                    </h4>
                    <p className="text-orange-800 text-sm leading-relaxed">
                      For best results, apply to clean, dry skin. Can be used
                      morning and/or evening. Always follow with SPF during the
                      day.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-900 mb-2">
                      💡 Pro Tip
                    </h4>
                    <p className="text-teal-800 text-sm leading-relaxed">
                      Start with a small amount and gradually increase usage.
                      Patch test before first use. Store in a cool, dry place
                      away from direct sunlight.
                    </p>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-900 mb-2">
                      🌱 Sustainability
                    </h4>
                    <p className="text-pink-800 text-sm leading-relaxed">
                      Responsibly sourced ingredients, recyclable packaging, and
                      cruelty-free formulation align with our commitment to
                      sustainable beauty.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Smart Subscription - Never Run Out */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: colors.brand.mistWhite }}
      >
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-2 border-dashed border-green-300">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      🔄 Never Run Out Again
                    </h2>
                    <p className="opacity-90">
                      Auto-refill when you're running low
                    </p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                      Why Subscribe?
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          icon: "💰",
                          title: "Save 15%",
                          desc:
                            formatPrice(
                              Math.round(currentPrice.selling_price * 0.85)
                            ) + " per delivery",
                        },
                        {
                          icon: "📅",
                          title: "Perfect Timing",
                          desc: "Delivered every 6-8 weeks",
                        },
                        {
                          icon: "🎯",
                          title: "Never Forget",
                          desc: "Consistent skincare routine",
                        },
                        {
                          icon: "⚡",
                          title: "Skip Anytime",
                          desc: "Cancel or pause easily",
                        },
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-xl">{benefit.icon}</span>
                          <div>
                            <div className="font-medium">{benefit.title}</div>
                            <div className="text-sm text-gray-600">
                              {benefit.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                      Choose Your Schedule
                    </h3>

                    <div className="space-y-3 mb-6">
                      {[
                        { duration: "6 weeks", savings: "15%", popular: true },
                        { duration: "8 weeks", savings: "15%", popular: false },
                        {
                          duration: "12 weeks",
                          savings: "20%",
                          popular: false,
                        },
                      ].map((option, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            option.popular
                              ? "border-2 border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  option.popular
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300"
                                }`}
                              />
                              <div>
                                <span className="font-medium">
                                  Every {option.duration}
                                </span>
                                {option.popular && (
                                  <Badge className="ml-2 text-xs bg-green-500">
                                    Most Popular
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-700">
                                Save {option.savings}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full mb-4"
                      style={{ backgroundColor: productColors.primary }}
                    >
                      🔄 Subscribe & Save{" "}
                      {formatPrice(
                        Math.round(currentPrice.selling_price * 0.15)
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">
                        ✓ Free shipping • ✓ Cancel anytime • ✓ Skip or pause
                        deliveries
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        💡 73% of subscribers see better results with consistent
                        use
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: colors.brand.mistWhite }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: colors.text.primary }}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                question: "How long does it take to see results?",
                answer:
                  "Most customers notice visible improvements within 7-14 days, with optimal results after 4-6 weeks of consistent use.",
              },
              {
                question: "Can I use this with other skincare products?",
                answer:
                  "Yes! This product works well in combination with other skincare products. Apply in order of thinnest to thickest consistency.",
              },
              {
                question: "Is this suitable for sensitive skin?",
                answer:
                  "Our formula is dermatologist-tested and suitable for sensitive skin. However, we recommend patch testing before first use.",
              },
              {
                question: "What's your return policy?",
                answer:
                  "We offer a 30-day money-back guarantee. If you're not completely satisfied, return the product for a full refund.",
              },
              {
                question: "How should I store this product?",
                answer:
                  "Store in a cool, dry place away from direct sunlight. Ensure the cap is tightly closed after each use.",
              },
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3
                    className="font-semibold mb-3 text-lg"
                    style={{ color: colors.text.primary }}
                  >
                    Q: {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    A: {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Reviews */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: colors.text.primary }}
          >
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Summary */}
            <Card className="lg:col-span-1">
              <CardContent className="p-8 text-center">
                <div
                  className="text-5xl font-bold mb-4"
                  style={{ color: productColors.primary }}
                >
                  {product.reviews.average_rating}
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.floor(product.reviews.average_rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xl font-semibold mb-2">Excellent</p>
                <p className="text-gray-600 mb-6">
                  Based on {product.reviews.total_reviews} verified reviews
                </p>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span>{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${
                              rating === 5
                                ? 70
                                : rating === 4
                                ? 20
                                : rating === 3
                                ? 7
                                : rating === 2
                                ? 2
                                : 1
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-gray-500">
                        {rating === 5
                          ? 70
                          : rating === 4
                          ? 20
                          : rating === 3
                          ? 7
                          : rating === 2
                          ? 2
                          : 1}
                        %
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Review Highlights */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-semibold mb-4">
                Customer Highlights
              </h3>

              {product.reviews.review_highlights.map((highlight, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: productColors.primary }}
                      >
                        {`C${index + 1}`}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            Verified Purchase
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed italic">
                          "{highlight}"
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          - Happy Customer {index + 1}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  style={{
                    borderColor: productColors.primary,
                    color: productColors.primary,
                  }}
                >
                  Read All Reviews
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
