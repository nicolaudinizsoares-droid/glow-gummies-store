// Verifies every image path in the product data resolves to a real file.
//
// The data and the assets were out of sync for several commits: products.json
// pointed at glow-hsn-bottle.png while the file on disk was glow-bottle.png.
// Nothing failed loudly, because ProductImage falls back to a placeholder --
// so the site looked fine while the structured data advertised a 404 image to
// search engines. This turns that class of mistake into a build error.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const products = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/products.json"), "utf8")
);

const missing = [];
for (const product of products) {
  for (const p of new Set([product.images.primary, ...product.images.gallery])) {
    if (!fs.existsSync(path.join(root, "public", p))) {
      missing.push(`${product.slug}: ${p}`);
    }
  }
}

if (missing.length) {
  console.error("Product images referenced but missing from /public:");
  for (const m of missing) console.error("  " + m);
  process.exit(1);
}
console.log(`✓ all product images resolve (${products.length} product)`);
