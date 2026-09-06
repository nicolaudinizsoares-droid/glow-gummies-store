// Section 09 - Product CTA.

"use client";

import { Reveal } from "@/components/reveal";
import { ProductImage } from "@/components/product-image";
import { PRODUCT_ASSETS } from "@/lib/product-assets";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/hooks/useCart";
import { semantic } from "@/styles/tokens";

const product = products[0];

export const ProductCta = () => {
  const { addToCart } = useCart();

  return (
    <section className="px-6 md:px-8 py-24 md:py-32">
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-12 items-center">
        <Reveal distance={36}>
          <ProductImage
            src={PRODUCT_ASSETS.bottle}
            alt={product.name}
            width={760}
            height={1470}
            className="w-full max-w-[215px] mx-auto h-auto drop-shadow-[0_24px_40px_rgba(10,29,54,0.14)]"
          />
        </Reveal>

        <Reveal stagger>
          <h2
            data-reveal-item
            className="text-[clamp(2rem,4vw,3.25rem)] mb-5"
            style={{ color: semantic.text.primary }}
          >
            Ready to glow?
          </h2>
          <p
            data-reveal-item
            className="text-base leading-relaxed mb-7"
            style={{ color: semantic.text.secondary }}
          >
            {product.serving.gummy_count} gummies · {product.serving.per_container}{" "}
            days · {product.flavor}
          </p>
          <div data-reveal-item className="flex items-baseline gap-3 mb-7">
            <span
              className="font-[family-name:var(--font-playfair)] text-4xl"
              style={{ color: semantic.text.primary }}
            >
              {formatPrice(product.pricing.selling_price)}
            </span>
            <span className="text-base line-through" style={{ color: semantic.text.muted }}>
              {formatPrice(product.pricing.mrp)}
            </span>
          </div>
          <button
            data-reveal-item
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.pricing.selling_price,
                image: product.images.primary,
                category: product.category.primary,
                size: product.size,
                sku: product.sku,
              })
            }
            className="w-full sm:w-auto px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: semantic.text.primary,
              color: semantic.text.inverse,
            }}
          >
            Shop Glow Gummies
          </button>
        </Reveal>
      </div>
    </section>
  );
};
