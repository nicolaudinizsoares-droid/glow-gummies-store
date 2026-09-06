import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/website-layouts";
import { semantic } from "@/styles/tokens";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: semantic.surface.page }}>
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-6 pt-16 md:pt-20">
        <div className="text-center py-24">
          <p className="eyebrow mb-5">404</p>
          <h1
            className="text-[clamp(2rem,4vw,3rem)] mb-4"
            style={{ color: semantic.text.primary }}
          >
            We could not find that.
          </h1>
          <p className="text-lg mb-9" style={{ color: semantic.text.secondary }}>
            The product you are looking for does not exist, or has moved.
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold"
            style={{ backgroundColor: semantic.text.primary, color: semantic.text.inverse }}
          >
            Shop Glow Gummies
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
