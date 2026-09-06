# Product artwork renderers

The scripts that generated everything in `public/products/`. Kept so the
artwork can be regenerated when the label changes, rather than being a set of
PNGs nobody can reproduce.

| Script | Produces |
| --- | --- |
| `spin3d.mjs` | The 24-frame turntable in `public/products/spin/` |
| `label-wrap.mjs` | The wrap-around label texture, read from `products.json` |
| `render.mjs` | The flat bottle, cap and gummy cut-outs |
| `poster.mjs` | `glow-poster.png` |

Run from this directory with `node <script>.mjs`. They need Playwright and
Chromium, which the repo already has via dev dependencies.

The `.woff2` files are Pacifico and Archivo, inlined by the renderers because
Google Fonts is not reachable from the headless browser in every environment.

## Regenerating after a label change

The label texture reads from `src/data/products.json`, so changing the
Supplement Facts, serving size or allergens there and re-running `spin3d.mjs`
produces a bottle whose printed panels match the site. Nothing is hardcoded
twice.

## Replacing these with photography

These are renders of a model, not photographs. When real turntable frames
exist, drop them into `public/products/spin/` following the brief in that
folder's README and delete these. The viewer does not care which it is
playing.
