// Corrects the net-weight declaration printed on the label in the product
// photography, so the imagery agrees with the product data.
//
// The photography was shot against pre-production packaging: two shots read
// 10.1 oz (286 g) and a third read 10.58 oz (300 g), while the product is
// 6.56 oz (186 g). Net weight is a required declaration, so a bottle on the
// page cannot show a figure the page contradicts.
//
// It works on the full-resolution originals, not the derived crops, so one
// pass propagates to every hero beat and gallery frame the crop pipeline
// builds afterwards.
//
// Method: find the printed line by its own darkness inside a search box,
// measure its baseline angle, rebuild the label stock underneath it from the
// clean stock around it (the cream carries a gradient, so a flat fill shows),
// then typeset the replacement at the same size, angle, colour and width.
//
// Usage: node relabel.mjs <jobs.json> <source-dir>
//
// It cannot do every shot. Where the printed line sits within a few pixels of
// its neighbours there is not enough clean label to rebuild from, and the
// patch shows -- see the in-hand shot, which was dropped from the site rather
// than retouched badly. Measure before assuming a shot is workable.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[3] || process.cwd();
const arc = fs.readdirSync(HERE).filter(f => f.startsWith('archivo') && f.endsWith('.woff2'));
const faces = arc.flatMap(f => [500, 600, 700].map(w =>
  `@font-face{font-family:'Archivo';font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(HERE, f)).toString('base64')}) format('woff2');}`
)).join('\n');

const JOBS = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 100, height: 100 } });
await page.setContent(`<style>${faces}</style><body style="margin:0"></body>`);
// Each face has to be asked for by name; awaiting document.fonts.ready alone
// lets the render fall back to a serif without saying so.
await page.evaluate(async () => {
  await Promise.all([document.fonts.load('600 40px Archivo'), document.fonts.load('500 40px Archivo')]);
  await document.fonts.ready;
});

for (const job of JOBS) {
  const uri = 'data:image/png;base64,' + fs.readFileSync(path.join(SRC, job.src)).toString('base64');
  const r = await page.evaluate(async ({ uri, job }) => {
    const img = new Image(); img.src = uri; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0);

    // --- find the printed line inside the search box -----------------------
    const bx = Math.round(W * job.box[0]), by = Math.round(H * job.box[1]);
    const bw = Math.round(W * job.box[2]), bh = Math.round(H * job.box[3]);
    const d = x.getImageData(bx, by, bw, bh).data;
    const lum = i => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    const T = job.threshold ?? 110;
    // Printed ink is neutral; the gummies showing through the glass below the
    // label are saturated red and fall under the same luminance threshold.
    // Without this test they read as part of the line, which throws the
    // baseline fit, the cap height and the extent of the patch.
    const SAT = job.sat ?? 38;
    const neutral = i => (Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2])) <= SAT;
    const cols = new Map();          // column -> [topmost, lowest]
    let minX = bw, maxX = -1, minY = bh, maxY = -1, n = 0;
    for (let yy = 0; yy < bh; yy++) for (let xx = 0; xx < bw; xx++) {
      const i0 = (yy * bw + xx) * 4;
      if (lum(i0) < T && neutral(i0)) {
        n++;
        if (xx < minX) minX = xx; if (xx > maxX) maxX = xx;
        if (yy < minY) minY = yy; if (yy > maxY) maxY = yy;
        const e = cols.get(xx); if (!e) cols.set(xx, [yy, yy]);
        else { if (yy < e[0]) e[0] = yy; if (yy > e[1]) e[1] = yy; }
      }
    }
    if (maxX < 0) return { error: 'no ink found in the search box' };

    // Baseline angle: least-squares fit through the lowest ink per column,
    // which tracks the baseline rather than the ascenders.
    let sx = 0, sy = 0, sxy = 0, sxx = 0, m = 0;
    for (const [cx, [, lo]] of cols) { sx += cx; sy += lo; sxy += cx * lo; sxx += cx * cx; m++; }
    const slope = m > 1 ? (m * sxy - sx * sy) / (m * sxx - sx * sx) : 0;
    const angle = Math.atan(slope);

    // Ink colour: mean of the darkest tenth, which is the core of the strokes
    // rather than their antialiased edges.
    const darks = [];
    for (let yy = 0; yy < bh; yy++) for (let xx = 0; xx < bw; xx++) {
      const i = (yy * bw + xx) * 4;
      if (lum(i) < T && neutral(i)) darks.push([d[i], d[i + 1], d[i + 2], lum(i)]);
    }
    darks.sort((a, b) => a[3] - b[3]);
    const keep = darks.slice(0, Math.max(1, Math.floor(darks.length * 0.1)));
    const ink = [0, 1, 2].map(k => Math.round(keep.reduce((s, v) => s + v[k], 0) / keep.length));

    // Cap metrics from medians, not extremes. The run's tallest ink is the
    // parentheses and the pipe, which overshoot the caps, and its lowest is
    // the descender of "(286g)" -- taking the outermost ink for either
    // oversizes the replacement by a third.
    const midX = (minX + maxX) / 2;
    const pad = job.pad ?? 6;
    const med = a => { const s = [...a].sort((p, q) => p - q); return s[s.length >> 1]; };
    const tops = [], lows = [];
    for (const [cx, [hi, lo]] of cols) {
      tops.push(hi - slope * (cx - midX));
      lows.push(lo - slope * (cx - midX));
    }
    const baseline = med(lows);
    const capH = baseline - med(tops);

    // --- rebuild the label stock under the line ----------------------------
    // The patch follows the printed line's own angle rather than sitting in an
    // axis-aligned box. Where the bottle is tilted, a rectangle tight enough
    // to cover the text also dips past the bottom edge of the label, and
    // filling through that drags the gummies up into the label stock.
    //
    // Walk the destination pixels, inverse-rotate each into the line's frame,
    // and replace only what falls inside the band -- so nothing outside it is
    // resampled at all.
    let vTop = Infinity, vBot = -Infinity;
    for (const [cx, [hi, lo]] of cols) {
      vTop = Math.min(vTop, hi - slope * (cx - midX) - baseline);
      vBot = Math.max(vBot, lo - slope * (cx - midX) - baseline);
    }
    vTop -= pad; vBot += pad;
    let halfU = (maxX - minX) / 2 + pad;
    let ox = bx + midX, oy = by + baseline;     // origin: centre of the baseline
    let ang = angle, capUse = capH;

    // Where the line sits close to its neighbours -- the flavour line above,
    // the label's bottom edge below -- detection cannot find its extent
    // without swallowing them, so the geometry is given instead. Measure it
    // off the pixels; do not eyeball it off a zoom.
    if (job.geom) {
      const g = job.geom;
      ox = g.cx * W; oy = g.baseY * H;
      ang = (g.angleDeg ?? 0) * Math.PI / 180;
      halfU = g.halfWidth * W;
      vTop = g.vTop; vBot = g.vBot;
      capUse = g.cap;
    }

    // Rows of clean stock to rebuild from. "above" and "below" copy from one
    // side rather than interpolating across, for lines with no clean label
    // left on the other side to reach towards.
    const sTop = job.fill === 'below' ? vBot + 3 : vTop - 3;
    const sBot = job.fill === 'above' ? vTop - 3 : vBot + 3;

    const px8 = x.getImageData(0, 0, W, H);
    const src = new Uint8ClampedArray(px8.data);       // sample from a frozen copy
    const at = (fx, fy) => {                           // bilinear sample
      const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
      const out = [0, 0, 0];
      for (let k = 0; k < 3; k++) {
        const g = (gx, gy) => src[((Math.min(H - 1, Math.max(0, gy)) * W) + Math.min(W - 1, Math.max(0, gx))) * 4 + k];
        out[k] = (g(x0, y0) * (1 - tx) + g(x0 + 1, y0) * tx) * (1 - ty)
               + (g(x0, y0 + 1) * (1 - tx) + g(x0 + 1, y0 + 1) * tx) * ty;
      }
      return out;
    };

    // Axis-aligned bounds of the rotated band, so the loop stays small.
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const corners = [[-halfU, vTop], [halfU, vTop], [-halfU, vBot], [halfU, vBot]]
      .map(([u, v]) => [ox + u * ca - v * sa, oy + u * sa + v * ca]);
    const loX = Math.max(0, Math.floor(Math.min(...corners.map(p => p[0]))));
    const hiX = Math.min(W - 1, Math.ceil(Math.max(...corners.map(p => p[0]))));
    const loY = Math.max(0, Math.floor(Math.min(...corners.map(p => p[1]))));
    const hiY = Math.min(H - 1, Math.ceil(Math.max(...corners.map(p => p[1]))));

    let painted = 0;
    for (let py = loY; py <= hiY; py++) {
      for (let pxx = loX; pxx <= hiX; pxx++) {
        const dx = pxx - ox, dy = py - oy;
        const u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
        if (u < -halfU || u > halfU || v < vTop || v > vBot) continue;
        const a = at(ox + u * ca - sTop * sa, oy + u * sa + sTop * ca);
        const b = at(ox + u * ca - sBot * sa, oy + u * sa + sBot * ca);
        // A one-sided fill puts both sample rows in the same place. Guard the
        // division: without it t is Infinity, every channel resolves to NaN,
        // and a NaN written into a Uint8ClampedArray clamps to 0 -- the patch
        // comes out solid black.
        const span = sBot - sTop;
        const t = span === 0 ? 0 : (v - sTop) / span;
        const i = (py * W + pxx) * 4;
        for (let k = 0; k < 3; k++) px8.data[i + k] = Math.round(a[k] * (1 - t) + b[k] * t);
        px8.data[i + 3] = 255;
        painted++;
      }
    }
    x.putImageData(px8, 0, 0);

    // --- typeset the replacement -------------------------------------------
    x.save();
    x.translate(ox, oy);
    x.rotate(ang);
    x.fillStyle = `rgb(${ink[0]},${ink[1]},${ink[2]})`;
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic';
    // Size to the measured cap height, then squeeze horizontally to reproduce
    // the original run length -- the printed face is condensed, Archivo is not.
    // A squeeze far from the others in a set means the geometry is wrong.
    const probe = 100;
    x.font = `${job.weight ?? 500} ${probe}px Archivo`;
    const capRatio = (x.measureText('H').actualBoundingBoxAscent || 72) / probe;
    x.font = `${job.weight ?? 500} ${capUse / capRatio}px Archivo`;
    const target = 2 * halfU - 2 * pad;
    const natural = x.measureText(job.text).width;
    x.scale(target / natural, 1);
    x.fillText(job.text, 0, 0);
    x.restore();

    return {
      uri: c.toDataURL('image/png'),
      angle: (ang * 180 / Math.PI).toFixed(2), ink, px: n,
      cap: capUse.toFixed(0), squeeze: (target / natural).toFixed(3), painted,
    };
  }, { uri, job });

  if (r.error) { console.log(`  ${job.src}: ${r.error}`); continue; }
  fs.writeFileSync(path.join(SRC, job.out), Buffer.from(r.uri.split(',')[1], 'base64'));
  console.log(`  ${job.src.padEnd(18)} -> ${job.out.padEnd(18)} cap ${r.cap}  angle ${r.angle}deg  ink rgb(${r.ink})  squeeze ${r.squeeze}  (${r.px} ink px, ${r.painted} repainted)`);
}
await browser.close();
