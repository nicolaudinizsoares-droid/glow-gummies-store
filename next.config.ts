import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript and ESLint checks were both disabled here, which is how eleven
  // type errors survived in the product page: it referenced colour tokens that
  // never existed and passed undefined into style props at runtime. The
  // codebase is now clean on both, so the checks are back on and a regression
  // fails the build instead of shipping.
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  images: {
    // Modern formats first; Next falls back to the original for older clients.
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // /about predated /our-story and duplicated it.
      { source: "/about", destination: "/our-story", permanent: true },
    ];
  },
};

export default nextConfig;
