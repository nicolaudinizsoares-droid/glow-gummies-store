// Site footer.

"use client";

import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

import { GlowLogo } from "@/components/glow-logo";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { semantic } from "@/styles/tokens";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { name: "Hair, Skin & Nails", href: "/products/hair-skin-nails-gummies-passion-fruit" },
      { name: "All products", href: "/products" },
      { name: "Ingredients", href: "/ingredients" },
    ],
  },
  {
    heading: "Glow",
    links: [
      { name: "Our Story", href: "/our-story" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Help",
    links: [
      { name: "Shipping", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  },
];

export const Footer = () => (
  <footer
    className="px-6 md:px-8 pt-16 pb-10"
    style={{
      backgroundColor: semantic.surface.sunken,
      borderTop: `1px solid ${semantic.border.subtle}`,
    }}
  >
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        <div className="col-span-2 md:col-span-1">
          <GlowLogo size={26} />
          <p
            className="text-sm mt-4 max-w-[24ch]"
            style={{ color: semantic.text.secondary }}
          >
            Daily beauty gummies for hair, skin and nails.
          </p>
          <div className="flex gap-2 mt-5">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Facebook, label: "Facebook" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={`Glow on ${label}`}
                className="p-2.5 rounded-full transition-colors hover:bg-black/5"
              >
                <Icon className="w-4 h-4" style={{ color: semantic.text.primary }} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2
              className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: semantic.text.primary }}
            >
              {column.heading}
            </h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block py-2 text-sm transition-opacity hover:opacity-60"
                    style={{ color: semantic.text.secondary }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="rule-metallic mb-8" />

      <LegalDisclaimer bordered={false} className="mb-8" />

      <p
        className="text-xs text-center"
        style={{ color: semantic.text.muted }}
      >
        © {new Date().getFullYear()} Glow. All rights reserved.
      </p>
    </div>
  </footer>
);
