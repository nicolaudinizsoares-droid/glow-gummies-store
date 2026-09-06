import productsData from '@/data/products.json'

export interface ProductVariant {
  id: string
  sku: string
  size: string
  price: {
    mrp: number
    selling_price: number
    discount_percentage: number
  }
  inventory: {
    stock_quantity: number
    low_stock_threshold: number
    status: string
  }
  shipping: {
    weight_grams: number
    dimensions_cm: {
      length: number
      width: number
      height: number
    }
  }
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  tagline: string
  short_description: string
  long_description: string
  category: {
    primary: string
    secondary: string[]
    tags: string[]
  }
  format: string
  size: string
  /** Flavour of the gummy, e.g. "Passion Fruit". */
  flavor: string
  /** Net weight as printed on the label, e.g. "10.1 oz (286 g)". */
  net_weight: string
  serving: {
    size: string
    per_container: number
    directions: string
  }
  /**
   * Supplement Facts panel rows. Empty until the real values are taken from
   * the printed label -- dosages are never inferred.
   */
  supplement_facts: {
    name: string
    amount: string
    daily_value: string | null
  }[]
  /** Label claims such as "Non-GMO", "Gluten Free". */
  dietary_badges: string[]
  /** FDA statement required alongside structure/function claims. */
  disclaimer: string
  variants?: ProductVariant[]
  ingredients: {
    hero_ingredients: {
      name: string
      benefit: string
      percentage: string | null
    }[]
    other_ingredients: string[]
  }
  concerns_addressed: string[]
  pricing: {
    mrp: number
    selling_price: number
    discount_percentage: number
  }
  inventory: {
    stock_quantity: number
    low_stock_threshold: number
    status: string
  }
  seo: {
    meta_title: string
    meta_description: string
    keywords: string[]
  }
  images: {
    primary: string
    gallery: string[]
  }
  usage_instructions: string
  shipping: {
    weight_grams: number
    dimensions_cm: {
      length: number
      width: number
      height: number
    }
    free_shipping_eligible: boolean
  }
  reviews: {
    average_rating: number
    total_reviews: number
    review_highlights: string[]
  }
}

export const products: Product[] = productsData

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => 
    product.category.primary.toLowerCase() === category.toLowerCase()
  )
}

export function getAllCategories(): string[] {
  const categories = new Set(products.map(product => product.category.primary))
  return Array.from(categories)
}

export function getFeaturedProducts(count: number = 6): Product[] {
  return products
    .filter(product => product.reviews.average_rating >= 4.5)
    .sort((a, b) => b.reviews.average_rating - a.reviews.average_rating)
    .slice(0, count)
}

// Enhanced search interfaces
export interface SearchResult {
  product: Product
  score: number
  matchedFields: string[]
  highlights: { [key: string]: string }
}

export interface SearchSuggestion {
  text: string
  type: 'product' | 'category' | 'ingredient' | 'concern'
  count: number
}

export interface SearchFilters {
  categories?: string[]
  priceRange?: { min: number; max: number }
  dietaryBadges?: string[]
  concerns?: string[]
  ingredients?: string[]
  inStock?: boolean
  rating?: number
}

// Utility functions for search
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[str2.length][str1.length]
}

function fuzzyMatch(query: string, text: string, threshold: number = 0.6): boolean {
  const distance = levenshteinDistance(query.toLowerCase(), text.toLowerCase())
  const maxLength = Math.max(query.length, text.length)
  const similarity = 1 - distance / maxLength
  return similarity >= threshold
}

function highlightMatch(text: string, query: string): string {
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Advanced search function with scoring and ranking
export function searchProducts(query: string, filters?: SearchFilters): SearchResult[] {
  if (!query.trim()) return []

  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0)
  const results: SearchResult[] = []

  products.forEach(product => {
    let score = 0
    const matchedFields: string[] = []
    const highlights: { [key: string]: string } = {}

    // Apply filters first
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(product.category.primary)) return
      }
      
      if (filters.priceRange) {
        const price = getProductPrice(product).selling_price
        if (price < filters.priceRange.min || price > filters.priceRange.max) return
      }
      
      if (filters.dietaryBadges && filters.dietaryBadges.length > 0) {
        if (!filters.dietaryBadges.some(type => product.dietary_badges.includes(type))) return
      }
      
      if (filters.concerns && filters.concerns.length > 0) {
        if (!filters.concerns.some(concern => 
          product.concerns_addressed.some(addr => addr.toLowerCase().includes(concern.toLowerCase()))
        )) return
      }
      
      if (filters.ingredients && filters.ingredients.length > 0) {
        if (!filters.ingredients.some(ingredient =>
          product.ingredients.hero_ingredients.some(hero => 
            hero.name.toLowerCase().includes(ingredient.toLowerCase())
          ) ||
          product.ingredients.other_ingredients.some(inci =>
            inci.toLowerCase().includes(ingredient.toLowerCase())
          )
        )) return
      }
      
      if (filters.inStock && !isProductInStock(product)) return
      
      if (filters.rating && product.reviews.average_rating < filters.rating) return
    }

    // Scoring algorithm
    searchTerms.forEach(term => {
      // Exact match in product name (highest priority)
      if (product.name.toLowerCase().includes(term)) {
        score += 100
        matchedFields.push('name')
        highlights.name = highlightMatch(product.name, term)
      }
      
      // Fuzzy match in product name
      if (fuzzyMatch(term, product.name)) {
        score += 80
        if (!matchedFields.includes('name')) {
          matchedFields.push('name')
          highlights.name = highlightMatch(product.name, term)
        }
      }
      
      // Exact match in tagline
      if (product.tagline.toLowerCase().includes(term)) {
        score += 60
        matchedFields.push('tagline')
        highlights.tagline = highlightMatch(product.tagline, term)
      }
      
      // Match in short description
      if (product.short_description.toLowerCase().includes(term)) {
        score += 40
        matchedFields.push('description')
        highlights.description = highlightMatch(product.short_description, term)
      }
      
      // Match in long description
      if (product.long_description.toLowerCase().includes(term)) {
        score += 20
        if (!matchedFields.includes('description')) {
          matchedFields.push('description')
          highlights.description = highlightMatch(product.long_description, term)
        }
      }
      
      // Match in category tags
      product.category.tags.forEach(tag => {
        if (tag.toLowerCase().includes(term)) {
          score += 30
          matchedFields.push('tags')
        }
      })
      
      // Match in concerns addressed
      product.concerns_addressed.forEach(concern => {
        if (concern.toLowerCase().includes(term)) {
          score += 35
          matchedFields.push('concerns')
        }
      })
      
      // Match in skin types
      product.dietary_badges.forEach(badge => {
        if (badge.toLowerCase().includes(term)) {
          score += 25
          matchedFields.push('dietaryBadges')
        }
      })
      
      // Match in hero ingredients
      product.ingredients.hero_ingredients.forEach(ingredient => {
        if (ingredient.name.toLowerCase().includes(term) || 
            ingredient.benefit.toLowerCase().includes(term)) {
          score += 30
          matchedFields.push('ingredients')
        }
      })
      
      // Match in SEO keywords
      product.seo.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(term)) {
          score += 15
          matchedFields.push('keywords')
        }
      })
    })

    // Boost score for highly rated products
    score += product.reviews.average_rating * 5
    
    // Boost score for products with variants
    if (product.variants && product.variants.length > 0) {
      score += 10
    }

    if (score > 0) {
      results.push({
        product,
        score,
        matchedFields: [...new Set(matchedFields)],
        highlights
      })
    }
  })

  // Sort by score (descending)
  return results.sort((a, b) => b.score - a.score)
}

// Get search suggestions
export function getSearchSuggestions(query: string, limit: number = 10): SearchSuggestion[] {
  if (!query.trim()) return []

  const suggestions: SearchSuggestion[] = []
  const queryLower = query.toLowerCase()
  const seen = new Set<string>()

  // Product name suggestions
  products.forEach(product => {
    if (product.name.toLowerCase().includes(queryLower)) {
      const suggestion = product.name
      if (!seen.has(suggestion.toLowerCase())) {
        suggestions.push({
          text: suggestion,
          type: 'product',
          count: 1
        })
        seen.add(suggestion.toLowerCase())
      }
    }
  })

  // Category suggestions
  const categoryMap = new Map<string, number>()
  products.forEach(product => {
    if (product.category.primary.toLowerCase().includes(queryLower)) {
      const count = categoryMap.get(product.category.primary) || 0
      categoryMap.set(product.category.primary, count + 1)
    }
    
    product.category.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        const count = categoryMap.get(tag) || 0
        categoryMap.set(tag, count + 1)
      }
    })
  })

  categoryMap.forEach((count, category) => {
    if (!seen.has(category.toLowerCase())) {
      suggestions.push({
        text: category,
        type: 'category',
        count
      })
      seen.add(category.toLowerCase())
    }
  })

  // Ingredient suggestions
  const ingredientMap = new Map<string, number>()
  products.forEach(product => {
    product.ingredients.hero_ingredients.forEach(ingredient => {
      if (ingredient.name.toLowerCase().includes(queryLower)) {
        const count = ingredientMap.get(ingredient.name) || 0
        ingredientMap.set(ingredient.name, count + 1)
      }
    })
  })

  ingredientMap.forEach((count, ingredient) => {
    if (!seen.has(ingredient.toLowerCase())) {
      suggestions.push({
        text: ingredient,
        type: 'ingredient',
        count
      })
      seen.add(ingredient.toLowerCase())
    }
  })

  // Concern suggestions
  const concernMap = new Map<string, number>()
  products.forEach(product => {
    product.concerns_addressed.forEach(concern => {
      if (concern.toLowerCase().includes(queryLower)) {
        const count = concernMap.get(concern) || 0
        concernMap.set(concern, count + 1)
      }
    })
  })

  concernMap.forEach((count, concern) => {
    if (!seen.has(concern.toLowerCase())) {
      suggestions.push({
        text: concern,
        type: 'concern',
        count
      })
      seen.add(concern.toLowerCase())
    }
  })

  // Sort by relevance and count
  return suggestions
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.text.toLowerCase().startsWith(queryLower)
      const bExact = b.text.toLowerCase().startsWith(queryLower)
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      // Then by count
      return b.count - a.count
    })
    .slice(0, limit)
}

// Simple search for backward compatibility
export function simpleSearchProducts(query: string): Product[] {
  return searchProducts(query).map(result => result.product)
}

// Get trending search terms
export function getTrendingSearches(): string[] {
  return [
    'Vitamin C Serum',
    'Niacinamide',
    'Retinol',
    'Hyaluronic Acid',
    'Sunscreen',
    'Anti-aging',
    'Acne Control',
    'Brightening',
    'Dark Spots',
    'Moisturizer'
  ]
}

// Get all unique values for filters
export function getFilterOptions() {
  const categories = new Set<string>()
  const dietaryBadges = new Set<string>()
  const concerns = new Set<string>()
  const ingredients = new Set<string>()
  
  let minPrice = Infinity
  let maxPrice = 0

  products.forEach(product => {
    // Categories
    categories.add(product.category.primary)
    product.category.secondary.forEach(cat => categories.add(cat))
    product.category.tags.forEach(tag => categories.add(tag))
    
    // Skin types
    product.dietary_badges.forEach(type => dietaryBadges.add(type))
    
    // Concerns
    product.concerns_addressed.forEach(concern => concerns.add(concern))
    
    // Ingredients
    product.ingredients.hero_ingredients.forEach(ing => ingredients.add(ing.name))
    
    // Price range
    const price = getProductPrice(product).selling_price
    minPrice = Math.min(minPrice, price)
    maxPrice = Math.max(maxPrice, price)
  })

  return {
    categories: Array.from(categories).sort(),
    dietaryBadges: Array.from(dietaryBadges).sort(),
    concerns: Array.from(concerns).sort(),
    ingredients: Array.from(ingredients).sort(),
    priceRange: { min: minPrice, max: maxPrice }
  }
}

// Quick search for instant results (used for autocomplete)
export function quickSearch(query: string, limit: number = 5): Product[] {
  if (!query.trim()) return []

  const queryLower = query.toLowerCase()
  const results: { product: Product; score: number }[] = []

  products.forEach(product => {
    let score = 0

    // High priority for product name matches
    if (product.name.toLowerCase().startsWith(queryLower)) {
      score += 100
    } else if (product.name.toLowerCase().includes(queryLower)) {
      score += 80
    }

    // Medium priority for tagline matches
    if (product.tagline.toLowerCase().includes(queryLower)) {
      score += 60
    }

    // Lower priority for category matches
    if (product.category.primary.toLowerCase().includes(queryLower)) {
      score += 40
    }

    // Boost highly rated products
    score += product.reviews.average_rating * 5

    if (score > 0) {
      results.push({ product, score })
    }
  })

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(result => result.product)
}

// Category mapping for color system
export function getCategoryKey(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'Cleanser': 'cleanser',
    'Serum': 'serum',
    'Moisturizer': 'moisturizer',
    'Sunscreen': 'sunscreen'
  }
  return categoryMap[category] || 'cleanser'
}

// Variant utility functions
export function getDefaultVariant(product: Product): ProductVariant | null {
  return product.variants ? product.variants[0] : null
}

export function getVariantBySku(product: Product, sku: string): ProductVariant | null {
  return product.variants?.find(variant => variant.sku === sku) || null
}

export function getVariantBySize(product: Product, size: string): ProductVariant | null {
  return product.variants?.find(variant => variant.size === size) || null
}

export function getProductPrice(product: Product, variantSku?: string): {
  mrp: number
  selling_price: number
  discount_percentage: number
} {
  if (variantSku && product.variants) {
    const variant = getVariantBySku(product, variantSku)
    if (variant) {
      return variant.price
    }
  }
  
  // Fallback to default variant or product pricing
  const defaultVariant = getDefaultVariant(product)
  if (defaultVariant) {
    return defaultVariant.price
  }
  
  return product.pricing
}

export function getAvailableSizes(product: Product): string[] {
  if (product.variants) {
    return product.variants.map(variant => variant.size)
  }
  return [product.size]
}

export function isProductInStock(product: Product, variantSku?: string): boolean {
  if (variantSku && product.variants) {
    const variant = getVariantBySku(product, variantSku)
    return variant ? variant.inventory.status === 'in_stock' && variant.inventory.stock_quantity > 0 : false
  }
  
  const defaultVariant = getDefaultVariant(product)
  if (defaultVariant) {
    return defaultVariant.inventory.status === 'in_stock' && defaultVariant.inventory.stock_quantity > 0
  }
  
  return product.inventory.status === 'in_stock' && product.inventory.stock_quantity > 0
}
