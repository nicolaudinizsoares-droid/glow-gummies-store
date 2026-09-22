# 3D hero — build brief

Handoff written at the end of an inspection pass. **No site code was changed.**
Phase 1 (inspect) is complete; phases 2-7 (build, verify, polish, test, fix)
have not started.

## Why this file exists

The inspecting session ran in an environment whose egress policy blocks
`registry.npmjs.org` (`403`, `x-deny-reason: host_not_allowed`). `node_modules`
was empty and could not be populated, so nothing could be installed, run, built
or screenshotted. Everything below was established by reading the tree, the git
history and the product data, and by rendering the bottle in a Three.js viewer
that does not depend on npm.

**Before starting: confirm `curl -s -o /dev/null -w "%{http_code}"
https://registry.npmjs.org/three` returns `200`, then `npm install`.** If it
still returns 403, stop and say so rather than working around it.

## What the goal is

A premium, cinematic, Awwwards-calibre single-product site. The centrepiece is
a hero where the real bottle floats in 3D and a **scroll-driven, choreographed
sequence** plays out: float -> slow rotation -> camera push-in -> bottle moves
into a new pose -> **cap opens** -> gummies emerge -> gummies float outward ->
camera transitions into the next section, with the bottle staying visually
connected to the page rather than cutting away.

Design register: luxury, feminine, modern, sophisticated, minimal, editorial.
Explicitly not wanted: generic templates, cheap gradients, excessive rounded
cards, walls of text, stock-photo layouts, Shopify-looking blocks, random
animation everywhere.

## The project as it stands

Next.js 15.5.9 App Router - React 19.1 - TypeScript **strict** - Tailwind v4 -
shadcn (new-york). 13 routes, ~40 components, working cart and checkout
(Redux Toolkit), sitemap/robots/OG already correct.

`next.config.ts` deliberately keeps `typescript.ignoreBuildErrors` and
`eslint.ignoreDuringBuilds` **false**, with a comment explaining that eleven
type errors once shipped because they were true. Do not flip them to get a
build through.

### Already good — build on these, do not replace

- **`src/styles/tokens.ts`** — a real 3-layer token system
  (primitive -> semantic -> component). Every colour traces to the physical
  product: wordmark navy `#0F2A4C`, label cream `#F3E2CE`, apricot `#F0A868`,
  campaign blush `#E0A093`, printed gold rule `#C8A063`, gummy berry `#C9202F`.
  Editorial type scale, and `radius.md = 4px` with the note that luxury reads
  sharper than rounded. It already encodes the requested design register.
- **`src/lib/motion/use-gsap.ts`** — dynamic GSAP + ScrollTrigger import,
  `gsap.context` teardown, reduced-motion gate. The right foundation for the
  scroll choreography. Note its contract: **under reduced motion the static
  markup is what ships, so author the static state as the finished state.**
- Fonts already loaded in `layout.tsx`: Playfair Display (display), Inter
  (body), Pacifico (script wordmark).

### Known defect to fix in passing

`three` and `@types/three` are in **devDependencies** but are imported at
runtime. Move `three` to `dependencies`.

## Assets — the honest inventory

**There is no `.glb`, `.gltf`, `.fbx`, `.obj` or `.usdz` anywhere in the repo.**
`public/products/` holds JPGs and three cut-out gummy PNGs, nothing more.

Also worth knowing:

- `public/products/README.md` promises `glow-bottle.png`,
  `glow-bottle-body.png`, `glow-cap.png`, `glow-lifestyle.png`. **None exist.**
- `public/products/spin/` is **empty**, so `src/data/spin-frames.json` is
  `{"frames": []}` and `src/components/bottle-spin.tsx` is dormant dead code.
  It renders `null`. Either feed it frames or delete it; do not leave it
  half-alive.

### But a 3D bottle already exists, as code

`tools/spin-render/spin3d.mjs` models the bottle in Three.js: translucent PET
body, spherical shoulder and base, ribbed cap, neck, gummies inside, and a
three-point key/fill/rim rig. `tools/spin-render/label-wrap.mjs` generates the
wrap-around label **from `src/data/products.json`**, so the printed panels can
never contradict the site.

And **git history contains a React port already**:

    git show aa095d2:src/components/bottle-3d.tsx    # 447 lines

Added in `73d0f73`, reverted in `da8bc8e`. Worth reading before writing a new
one — it solved dynamic `three` loading, drag-to-rotate with momentum, a
canvas-drawn label, and camera distance solved from the panel's measured aspect
rather than per breakpoint.

## Decision taken: procedural now, GLB-ready

Agreed with the repository owner. Build the bottle as **procedural Three.js
geometry with `body`, `cap`, `label` and gummies as separately animatable
nodes**, and structure the loader so a real `bottle.glb` swaps in later without
rewriting the choreography.

`docs/bottle-scene-reference.js` in this folder is a **rendered and visually
confirmed** scene implementing exactly that, including the full nine-beat
choreography. Port it; do not start from scratch.

What it establishes:

- **True silhouette** via `LatheGeometry` — a revolved profile with foot
  chamfer, straight wall, shoulder curve and neck. Better than the stacked
  cylinder-and-spheres in `spin3d.mjs`.
- **Real glass** — `MeshPhysicalMaterial` with `transmission: 0.92`,
  `ior: 1.46`, clearcoat.
- **A procedural studio HDRI** — canvas gradient plus soft-box blobs pushed
  through `PMREMGenerator`. This is what produces the travelling highlights,
  and it needs **no network fetch and no `.hdr` file**, which also means it
  survives a restrictive egress policy. Do not swap it for a `drei`
  `<Environment preset>` that fetches from a CDN.
- **Cap is a separate `THREE.Group`**, not welded to the body — the structure
  the cap-opening beat requires, and the same structure a GLB would need.

Its two honest limits: gummies are squashed spheres rather than moulded shapes,
and the glass is `transmission` rather than true refraction with dispersion.
Both are fixed by a real model.

### GLB to commission (parallel track)

`bottle.glb`, Draco or meshopt compressed, under ~3 MB, Y-up, origin at the
base of the bottle, and **separately named nodes: `body`, `cap`, `label`** —
without a detached cap node the opening beat cannot be animated. Plus a studio
`.hdr` if photoreal glass is wanted.

## Build plan

**Phase 2 — the hero, alone.** Move `three` to `dependencies`; add
`@react-three/fiber`, `@react-three/drei`, `@gsap/react`. Port the reference
scene to `<BottleScene />`, dynamically imported with `ssr: false`, behind the
same reduced-motion gate `use-gsap.ts` uses, so a reduced-motion visitor
downloads no Three.js at all. Expose `useBottleModel()` returning
`{ body, cap, label }` — procedural today, `useGLTF` tomorrow. **Then actually
run it and confirm it renders before moving on.**

**Phase 3 — the scroll choreography.** One pinned ScrollTrigger with
`scrub: 1`, driving a single normalised `progress` value into the scene. Beat
map, validated in the reference file:

| progress | beat |
| --- | --- |
| 0.00-0.20 | float, slow rotation, bottle centred |
| 0.00-0.55 | camera push-in (26 -> 17 units) |
| 0.28-0.62 | bottle tilts into its new pose |
| 0.42-0.68 | **cap lifts, tips and spins away** |
| 0.55-1.00 | gummies emerge from the neck, staggered, float outward |
| 0.85-1.00 | camera hands off to the next section |

**Phase 4** the remaining sections; **Phase 5** typography, spacing,
transitions, hover states, micro-interactions; **Phase 6** desktop + mobile
testing; **Phase 7** fix every error and performance issue.

Do not call it finished because it compiles. Run it, look at it, iterate.

## Constraints that must not be broken

- **No invented claims.** Benefits come only from `src/data/products.json` or
  the product assets. The FDA disclaimer and the allergen line (Fish/Tilapia,
  Tree nuts/Coconut) are mandatory. The product contains fish collagen and is
  **not** vegetarian or vegan.
- **Reviews stay empty.** `src/data/reviews.json` is `[]` on purpose;
  `src/lib/reviews.ts` explains that fabricated reviews are actionable under
  the FTC rule. The social-proof section must keep rendering its honest empty
  state. A dev-only fixture exists for previewing the layout and is stripped
  from production builds — keep it that way.
- **Every figure reads from the product data.** Price `$37` MRP / `$30`
  current, `60 gummies`, `2 a day`, `30 servings`, `NET WT. 6.56 oz (186 g)`.
  Never retype a figure into a component.
- `scripts/check-assets.mjs` runs on build and fails on a missing image. Any
  new image path must resolve.
- **Keep the headline and the Shop CTA legible from the first frame.** The
  earlier 3D hero was reverted (`da8bc8e`) precisely because a visitor landed
  on a bottle with no words and had to scroll roughly two and a half screens
  before the headline and Shop button resolved. The cinematic hero must not
  repeat that.

## Three.js rules (version-matched to the pinned 0.185.1)

- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — cap at 2,
  not 3. 3x costs 2.25x the pixels for no visible gain.
- **Dispose explicitly** on teardown: every geometry, material and texture,
  plus the `PMREMGenerator` and its render target. Three.js does not
  garbage-collect GPU resources.
- Update `camera.aspect` **and** `camera.updateProjectionMatrix()` in every
  resize handler.
- `outputColorSpace = SRGBColorSpace`, `toneMapping = ACESFilmicToneMapping`.
  Do not use the removed `outputEncoding` / `sRGBEncoding`.
- `MeshBasicMaterial` for anything that never needs lighting.
- Pin **one** section, not several — excessive pinning fights native scroll and
  hurts mobile.
- Mobile: adapt the 3D experience (fewer gummies, lower DPR, simpler
  materials), do not simply hide it.

## Environment note

The 21st.dev MCP was available in the inspecting environment
(`TWENTY_FIRST_API_KEY`) but npm was not. If this session runs in `Default`,
npm should work but the 21st key may be absent. That is an acceptable trade:
the design direction comes from `src/styles/tokens.ts` and the local
`ui-ux-pro-max` skill, which is a Python script needing no network.
