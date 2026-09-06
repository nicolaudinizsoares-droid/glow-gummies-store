// Section 06 - Ingredients.
//
// Every figure is transcribed from the printed Supplement Facts panel. The
// highlighted actives are pulled from that same data, so nothing here can
// drift from the label.

import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { AllergenNotice } from "@/components/allergen-notice";
import { products } from "@/lib/products";
import { semantic } from "@/styles/tokens";

const product = products[0];

/** The actives worth surfacing, taken straight from the panel rows. */
const HIGHLIGHT = ["Biotin", "Vitamin C (as ascorbic acid)", "Collagen (piscine)", "Zinc (as zinc citrate)"];

export const Ingredients = () => {
  const highlights = product.supplement_facts.filter((row) =>
    HIGHLIGHT.includes(row.name)
  );

  return (
    <section
      className="px-6 md:px-8 py-24 md:py-32"
      style={{ backgroundColor: semantic.surface.sunken }}
    >
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14" stagger>
          <p data-reveal-item className="eyebrow mb-6">
            Ingredients
          </p>
          <h2
            data-reveal-item
            className="text-[clamp(2rem,4vw,3.25rem)] mb-5"
            style={{ color: semantic.text.primary }}
          >
            Nothing hidden.
          </h2>
          <p
            data-reveal-item
            className="text-lg"
            style={{ color: semantic.text.secondary }}
          >
            Exactly what the label says, printed here in full.
          </p>
        </Reveal>

        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14" stagger>
          {highlights.map((row) => (
            <div
              key={row.name}
              data-reveal-item
              className="p-5 text-center"
              style={{
                backgroundColor: semantic.surface.raised,
                border: `1px solid ${semantic.border.subtle}`,
              }}
            >
              <p
                className="font-[family-name:var(--font-playfair)] text-2xl mb-1"
                style={{ color: semantic.text.primary }}
              >
                {row.amount}
              </p>
              <p
                className="text-xs uppercase tracking-[0.12em]"
                style={{ color: semantic.text.muted }}
              >
                {row.name.replace(/\s*\(.*\)$/, "")}
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal>
          <div
            style={{
              backgroundColor: semantic.surface.raised,
              border: `1px solid ${semantic.border.subtle}`,
            }}
            className="p-6 md:p-8"
          >
            <h3
              className="text-xl mb-1"
              style={{ color: semantic.text.primary }}
            >
              Supplement Facts
            </h3>
            <p className="text-sm mb-6" style={{ color: semantic.text.secondary }}>
              Serving size {product.serving.size} · {product.serving.per_container}{" "}
              servings per container
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[420px]">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${semantic.text.primary}` }}>
                    <th className="text-left py-2 font-semibold">Amount per serving</th>
                    <th className="text-right py-2 font-semibold" />
                    <th className="text-right py-2 font-semibold">%DV</th>
                  </tr>
                </thead>
                <tbody>
                  {product.supplement_facts.map((row) => (
                    <tr
                      key={row.name}
                      style={{ borderBottom: `1px solid ${semantic.border.subtle}` }}
                    >
                      <td className="py-2" style={{ color: semantic.text.primary }}>
                        {row.name}
                      </td>
                      <td className="py-2 text-right tabular-nums" style={{ color: semantic.text.secondary }}>
                        {row.amount}
                      </td>
                      <td className="py-2 text-right tabular-nums" style={{ color: semantic.text.secondary }}>
                        {row.daily_value ?? "***"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="text-xs space-y-1 mt-4" style={{ color: semantic.text.muted }}>
              {product.supplement_facts_footnotes.map((note, i) => (
                <li key={note}>
                  {"*".repeat(i + 2)} {note}
                </li>
              ))}
            </ul>

            <AllergenNotice className="mt-6" />

            <Link
              href="/ingredients"
              className="inline-block mt-5 py-2 text-sm underline underline-offset-4"
              style={{ color: semantic.text.primary }}
            >
              Full ingredient information
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
