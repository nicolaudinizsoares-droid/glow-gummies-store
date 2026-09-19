// 404.
//
// Next.js ships a bare black-on-white "404 | This page could not be found"
// when this file is absent. A visitor who mistypes a URL or follows a stale
// link lands somewhere that looks nothing like the shop and offers no way back
// into it, which is a strange place to lose a customer.
//
// So it is a Glow page: the navigation they arrived with, the footer, and two
// routes onward -- the product, which is what most people are looking for, and
// the home page.

import type { Metadata } from "next";
import Link from "next/link";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { semantic } from "@/styles/tokens";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 has nothing worth indexing, and every one of them indexed is a
  // search result that disappoints whoever clicks it.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />

      <main className="flex-1 px-6 md:px-8 pt-32 md:pt-40 pb-16 flex items-center">
        <div className="max-w-xl mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-5"
            style={{ color: semantic.text.muted }}
          >
            Error 404
          </p>

          <h1
            className="text-[clamp(2rem,4vw,3rem)] mb-5"
            style={{ color: semantic.text.primary }}
          >
            We could not find that page
          </h1>

          <p className="text-base leading-relaxed mb-10" style={{ color: semantic.text.secondary }}>
            The link may be out of date, or the address slightly off. Nothing is
            broken — the page simply is not here.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="inline-block px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
            >
              Shop Glow Gummies
            </Link>
            <Link
              href="/"
              className="inline-block px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
              style={{
                border: `1px solid ${semantic.border.strong}`,
                color: semantic.text.primary,
              }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
