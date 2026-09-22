// Free shipping badge.
//
// Sits beside the price, in the slot the "Save $7" flash used to hold. The
// discount was the kind of urgency that works once; free delivery on every
// order is true every time someone looks, and it is the thing most often
// abandoned over.
//
// One component rather than four copies so the four places it appears cannot
// drift apart, and so it has one place to change if shipping ever stops being
// free -- src/lib/shipping.ts is the source of truth for that, and this
// renders nothing when the mode is not "free".

import { Truck } from "lucide-react";

import { SHIPPING } from "@/lib/shipping";
import { semantic } from "@/styles/tokens";

export const FreeShippingBadge = ({ className = "" }: { className?: string }) => {
  if (SHIPPING.mode !== "free") return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] whitespace-nowrap ${className}`}
      style={{
        backgroundColor: semantic.accent.primary,
        color: semantic.text.onAccent,
      }}
    >
      <Truck className="w-3.5 h-3.5" aria-hidden="true" />
      Free shipping
    </span>
  );
};
