import type { Metadata } from "next";
import { PageShell, Section, NeedsReview } from "@/components/page-shell";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { AllergenNotice } from "@/components/allergen-notice";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "FAQ | Glow",
  description: "Common questions about Glow Hair, Skin & Nails gummies.",
};

const product = products[0];

export default function FaqPage() {
  return (
    <PageShell title="Frequently asked questions" intro="Everything about taking Glow.">
      <Section heading="How many gummies do I take?">
        <p>{product.serving.directions}</p>
      </Section>

      <Section heading="How long does one bottle last?">
        <p>
          Each bottle holds {product.serving.gummy_count} gummies. At a serving
          size of {product.serving.size} per day, that is{" "}
          {product.serving.per_container} days.
        </p>
      </Section>

      <Section heading="What does it taste like?">
        <p>
          {product.flavor}. Net weight {product.net_weight}.
        </p>
      </Section>

      <Section heading="Is it suitable for my diet?">
        <p>Glow is {product.dietary_badges.join(", ").toLowerCase()}.</p>
        <p>
          It is not vegetarian or vegan: the formula contains collagen sourced
          from fish.
        </p>
        <AllergenNotice />
      </Section>

      <Section heading="What is in it?">
        <NeedsReview>
          The Supplement Facts panel has not been added to the site yet. Send the
          values printed on the label and this section will list them in full.
        </NeedsReview>
      </Section>

      <Section heading="Can I take it if I am pregnant or on medication?">
        <p>
          Talk to your doctor before starting any new supplement, particularly if
          you are pregnant, nursing, or taking medication.
        </p>
      </Section>

      <LegalDisclaimer />
    </PageShell>
  );
}
