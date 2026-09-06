import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product-detail";
import { getProductBySlug, products } from "@/lib/products";
import { CURRENCY } from "@/lib/currency";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found | Glow" };

  return {
    title: product.seo.meta_title,
    description: product.seo.meta_description,
    keywords: product.seo.keywords,
    openGraph: {
      title: product.seo.meta_title,
      description: product.seo.meta_description,
      type: "website",
      images: [{ url: product.images.primary, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  // Product structured data. Deliberately no aggregateRating or review
  // properties: Glow has no reviews, and emitting either without them would be
  // fabricating the exact signal search engines surface as stars.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    sku: product.sku,
    image: [product.images.primary],
    brand: { "@type": "Brand", name: "Glow" },
    offers: {
      "@type": "Offer",
      price: product.pricing.selling_price.toFixed(2),
      priceCurrency: CURRENCY,
      availability:
        product.inventory.status === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail slug={slug} />
    </>
  );
}
