// Site navigation.
//
// Minimal and sticky. Transparent over the hero, then settling onto an opaque
// surface as the page scrolls, so the product stays the focus at the top
// without the nav ever becoming unreadable further down.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";

import { GlowLogo } from "@/components/glow-logo";
import { useCart } from "@/hooks/useCart";
import { semantic, component } from "@/styles/tokens";

const NAV_LINKS = [
  { name: "Shop", href: "/products" },
  { name: "Our Story", href: "/our-story" },
  { name: "Ingredients", href: "/ingredients" },
  { name: "FAQ", href: "/faq" },
];

export const Navigation = () => {
  const { itemCount, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: scrolled
          ? component.nav.backgroundScrolled
          : component.nav.background,
        backdropFilter: "saturate(150%) blur(12px)",
        WebkitBackdropFilter: "saturate(150%) blur(12px)",
        borderBottom: `1px solid ${
          scrolled ? component.nav.border : "transparent"
        }`,
      }}
    >
      <nav
        className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between"
        aria-label="Main"
      >
        <Link href="/" aria-label="Glow home" className="shrink-0 py-2 -my-2">
          <GlowLogo size={28} />
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-[0.8125rem] tracking-[0.08em] uppercase font-medium relative group"
                style={{ color: semantic.text.primary }}
              >
                {link.name}
                <span
                  className="absolute -bottom-1.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: semantic.accent.metallic }}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleCart}
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className="relative p-2.5 rounded-full transition-colors hover:bg-black/5"
          >
            <ShoppingBag
              className="w-[18px] h-[18px]"
              style={{ color: semantic.text.primary }}
            />
            {itemCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 text-[10px] font-semibold rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: semantic.accent.primary,
                  color: semantic.text.onAccent,
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="md:hidden p-2.5 rounded-full transition-colors hover:bg-black/5"
          >
            {mobileOpen ? (
              <X className="w-[18px] h-[18px]" style={{ color: semantic.text.primary }} />
            ) : (
              <Menu className="w-[18px] h-[18px]" style={{ color: semantic.text.primary }} />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: semantic.surface.page,
              borderTop: `1px solid ${semantic.border.subtle}`,
            }}
          >
            <ul className="px-5 py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-sm tracking-[0.08em] uppercase font-medium"
                    style={{
                      color: semantic.text.primary,
                      borderBottom: `1px solid ${semantic.border.subtle}`,
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
