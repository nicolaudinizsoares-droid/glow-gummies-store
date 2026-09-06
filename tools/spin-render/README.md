# Product artwork renderers

The scripts that generated everything in `public/products/`. Kept so the
artwork can be regenerated when the label changes, rather than being a set of
PNGs nobody can reproduce.

| Script | Produces |
| --- | --- |
| `spin3d.mjs` | The 24-frame turntable in `public/products/spin/` |
| `label-wrap.mjs` | The wrap-around label texture, read from `products.json` |
| `render.mjs` | The gummy cut-outs |
| `og-card.mjs` | `glow-og.jpg`, the 1200x630 social share card |

Run with `node <script>.mjs`. They need Playwright, which is **not** a
dependency of this repo -- these are one-off asset builders, not part of
`npm run build`, so it is not worth shipping to everyone who installs the
site. Install it wherever you run them (`npm i playwright`) and run the script
from that directory: Node resolves imports relative to the script file, so
running it from a directory without `node_modules/playwright` fails even if
Playwright is installed elsewhere.

Chromium itself is already on the box at `/opt/pw-browsers/chromium`, which is
what every script passes as `executablePath`. Do not run `playwright install`.

The `.woff2` files are Pacifico and Archivo, inlined by the renderers because
Google Fonts is not reachable from the headless browser in every environment.

## Regenerating after a label change

The label texture reads from `src/data/products.json`, so changing the
Supplement Facts, serving size or allergens there and re-running `spin3d.mjs`
produces a bottle whose printed panels match the site. Nothing is hardcoded
twice.

## What photography has already replaced

The bottle, cap and poster renders are gone. Every bottle on the site is now a
photograph: the hero, the product gallery and the three homepage sections all
read from `PRODUCT_ASSETS`. What is left here draws the loose gummies that
scatter behind the passion fruit section, where a cut-out is still wanted, and
builds the share card.

`spin3d.mjs` and `label-wrap.mjs` are kept for the turntable, which has no
frames yet -- `public/products/spin/` is empty, so `BottleSpin` stays dormant.
If real turntable frames are ever shot, drop them in there and the viewer
picks them up.
