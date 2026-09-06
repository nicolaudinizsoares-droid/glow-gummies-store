// Canonical site origin, used for absolute URLs in metadata, the sitemap and
// structured data.
//
// Order matters. NEXT_PUBLIC_SITE_URL wins, so a custom domain can always be
// set explicitly. Failing that, Vercel exposes the project's production
// domain at build time, which is enough to keep share cards, canonicals and
// the sitemap pointing somewhere real without anyone configuring anything --
// without it the fallback below ships "http://localhost:3000" into production
// metadata, and every link preview and canonical URL is dead.
const vercelDomain =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000");

export const SITE_NAME = "Glow";
