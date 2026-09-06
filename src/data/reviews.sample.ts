// DESIGN FIXTURE -- NOT REAL REVIEWS. NEVER SHIPPED.
//
// Placeholder copy for laying out the review section. These are not customer
// statements and must not be presented as such. Guarded by the development
// check in src/lib/reviews.ts, so this file is dropped from production builds.
//
// Delete this file once real reviews exist.

import type { Review } from "@/lib/reviews";

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: "sample-1",
    author: "Sample reviewer",
    rating: 5,
    title: "Placeholder review title",
    body: "Placeholder body copy standing in for a real customer review, long enough to show how a review of typical length wraps inside the card at this measure.",
    date: "2026-01-14",
    verified: true,
  },
  {
    id: "sample-2",
    author: "Sample reviewer",
    rating: 4,
    title: "Placeholder review title",
    body: "A shorter placeholder, to show the card at its minimum height next to a longer one.",
    date: "2026-02-02",
    verified: true,
  },
  {
    id: "sample-3",
    author: "Sample reviewer",
    rating: 5,
    title: "Placeholder review title",
    body: "Another placeholder body, included so the grid has a third column filled and the stagger timing can be judged against real spacing.",
    date: "2026-02-20",
    verified: false,
  },
];
