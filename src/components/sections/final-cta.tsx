// Section 11 - Final CTA.

import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ProductImage } from "@/components/product-image";
import { PRODUCT_ASSETS } from "@/lib/product-assets";
import { products } from "@/lib/products";
import { semantic } from "@/styles/tokens";

const product = products[0];

export const FinalCta = () => (
  <section
    className="relative px-6 md:px-8 py-28 md:py-40 overflow-hidden"
    style={{ backgroundColor: semantic.surface.inverse }}
  >
    <Reveal className="relative max-w-3xl mx-auto text-center" stagger>
      <div data-reveal-item className="mb-10">
        <div className="relative aspect-[4/5] w-full max-w-[260px] mx-auto overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
          <ProductImage
            src={PRODUCT_ASSETS.photos.open}
            alt={product.name}
            width={1200}
            height={1500}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <h2
        data-reveal-item
        className="text-[clamp(2.25rem,5.5vw,4.5rem)] mb-7 text-white"
      >
        Your glow starts here.
      </h2>
      <Link
        data-reveal-item
        href={`/products/${product.slug}`}
        className="inline-block px-12 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
        style={{
          backgroundColor: semantic.accent.primary,
          color: semantic.text.onAccent,
        }}
      >
        Shop Now
      </Link>
    </Reveal>
  </section>
);
