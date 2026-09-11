import type { Metadata } from "next";
import Link from "next/link";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { ProductImage } from "@/components/product-image";
import { AllergenNotice } from "@/components/allergen-notice";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { semantic } from "@/styles/tokens";

export const metadata: Metadata = {
  title: "Shop | Glow",
  description:
    "Glow Hair, Skin & Nails gummies. Passion fruit flavor, 60 gummies, two a day.",
};

// One product, so this is a shop page rather than a filterable catalogue. The
// previous version carried sort controls, a search box and category filters
// for cleansers, serums, moisturizers and sunscreens -- none of which Glow
// sells. Reintroduce filtering when there is a second SKU to filter.
export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />

      <main className="flex-1 pt-16 md:pt-20">
        <header className="px-6 md:px-8 py-14" style={{ background: semantic.surface.sunken }}>
          <div className="max-w-5xl mx-auto">
            <p className="eyebrow mb-5">Shop</p>
            <h1
              className="text-[clamp(2rem,4.5vw,3.5rem)]"
              style={{ color: semantic.text.primary }}
            >
              One bottle. One ritual.
            </h1>
          </div>
        </header>

        <section className="px-6 md:px-8 py-14">
          <ul className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-10">
            {products.map((product) => (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`} className="group block">
                  <div
                    className="flex items-center justify-center p-10 mb-5 transition-transform duration-300 group-hover:scale-[1.015]"
                    style={{ background: "linear-gradient(150deg, #FFF6E6 0%, #FBE4CE 100%)" }}
                  >
                    <ProductImage
                      src={product.images.primary}
                      alt={product.name}
                      width={760}
                      height={1470}
                      className="w-full max-w-[210px] h-auto object-contain drop-shadow-[0_18px_30px_rgba(10,29,54,0.14)]"
                    />
                  </div>
                  <h2 className="text-xl mb-1.5" style={{ color: semantic.text.primary }}>
                    {product.name}
                  </h2>
                  <p className="text-sm mb-3" style={{ color: semantic.text.secondary }}>
                    {product.flavor} · {product.serving.gummy_count} gummies ·{" "}
                    {product.serving.per_container} days
                  </p>
                  <p className="flex items-baseline gap-2">
                    <span
                      className="font-[family-name:var(--font-playfair)] text-2xl"
                      style={{ color: semantic.text.primary }}
                    >
                      {formatPrice(product.pricing.selling_price)}
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="max-w-3xl mx-auto mt-14">
            <AllergenNotice />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
