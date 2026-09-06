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

      <Section heading="Rates">
        <p>
          Shipping is free on every Glow order, with no minimum spend. The
          price you see is the price you pay.
        </p>
      </Section>

      <Section heading="Delivery times">
        <NeedsReview>
          Carrier and delivery windows have not been supplied. Customers ask
          this before they buy, so it is worth filling in.
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
