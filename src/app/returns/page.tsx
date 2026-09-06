import type { Metadata } from "next";
import { PageShell, Section, NeedsReview } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Returns | Glow",
  description: "Glow's return and refund policy.",
};

export default function ReturnsPage() {
  return (
    <PageShell title="Returns" intro="If Glow is not right for you.">
      <Section heading="Return window">
        <NeedsReview>
          The return window and refund terms have not been set. Note that
          consumable supplements are commonly accepted only unopened and sealed
          — decide whether Glow accepts opened bottles.
        </NeedsReview>
      </Section>

      <Section heading="Damaged or incorrect orders">
        <p>
          If your order arrives damaged or is not what you ordered, contact
          support with your order number and a photo, and we will put it right.
        </p>
      </Section>
    </PageShell>
  );
}
