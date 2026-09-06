// Glow brand mark: script wordmark + four-point sparkle.
//
// The sparkle is drawn as SVG so it stays crisp at any size and can be
// recolored. The wordmark currently renders in Pacifico as a stand-in for the
// real hand-lettered logotype -- drop the artwork at /public/brand/glow-logo.svg
// and set `asset` to true to use it instead.

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
  /** Render /public/brand/glow-logo.svg instead of the font stand-in. */
  asset?: boolean;
  className?: string;
}

export const GlowLogo = ({
  size = 32,
  color = colors.brand.navy,
  asset = false,
  className = "",
}: GlowLogoProps) => {
  if (asset) {
    return (
      <Image
        src="/brand/glow-logo.svg"
        alt="Glow"
        width={Math.round(size * 3.2)}
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
