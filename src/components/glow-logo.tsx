// Glow brand mark.
//
// The wordmark is the real logo artwork at /public/brand/glow-logo.png, lifted
// off its gradient ground so it sits on any background. GlowSparkle remains as
// SVG for the places that need just the mark -- benefit icons, dividers --
// where a recolourable vector beats a bitmap.

import Image from "next/image";
import { colors } from "@/styles/colors";

export const GlowSparkle = ({
  className = "",
  color = colors.brand.navy,
  style,
}: {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    style={style}
    fill={color}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M50 0 Q54 46 100 50 Q54 54 50 100 Q46 54 0 50 Q46 46 50 0 Z" />
  </svg>
);

interface GlowLogoProps {
  /** Wordmark height in px. The sparkle scales from this. */
  size?: number;
  color?: string;
  /** Set false to fall back to the Pacifico stand-in. */
  asset?: boolean;
  className?: string;
}

export const GlowLogo = ({
  size = 32,
  color = colors.brand.navy,
  asset = true,
  className = "",
}: GlowLogoProps) => {
  if (asset) {
    // The mark is 892x483; height drives the box and width follows. The full
    // lockup with the tagline lives at /brand/glow-logo.png for marketing
    // surfaces where it is rendered large enough to read.
    return (
      <Image
        src="/brand/glow-logo-mark.png"
        alt="Glow"
        width={Math.round(size * (892 / 483))}
        height={size}
        className={className}
        priority
      />
    );
  }

  return (
    <span
      className={`relative inline-block leading-none ${className}`}
      style={{ color }}
    >
      <span
        className="font-[family-name:var(--font-pacifico)] leading-none"
        style={{ fontSize: size }}
      >
        Glow
      </span>
      <GlowSparkle
        className="absolute"
        color={color}
        style={{
          width: size * 0.3,
          height: size * 0.3,
          top: -size * 0.1,
          right: -size * 0.18,
        }}
      />
    </span>
  );
};
