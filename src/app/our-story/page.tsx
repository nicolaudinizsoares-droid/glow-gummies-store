import type { Metadata } from "next";
import { PageShell, Section, NeedsReview } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Our Story | Glow Gummies",
  description: "Why Glow exists, and the idea behind beauty from within.",
};

export default function OurStoryPage() {
  return (
    <PageShell
      title="Our story"
      intro="Beauty routines work from the outside in. We wanted one that worked the other way round."
    >
      <Section heading="The idea">
        <p>
          Most beauty routines sit on the surface. Glow started from a simpler
          thought: that looking after your hair, skin and nails could be part of
          the day you already enjoy, rather than another step to remember.
        </p>
        <p>
          So we made it a gummy. Passion fruit, one a day, and a bottle you are
          happy to leave out on the counter.
        </p>
      </Section>

      <Section heading="How we make it">
        <NeedsReview>
          Manufacturing details — where Glow is produced, testing and quality
          standards, sourcing — have not been supplied. This is the section
          customers read to decide whether to trust a supplement, so it is worth
          filling in properly.
        </NeedsReview>
      </Section>
    </PageShell>
  );
}
