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
  /** Bottle with passion fruit, for the flavour section. */
  lifestyle: "/products/glow-lifestyle.png",
  /** Marketing poster, corrected: no vegetarian claim, two gummies a day. */
  poster: "/products/glow-poster.png",
} as const;
