// Scans public/products/spin/ and records which turntable frames exist.
//
// The browser cannot list a directory, so the frame list has to be resolved at
// build time. Drop frames in, rebuild, and the spin viewer picks them up; with
// no frames the hero falls back to the layered still.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "public/products/spin");
const out = path.join(root, "src/data/spin-frames.json");

let frames = [];
if (fs.existsSync(dir)) {
  frames = fs
    .readdirSync(dir)
    .filter((f) => /^\d{3}\.(png|jpg|jpeg|webp|avif)$/i.test(f))
    .sort()
    .map((f) => `/products/spin/${f}`);
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ frames }, null, 2) + "\n");

console.log(
  frames.length
    ? `✓ turntable: ${frames.length} frames (${(360 / frames.length).toFixed(1)}° apart)`
    : "✓ turntable: no frames yet, hero uses the layered still"
);
