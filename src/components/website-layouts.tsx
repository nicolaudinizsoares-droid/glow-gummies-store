// Website Layout Components for Glow
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { colors } from "@/styles/colors";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { GlowLogo } from "@/components/glow-logo";

// Navigation Component
export const Navigation = () => {
  const { itemCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't let the page scroll behind the open mobile menu.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Close on Escape, matching the cart sidebar's behaviour.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const navItems = [
    { name: "Shop", href: "/products", accent: colors.brand.apricot },
    { name: "Benefits", href: "/#benefits", accent: colors.brand.blush },
    { name: "How to take it", href: "/#how-to-take-it", accent: colors.brand.peach },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Link href="/" className="flex items-center" aria-label="Glow home">
              <GlowLogo size={30} />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:opacity-75 relative group"
                  style={{ color: colors.text.primary }}
                >
                  {item.name}
                  {item.accent && (
                    <div
                      className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                      style={{ backgroundColor: item.accent }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="glass-subtle hover:glass rounded-full"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="glass-subtle hover:glass rounded-full"
            >
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="glass-subtle hover:glass rounded-full relative"
              onClick={toggleCart}
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.brand.goldenDawn }}
                >
                  {itemCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden glass-subtle hover:glass rounded-full"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{
              borderColor: colors.brand.creamPale,
              backgroundColor: colors.brand.offWhite,
            }}
          >
            <ul className="px-4 py-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 text-base font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: item.accent ?? colors.brand.apricot,
                      }}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="py-16 px-4 glass-card">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <GlowLogo size={26} />
            </div>
            <p className="text-gray-600 text-sm">
              Science meets nature in our carefully curated skincare collection.
              Experience the power of botanical wisdom.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="p-2 rounded-full transition-colors"
                  style={{ backgroundColor: colors.brand.glacialBlue + "20" }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: colors.text.primary }}
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: colors.text.primary }}
            >
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:opacity-75">
                  All Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-75">
                  Cleansers
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-75">
                  Serums
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-75">
                  Moisturizers
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-75">
                  Sun Protection
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: colors.text.primary }}
            >
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:opacity-75">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-75">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-75">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-75">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-75">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="font-semibold mb-4"
              style={{ color: colors.text.primary }}
            >
              Stay Connected
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Get skincare tips and exclusive offers
            </p>
            <div className="space-y-2">
              <Input
                placeholder="Your email address"
                className="text-sm"
                style={{ borderColor: colors.brand.glacialBlue }}
              />
              <Button
                className="w-full text-white font-medium"
                style={{ backgroundColor: colors.brand.goldenDawn }}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-center"
          style={{ borderColor: colors.brand.glacialBlue + "40" }}
        >
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            © 2025 Glow. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:opacity-75">
              Privacy Policy
            </a>
            <a href="#" className="hover:opacity-75">
              Terms of Service
            </a>
            <a href="#" className="hover:opacity-75">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Product Detail Page Component
interface ProductDetailProps {
  category: keyof typeof colors.products;
}

export const ProductDetailLayout = ({ category }: ProductDetailProps) => {
  const categoryColors = colors.products[category];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.brand.mistWhite }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div
              className="aspect-square rounded-lg p-8 flex items-center justify-center"
              style={{ backgroundColor: categoryColors.lighter }}
            >
              <div className="text-center">
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: categoryColors.primary }}
                >
                  <span className="text-white text-2xl font-bold">Glow</span>
                </div>
                <p className="text-gray-600">Product Image</p>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4"
                style={{ backgroundColor: categoryColors.primary }}
              >
                {category
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{ color: colors.text.primary }}
              >
                Premium {category.replace(/([A-Z])/g, " $1")}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Experience the perfect blend of nature and science in this
                carefully formulated product.
              </p>
              <div
                className="text-3xl font-bold mb-6"
                style={{ color: colors.text.primary }}
              >
                $45.00
              </div>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full text-white font-semibold py-4"
                style={{ backgroundColor: categoryColors.primary }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                style={{
                  borderColor: categoryColors.primary,
                  color: categoryColors.primary,
                }}
              >
                Add to Wishlist
              </Button>
            </div>

            {/* Product Benefits */}
            <Card>
              <CardContent className="p-6">
                <h3
                  className="font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  Key Benefits
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Naturally sourced ingredients</li>
                  <li>• Scientifically proven formulation</li>
                  <li>• Suitable for all skin types</li>
                  <li>• Cruelty-free and sustainable</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Category Page Layout
interface CategoryPageProps {
  category: keyof typeof colors.products;
  products: Array<{ id: string; name: string; price: number }>;
}

export const CategoryPageLayout = ({
  category,
  products,
}: CategoryPageProps) => {
  const categoryColors = colors.products[category];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.brand.mistWhite }}
    >
      {/* Category Header */}
      <div
        className="py-16 px-4"
        style={{
          background: `linear-gradient(135deg, ${categoryColors.lighter} 0%, ${colors.brand.mistWhite} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="inline-block px-4 py-2 rounded-full text-white font-medium mb-6"
              style={{ backgroundColor: categoryColors.primary }}
            >
              {category
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </div>
            <h1
              className="text-5xl font-bold mb-6"
              style={{ color: colors.text.primary }}
            >
              {category.replace(/([A-Z])/g, " $1")} Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium skincare
              products designed to nourish and protect your skin.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-8">
            {["All", "Best Sellers", "New Arrivals", "Sale"].map((filter) => (
              <Button
                key={filter}
                variant="outline"
                className="border-2"
                style={{
                  borderColor: categoryColors.light,
                  color: colors.text.primary,
                }}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                  <div
                    className="aspect-square p-8 flex items-center justify-center"
                    style={{ backgroundColor: categoryColors.lighter }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: categoryColors.primary }}
                    >
                      <span className="text-white font-bold">Glow</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: colors.text.primary }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-lg font-bold"
                      style={{ color: categoryColors.primary }}
                    >
                      ${product.price}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
