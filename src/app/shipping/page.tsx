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
        <p>
          Orders arrive in 3 to 8 business days after they are dispatched.
          Business days do not include weekends or public holidays, so an order
          placed on a Friday is usually with you the following week.
        </p>
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
