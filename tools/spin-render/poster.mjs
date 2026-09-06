import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = '/home/user/glow-gummies-store/public/products';

const b64 = f => fs.readFileSync(path.join(HERE, f)).toString('base64');
const face = (fam, file, w = 400) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;
const pac = fs.readdirSync(HERE).filter(f => f.startsWith('pacifico') && f.endsWith('.woff2'));
const arc = fs.readdirSync(HERE).filter(f => f.startsWith('archivo') && f.endsWith('.woff2'));
const bottleB64 = fs.readFileSync(`${OUT}/glow-bottle.png`).toString('base64');

const NAVY = '#0F2A4C', BLUSH = '#E0A093', CREAM = '#FDF3E3', GOLD = '#C6A063';

const html = `<!doctype html><meta charset="utf-8"><style>
${[...pac.map(f => face('Pacifico', f)), ...arc.flatMap(f => [500,600,700].map(w => face('Archivo', f, w)))].join('\n')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1024px;height:1536px;font-family:Archivo,sans-serif;background:${CREAM};display:flex;flex-direction:column}
.top{flex:1;padding:48px 60px 0;min-height:0;overflow:hidden;display:flex;flex-direction:column}
.logo{font-family:Pacifico;font-size:52px;color:${NAVY};position:relative;display:inline-block;line-height:1}
.logo i{position:absolute;top:-6px;right:-22px;font-style:normal;font-size:26px}
h1{font-family:Georgia,serif;font-size:78px;line-height:1.02;color:${NAVY};font-weight:400;margin-top:32px;letter-spacing:-2px}
h1 em{font-style:normal;color:${BLUSH}}
.sub{font-size:26px;color:#5A6472;margin-top:26px;max-width:400px;line-height:1.45}
.rule{height:2px;width:120px;background:${GOLD};margin:24px 0}
.body{display:flex;gap:20px;align-items:flex-start;flex:1}
.left{width:400px;padding-top:4px}
.benefit{display:flex;align-items:center;gap:18px;margin-bottom:20px}
.dot{width:54px;height:54px;border-radius:50%;background:${BLUSH}33;display:flex;align-items:center;justify-content:center;color:${NAVY};font-size:22px}
.benefit span{font-size:21px;font-weight:600;letter-spacing:1.4px;color:${NAVY}}
.shot{flex:1;display:flex;align-items:flex-start;justify-content:center}
.shot img{width:390px;filter:drop-shadow(0 30px 44px rgba(10,29,54,.2))}
.claims{background:${BLUSH};display:flex;justify-content:space-around;align-items:center;padding:22px 40px;flex-shrink:0}
.claims div{color:#fff;font-size:16px;font-weight:600;letter-spacing:2.2px}
.foot{background:${NAVY};color:#fff;padding:30px 60px 26px;text-align:center;flex-shrink:0}
.foot .dose{font-size:24px;letter-spacing:5px;font-weight:600}
.foot .dose em{font-family:Georgia,serif;font-style:italic;letter-spacing:0;font-weight:400;display:block;margin-top:10px;font-size:30px;color:${CREAM}}
.foot .allerg{margin-top:18px;font-size:15px;font-weight:600;color:${CREAM}}
.foot .disc{margin-top:10px;font-size:11.5px;line-height:1.5;color:#ffffffaa;border:1px solid #ffffff33;padding:10px 16px}
</style>
<body>
  <div class="top">
    <div class="logo">Glow<i>✦</i></div>
    <h1>Beauty<br><em>starts from</em><br>within.</h1>
    <div class="rule"></div>
    <div class="body">
      <div class="left">
        <div class="sub">Nourish your hair, skin and nails with every delicious gummy.</div>
        <div style="margin-top:28px">
          <div class="benefit"><div class="dot">✦</div><span>STRONGER HAIR*</span></div>
          <div class="benefit"><div class="dot">✦</div><span>RADIANT SKIN*</span></div>
          <div class="benefit"><div class="dot">✦</div><span>HEALTHY NAILS*</span></div>
        </div>
      </div>
      <div class="shot"><img src="data:image/png;base64,${bottleB64}"></div>
    </div>
  </div>
  <div class="claims"><div>NON-GMO</div><div>GLUTEN FREE</div><div>MADE IN THE USA</div></div>
  <div class="foot">
    <div class="dose">TWO GUMMIES A DAY<em>for the glow you deserve.</em></div>
    <div class="allerg">CONTAINS: FISH (TILAPIA), TREE NUTS (COCONUT)</div>
    <div class="disc">*These statements have not been evaluated by the Food and Drug Administration.<br>This product is not intended to diagnose, treat, cure or prevent any disease.</div>
  </div>
</body>`;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await browser.newPage({ viewport: { width: 1024, height: 1536 }, deviceScaleFactor: 1.5 });
await p.setContent(html);
await p.evaluate(async () => {
  await Promise.all([document.fonts.load('52px Pacifico'), document.fonts.load('600 20px Archivo')]);
  await document.fonts.ready;
});
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/glow-poster.png` });
console.log('poster:', (fs.statSync(`${OUT}/glow-poster.png`).size / 1024).toFixed(0), 'kB');
await browser.close();
