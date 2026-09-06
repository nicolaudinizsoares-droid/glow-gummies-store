// Glow design tokens.
//
// Three layers, in dependency order:
//   primitive -> raw values, the only place a literal colour is written
//   semantic  -> what a value means (surface, text, accent)
//   component -> what a specific part of the UI uses
//
// Every colour traces back to the physical product: the navy of the script
// wordmark, the cream label stock, the apricot-to-peach wash behind the logo,
// the blush of the campaign artwork, the gold rule printed on the label border,
// and the red of the gummies themselves.

/* ---------------------------------------------------------------- primitive */

export const primitive = {
  navy: {
    900: "#0A1D36",
    800: "#0F2A4C", // wordmark navy
    700: "#1B4272",
    600: "#2C5688",
  },
  cream: {
    50: "#FDFBF7", // warm white
    100: "#FAF4EA",
    200: "#F7E8D5",
    300: "#F3E2CE", // label stock
    400: "#EAD5BC",
  },
  apricot: {
    300: "#FBD9B4",
    400: "#F8BE8A", // logo gradient end
    500: "#F0A868", // logo gradient mid
    600: "#DE8F4C",
  },
  blush: {
    100: "#FBF1EE",
    200: "#F5E1DB",
    300: "#EBC0B6",
    400: "#E0A093", // campaign blush
    500: "#C9847A",
  },
  gold: {
    400: "#D8B87F",
    500: "#C8A063", // the printed rule on the label
    600: "#A8834A",
  },
  berry: {
    500: "#C9202F", // the gummies
    600: "#A81826",
  },
  neutral: {
    0: "#FFFFFF",
    100: "#F5F5F4",
    300: "#D6D3D1",
    500: "#78716C",
    600: "#57534E",
    800: "#2E2A26", // deep charcoal
    900: "#1C1917",
  },
} as const;

/* ----------------------------------------------------------------- semantic */

export const semantic = {
  surface: {
    page: primitive.cream[50],
    raised: primitive.neutral[0],
    sunken: primitive.cream[100],
    inverse: primitive.navy[800],
    tint: primitive.blush[100],
  },
  text: {
    primary: primitive.navy[800],
    secondary: primitive.neutral[600],
    muted: primitive.neutral[500],
    inverse: primitive.neutral[0],
    onAccent: primitive.navy[800],
  },
  accent: {
    primary: primitive.apricot[500],
    secondary: primitive.blush[400],
    metallic: primitive.gold[500],
    product: primitive.berry[500],
  },
  border: {
    subtle: primitive.cream[200],
    default: primitive.cream[400],
    strong: primitive.navy[800],
    metallic: primitive.gold[500],
  },
  state: {
    success: primitive.navy[700],
    error: primitive.berry[500],
    disabled: primitive.neutral[300],
    focus: primitive.apricot[500],
  },
} as const;

/* ---------------------------------------------------------------- component */

export const component = {
  nav: {
    background: "rgba(253, 251, 247, 0.72)",
    backgroundScrolled: "rgba(253, 251, 247, 0.94)",
    border: semantic.border.subtle,
    text: semantic.text.primary,
  },
  button: {
    primaryBg: primitive.navy[800],
    primaryText: primitive.neutral[0],
    primaryHover: primitive.navy[700],
    secondaryBg: "transparent",
    secondaryText: primitive.navy[800],
    secondaryBorder: primitive.navy[800],
    accentBg: primitive.apricot[500],
    accentText: primitive.navy[800],
  },
  card: {
    background: semantic.surface.raised,
    border: semantic.border.subtle,
    shadow: "0 1px 2px rgba(10, 29, 54, 0.04), 0 8px 24px rgba(10, 29, 54, 0.06)",
  },
} as const;

/* ------------------------------------------------------------------- scales */

/** 4px base grid. */
export const spacing = {
  "2xs": "0.25rem",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4.5rem",
  "4xl": "7rem",
  "5xl": "10rem",
} as const;

/**
 * Editorial type scale. Display sizes are deliberately large and set in the
 * serif; body stays in the sans for legibility.
 */
export const typography = {
  family: {
    display: "var(--font-playfair), Georgia, 'Times New Roman', serif",
    body: "var(--font-inter), system-ui, -apple-system, sans-serif",
    script: "var(--font-pacifico), cursive",
  },
  size: {
    micro: "0.6875rem",
    caption: "0.8125rem",
    body: "1rem",
    bodyLg: "1.125rem",
    lead: "1.375rem",
    h3: "1.75rem",
    h2: "2.5rem",
    h1: "3.5rem",
    display: "clamp(2.75rem, 7vw, 6rem)",
  },
  tracking: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.08em",
    wider: "0.2em", // the uppercase eyebrow labels
  },
  leading: {
    tight: "1.05",
    snug: "1.2",
    normal: "1.6",
  },
} as const;

export const radius = {
  none: "0",
  sm: "2px",
  md: "4px", // restrained; luxury reads sharper than rounded
  lg: "8px",
  pill: "999px",
} as const;

/**
 * Motion tokens. Durations and easings follow the GSAP preset guidance:
 * transform/opacity only, so animation stays on the compositor thread.
 */
export const motion = {
  duration: {
    instant: 0.15,
    fast: 0.25,
    base: 0.4,
    slow: 0.7,
    cinematic: 1.2,
  },
  ease: {
    out: "power2.out",
    inOut: "power2.inOut",
    entrance: "power3.out",
    cinematic: "power1.inOut",
  },
  stagger: {
    tight: 0.05,
    base: 0.09,
    loose: 0.16,
  },
} as const;
