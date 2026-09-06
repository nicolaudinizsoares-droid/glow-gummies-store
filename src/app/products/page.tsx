"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation, Footer } from "@/components/website-layouts";
import { EnhancedSearch } from "@/components/enhanced-search";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { colors } from "@/styles/colors";
import {
  products,
  getAllCategories,
  getProductsByCategory,
  searchProducts,
  quickSearch,
  getSearchSuggestions,
  getFilterOptions,
  type Product,
  type SearchResult,
  type SearchFilters,
} from "@/lib/products";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/currency";

// Product Card Component
interface ProductCardProps {
  product: Product;
  searchResult?: SearchResult;
}

const ProductCard = ({ product, searchResult }: ProductCardProps) => {
  const { addToCart } = useCart();

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

  // Function to render highlighted text
  const renderHighlightedText = (text: string, field: string) => {
    if (searchResult?.highlights[field]) {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: searchResult.highlights[field] }}
        />
      );
    }
    return text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group h-full"
    >
      <Card className="h-full glass-card hover:glass-strong transition-all duration-300 overflow-hidden floating-element">
        <div
          className="h-2 glass-button"
          style={{ backgroundColor: productColors.primary + "80" }}
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
            {renderHighlightedText(product.name, "name")}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {renderHighlightedText(product.short_description, "description")}
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
                  style={{ backgroundColor: colors.interactive.primary }}
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

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});

  const categories = getAllCategories();
  const filterOptions = getFilterOptions();

  // Handle search with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim()) {
      // Get suggestions for autocomplete
      const newSuggestions = getSearchSuggestions(value, 5);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);

      // Get search results
      const results = searchProducts(value, filters);
      setSearchResults(results);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchResults([]);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered: Product[] = [];
    let results: SearchResult[] = [];

    // If there's a search query, use search results
    if (searchQuery.trim()) {
      results = searchResults;
      filtered = results.map((result) => result.product);
    } else {
      filtered = products;
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.primary.toLowerCase() ===
          selectedCategory.toLowerCase()
      );

      // Also filter the search results if we have them
      if (searchQuery.trim()) {
        results = results.filter(
          (result) =>
            result.product.category.primary.toLowerCase() ===
            selectedCategory.toLowerCase()
        );
      }
    }

    // Sort products
    if (!searchQuery.trim()) {
      switch (sortBy) {
        case "price-low":
          filtered = [...filtered].sort(
            (a, b) => a.pricing.selling_price - b.pricing.selling_price
          );
          break;
        case "price-high":
          filtered = [...filtered].sort(
            (a, b) => b.pricing.selling_price - a.pricing.selling_price
          );
          break;
        case "rating":
          filtered = [...filtered].sort(
            (a, b) => b.reviews.average_rating - a.reviews.average_rating
          );
          break;
        case "name":
          filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Keep search relevance order
          break;
      }
    } else if (sortBy !== "relevance") {
      // Apply sorting to search results while maintaining search result data
      const sortedResults = [...results];
      switch (sortBy) {
        case "price-low":
          sortedResults.sort(
            (a, b) =>
              a.product.pricing.selling_price - b.product.pricing.selling_price
          );
          break;
        case "price-high":
          sortedResults.sort(
            (a, b) =>
              b.product.pricing.selling_price - a.product.pricing.selling_price
          );
          break;
        case "rating":
          sortedResults.sort(
            (a, b) =>
              b.product.reviews.average_rating -
              a.product.reviews.average_rating
          );
          break;
        case "name":
          sortedResults.sort((a, b) =>
            a.product.name.localeCompare(b.product.name)
          );
          break;
      }
      results = sortedResults;
      filtered = sortedResults.map((result) => result.product);
    }

    return { products: filtered, searchResults: results };
  }, [searchQuery, selectedCategory, sortBy, searchResults, filters]);

  // Helper function to get search result for a product
  const getSearchResultForProduct = (
    product: Product
  ): SearchResult | undefined => {
    return filteredProducts.searchResults.find(
      (result) => result.product.id === product.id
    );
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearchChange(suggestion.text);
  };

  return (
    <div className="min-h-screen search-highlight">
      <Navigation />

      {/* CSS for search highlights */}
      <style jsx global>{`
        .search-highlight mark {
          background-color: #fef3c7;
          color: #92400e;
          padding: 1px 2px;
          border-radius: 2px;
          font-weight: 500;
        }
      `}</style>

      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center glass-card p-12 rounded-3xl"
          >
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              All Products
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of nature-inspired skincare
              products, crafted with the finest ingredients for healthy, radiant
              skin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Search and Filters Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Enhanced Search */}
              <div className="flex-1 max-w-md">
                <EnhancedSearch
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onSuggestionClick={handleSuggestionClick}
                  placeholder="Search products, ingredients, concerns..."
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 items-center">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 glass-subtle border-0 rounded-md backdrop-blur-md"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 glass-subtle border-0 rounded-md backdrop-blur-md"
                >
                  {searchQuery.trim() && (
                    <option value="relevance">Sort by Relevance</option>
                  )}
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredProducts.products.length} of {products.length}{" "}
              products
              {searchQuery && (
                <span className="ml-2 text-sm">
                  for "<strong>{searchQuery}</strong>"
                </span>
              )}
            </p>
          </div>

          {filteredProducts.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    searchResult={getSearchResultForProduct(product)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
                {searchQuery && (
                  <>
                    <br />
                    <span className="text-sm mt-2 block">
                      Try adjusting your search terms or filters.
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
