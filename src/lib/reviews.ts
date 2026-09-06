// Customer reviews.
//
// reviews.json is the real store: it ships empty because Glow has no reviews
// yet, and inventing them is not an option. Fabricated reviews are actionable
// under the FTC rule on consumer reviews and testimonials, and they mislead
// exactly the people trying to decide whether to buy.
//
// To preview the section's design there is a sample fixture, gated to
// development. It can never reach a production build: the check below is a
// literal comparison the bundler resolves at build time, so the fixture is
// dropped from the production bundle entirely.

import realReviews from "@/data/reviews.json";
import { SAMPLE_REVIEWS } from "@/data/reviews.sample";

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  /** ISO date. */
  date: string;
  /** Whether the reviewer's order could be verified. */
  verified: boolean;
}

/** True when the section is showing the design fixture rather than real data. */
export const usingSampleReviews =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_SHOW_SAMPLE_REVIEWS === "1" &&
  (realReviews as Review[]).length === 0;

export const reviews: Review[] = usingSampleReviews
  ? SAMPLE_REVIEWS
  : (realReviews as Review[]);

export const reviewSummary = () => {
  if (reviews.length === 0) return { count: 0, average: 0, distribution: [] };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  return {
    count: reviews.length,
    average: Math.round((total / reviews.length) * 10) / 10,
    distribution,
  };
};
