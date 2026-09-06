# Product photography

Drop the real Glow PNGs here, named exactly as below. The site picks them up
with no code change; anything missing falls back to a drawn placeholder.

| File                     | What it needs to be                                   |
| ------------------------ | ----------------------------------------------------- |
| `glow-bottle.png`        | Whole bottle, cap on, straight on, transparent bg      |
| `glow-bottle-body.png`   | Same bottle with the cap removed, transparent bg       |
| `glow-cap.png`           | The cap alone, transparent bg                          |
| `glow-gummy-1..3.png`    | Three single gummies, cut out, transparent bg          |
| `glow-lifestyle.png`     | Bottle with passion fruit, transparent or white bg     |

Requirements:

- **Transparent background** on everything except the lifestyle shot. The hero
  layers these over a lit backdrop; a white box around the bottle breaks it.
- **At least 1600px** on the long edge. They are displayed large.
- PNG here is fine. The build converts to AVIF/WebP automatically.

The cap and body shots are what make the bottle-opening sequence possible.
Without them the hero falls back to a single static bottle.

## Generated artwork

`glow-bottle.png`, `glow-bottle-body.png`, `glow-cap.png`, `glow-gummy-*.png`
and `glow-poster.png` are vector recreations built from the label design, not
photography. Replace them with real product shots when you have them; the
filenames and proportions are already correct, so no code changes are needed.

`glow-poster.png` is a corrected marketing poster. It differs from the original
in two ways that matter:

- No "Vegetarian Friendly" claim. The Supplement Facts panel lists Collagen
  (piscine) and declares Contains: Fish (Tilapia).
- "Two gummies a day", matching the panel's serving size, rather than "one".

It also carries the allergen line and the FDA disclaimer.
