# Glow

Storefront for Glow Hair, Skin & Nails gummies. Next.js 15 (App Router),
TypeScript, Tailwind v4, Redux for the cart.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build; also checks assets and the spin manifest |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

Type and lint errors fail the build. They were previously suppressed in
`next.config.ts`, which hid eleven real ones.

## One product, one source of truth

`src/data/products.json` holds the single SKU, transcribed from the printed
label: Supplement Facts, serving size, allergens, net weight, claims. Every
page reads from it, so the site cannot drift from the packaging. The label
texture on the rendered artwork reads from it too.

Change a figure there and it changes everywhere.

## Things that are deliberate

**No reviews.** `src/data/reviews.json` is empty and the section says so.
Fabricated reviews are actionable under the FTC rule on consumer reviews. To
preview the layout, run dev with `NEXT_PUBLIC_SHOW_SAMPLE_REVIEWS=1`; the
fixture is dropped from production builds.

**No "Vegetarian Friendly" claim.** The Supplement Facts list Collagen
(piscine) and declare `Contains: Fish (Tilapia)`. The packaging still carries
the claim; the site does not. See `dietary_badges` in `src/lib/products.ts`.

**Two gummies a day, not one.** The panel says serving size 2, 30 servings.
Some marketing says one, which would be half the intended dose.

**No card fields at checkout.** No processor is connected, and a card form
that goes nowhere invites real card numbers onto a page that cannot charge
them. See `src/lib/checkout.ts`.

**Privacy and Terms are blank.** Placeholder legal text reads as binding.

Pages showing a "To confirm:" block are waiting on information: support
email, carrier and delivery times, return window, manufacturing details.

## Layout of the code

```
src/
  app/                  routes; product page is a server component with
                        metadata and Product structured data
  components/
    sections/           the eleven homepage sections
    hero.tsx            scroll-scrubbed cap-lift sequence
    bottle-spin.tsx     turntable viewer, used when frames exist
  lib/
    products.ts         product types and search
    currency.ts         one place to change currency
    shipping.ts         one place to change shipping policy
    checkout.ts         processor flag and validation
    analytics.ts        typed events; nothing sent without consent
    motion/use-gsap.ts  lazy GSAP, reduced-motion aware
  styles/tokens.ts      primitive -> semantic -> component tokens
```

## Images

`public/products/` holds the product photography. `public/brand/` holds the
logo: `glow-logo.png` is the full lockup, `glow-logo-mark.png` the wordmark
alone, which is what the nav and footer use because the tagline is unreadable
at that size.

`scripts/check-assets.mjs` fails the build if the product data references an
image that is not there. That check exists because the data pointed at a file
that never existed for several commits, and the placeholder fallback hid it.

`public/products/spin/` is empty. Drop turntable frames in named `001.png`
onward and the hero switches from the cap-lift sequence to a 360 spin; the
photography brief is in that folder. `tools/spin-render/` can generate
frames from a 3D model if photography is not available.

## Before going live

- Set `NEXT_PUBLIC_SITE_URL`, or the sitemap, canonicals and Open Graph tags
  all point at localhost.
- Connect a payment processor.
- Fill in the "To confirm:" pages, and Privacy and Terms.
- Confirm the packaging discrepancies above are resolved in print.
