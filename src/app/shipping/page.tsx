import type { Metadata } from "next";
import { PageShell, Section, NeedsReview } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Shipping | Glow",
  description: "Shipping options and delivery times for Glow orders.",
};

export default function ShippingPage() {
  return (
    <PageShell title="Shipping" intro="How and when your order reaches you.">
      <Section heading="Processing">
        <p>
          Orders are picked and packed on business days. Orders placed over a
          weekend or holiday are processed the next business day.
        </p>
      </Section>

      <Section heading="Rates and delivery times">
        <NeedsReview>
          Carrier, delivery windows, shipping rates, and the free-shipping
          threshold have not been set. The cart currently shows a placeholder
          threshold that needs replacing with your real policy.
        </NeedsReview>
      </Section>

      <Section heading="Where we ship">
        <NeedsReview>
          Confirm which countries or states Glow ships to. Dietary supplements
          face import restrictions in some markets.
        </NeedsReview>
      </Section>
    </PageShell>
  );
}
