// Glow homepage.
//
// A single-product storefront read as one continuous scroll: the bottle
// opening, then the story, the product, the flavour, what it is for, what is
// actually in it, the daily ritual, reviews, and two chances to buy.

"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { Hero } from "@/components/hero";
import { BadgeStrip } from "@/components/sections/badge-strip";
import { TheGlow } from "@/components/sections/the-glow";
import { TheProduct } from "@/components/sections/the-product";
import { PassionFruit } from "@/components/sections/passion-fruit";
import { Benefits } from "@/components/sections/benefits";
import { Ingredients } from "@/components/sections/ingredients";
import { TheRitual } from "@/components/sections/the-ritual";
import { ProductCta } from "@/components/sections/product-cta";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { AllergenNotice } from "@/components/allergen-notice";
import { semantic } from "@/styles/tokens";

export default function GlowHome() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />
      <main>
        <Hero />
        <BadgeStrip />
        <TheGlow />
        <TheProduct />
        <PassionFruit />
        <Benefits />
        <Ingredients />
        <TheRitual />
        <ProductCta />
        <Faq />
        <FinalCta />
      </main>
      <div className="px-6 py-10">
        <AllergenNotice className="max-w-3xl mx-auto" />
      </div>
      <Footer />
    </div>
  );
}
