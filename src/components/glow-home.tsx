// Glow Product Components
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Droplets,
  Sun,
  Leaf,
  Shield,
  Sparkles,
  ArrowRight,
  Users,
  Award,
  Globe,
  ShoppingCart,
  Heart,
  Search,
} from "lucide-react";
import { colors, type ProductCategoryKey } from "@/styles/colors";
import { Navigation, Footer } from "@/components/website-layouts";
import {
  products,
  getFeaturedProducts,
  getAllCategories,
  type Product,
} from "@/lib/products";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

// Product Card Component for the actual products
interface RealProductCardProps {
  product: Product;
}

const RealProductCard = ({ product }: RealProductCardProps) => {
  const { addToCart } = useCart();

  const getCategoryKey = (category: string): ProductCategoryKey => {
    const categoryMap: { [key: string]: ProductCategoryKey } = {
      Cleanser: "cleanser",
      Serum: "serum",
      Moisturizer: "moisturizer",
      Sunscreen: "sunscreen",
    };
    return categoryMap[category] || "cleanser";
  };

  const categoryKey = getCategoryKey(product.category.primary);
  const productColors =
    colors.products[categoryKey] || colors.products.cleanser;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.pricing.selling_price,
      category: product.category.primary,
      size: product.size,
      sku: product.sku,
      image: product.images?.primary,
    });
  };

  const getIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      Cleanser: Leaf,
      Serum: Droplets,
      Moisturizer: Sparkles,
      Sunscreen: Sun,
    };
    return iconMap[category] || Leaf;
  };

  const Icon = getIcon(product.category.primary);

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
            <div
              className="p-3 rounded-full mb-4"
              style={{ backgroundColor: `${productColors.primary}15` }}
            >
              <Icon
                className="h-6 w-6"
                style={{ color: productColors.primary }}
              />
            </div>
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
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 leading-relaxed">
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
                variant="secondary"
                className="text-xs px-2 py-1"
                style={{
                  backgroundColor: `${productColors.primary}10`,
                  color: productColors.primary,
                  border: `1px solid ${productColors.primary}20`,
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
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
                  style={{ backgroundColor: productColors.accent }}
                >
                  {product.pricing.discount_percentage}% OFF
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
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
              className="px-3 hover:bg-opacity-10"
              style={{
                borderColor: productColors.primary,
                color: productColors.primary,
              }}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Legacy Product Card Component for demo sections
interface DemoProduct {
  id: string;
  name: string;
  category: ProductCategoryKey;
  price: number;
  rating: number;
  description: string;
  benefits: string[];
  image?: string;
}

// Sample product data for demo
const sampleProducts: DemoProduct[] = [
  {
    id: "1",
    name: "Gentle Botanical Cleanser",
    category: "cleanser",
    price: 28,
    rating: 4.8,
    description:
      "A gentle, plant-based cleanser that purifies without stripping natural oils.",
    benefits: ["Deep cleansing", "Maintains pH balance", "Botanical extracts"],
  },
  {
    id: "2",
    name: "Hydrating Moisture Serum",
    category: "serum",
    price: 45,
    rating: 4.9,
    description:
      "Intensive hydration serum with hyaluronic acid and marine botanicals.",
    benefits: ["24h hydration", "Plumps skin", "Marine minerals"],
  },
  {
    id: "3",
    name: "Brightening Vitamin C Serum",
    category: "serum",
    price: 52,
    rating: 4.7,
    description: "Potent vitamin C serum for radiant, even-toned skin.",
    benefits: [
      "Brightens complexion",
      "Evens skin tone",
      "Antioxidant protection",
    ],
  },
  {
    id: "4",
    name: "Daily Protection Sunscreen SPF 50",
    category: "sunscreen",
    price: 32,
    rating: 4.6,
    description: "Lightweight, broad-spectrum protection with a silky finish.",
    benefits: [
      "SPF 50 protection",
      "Non-greasy formula",
      "Reef-safe ingredients",
    ],
  },
];

// Demo Product Card Component
interface ProductCardProps {
  product: DemoProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const productColors = colors.products[product.category];

  const getIcon = (category: ProductCategoryKey) => {
    const iconMap: Record<ProductCategoryKey, any> = {
      cleanser: Leaf,
      serum: Droplets,
      moisturizer: Sparkles,
      sunscreen: Sun,
      treatment: Star,
    };
    return iconMap[category] || Leaf;
  };

  const Icon = getIcon(product.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className="h-full overflow-hidden glass-card hover:glass-strong transition-all duration-300 floating-element"
        style={{
          borderColor: productColors.lighter + "40",
        }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Badge
              className="text-white font-medium"
              style={{ backgroundColor: productColors.primary }}
            >
              <Icon className="w-3 h-3 mr-1" />
              {product.category
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </Badge>
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{product.rating}</span>
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            {product.name}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {product.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: productColors.lighter,
                    color: productColors.primary,
                    border: `1px solid ${productColors.lighter}`,
                  }}
                >
                  {benefit}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              <Button
                className="text-white font-medium transition-all duration-300"
                style={{
                  backgroundColor: productColors.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = productColors.lighter;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = productColors.primary;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative h-[100vh] overflow-hidden pt-16 md:pt-20">
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
        <source
          src="/videos/18409876-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Fallback gradient background */}

      {/* Overlay for better text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colors.semantic.info}40, transparent 70%)`,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left max-w-3xl mx-auto md:mx-0"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight"
            >
              Born from the Clarity of Himalayan Waters
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed max-w-2xl mx-auto md:mx-0"
            >
              At Glow, we bring together the untouched serenity of
              high-altitude Himalayan lakes and the strength of modern
              dermatology. Each product is crafted to honor your skin's natural
              rhythm — calm, transparent, and enduringly strong.
            </motion.p>

            {/* Hero Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8 max-w-lg mx-auto md:mx-0 w-full"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/60" />
                </div>
                <Input
                  type="text"
                  placeholder="Search products, skin concerns..."
                  className="w-full pl-12 pr-16 md:pr-20 py-4 text-white placeholder-white/60 bg-white/20 backdrop-blur-md border-white/30 rounded-2xl focus:bg-white/30 focus:border-white/50 transition-all duration-200 text-base"
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
                  <Button
                    size="sm"
                    className="h-8 w-12 md:h-8 md:w-10 px-0 bg-white/90 hover:bg-white text-gray-900 font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Search Suggestions */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <span className="text-white/70 text-sm mr-2 hidden sm:inline">
                  Popular:
                </span>
                {["Acne Control", "Vitamin C", "Hydrating", "Anti-Aging"].map(
                  (term) => (
                    <button
                      key={term}
                      className="px-3 py-1 text-xs font-medium text-white/80 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/20"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link href="/products">
                <Button
                  size="lg"
                  className="text-white font-semibold px-8 py-4 rounded-2xl border-0 transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: colors.semantic.success,
                    boxShadow: colors.elevation.medium,
                  }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Discover Your Ritual
                </Button>
              </Link>
              <Button
                size="lg"
                className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                <Heart className="mr-2 h-5 w-5" />
                Learn Our Story
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8 text-white/80"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Quality Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                <span className="text-sm font-medium">Natural Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">Customer Loved</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Product Categories Section
const CategoriesSection = () => {
  const categories = [
    {
      key: "cleanser",
      name: "Cleansers",
      icon: Leaf,
      description: "Gentle purification",
      href: "/categories/cleanser",
    },
    {
      key: "serum",
      name: "Serums",
      icon: Droplets,
      description: "Concentrated treatments",
      href: "/categories/serum",
    },
    {
      key: "moisturizer",
      name: "Moisturizers",
      icon: Sparkles,
      description: "Hydrating care",
      href: "/categories/moisturizer",
    },
    {
      key: "sunscreen",
      name: "Sun Protection",
      icon: Sun,
      description: "Daily defense",
      href: "/categories/sunscreen",
    },
  ] as const;

  return (
    <section
      className="py-16 px-4 relative z-10"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Each collection is thoughtfully crafted with nature&apos;s finest
            ingredients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const categoryColors =
              colors.products[category.key as ProductCategoryKey];
            const Icon = category.icon;

            return (
              <Link key={category.key} href={category.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="glass-card p-6 rounded-2xl text-center cursor-pointer transition-all duration-300 h-full hover:glass-strong floating-element"
                  style={{
                    borderColor: categoryColors.lighter + "40",
                    animationDelay: `${index * 0.5}s`,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center glass-button floating-element"
                    style={{ backgroundColor: categoryColors.primary + "80" }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Main Glow Homepage Component
export default function GlowHome() {
  const featuredProducts = getFeaturedProducts(6);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: colors.gradients.hero,
      }}
    >
      <Navigation />
      <HeroSection />
      <BrandPhilosophySection />
      <CategoriesSection />

      {/* Real Featured Products Section */}
      <section
        className="py-16 px-4"
        style={{
          background: colors.gradients.subtle,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Discover Rituals Born in the Himalayas
            </h2>
            <p className="text-lg text-gray-600">
              Each formulation is infused with the clarity of water, the
              strength of minerals, and the wisdom of botanicals. Skincare
              designed to restore balance — naturally and scientifically.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RealProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                size="lg"
                className="text-white font-medium px-8 py-3"
                style={{ backgroundColor: colors.interactive.primary }}
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Products Section */}
      <section
        className="py-16 px-4"
        style={{
          background: colors.gradients.card,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Product Experience Preview
            </h2>
            <p className="text-lg text-gray-600">
              Experience the power of nature-inspired skincare design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product, index) => (
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

      {/* Trust Indicators */}
      <TrustSection />

      {/* Ingredients Philosophy Section */}
      <BlogSection />

      {/* Closing CTA Section */}
      <ClosingCTASection />

      <Footer />
    </div>
  );
}

// Brand Philosophy Section Component
const BrandPhilosophySection = () => {
  const philosophyItems = [
    {
      icon: Droplets,
      title: "Serene Purity",
      description: "Calm formulations that let your skin breathe",
      color: colors.brand.glacialBlue,
    },
    {
      icon: Shield,
      title: "Empowered Transparency",
      description: "Honest ingredients, clear results",
      color: colors.brand.goldenDawn,
    },
    {
      icon: Sparkles,
      title: "Minimalist Strength",
      description: "Powerful skincare without the clutter",
      color: colors.brand.deepLakeBlue,
    },
    {
      icon: Leaf,
      title: "Nature Meets Science",
      description: "Proven actives blended with Himalayan botanicals",
      color: colors.products.treatment.primary,
    },
    {
      icon: Users,
      title: "Enduring Connection",
      description: "A ritual that becomes timeless",
      color: colors.text.primary,
    },
  ];

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: colors.surfaces.secondary }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: colors.text.primary }}
          >
            Where Nature Meets Science, Your Skin Finds Balance
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From the golden dawns over Ladakh to the depth of its tranquil
            lakes, Glow is inspired by nature's quiet resilience. Our philosophy
            is rooted in:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {philosophyItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="text-center bg-white/70 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/90 transition-all duration-300 border border-white/20"
                style={{ animationDelay: `${index * 1}s` }}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: item.color + "20" }}
                >
                  <Icon className="w-8 h-8" style={{ color: item.color }} />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: colors.brand.goldenDawn,
              boxShadow:
                colors.elevation?.medium || "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            Learn Our Story
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

// Trust Section Component (Updated)
const TrustSection = () => {
  const trustItems = [
    {
      icon: Shield,
      title: "Rooted in Care",
      description: "For you and the planet - minimal, recyclable packaging",
      color: colors.products.treatment.primary,
    },
    {
      icon: Award,
      title: "Ethically Sourced",
      description: "Cruelty-free and made with uncompromising honesty",
      color: colors.brand.goldenDawn,
    },
    {
      icon: Globe,
      title: "Light Footprint",
      description:
        "Just as a high mountain lake stands untouched, we believe in leaving a light footprint",
      color: colors.brand.glacialBlue,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Rooted in Care — For You and the Planet
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="text-center glass-card p-6 rounded-2xl hover:glass-strong transition-all duration-300 floating-element"
                style={{ animationDelay: `${index * 1}s` }}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center glass-button floating-element"
                  style={{ backgroundColor: item.color + "40" }}
                >
                  <Icon className="w-8 h-8" style={{ color: item.color }} />
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Blog Section Component
const BlogSection = () => {
  const blogPosts = [
    {
      title: "The Science of Hydration",
      category: "Skincare Science",
      categoryColor: colors.products.serum.primary,
      excerpt:
        "Understanding how your skin maintains moisture and the role of hyaluronic acid.",
      readTime: "5 min read",
    },
    {
      title: "Natural Ingredients Guide",
      category: "Nature Stories",
      categoryColor: colors.products.cleanser.primary,
      excerpt:
        "Discover the botanical extracts that make our formulations so effective.",
      readTime: "7 min read",
    },
    {
      title: "Your Daily Skincare Ritual",
      category: "Self-Care",
      categoryColor: colors.products.treatment.primary,
      excerpt:
        "Create a mindful morning routine that nourishes both skin and soul.",
      readTime: "4 min read",
    },
  ];

  return (
    <section
      className="py-16 px-4"
      style={{
        background: colors.gradients.subtle,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Ingredients That Speak With Transparency
          </h2>
          <p className="text-lg text-gray-600">
            We believe skincare should be both poetic and precise. Every
            ingredient is carefully chosen, never hidden. Expect clarity: from
            Himalayan spring water to Ladakh herbs and clinically backed
            actives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full group cursor-pointer transition-all duration-300 hover:shadow-lg">
                <div
                  className="h-48 p-6 flex items-center justify-center"
                  style={{ backgroundColor: post.categoryColor + "15" }}
                >
                  <div className="text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: post.categoryColor }}
                    >
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <Badge
                      className="text-white text-xs"
                      style={{ backgroundColor: post.categoryColor }}
                    >
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3
                    className="text-xl font-semibold mb-3 group-hover:text-opacity-75"
                    style={{ color: colors.text.primary }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {post.readTime}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Closing CTA Section Component
const ClosingCTASection = () => {
  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.brand.deepLakeBlue}15, ${colors.brand.glacialBlue}10)`,
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: colors.text.primary }}
          >
            Begin Your Ritual of Clarity
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Skincare that feels like a deep breath by the lake — calm,
            empowering, and enduring.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link href="/products">
              <Button
                size="lg"
                className="text-white font-semibold px-12 py-6 text-lg rounded-2xl transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: colors.brand.goldenDawn,
                  boxShadow: "0 8px 24px rgba(225, 168, 95, 0.3)",
                }}
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Explore Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-32 h-32 rounded-full blur-3xl"
            style={{ backgroundColor: colors.brand.glacialBlue + "20" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2"
        >
          <div
            className="w-24 h-24 rounded-full blur-2xl"
            style={{ backgroundColor: colors.brand.goldenDawn + "25" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

// Trust Section Component
