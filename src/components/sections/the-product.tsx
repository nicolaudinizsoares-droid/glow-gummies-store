// Section 03 - The Product.

import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ProductImage } from "@/components/product-image";
import { PRODUCT_ASSETS } from "@/lib/product-assets";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { semantic } from "@/styles/tokens";

const product = products[0];

export const TheProduct = () => (
  <section
    className="px-6 md:px-8 py-24 md:py-32"
    style={{ backgroundColor: semantic.surface.sunken }}
  >
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-center">
      <Reveal className="order-2 md:order-1" stagger>
        <p data-reveal-item className="eyebrow mb-6">
          The Product
        </p>
        <h2
          data-reveal-item
          className="text-[clamp(2rem,4vw,3.25rem)] mb-6"
          style={{ color: semantic.text.primary }}
        >
          Hair. Skin. Nails.
          <br />
          One daily ritual.
        </h2>
        <p
          data-reveal-item
          className="text-lg leading-relaxed mb-8"
          style={{ color: semantic.text.secondary }}
        >
          {product.short_description}
        </p>

        <dl data-reveal-item className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10">
          {[
            ["Flavour", product.flavor],
            ["Serving", product.serving.size],
            ["Per bottle", `${product.serving.gummy_count} gummies`],
            ["Lasts", `${product.serving.per_container} days`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt
                className="text-xs uppercase tracking-[0.15em] mb-1"
                style={{ color: semantic.text.muted }}
              >
                {label}
              </dt>
              <dd className="text-sm font-medium" style={{ color: semantic.text.primary }}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div data-reveal-item className="flex items-baseline gap-3 mb-6">
          <span
            className="font-[family-name:var(--font-playfair)] text-4xl"
            style={{ color: semantic.text.primary }}
          >
            {formatPrice(product.pricing.selling_price)}
          </span>
        </div>

        <Link
          data-reveal-item
          href={`/products/${product.slug}`}
          className="inline-block px-9 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: semantic.text.primary,
            color: semantic.text.inverse,
          }}
        >
          Shop Glow Gummies
        </Link>
      </Reveal>

      <Reveal className="order-1 md:order-2" distance={40}>
        <div className="relative aspect-[4/5] w-full max-w-[440px] mx-auto overflow-hidden">
          <ProductImage
            src={PRODUCT_ASSETS.photos.skin}
            alt="Skin in soft daylight"
            width={1200}
            height={1500}
            className="h-full w-full object-cover"
          />
        </div>
      </Reveal>
    </div>
  </section>
);
