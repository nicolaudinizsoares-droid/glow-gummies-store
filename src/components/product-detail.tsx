// Product detail.
//
// Everything factual on this page reads from the product data, which is
// transcribed from the printed label, so the page cannot drift from the
// packaging. Nothing here is invented: no ratings, no customer counts, no
// scarcity, and no claims beyond the label's own.

"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Check, Truck, RotateCcw, ShieldCheck } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { ProductImage } from "@/components/product-image";
import { AllergenNotice } from "@/components/allergen-notice";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { PRODUCT_ASSETS } from "@/lib/product-assets";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/hooks/useCart";
import { semantic } from "@/styles/tokens";

const GALLERY = [
  { src: PRODUCT_ASSETS.bottle, label: "Bottle" },
  { src: PRODUCT_ASSETS.bottleBody, label: "Open" },
  { src: PRODUCT_ASSETS.lifestyle, label: "Passion fruit" },
];

export const ProductDetail = ({ slug }: { slug: string }) => {
  const product = getProductBySlug(slug);
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [active, setActive] = useState(0);

  if (!product) return null;

  const price = product.pricing.selling_price;
  const saving = product.pricing.mrp - price;

  const add = () =>
    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.images.primary,
      category: product.category.primary,
      size: product.size,
      sku: product.sku,
      quantity,
    });

  return (
    <div className="min-h-screen" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />

      <main className="pt-16 md:pt-20">
        {/* Breadcrumb */}
        <nav className="px-6 md:px-8 pt-6" aria-label="Breadcrumb">
          <ol className="max-w-6xl mx-auto flex gap-2 text-xs" style={{ color: semantic.text.muted }}>
            <li><Link href="/" className="inline-block py-2 hover:underline">Home</Link></li>
            <li aria-hidden="true" className="py-2">/</li>
            <li><Link href="/products" className="inline-block py-2 hover:underline">Shop</Link></li>
            <li aria-hidden="true" className="py-2">/</li>
            <li className="py-2" style={{ color: semantic.text.primary }}>{product.name}</li>
          </ol>
        </nav>

        {/* Buy panel */}
        <section className="px-6 md:px-8 py-10 md:py-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <div>
              <div
                className="flex items-center justify-center p-8 md:p-12"
                style={{ background: "linear-gradient(150deg, #FFF6E6 0%, #FBE4CE 100%)" }}
              >
                <ProductImage
                  src={GALLERY[active].src}
                  alt={`${product.name} — ${GALLERY[active].label}`}
                  width={760}
                  height={1470}
                  priority
                  className="w-full max-w-[300px] h-auto object-contain drop-shadow-[0_24px_40px_rgba(10,29,54,0.16)]"
                />
              </div>
              <div className="flex gap-3 mt-3">
                {GALLERY.map((shot, i) => (
                  <button
                    key={shot.label}
                    onClick={() => setActive(i)}
                    aria-label={`View ${shot.label}`}
                    aria-current={i === active}
                    className="flex-1 p-3 transition-colors"
                    style={{
                      backgroundColor: semantic.surface.raised,
                      border: `1px solid ${i === active ? semantic.border.strong : semantic.border.subtle}`,
                    }}
                  >
                    <ProductImage
                      src={shot.src}
                      alt=""
                      width={200}
                      height={200}
                      className="h-14 w-auto mx-auto object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Buy box */}
            <div>
              <p className="eyebrow mb-4">{product.category.primary}</p>
              <h1
                className="text-[clamp(2rem,4vw,3rem)] leading-[1.08] mb-4"
                style={{ color: semantic.text.primary }}
              >
                {product.name}
              </h1>
              <p className="text-lg mb-7" style={{ color: semantic.text.secondary }}>
                {product.short_description}
              </p>

              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="font-[family-name:var(--font-playfair)] text-4xl"
                  style={{ color: semantic.text.primary }}
                >
                  {formatPrice(price)}
                </span>
                <span className="text-base line-through" style={{ color: semantic.text.muted }}>
                  {formatPrice(product.pricing.mrp)}
                </span>
                <span
                  className="text-xs font-semibold uppercase tracking-[0.12em] px-2 py-1"
                  style={{ backgroundColor: semantic.accent.primary, color: semantic.text.onAccent }}
                >
                  Save {formatPrice(saving)}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: semantic.text.muted }}>
                {product.flavor} · {product.serving.gummy_count} gummies ·{" "}
                {product.serving.per_container} days
              </p>
              <p
                className="flex items-center gap-1.5 text-sm mb-8"
                style={{ color: semantic.text.primary }}
              >
                <Truck className="w-4 h-4" style={{ color: semantic.accent.metallic }} />
                Free shipping
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-5">
                <span
                  className="text-xs uppercase tracking-[0.15em]"
                  style={{ color: semantic.text.muted }}
                >
                  Quantity
                </span>
                <div className="flex items-center" style={{ border: `1px solid ${semantic.border.default}` }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="px-3 py-2.5 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                    className="px-3 py-2.5 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-7">
                <button
                  onClick={add}
                  className="w-full py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
                >
                  Add to cart — {formatPrice(price * quantity)}
                </button>
                <button
                  onClick={() => {
                    add();
                    openCart();
                  }}
                  className="w-full py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold border transition-colors"
                  style={{ borderColor: semantic.text.primary, color: semantic.text.primary }}
                >
                  Buy now
                </button>
              </div>

              <ul className="space-y-2.5 mb-7">
                {product.dietary_badges.map((badge) => (
                  <li key={badge} className="flex items-center gap-2.5 text-sm" style={{ color: semantic.text.secondary }}>
                    <Check className="w-4 h-4 shrink-0" style={{ color: semantic.accent.metallic }} />
                    {badge}
                  </li>
                ))}
              </ul>

              <AllergenNotice />
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="px-6 md:px-8 py-16" style={{ backgroundColor: semantic.surface.sunken }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl mb-4" style={{ color: semantic.text.primary }}>
              How to take it
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: semantic.text.secondary }}>
              {product.serving.directions}
            </p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                ["Serving", product.serving.size],
                ["Per bottle", `${product.serving.gummy_count} gummies`],
                ["Servings", String(product.serving.per_container)],
                ["Net weight", product.net_weight],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-[0.15em] mb-1" style={{ color: semantic.text.muted }}>
                    {k}
                  </dt>
                  <dd className="text-sm font-medium" style={{ color: semantic.text.primary }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Supplement Facts */}
        <section className="px-6 md:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl mb-1" style={{ color: semantic.text.primary }}>
              Supplement Facts
            </h2>
            <p className="text-sm mb-6" style={{ color: semantic.text.secondary }}>
              Serving size {product.serving.size} · {product.serving.per_container} servings per container
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[420px]">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${semantic.text.primary}` }}>
                    <th className="text-left py-2 font-semibold">Amount per serving</th>
                    <th className="text-right py-2" />
                    <th className="text-right py-2 font-semibold">%DV</th>
                  </tr>
                </thead>
                <tbody>
                  {product.supplement_facts.map((row) => (
                    <tr key={row.name} style={{ borderBottom: `1px solid ${semantic.border.subtle}` }}>
                      <td className="py-2" style={{ color: semantic.text.primary }}>{row.name}</td>
                      <td className="py-2 text-right tabular-nums" style={{ color: semantic.text.secondary }}>{row.amount}</td>
                      <td className="py-2 text-right tabular-nums" style={{ color: semantic.text.secondary }}>{row.daily_value ?? "***"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="text-xs space-y-1 mt-4" style={{ color: semantic.text.muted }}>
              {product.supplement_facts_footnotes.map((note, i) => (
                <li key={note}>{"*".repeat(i + 2)} {note}</li>
              ))}
            </ul>
            <AllergenNotice className="mt-6" />
            <div className="mt-8">
              <LegalDisclaimer />
            </div>
          </div>
        </section>

        {/* Shipping & returns */}
        <section className="px-6 md:px-8 py-16" style={{ backgroundColor: semantic.surface.sunken }}>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
            {[
              { Icon: Truck, title: "Free shipping", copy: "On every order, no minimum.", href: "/shipping", cta: "Shipping details" },
              { Icon: RotateCcw, title: "Returns", copy: "If Glow is not right for you.", href: "/returns", cta: "Return policy" },
              { Icon: ShieldCheck, title: "Questions", copy: "Ingredients, dosage and diet.", href: "/faq", cta: "Read the FAQ" },
            ].map(({ Icon, title, copy, href, cta }) => (
              <div key={title}>
                <Icon className="w-5 h-5 mb-3" style={{ color: semantic.accent.metallic }} />
                <h3 className="text-base font-semibold mb-1.5" style={{ color: semantic.text.primary }}>{title}</h3>
                <p className="text-sm mb-1" style={{ color: semantic.text.secondary }}>{copy}</p>
                <Link
                  href={href}
                  className="inline-block py-2 text-sm underline underline-offset-4"
                  style={{ color: semantic.text.primary }}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky purchase bar, mobile only */}
      <div
        className="md:hidden sticky bottom-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{
          backgroundColor: semantic.surface.raised,
          borderTop: `1px solid ${semantic.border.default}`,
        }}
      >
        <div className="shrink-0">
          <p className="text-base font-semibold leading-none" style={{ color: semantic.text.primary }}>
            {formatPrice(price * quantity)}
          </p>
          <p className="text-xs mt-1" style={{ color: semantic.text.muted }}>
            {quantity} × {product.serving.gummy_count} gummies
          </p>
        </div>
        <button
          onClick={add}
          className="flex-1 py-3.5 text-[0.75rem] tracking-[0.16em] uppercase font-semibold"
          style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
        >
          Add to cart
        </button>
      </div>

      <Footer />
    </div>
  );
};
