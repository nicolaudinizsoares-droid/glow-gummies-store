// Section 08 - Social proof.
//
// Reviews come from src/data/reviews.json, and there are none yet. The section
// renders nothing at all until there are: an empty reviews block advertises
// that nobody has bought, which is worse than no block. It reappears on its
// own the moment a review lands, with no code change.
//
// Reviews collected through /review came with a discount attached and carry
// incentivized: true. Those are labelled. That label is required, not a
// courtesy -- an undisclosed incentive is what turns a lawful offer into an
// actionable one.

import { Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { reviews, reviewSummary } from "@/lib/reviews";
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

  // Nothing to show, so show nothing.
  if (summary.count === 0) return null;

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
            What people say
          </h2>
          <div data-reveal-item className="flex items-center justify-center gap-3 mt-5">
            <Stars rating={Math.round(summary.average)} />
            <span className="text-sm" style={{ color: semantic.text.secondary }}>
              {summary.average} · {summary.count} review
              {summary.count === 1 ? "" : "s"}
            </span>
          </div>
        </Reveal>

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
              {review.incentivized && (
                <p
                  className="text-xs mt-2"
                  style={{ color: semantic.text.secondary }}
                >
                  Written for a discount on a future order.
                </p>
              )}
            </article>
        ))}
      </Reveal>
      </div>
    </section>
  );
};
