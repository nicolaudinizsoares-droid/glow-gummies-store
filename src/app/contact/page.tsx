import type { Metadata } from "next";
import { PageShell, Section, NeedsReview } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Contact Us | Glow",
  description: "Get in touch with the Glow team.",
};

export default function ContactPage() {
  return (
    <PageShell title="Contact us" intro="We read everything that comes in.">
      <Section heading="Customer support">
        <NeedsReview>
          No support email or phone number has been supplied yet. Send the
          address you want customers to use and it will go here.
        </NeedsReview>
      </Section>

      <Section heading="Order questions">
        <p>
          Have your order number to hand and we can look things up faster.
          Questions about a delivery in progress are usually answered within one
          business day.
        </p>
      </Section>

      <Section heading="Wholesale and press">
        <NeedsReview>
          Add a separate contact route here if wholesale and press enquiries
          should not go to general support.
        </NeedsReview>
      </Section>
    </PageShell>
  );
}
