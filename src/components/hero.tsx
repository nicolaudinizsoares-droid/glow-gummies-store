// Hero.
//
// The first screen has one job: say what this is and give the visitor
// somewhere to go. So the headline, the proposition and both calls to action
// are on screen the moment the page paints -- no scrolling required, and
// nothing that depends on JavaScript having run.
//
// It replaces a three-viewport scroll sequence that opened the bottle. That
// version looked good in isolation but read badly as a shop front: a visitor
// landed on a bottle floating on a gradient with no words anywhere, and had to
// scroll roughly two and a half screens before the headline and the Shop
// button resolved -- long after most people decide whether to stay.
//
// The photograph is the real product, which is also why the composited
// cap-and-body layers are gone: they only existed so the cap could lift away.

import Link from "next/link";
import type { CSSProperties } from "react";

import { PRODUCT_ASSETS } from "@/lib/product-assets";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { semantic } from "@/styles/tokens";

const SLUG = "hair-skin-nails-gummies-passion-fruit";

const CTA_BASE =
  "w-full sm:w-auto px-8 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold text-center whitespace-nowrap";

/**
 * Stagger step for the copy's entrance. The animation itself is the .hero-rise
 * class in globals.css; this only sets when each element starts.
 */
const rise = (delay: number) =>
  ({ style: { "--hero-delay": `${delay}s` } as CSSProperties });

export const Hero = () => {
  // Price, count and duration come from the product data, never from a string
  // typed here -- the whole point of the data file is that the site cannot
  // quote a figure the packaging does not.
  const product = getProductBySlug(SLUG);

  return (
    <section
      className="relative grid lg:grid-cols-2 lg:min-h-[calc(100vh-5rem)]"
      aria-label="Glow Gummies"
    >
      {/* Photograph. Second in the source order so the headline is what a
          screen reader and a search engine reach first, but painted first on
          mobile via order-1.

          Two beats shot on the same set dissolve into one another under a slow
          push-in -- see .hero-frame in globals.css. Plain <picture> rather than
          next/image because the two crops are art direction, not resolutions:
          a CSS-hidden <img> still downloads, so the next/image version fetched
          both the tall and the wide crop on every device. With media on the
          <source>, each device fetches one. */}
      <div className="hero-frame relative order-1 lg:order-2 aspect-[6/5] lg:aspect-auto lg:min-h-[calc(100vh-5rem)] overflow-hidden">
        <picture>
          <source media="(min-width: 1024px)" srcSet={PRODUCT_ASSETS.hero} />
          <img
            src={PRODUCT_ASSETS.heroMobile}
            alt="A bottle of Glow Hair, Skin & Nails gummies on marble, beside a halved passion fruit"
            fetchPriority="high"
            className="hero-beat-a absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <picture>
          <source media="(min-width: 1024px)" srcSet={PRODUCT_ASSETS.hero2} />
          <img
            src={PRODUCT_ASSETS.hero2Mobile}
            alt=""
            aria-hidden="true"
            fetchPriority="low"
            className="hero-beat-b absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </div>

      {/* Copy */}
      <div
        className="order-2 lg:order-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-20 py-14 md:py-16 lg:py-20"
        style={{ backgroundColor: semantic.surface.page }}
      >
        <div className="max-w-xl lg:ml-auto lg:mr-0 w-full">
          <p className="hero-rise eyebrow mb-5" {...rise(0)}>
            Hair, Skin &amp; Nails
          </p>

          <h1
            {...rise(0.08)}
            className="hero-rise text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.04] mb-5"
            style={{ color: semantic.text.primary }}
          >
            Glow from within.
          </h1>

          <p
            {...rise(0.16)}
            className="hero-rise text-base md:text-lg leading-relaxed mb-8 max-w-md"
            style={{ color: semantic.text.secondary }}
          >
            A daily beauty supplement for your hair, skin and nails — in a
            passion fruit gummy you will actually look forward to. Two a day,
            and the rest of your day is yours.
          </p>

          <div
            {...rise(0.24)}
            className="hero-rise flex flex-col sm:flex-row gap-3 mb-10"
          >
            <Link
              href={`/products/${SLUG}`}
              className={`${CTA_BASE} transition-opacity hover:opacity-90`}
              style={{
                backgroundColor: semantic.text.primary,
                color: semantic.text.inverse,
              }}
            >
              Shop{product ? ` — ${formatPrice(product.pricing.selling_price)}` : ""}
            </Link>
            <Link
              href="#the-glow"
              className={`${CTA_BASE} border transition-colors`}
              style={{
                borderColor: semantic.text.primary,
                color: semantic.text.primary,
              }}
            >
              Discover More
            </Link>
          </div>

          <p
            {...rise(0.32)}
            className="hero-rise text-xs tracking-[0.1em] uppercase"
            style={{ color: semantic.text.muted }}
          >
            {product
              ? `${product.size} · ${product.serving.per_container} days · Free shipping`
              : "Free shipping"}
          </p>
        </div>
      </div>
    </section>
  );
};
