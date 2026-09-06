// Where the real Glow product photography lives.
//
// The hero composites the bottle from separate layers so the cap can lift away
// from the body and gummies can travel independently. Each layer needs a
// transparent-background PNG at these paths. Any that are missing fall back to
// the drawn placeholder, so the site never shows a broken image.

export const PRODUCT_ASSETS = {
  /** Whole bottle, straight on, cap attached. The default product shot. */
  bottle: "/products/glow-bottle.png",
  /** Bottle body with the cap removed, for the opening sequence. */
  bottleBody: "/products/glow-bottle-body.png",
  /** The cap alone, so it can twist and lift. */
  cap: "/products/glow-cap.png",
  /** Single gummies, cut out, for the emerge sequence. */
  gummies: [
    "/products/glow-gummy-1.png",
    "/products/glow-gummy-2.png",
    "/products/glow-gummy-3.png",
  ],
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
  /** Marketing poster, corrected: no vegetarian claim, two gummies a day. */
  poster: "/products/glow-poster.png",
} as const;
