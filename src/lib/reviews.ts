// Customer reviews.
//
// reviews.json is the store, and it ships empty because Glow has no reviews
// yet. Inventing them is not an option: fabricated reviews are actionable
// under the FTC rule on consumer reviews and testimonials, and they mislead
// exactly the people trying to decide whether to buy.
//
// Reviews collected through the invitation in lib/review-invite.ts carry
// `incentivized: true`, and the card renders a label from that field. The
// disclosure travels with the data so it cannot be lost in a redesign.

import realReviews from "@/data/reviews.json";

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
  /**
   * True when the reviewer was offered the discount for writing it. Drives
   * the disclosure label; never omit it on a review collected that way.
   */
  incentivized?: boolean;
}

export const reviews: Review[] = realReviews as Review[];

export const reviewSummary = () => {
  if (reviews.length === 0) return { count: 0, average: 0, distribution: [] };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));
  return {
    count: reviews.length,
    average: Math.round((total / reviews.length) * 10) / 10,
    distribution,
  };
};
