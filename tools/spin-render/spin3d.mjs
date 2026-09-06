// Renders the turntable frames from a real 3D bottle.
//
// A cylinder body in translucent PET, the wrap-around label as a texture, a
// ribbed cap, and a heap of gummies inside. Lit with a key, a fill and a rim,
// then photographed 36 times while the bottle rotates -- exactly the setup the
// photography brief describes, done in software.
//
// This is a model of the bottle, not a photograph of it. The proportions and
// the label are right; the material is an approximation.

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { labelHtml, W, H } from './label-wrap.mjs';
import { fontCss, loadFonts } from './fonts.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = '/home/user/glow-gummies-store/public/products/spin';
const FRAMES = 24;
const SIZE = 820;

fs.mkdirSync(OUT, { recursive: true });

const LIB = path.join(HERE, 'lib');

// ES modules cannot be imported over file:// (CORS), so serve the scene and
// the three build over a throwaway local server.
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '') || 'scene.html';
  const file = path.join(HERE, rel);
  if (!file.startsWith(HERE) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

// 1. Render the label to a data URI first.
const labelPage = await browser.newPage({ viewport: { width: W, height: H } });
await labelPage.setContent(labelHtml(fontCss));
await loadFonts(labelPage);
await labelPage.waitForTimeout(300);
const labelBuf = await labelPage.screenshot();
const labelUri = 'data:image/png;base64,' + labelBuf.toString('base64');
await labelPage.close();

// 2. Build the scene and render each frame.
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
page.on('console', m => { if (m.type() === 'error') console.log('  page error:', m.text()); });
page.on('pageerror', e => console.log('  PAGE ERROR:', e.message));

const sceneHtml = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;background:transparent;overflow:hidden}canvas{display:block}</style>
<body><script type="module">
import * as THREE from './lib/three.module.min.js';
window.__ready = (async () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0.9, 25);
  camera.lookAt(0, 0.55, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setSize(${SIZE}, ${SIZE});
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  document.body.appendChild(renderer.domElement);

  // --- lighting: key, fill, rim, matching the brief's setup -------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xfff6ec, 2.5);  key.position.set(-5, 7, 7);
  const fill = new THREE.DirectionalLight(0xeaf0ff, 1.0); fill.position.set(6, 2, 5);
  const rim = new THREE.DirectionalLight(0xffffff, 2.0);  rim.position.set(2, 4, -7);
  scene.add(key, fill, rim);

  const bottle = new THREE.Group();
  scene.add(bottle);

  const R = 2.05;              // body radius
  const BODY_H = 6.4;

  // --- gummies inside ---------------------------------------------------
  const gummyGeo = new THREE.SphereGeometry(0.34, 12, 10);
  const gummyMats = [0xA81E28, 0xB72731, 0x8E1720].map(c =>
    new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.32, transmission: 0.25, thickness: 0.5, clearcoat: 0.6 }));
  let seed = 8;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  for (let i = 0; i < 420; i++) {
    const m = new THREE.Mesh(gummyGeo, gummyMats[i % 3]);
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * (R - 0.42);
    m.position.set(Math.cos(a) * r, -BODY_H / 2 + 0.4 + Math.pow(rnd(), 2.1) * 5.2, Math.sin(a) * r);
    m.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    m.scale.setScalar(0.85 + rnd() * 0.4);
    bottle.add(m);
  }

  // --- body: clear PET --------------------------------------------------
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R * 0.985, BODY_H, 96, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: 0xEDF1F2, roughness: 0.12, metalness: 0,
      transparent: true, opacity: 0.17, side: THREE.DoubleSide,
      clearcoat: 1, clearcoatRoughness: 0.06, depthWrite: false,
    }));
  bottle.add(body);

  // rounded shoulder + base
  const shoulderMat = body.material;
  const shoulder = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 20, 0, Math.PI * 2, 0, Math.PI * 0.42), shoulderMat);
  shoulder.position.y = BODY_H / 2 - 0.02; shoulder.scale.y = 0.62; bottle.add(shoulder);
  const base = new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 16, 0, Math.PI * 2, Math.PI * 0.58, Math.PI * 0.42), shoulderMat);
  base.position.y = -BODY_H / 2 + 0.02; base.scale.y = 0.4; bottle.add(base);

  // --- label wrapped around the body ------------------------------------
  const tex = await new THREE.TextureLoader().loadAsync(${JSON.stringify(labelUri)});
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  // The front panel sits mid-texture; offset so it faces camera at frame 0.
  tex.offset.x = 0.5;
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(R * 1.004, R * 1.004, 3.9, 96, 1, true),
    new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.62, clearcoat: 0.35, side: THREE.DoubleSide }));
  label.position.y = -0.75;
  bottle.add(label);

  // --- neck and cap ------------------------------------------------------
  const neckMat = body.material;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.52, R * 0.55, 0.9, 48, 1, true), neckMat);
  neck.position.y = BODY_H / 2 + 0.78; bottle.add(neck);

  const capMat = new THREE.MeshPhysicalMaterial({ color: 0xf7f6f3, roughness: 0.36, clearcoat: 0.5, clearcoatRoughness: 0.3 });
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.60, R * 0.60, 0.95, 96), capMat);
  cap.position.y = BODY_H / 2 + 1.55; bottle.add(cap);
  // ribs
  const ribGeo = new THREE.BoxGeometry(0.032, 0.78, 0.05);
  const ribMat = new THREE.MeshStandardMaterial({ color: 0xdedbd5, roughness: 0.6 });
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const rib = new THREE.Mesh(ribGeo, ribMat);
    rib.position.set(Math.cos(a) * R * 0.603, BODY_H / 2 + 1.53, Math.sin(a) * R * 0.603);
    rib.rotation.y = -a; bottle.add(rib);
  }

  window.__render = (i) => {
    bottle.rotation.y = (i / ${FRAMES}) * Math.PI * 2;
    renderer.render(scene, camera);
  };
  window.__render(0);
  return true;
})();
</script></body>`;
fs.writeFileSync(path.join(HERE, 'scene.html'), sceneHtml);
await page.goto(ORIGIN + '/scene.html');

await page.waitForFunction('window.__ready !== undefined', null, { timeout: 30000 });
await page.evaluate('window.__ready');
await page.waitForTimeout(500);

for (let i = 0; i < FRAMES; i++) {
  await page.evaluate((n) => window.__render(n), i);
  await page.waitForTimeout(60);
  await page.locator('canvas').screenshot({
    path: `${OUT}/${String(i + 1).padStart(3, '0')}.png`,
    omitBackground: true,
  });
}
const total = fs.readdirSync(OUT).filter(f => f.endsWith('.png'))
  .reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`${FRAMES} frames rendered, ${(total / 1024).toFixed(0)} kB total`);
await browser.close();
server.close();
