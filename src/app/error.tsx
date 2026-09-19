// The page shown when rendering throws.
//
// Distinct from not-found.tsx: that is a page which does not exist, this is a
// page which exists and broke. Without it Next.js shows its own unstyled
// screen, and in production it says nothing at all -- the customer is left
// looking at a blank slab with no way onward.
//
// Must be a client component; React needs it to catch the error below it.

"use client";

import { useEffect } from "react";
import Link from "next/link";

import { semantic } from "@/styles/tokens";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only handle on this crash in the hosting logs; the
    // customer sees a sentence, whoever is on call gets the identifier.
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: semantic.surface.page }}
    >
      <div className="max-w-md text-center">
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] mb-4" style={{ color: semantic.text.primary }}>
          Something went wrong
        </h1>

        <p className="text-base leading-relaxed mb-8" style={{ color: semantic.text.secondary }}>
          That page failed to load. Nothing has been charged and nothing is
          lost — try again, or head back to the shop.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-block px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
            style={{ border: `1px solid ${semantic.border.strong}`, color: semantic.text.primary }}
          >
            Back to home
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs mt-8" style={{ color: semantic.text.muted }}>
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
