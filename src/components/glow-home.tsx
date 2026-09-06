// Glow homepage - a single-product storefront.
//
// The catalogue is one SKU (Hair, Skin & Nails gummies), so this page is a
// focused landing page rather than a category grid: hero, benefits, label
// claims, dosage, and one buying decision.

"use client";

import { motion } from "framer-motion";
import { Leaf, FlaskConical, Wheat, Heart, Sparkles, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { Hero } from "@/components/hero";
import { GlowSparkle } from "@/components/glow-logo";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { colors } from "@/styles/colors";
import { formatPrice } from "@/lib/currency";
import { products } from "@/lib/products";
import { useCart } from "@/hooks/useCart";

const product = products[0];

const BENEFITS = [
  {
    title: "Stronger hair",
    copy: "Supports the hair you already have, as part of your daily routine.",
    color: colors.brand.blush,
  },
  {
    title: "Radiant skin",
    copy: "Beauty support that works from the inside out, not just on top.",
    color: colors.brand.apricot,
  },
  {
    title: "Healthy nails",
    copy: "A simple daily habit for nails that keep up with you.",
    color: colors.brand.peach,
  },
];

const BADGE_ICONS: Record<string, typeof Leaf> = {
  "Vegetarian Friendly": Leaf,
  "Non-GMO": FlaskConical,
  "Gluten Free": Wheat,
  "Made in the USA": Heart,
};

const BenefitsSection = () => (
  <section id="the-glow" className="px-4 py-20">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <h2
          className="font-[family-name:var(--font-playfair)] text-4xl mb-3"
          style={{ color: colors.brand.navy }}
        >
          One gummy a day
        </h2>
        <p style={{ color: colors.text.secondary }}>
          for the glow you deserve.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-8">
        {BENEFITS.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ backgroundColor: benefit.color + "33" }}
            >
              <GlowSparkle className="w-6 h-6" color={benefit.color} />
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: colors.brand.navy }}
            >
              {benefit.title}
              <span aria-hidden="true">*</span>
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: colors.text.secondary }}>
              {benefit.copy}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const BadgeStrip = () => (
  <section className="px-4 py-8" style={{ backgroundColor: colors.brand.blushPale }}>
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
      {product.dietary_badges.map((badge) => {
        const Icon = BADGE_ICONS[badge] ?? Sparkles;
        return (
          <div key={badge} className="flex items-center justify-center gap-3">
            <Icon className="w-5 h-5 shrink-0" style={{ color: colors.brand.navy }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.brand.navy }}
            >
              {badge}
            </span>
          </div>
        );
      })}
    </div>
  </section>
);

const HowToTakeItSection = () => (
  <section id="how-to-take-it" className="px-4 py-20">
    <div className="max-w-3xl mx-auto text-center">
      <h2
        className="font-[family-name:var(--font-playfair)] text-4xl mb-6"
        style={{ color: colors.brand.navy }}
      >
        How to take it
      </h2>
      <p className="text-lg leading-relaxed mb-8" style={{ color: colors.text.secondary }}>
        {product.serving.directions}
      </p>
      <div className="inline-flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
        {[
          `Serving size: ${product.serving.size}`,
          `${product.serving.per_container} gummies per bottle`,
          `Net weight ${product.net_weight}`,
          product.flavor,
        ].map((fact) => (
          <span key={fact} className="flex items-center gap-2" style={{ color: colors.brand.navy }}>
            <Check className="w-4 h-4" style={{ color: colors.brand.apricot }} />
            {fact}
          </span>
        ))}
      </div>
    </div>
  </section>
);

const ClosingCTA = () => {
  const { addToCart } = useCart();

  return (
    <section className="px-4 py-20" style={{ backgroundColor: colors.brand.navy }}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-white mb-4">
          Be ready to glow.
        </h2>
        <p className="text-white/70 mb-8">
          {product.name} · {product.flavor} · {product.size}
        </p>
        <Button
          size="lg"
          className="font-semibold px-10"
          style={{ backgroundColor: colors.brand.apricot, color: colors.brand.navy }}
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
        >
          Add to bag — {formatPrice(product.pricing.selling_price)}
        </Button>
      </div>
    </section>
  );
};

export default function GlowHome() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.brand.offWhite }}>
      <Navigation />
      <Hero />
      <BadgeStrip />
      <BenefitsSection />
      <HowToTakeItSection />
      <ClosingCTA />
      <div className="px-4 py-10">
        <LegalDisclaimer />
      </div>
      <Footer />
    </div>
  );
}
