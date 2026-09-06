import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = [
  "", "/products", "/our-story", "/ingredients", "/faq",
  "/contact", "/shipping", "/returns", "/privacy", "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
