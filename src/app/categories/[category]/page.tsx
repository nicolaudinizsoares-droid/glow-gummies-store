"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation, Footer } from "@/components/website-layouts";
import {
  Star,
  ShoppingCart,
  Heart,
  Leaf,
  Droplets,
  Sun,
  Shield,
} from "lucide-react";
import { colors } from "@/styles/colors";
import { getProductsByCategory, type Product } from "@/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Product Card Component
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
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
  const productColors =
    colors.products[categoryKey as keyof typeof colors.products] ||
    colors.products.cleanser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div
          className="h-2"
          style={{ backgroundColor: productColors.primary }}
        />
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <Badge
              variant="secondary"
              className="mb-3"
              style={{
                backgroundColor: `${productColors.primary}15`,
                color: productColors.primary,
                border: `1px solid ${productColors.primary}30`,
              }}
            >
              {product.category.primary}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {product.short_description}
          </CardDescription>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.reviews.average_rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({product.reviews.total_reviews})
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-4">
            {product.category.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-1"
                style={{
                  backgroundColor: `${productColors.primary}10`,
                  color: productColors.primary,
                  borderColor: `${productColors.primary}30`,
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {product.pricing.discount_percentage > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.pricing.mrp)}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.pricing.selling_price)}
              </span>
              {product.pricing.discount_percentage > 0 && (
                <Badge
                  variant="destructive"
                  className="text-xs"
                  style={{ backgroundColor: colors.brand.goldenDawn }}
                >
                  {product.pricing.discount_percentage}% OFF
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/products/${product.slug}`} className="flex-1">
              <Button
                className="w-full text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: productColors.primary }}
              >
                View Details
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              style={{
                borderColor: productColors.primary,
                color: productColors.primary,
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = React.use(params);
  const categoryName = decodeURIComponent(resolvedParams.category);
  const categoryProducts = getProductsByCategory(categoryName);

  if (categoryProducts.length === 0) {
    notFound();
  }

  const getCategoryKey = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      cleanser: "cleanser",
      serum: "serum",
      moisturizer: "moisturizer",
      sunscreen: "sunscreen",
    };
    return categoryMap[category.toLowerCase()] || "cleanser";
  };

  const categoryKey = getCategoryKey(categoryName);
  const categoryColors =
    colors.products[categoryKey as keyof typeof colors.products] ||
    colors.products.cleanser;

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      cleanser: Leaf,
      serum: Droplets,
      moisturizer: Shield,
      sunscreen: Sun,
    };
    return iconMap[category.toLowerCase()] || Leaf;
  };

  const CategoryIcon = getCategoryIcon(categoryName);

  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      cleanser:
        "Gentle yet effective cleansers that purify your skin while maintaining its natural balance.",
      serum:
        "Concentrated treatments targeting specific skin concerns with powerful active ingredients.",
      moisturizer:
        "Hydrating formulas that nourish and protect your skin barrier for healthy, radiant skin.",
      sunscreen:
        "Broad-spectrum protection that shields your skin from harmful UV rays while feeling lightweight.",
    };
    return (
      descriptions[category.toLowerCase()] ||
      "Premium skincare products crafted with nature's finest ingredients."
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.brand.mistWhite }}
    >
      <Navigation />

      {/* Breadcrumb */}
      <section className="py-4 px-4 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900">
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-900">{categoryName}</span>
          </div>
        </div>
      </section>

      {/* Header Section */}
      <section
        className="py-16 px-4"
        style={{
          background: `linear-gradient(135deg, ${categoryColors.lighter} 0%, ${colors.brand.mistWhite} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{ backgroundColor: categoryColors.primary }}
            >
              <CategoryIcon className="h-8 w-8 text-white" />
            </div>

            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              {categoryName} Collection
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {getCategoryDescription(categoryName)}
            </p>

            <Badge
              className="text-lg px-4 py-2"
              style={{
                backgroundColor: categoryColors.primary,
                color: "white",
              }}
            >
              {categoryProducts.length} Product
              {categoryProducts.length !== 1 ? "s" : ""}
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Category Benefits */}
      <section
        className="py-12 px-4"
        style={{ backgroundColor: colors.brand.sandyBeige }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: categoryColors.primary }}
              >
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Natural Ingredients</h3>
              <p className="text-gray-600 text-sm">
                Sourced from nature's finest botanicals
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: categoryColors.primary }}
              >
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Quality Tested</h3>
              <p className="text-gray-600 text-sm">
                Safe and effective for all skin types
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: categoryColors.primary }}
              >
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">
                Crafted with precision and care
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
