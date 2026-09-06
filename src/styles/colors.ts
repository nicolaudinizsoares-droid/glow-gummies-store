// Glow Design System
// Palette taken from the Glow packaging and logo:
// navy script wordmark on a cream-to-apricot gradient, blush accents,
// cream label stock, and the deep red of the gummies themselves.

export const colors = {
  // Primary Brand Colors (straight off the label and logo)
  brand: {
    navy: "#0F2A4C", // The wordmark navy - headings, primary text, footer
    white: "#FFFFFF", // Clean base
    cream: "#F3E2CE", // Label stock cream
    gray: "#6B7280", // Body copy gray
    apricot: "#F0A868", // Logo gradient mid-tone - primary accent

    // Supporting palette
    navyLight: "#1B4272", // Lifted navy for hierarchy
    offWhite: "#FDF9F3", // Warm page background
    creamPale: "#F7E8D5", // Pale cream for borders and fills
    grayLight: "#9CA3AF", // Muted gray
    peach: "#F8BE8A", // Logo gradient end
    blush: "#E0A093", // Poster blush - secondary accent
    blushPale: "#F5E1DB", // Tinted blush for backgrounds
    berry: "#C9202F", // Gummy red - use sparingly for pops

    // Legacy aliases kept so existing components keep compiling
    deepLakeBlue: "#0F2A4C",
    skyWhite: "#FFFFFF",
    sandyBeige: "#F3E2CE",
    mountainStoneGray: "#6B7280",
    goldenDawn: "#F0A868",
    glacialBlue: "#1B4272",
    mistWhite: "#FDF9F3",
    warmSand: "#F7E8D5",
    coolStone: "#9CA3AF",
    sunriseGold: "#F8BE8A",
  },

  // Typography colors following natural hierarchy
  text: {
    primary: "#0F2A4C", // Navy for primary text
    secondary: "#6B7280", // Gray for secondary copy
    tertiary: "#9CA3AF", // Light gray for tertiary text
    inverse: "#FFFFFF", // White text on dark backgrounds
    accent: "#F0A868", // Apricot for highlighted text
  },

  // Interactive elements
  interactive: {
    primary: "#0F2A4C", // Navy for primary buttons
    primaryHover: "#1B4272", // Lifted navy on hover
    secondary: "transparent", // Secondary button background
    secondaryBorder: "#0F2A4C", // Navy border
    secondaryHover: "#F3E2CE", // Cream hover for secondary
    disabled: "#9CA3AF", // Gray for disabled state
    focus: "#F0A868", // Apricot for focus outlines
    linkDefault: "#1B4272", // Inline text links
  },

  // Product category colors
  products: {
    cleanser: {
      primary: "#1B4272", // Glacial blue for cleansing
      light: "#4A7B9D", // Lighter glacial blue
      lighter: "#EAF0F7", // Ultra-light blue background
      accent: "#F0A868", // Golden dawn accent
      background: "#FFFFFF", // Pure white background
    },
    serum: {
      primary: "#F0A868", // Golden dawn for serums
      light: "#F8BE8A", // Sunrise gold
      lighter: "#FEF6E8", // Ultra-light golden background
      accent: "#0F2A4C", // Navy accent
      background: "#FFFFFF",
    },
    moisturizer: {
      primary: "#F3E2CE", // Sandy beige for moisturizers
      light: "#F7E8D5", // Warm sand
      lighter: "#FBF3E9", // Ultra-light sand background
      accent: "#1B4272", // Glacial blue accent
      background: "#FFFFFF",
    },
    sunscreen: {
      primary: "#F0A868", // Golden dawn for sun protection
      light: "#F8BE8A", // Sunrise gold
      lighter: "#FEF6E8", // Ultra-light golden background
      accent: "#0F2A4C", // Navy accent
      background: "#FFFFFF",
    },
    treatment: {
      primary: "#0F2A4C", // Navy for treatments
      light: "#1B4272", // Glacial blue
      lighter: "#EAF0F7", // Ultra-light blue background
      accent: "#F0A868", // Golden dawn accent
      background: "#FFFFFF",
    },
  },

  // Semantic colors for feedback and states
  semantic: {
    success: "#1B4272", // Navy for success
    warning: "#F0A868", // Apricot for warnings
    error: "#C9202F", // Gummy red for errors
    info: "#0F2A4C", // Navy for information

    // Background variants
    successBg: "#EAF0F7",
    warningBg: "#FEF6E8",
    errorBg: "#FBECEC",
    infoBg: "#EAF0F7",
  },

  // Surface colors for cards, modals, etc.
  surfaces: {
    primary: "#FFFFFF", // Primary surface
    secondary: "#FDF9F3", // Secondary surface - warm off-white
    tertiary: "#F3E2CE", // Tertiary surface - label cream
    overlay: "rgba(15, 42, 76, 0.4)", // Modal overlays in navy
    border: "#F7E8D5", // Pale cream borders
    divider: "#9CA3AF", // Gray dividers
  },

  // Elevation and shadows
  elevation: {
    card: "0 2px 8px rgba(15, 42, 76, 0.10)", // Default card resting shadow
    low: "0 1px 3px rgba(15, 42, 76, 0.08)",
    medium: "0 4px 12px rgba(15, 42, 76, 0.12)",
    high: "0 8px 24px rgba(15, 42, 76, 0.16)",
  },

  // Gradients - the logo's cream-to-apricot wash is the signature
  gradients: {
    hero: "linear-gradient(120deg, #FFF6DF 0%, #F9C79A 100%)", // The logo backdrop
    card: "linear-gradient(180deg, #FFFFFF 0%, #FDF9F3 100%)",
    subtle: "linear-gradient(135deg, #FDF9F3 0%, #F3E2CE 100%)",
    brand: "linear-gradient(135deg, #0F2A4C 0%, #1B4272 100%)",
    dawn: "linear-gradient(135deg, #F0A868 0%, #F8BE8A 100%)",
    blush: "linear-gradient(135deg, #F5E1DB 0%, #E0A093 100%)",
  },
};

// Design tokens following the 4px grid system with 6px radius
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "64px",
};

export const borderRadius = {
  sm: "3px",
  md: "6px", // Glow's signature radius
  lg: "12px",
  xl: "18px",
  full: "50%",
};

export const typography = {
  fontFamily: {
    serif: '"Playfair Display", "Freight Display", "Georgia", serif', // Elegant serif for headings
    sans: '"Inter", "Proxima Nova", sans-serif', // Clean sans for body text
  },
  fontSize: {
    caption: "14px",
    body: "16px",
    bodyLarge: "18px",
    h3: "28px",
    h2: "36px",
    h1: "48px",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.2",
    normal: "1.5",
    relaxed: "1.6",
  },
};

// Product category mapping for easy access
export const productCategories = {
  cleanser: "cleanser",
  serum: "serum",
  moisturizer: "moisturizer",
  sunscreen: "sunscreen",
  treatment: "treatment",
} as const;

export type ProductCategory = keyof typeof productCategories;
export type ProductCategoryKey = (typeof productCategories)[ProductCategory];

// Export default for easy importing
export default colors;
