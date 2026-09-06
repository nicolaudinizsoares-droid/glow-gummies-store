// Shared shell for the site's content pages (support, policy, info).

import { Navigation, Footer } from "@/components/website-layouts";
import { colors } from "@/styles/colors";

export const PageShell = ({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen" style={{ backgroundColor: colors.brand.offWhite }}>
    <Navigation />
    <header className="px-4 pt-16 pb-10" style={{ background: colors.gradients.hero }}>
      <div className="max-w-3xl mx-auto">
        <h1
          className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-3"
          style={{ color: colors.brand.navy }}
        >
          {title}
        </h1>
        {intro && (
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            {intro}
          </p>
        )}
      </div>
    </header>
    <main className="px-4 py-14">
      <div
        className="max-w-3xl mx-auto space-y-8 leading-relaxed"
        style={{ color: colors.text.secondary }}
      >
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

export const Section = ({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold" style={{ color: colors.brand.navy }}>
      {heading}
    </h2>
    {children}
  </section>
);

/** Marks copy that Glow still needs to supply or have reviewed. */
export const NeedsReview = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-sm rounded-md px-4 py-3"
    style={{
      backgroundColor: colors.brand.blushPale,
      color: colors.brand.navy,
    }}
  >
    <strong>To confirm: </strong>
    {children}
  </p>
);
