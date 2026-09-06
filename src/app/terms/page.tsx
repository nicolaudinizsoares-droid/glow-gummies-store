import type { Metadata } from "next";
import { PageShell, Section, NeedsReview } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Terms of Service | Glow",
};

export default function Page() {
  return (
    <PageShell title="Terms of Service">
      <Section heading="This page needs your legal copy">
        <NeedsReview>
          Terms of Service is a legal document specific to your business, the data you
          collect, and the jurisdictions you sell into. Nothing has been drafted
          here on purpose — placeholder legal text is worse than none, because it
          reads as binding. Have this written or reviewed by someone qualified,
          then drop it in.
        </NeedsReview>
      </Section>
    </PageShell>
  );
}
