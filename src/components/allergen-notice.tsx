// Allergen declaration.
//
// The Supplement Facts panel declares "Contains: Fish (Tilapia), Tree nuts
// (Coconut)". Allergen information has to be easy to find before someone buys,
// not tucked into a collapsed panel, so this renders as its own marked block
// wherever the product is sold.

import { AlertCircle } from "lucide-react";
import { colors } from "@/styles/colors";
import { products } from "@/lib/products";

export const AllergenNotice = ({ className = "" }: { className?: string }) => {
  const allergens = products[0]?.allergens ?? [];
  if (allergens.length === 0) return null;

  return (
    <div
      className={`flex gap-3 rounded-md px-4 py-3 ${className}`}
      style={{
        backgroundColor: colors.brand.creamPale,
        border: `1px solid ${colors.brand.cream}`,
      }}
      role="note"
    >
      <AlertCircle
        className="w-4 h-4 shrink-0 mt-0.5"
        style={{ color: colors.brand.berry }}
        aria-hidden="true"
      />
      <p className="text-sm leading-relaxed" style={{ color: colors.text.primary }}>
        <strong>Contains: {allergens.join(", ")}.</strong>{" "}
        <span style={{ color: colors.text.secondary }}>
          Check the full ingredient list if you have a food allergy.
        </span>
      </p>
    </div>
  );
};
