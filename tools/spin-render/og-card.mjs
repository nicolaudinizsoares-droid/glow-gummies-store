// Social share card.
//
// This is the image every link preview shows -- Slack, iMessage, WhatsApp,
// X, Facebook -- so it has to be 1.91:1. The old poster was a 2:3 portrait
// marketing sheet, which those previews crop to a letterbox through the
// middle, cutting off the headline and most of the bottle.
//
// It mirrors the hero: photograph on the right, wordmark and headline on the
// left, same type and palette. Copy comes from the product data so the card
// cannot quote a figure the packaging does not.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const OUT = path.join(ROOT, 'public', 'products');

const PRODUCT = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf8')
)[0];

const b64 = f => fs.readFileSync(path.join(HERE, f)).toString('base64');
const face = (fam, file, w = 400) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;
const pac = fs.readdirSync(HERE).filter(f => f.startsWith('pacifico') && f.endsWith('.woff2'));
const arc = fs.readdirSync(HERE).filter(f => f.startsWith('archivo') && f.endsWith('.woff2'));
const shot = fs.readFileSync(path.join(OUT, 'glow-hero.jpg')).toString('base64');

const NAVY = '#0F2A4C', CREAM = '#FDFBF7', MUTED = '#5A6472';

const html = `<!doctype html><meta charset="utf-8"><style>
${[...pac.map(f => face('Pacifico', f)), ...arc.flatMap(f => [400, 500, 600].map(w => face('Archivo', f, w)))].join('\n')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:Archivo,sans-serif;display:flex;background:${CREAM}}
.left{width:640px;padding:64px 56px;display:flex;flex-direction:column;justify-content:center}
.logo{font-family:Pacifico;font-size:44px;color:${NAVY};position:relative;display:inline-block;line-height:1;align-self:flex-start}
.logo i{position:absolute;top:-4px;right:-19px;font-style:normal;font-size:22px}
.eyebrow{font-size:15px;font-weight:600;letter-spacing:3px;color:${NAVY};margin-top:40px}
h1{font-family:Georgia,serif;font-size:70px;line-height:1.04;color:${NAVY};font-weight:400;margin-top:16px;letter-spacing:-1.5px}
.sub{font-size:22px;color:${MUTED};margin-top:20px;line-height:1.45;max-width:470px}
.meta{margin-top:34px;font-size:14px;font-weight:600;letter-spacing:2.4px;color:${MUTED}}
.shot{width:560px;background:url(data:image/jpeg;base64,${shot}) center/cover no-repeat}
</style>
<body>
  <div class="left">
    <div class="logo">Glow<i>✦</i></div>
    <div class="eyebrow">HAIR, SKIN &amp; NAILS</div>
    <h1>Glow from within.</h1>
    <div class="sub">A daily beauty supplement in a passion fruit gummy you will actually look forward to.</div>
    <div class="meta">${PRODUCT.size.toUpperCase()} &nbsp;·&nbsp; ${PRODUCT.serving.per_container} DAYS &nbsp;·&nbsp; FREE SHIPPING</div>
  </div>
  <div class="shot"></div>
</body>`;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await p.setContent(html);
// Awaiting document.fonts.ready alone is not enough -- each face has to be
// asked for by name or the screenshot silently falls back to a serif.
await p.evaluate(async () => {
  await Promise.all([
    document.fonts.load('44px Pacifico'),
    document.fonts.load('600 15px Archivo'),
    document.fonts.load('400 22px Archivo'),
  ]);
  await document.fonts.ready;
});
await p.waitForTimeout(300);
await p.screenshot({ path: path.join(OUT, 'glow-og.jpg'), type: 'jpeg', quality: 90 });
console.log('og card:', (fs.statSync(path.join(OUT, 'glow-og.jpg')).size / 1024).toFixed(0), 'kB');
await browser.close();
