// Shopify Buy Button, on its own page.
//
// Deliberately separate from /checkout. That route takes payment through
// Stripe and keeps the customer on this site; this one hands the sale to
// Shopify. Two buy paths on one page would mean two carts that cannot see each
// other, and a customer adding to one while looking at a total from the other.
// Kept apart, each is coherent, and whichever proves out can absorb the other.

import type { Metadata } from "next";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { AllergenNotice } from "@/components/allergen-notice";
import { ShopifyBuyButton } from "@/components/shopify-buy-button";
import { semantic } from "@/styles/tokens";

export const metadata: Metadata = {
  title: "Buy Glow Gummies",
  description: "Order Glow Hair, Skin & Nails Gummies — passion fruit, 60 gummies.",
};

export default function BuyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />

      <main className="flex-1 px-6 md:px-8 pt-32 md:pt-40 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-[clamp(2rem,4vw,3rem)] mb-4"
            style={{ color: semantic.text.primary }}
          >
            Buy Glow Gummies
          </h1>

          <p
            className="text-sm leading-relaxed mb-10 max-w-prose"
            style={{ color: semantic.text.secondary }}
          >
            Hair, skin and nails support in a passion fruit gummy. Add to your
            basket below and you will be taken to our secure checkout to pay.
          </p>

          <div
            className="p-7 md:p-9"
            style={{
              backgroundColor: semantic.surface.raised,
              border: `1px solid ${semantic.border.subtle}`,
            }}
          >
            <ShopifyBuyButton />
          </div>

          <AllergenNotice className="mt-8" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
