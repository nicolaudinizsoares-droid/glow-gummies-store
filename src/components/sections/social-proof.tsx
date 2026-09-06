// Section 08 - Social proof.
//
// Reviews come from src/data/reviews.json, which is empty. Rather than
// fabricate any, the section renders an honest empty state until real ones
// exist. A development-only fixture can be switched on to preview the layout;
// see src/lib/reviews.ts.

import { Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { reviews, reviewSummary, usingSampleReviews } from "@/lib/reviews";
import { semantic } from "@/styles/tokens";

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className="w-3.5 h-3.5"
        aria-hidden="true"
        style={{ color: semantic.accent.metallic }}
        fill={i <= rating ? semantic.accent.metallic : "none"}
      />
    ))}
  </div>
);

export const SocialProof = () => {
  const summary = reviewSummary();

  return (
    <section
      id="reviews"
      className="px-6 md:px-8 py-24 md:py-32"
      style={{ backgroundColor: semantic.surface.tint }}
    >
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14" stagger>
          <p data-reveal-item className="eyebrow mb-6">
            Reviews
          </p>
          <h2
            data-reveal-item
            className="text-[clamp(2rem,4vw,3.25rem)]"
            style={{ color: semantic.text.primary }}
          >
            {summary.count > 0 ? "What people say" : "No reviews yet"}
          </h2>
          {summary.count > 0 && (
            <div data-reveal-item className="flex items-center justify-center gap-3 mt-5">
              <Stars rating={Math.round(summary.average)} />
              <span className="text-sm" style={{ color: semantic.text.secondary }}>
                {summary.average} · {summary.count} review
                {summary.count === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </Reveal>

        {usingSampleReviews && (
          <p
            className="text-xs text-center mb-8 px-4 py-2 max-w-lg mx-auto"
            style={{
              backgroundColor: semantic.accent.secondary,
              color: semantic.text.inverse,
            }}
          >
            Development preview: placeholder review data, not real customers.
          </p>
        )}

        {summary.count === 0 ? (
          <Reveal className="max-w-lg mx-auto text-center">
            <p className="text-lg leading-relaxed mb-3" style={{ color: semantic.text.secondary }}>
              Glow is new, so there is nothing here yet. When customers start
              leaving reviews, they will appear on this page exactly as written.
            </p>
            <p className="text-sm" style={{ color: semantic.text.muted }}>
              We do not write our own.
            </p>
          </Reveal>
        ) : (
          <Reveal className="grid md:grid-cols-3 gap-6" stagger distance={32}>
            {reviews.map((review) => (
              <article
                key={review.id}
                data-reveal-item
                className="p-7"
                style={{
                  backgroundColor: semantic.surface.raised,
                  border: `1px solid ${semantic.border.subtle}`,
                }}
              >
                <Stars rating={review.rating} />
                <h3 className="text-base font-semibold mt-4 mb-2" style={{ color: semantic.text.primary }}>
                  {review.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: semantic.text.secondary }}>
                  {review.body}
                </p>
                <p className="text-xs" style={{ color: semantic.text.muted }}>
                  {review.author}
                  {review.verified && " · Verified purchase"}
                </p>
              </article>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
};
