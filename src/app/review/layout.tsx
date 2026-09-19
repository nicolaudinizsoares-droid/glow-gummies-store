// Metadata for /review.
//
// The page itself is a client component, which cannot export metadata, so it
// lives here. Without it the route inherits the site-wide title and shows the
// same thing as the home page in search results and link previews.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave a review",
  description:
    "Tried Glow Hair, Skin & Nails gummies? Leave a review and get a discount code for your next order. Any rating qualifies.",
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
