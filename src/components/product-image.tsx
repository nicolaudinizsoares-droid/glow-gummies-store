// Product imagery with a branded fallback.
//
// The real photography is not in the repo yet. Until the files land in
// /public/products/, this renders an SVG stand-in in the Glow palette rather
// than a broken image icon. Once the real file exists at the path in
// products.json, it is used automatically -- no code change needed.

"use client";

import { useState } from "react";
import Image from "next/image";
import { colors } from "@/styles/colors";
import { GlowSparkle } from "@/components/glow-logo";

/** Stylised gummy bottle in the brand palette. */
export const BottlePlaceholder = ({
  className = "",
  label = "Glow",
}: {
  className?: string;
  label?: string;
}) => (
  <div
    className={`relative flex items-center justify-center overflow-hidden ${className}`}
    style={{ background: colors.gradients.hero }}
  >
    <svg viewBox="0 0 160 220" className="h-full w-auto py-6" role="img" aria-label={`${label} bottle`}>
      {/* cap */}
      <rect x="52" y="8" width="56" height="26" rx="6" fill="#FFFFFF" stroke={colors.brand.creamPale} strokeWidth="2" />
      {/* body */}
      <rect x="40" y="34" width="80" height="176" rx="14" fill="#FFFFFF" fillOpacity="0.55" stroke={colors.brand.creamPale} strokeWidth="2" />
      {/* gummies */}
      {[
        [58, 176], [80, 182], [102, 176], [69, 160], [91, 160], [58, 146], [102, 146], [80, 140],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="9" fill={colors.brand.berry} fillOpacity="0.85" />
      ))}
      {/* label */}
      <rect x="46" y="62" width="68" height="64" rx="6" fill={colors.brand.cream} />
      <text x="80" y="90" textAnchor="middle" fontSize="17" fontFamily="var(--font-pacifico), cursive" fill={colors.brand.navy}>
        Glow
      </text>
      <rect x="58" y="100" width="44" height="4" rx="2" fill={colors.brand.navy} fillOpacity="0.55" />
      <rect x="64" y="110" width="32" height="4" rx="2" fill={colors.brand.navy} fillOpacity="0.35" />
    </svg>
    <GlowSparkle
      className="absolute top-4 right-5 w-5 h-5 opacity-70"
      color={colors.brand.navy}
    />
  </div>
);

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  /** Rendered box size; the placeholder fills the same space. */
  width?: number;
  height?: number;
  priority?: boolean;
}

export const ProductImage = ({
  src,
  alt,
  className = "",
  width = 600,
  height = 600,
  priority = false,
}: ProductImageProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <BottlePlaceholder className={className} label={alt} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};
