// Label claims strip.
//
// Only claims that survive checking against the Supplement Facts panel appear
// here. "Vegetarian Friendly" is not among them: the panel lists Collagen
// (piscine) and declares Contains: Fish (Tilapia).

import { FlaskConical, Wheat, Heart, Sparkles } from "lucide-react";
import { products } from "@/lib/products";
import { semantic } from "@/styles/tokens";

const ICONS: Record<string, typeof Wheat> = {
  "Non-GMO": FlaskConical,
  "Gluten Free": Wheat,
  "Made in the USA": Heart,
};

export const BadgeStrip = () => (
  <section
    className="px-6 md:px-8 py-7"
    style={{
      backgroundColor: semantic.surface.tint,
      borderBlock: `1px solid ${semantic.border.subtle}`,
    }}
    aria-label="Product claims"
  >
    <ul className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
      {products[0].dietary_badges.map((badge) => {
        const Icon = ICONS[badge] ?? Sparkles;
        return (
          <li key={badge} className="flex items-center justify-center gap-2.5">
            <Icon
              className="w-4 h-4 shrink-0"
              style={{ color: semantic.accent.metallic }}
              aria-hidden="true"
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-center"
              style={{ color: semantic.text.primary }}
            >
              {badge}
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);
