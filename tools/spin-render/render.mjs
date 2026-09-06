import { chromium } from 'playwright';
import { cap, bottle, gummy } from './build.mjs';
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = '/home/user/glow-gummies-store/public/products';
fs.mkdirSync(OUT, { recursive: true });

// Google Fonts is unreachable from the browser here, so the real font files
// (fetched over the shell's proxy) are inlined as data URIs.
const b64 = f => fs.readFileSync(path.join(HERE, f)).toString('base64');
const face = (family, file, weight = 400) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-display:block;` +
  `src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;

const pac = fs.readdirSync(HERE).filter(f => f.startsWith('pacifico') && f.endsWith('.woff2'));
const arc = fs.readdirSync(HERE).filter(f => f.startsWith('archivo') && f.endsWith('.woff2'));

const css = [
  ...pac.map(f => face('Pacifico', f)),
  ...arc.flatMap(f => [500, 600, 700].map(w => face('Archivo', f, w))),
].join('\n');

const html = `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;background:transparent}
${css}
.shot{display:inline-block;line-height:0}
</style><body>
<div id="preload" style="position:absolute;visibility:hidden">
  <span style="font-family:Pacifico;font-size:40px">Glow</span>
  <span style="font-family:Archivo;font-weight:500">A</span>
  <span style="font-family:Archivo;font-weight:600">A</span>
  <span style="font-family:Archivo;font-weight:700">A</span>
</div>
</body>`;

const jobs = [
  ['glow-cap.png',         cap(),         620, 296],
  ['glow-bottle-body.png', bottle(false), 760, 1470],
  ['glow-bottle.png',      bottle(true),  760, 1470],
  ['glow-gummy-1.png',     gummy(0),      140, 140],
  ['glow-gummy-2.png',     gummy(1),      140, 140],
  ['glow-gummy-3.png',     gummy(2),      140, 140],
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await browser.newPage({ deviceScaleFactor: 1.5 });
await p.setContent(html);
// Fonts only fetch once something references them; ask for each face explicitly.
await p.evaluate(async () => {
  await Promise.all([
    document.fonts.load('100px Pacifico'),
    document.fonts.load('500 40px Archivo'),
    document.fonts.load('600 40px Archivo'),
    document.fonts.load('700 40px Archivo'),
  ]);
  await document.fonts.ready;
});
console.log('Pacifico loaded:', await p.evaluate(() => document.fonts.check('100px Pacifico')));
console.log('Archivo loaded :', await p.evaluate(() => document.fonts.check('700 80px Archivo')));

for (const [name, svg, w, h] of jobs) {
  await p.setViewportSize({ width: w, height: h });
  await p.evaluate(s => { document.body.innerHTML = `<div class="shot">${s}</div>`; }, svg);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(250);
  await p.locator('.shot').screenshot({ path: `${OUT}/${name}`, omitBackground: true });
  console.log(`  ${name.padEnd(22)} ${(fs.statSync(`${OUT}/${name}`).size/1024).toFixed(0)} kB`);
}
await browser.close();
