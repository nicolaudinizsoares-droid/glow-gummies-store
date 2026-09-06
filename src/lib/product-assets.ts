// Where the real Glow product photography lives.
//
// Two kinds of image live here. The cut-outs -- the bottle and the loose
// gummies -- are transparent PNGs that sit on the page's own background. The
// photographs carry their own. Any file that is missing falls back to a drawn
// placeholder, so the site never shows a broken image.
//
// The separate cap and open-body layers are gone with the hero sequence that
// lifted the cap off the bottle; nothing composites the product any more.

export const PRODUCT_ASSETS = {
  /** Single gummies, cut out, for the emerge sequence. */
  gummies: [
    "/products/glow-gummy-1.png",
    "/products/glow-gummy-2.png",
    "/products/glow-gummy-3.png",
  ],
  /**
   * Hero photograph, cropped for the tall half-screen panel and, separately,
   * for the shallower band that sits above the copy on a phone. Larger than
   * the gallery crops because this is the first and biggest image on the site.
   */
  hero: "/products/glow-hero.jpg",
  heroMobile: "/products/glow-hero-mobile.jpg",
  /** Second beat of the hero's dissolve: same set, cap off, gummies spilled. */
  hero2: "/products/glow-hero-2.jpg",
  hero2Mobile: "/products/glow-hero-2-mobile.jpg",
  /**
   * Finished product photography, for the gallery. Unlike the layers above
   * these keep their own backgrounds -- they are shot, not composited -- and
   * are cropped to one 4:5 frame so the gallery does not jump between shots.
   */
  photos: {
    /** Bottle with cut passion fruit and loose gummies. The default shot. */
    fruit: "/products/glow-photo-fruit.jpg",
    /** Cap off, gummies spilled onto marble. */
    open: "/products/glow-photo-open.jpg",
    /** Held in hand, for scale. */
    hand: "/products/glow-photo-hand.jpg",
    /** Skin close-up. No product in frame. */
    skin: "/products/glow-photo-skin.jpg",
  },
  /** 1200x630 social share card. Built by tools/spin-render/og-card.mjs. */
  og: "/products/glow-og.jpg",
} as const;
