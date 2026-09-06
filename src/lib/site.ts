// Canonical site origin, used for absolute URLs in metadata, the sitemap and
// structured data. Set NEXT_PUBLIC_SITE_URL in the deploy environment; the
// fallback only keeps local builds working.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const SITE_NAME = "Glow";
