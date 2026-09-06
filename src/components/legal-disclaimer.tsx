// FDA disclaimer required alongside structure/function claims on a dietary
// supplement. Glow's own poster carries it; it must appear anywhere the site
// makes hair/skin/nail claims.

import { colors } from "@/styles/colors";
import { products } from "@/lib/products";

export const FDA_DISCLAIMER =
  products[0]?.disclaimer ??
  "*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.";

export const LegalDisclaimer = ({
  className = "",
  bordered = true,
}: {
  className?: string;
  bordered?: boolean;
}) => (
  <p
    className={`text-xs leading-relaxed text-center max-w-3xl mx-auto ${
      bordered ? "border rounded-md px-4 py-3" : ""
    } ${className}`}
    style={{
      color: colors.text.secondary,
      borderColor: bordered ? colors.surfaces.border : undefined,
    }}
  >
    {FDA_DISCLAIMER}
  </p>
);
