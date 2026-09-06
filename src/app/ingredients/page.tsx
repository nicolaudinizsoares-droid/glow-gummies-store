import type { Metadata } from "next";
import { PageShell, Section, NeedsReview } from "@/components/page-shell";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { AllergenNotice } from "@/components/allergen-notice";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ingredients | Glow Gummies",
  description:
    "What goes into Glow Hair, Skin & Nails gummies, and what does not.",
};

const product = products[0];

export default function IngredientsPage() {
  return (
    <PageShell
      title="Ingredients"
      intro="Everything in the bottle, printed exactly as it appears on the label."
    >
      <Section heading="Supplement Facts">
        {product.supplement_facts.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold">Nutrient</th>
                <th className="text-right py-2 font-semibold">Amount</th>
                <th className="text-right py-2 font-semibold">% Daily Value</th>
              </tr>
            </thead>
            <tbody>
              {product.supplement_facts.map((row) => (
                <tr key={row.name} className="border-b">
                  <td className="py-2">{row.name}</td>
                  <td className="py-2 text-right">{row.amount}</td>
                  <td className="py-2 text-right">{row.daily_value ?? "***"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NeedsReview>
            The Supplement Facts panel has not been transcribed yet. Send the
            values printed on the label and this table fills in automatically.
            Nothing is guessed here on purpose.
          </NeedsReview>
        )}
        {product.supplement_facts.length > 0 && (
          <ul className="text-xs space-y-1 pt-2">
            {product.supplement_facts_footnotes.map((note, i) => (
              <li key={note}>
                {"*".repeat(i + 2)} {note}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section heading="Allergens">
        <AllergenNotice />
      </Section>

      <Section heading="Serving">
        <p>
          {product.serving.directions} Each bottle contains{" "}
          {product.serving.gummy_count} gummies, which is{" "}
          {product.serving.per_container} servings.
        </p>
      </Section>

      <Section heading="What it is free from">
        <ul className="list-disc pl-5 space-y-1">
          {product.dietary_badges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
      </Section>

      <LegalDisclaimer />
    </PageShell>
  );
}
