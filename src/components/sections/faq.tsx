// Section 10 - FAQ.
//
// Product answers come from the product data, so they cannot drift from the
// label. Shipping and returns point at the policy pages rather than stating
// terms that have not been set.

"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { products } from "@/lib/products";
import { semantic } from "@/styles/tokens";

const product = products[0];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What are Glow Gummies?",
    a: <>{product.long_description}</>,
  },
  {
    q: "How do I take them?",
    a: <>{product.serving.directions}</>,
  },
  {
    q: "What flavour are they?",
    a: (
      <>
        {product.flavor}. Each bottle holds {product.serving.gummy_count} gummies,
        which is {product.serving.per_container} servings.
      </>
    ),
  },
  {
    q: "Are they gluten free?",
    a: <>Yes. Glow is gluten free and non-GMO, and made in the USA.</>,
  },
  {
    q: "Are they vegetarian?",
    a: (
      <>
        No. The formula contains collagen sourced from fish, and the label
        declares <strong>Contains: {product.allergens.join(", ")}</strong>. Glow
        is not suitable for vegetarians or vegans, or for anyone avoiding fish
        or coconut.
      </>
    ),
  },
  {
    q: "How long does shipping take?",
    a: (
      <>
        See <Link href="/shipping" className="underline underline-offset-4">shipping information</Link>.
      </>
    ),
  },
  {
    q: "What is your return policy?",
    a: (
      <>
        See <Link href="/returns" className="underline underline-offset-4">returns</Link>.
      </>
    ),
  },
];

export const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className="px-6 md:px-8 py-24 md:py-32"
      style={{ backgroundColor: semantic.surface.sunken }}
    >
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-12" stagger>
          <p data-reveal-item className="eyebrow mb-6">
            Questions
          </p>
          <h2
            data-reveal-item
            className="text-[clamp(2rem,4vw,3.25rem)]"
            style={{ color: semantic.text.primary }}
          >
            Good to know
          </h2>
        </Reveal>

        <Reveal>
          <dl>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  style={{ borderBottom: `1px solid ${semantic.border.default}` }}
                >
                  <dt>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 py-5 text-left"
                    >
                      <span
                        className="text-base md:text-lg"
                        style={{ color: semantic.text.primary }}
                      >
                        {item.q}
                      </span>
                      {isOpen ? (
                        <Minus className="w-4 h-4 shrink-0" style={{ color: semantic.text.muted }} />
                      ) : (
                        <Plus className="w-4 h-4 shrink-0" style={{ color: semantic.text.muted }} />
                      )}
                    </button>
                  </dt>
                  {isOpen && (
                    <dd
                      className="pb-6 pr-10 text-sm leading-relaxed"
                      style={{ color: semantic.text.secondary }}
                    >
                      {item.a}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </Reveal>
      </div>
    </section>
  );
};
