// Builds the full wrap-around label as one wide texture.
//
// The front panel is the one already on the flat artwork. The side panels
// carry the Supplement Facts table and the directions, both read from the
// product data, so the bottle you can rotate shows the same figures the site
// does rather than decorative filler.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/home/user/glow-gummies-store';
const product = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/products.json'), 'utf8'))[0];

const CREAM = '#F7EBD1', GOLD = '#C6A063', INK = '#141210';

// 2900x1000 ~ a 60mm bottle's circumference against a 65mm tall label.
export const W = 2900, H = 1000;

const factsRows = product.supplement_facts
  .map((r, i) => `
    <tr>
      <td>${r.name}</td>
      <td class="n">${r.amount}</td>
      <td class="n">${r.daily_value ?? '***'}</td>
    </tr>`)
  .join('');

export const labelHtml = (fontCss) => `<!doctype html><meta charset="utf-8"><style>
${fontCss}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:${CREAM};font-family:Archivo,sans-serif;color:${INK};display:flex}
.panel{height:${H}px;padding:30px 28px;position:relative;overflow:hidden}

.rule{position:absolute;inset:20px;border:2px solid ${GOLD};border-radius:14px;pointer-events:none}
.rule.inner{inset:29px;border-width:1px;border-radius:9px}

/* ---- front ---- */
.front{width:1160px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.wordmark{font-family:Pacifico;font-size:132px;line-height:1;position:relative}
.wordmark i{position:absolute;top:-4px;right:-56px;font-style:normal;font-size:58px}
.name{font-size:94px;font-weight:700;letter-spacing:-2px;line-height:1.05;margin-top:26px}
.kind{font-size:52px;font-weight:600;letter-spacing:5px;margin-top:20px}
.flavour{font-size:48px;font-weight:500;margin-top:10px;line-height:1.25}
.net{font-size:34px;font-weight:600;margin-top:26px;padding-top:18px;border-top:1px solid ${GOLD};width:70%}

/* ---- supplement facts ---- */
.facts{width:900px}
.facts h2{font-size:44px;font-weight:700;letter-spacing:-1px}
.facts .serving{font-size:26px;margin-top:8px;font-weight:500}
table{width:100%;border-collapse:collapse;margin-top:12px;font-size:21px}
th{text-align:left;font-weight:700;border-bottom:4px solid ${INK};padding:6px 0}
td{padding:2.5px 0;border-bottom:1px solid ${INK}33}
td.n{text-align:right;white-space:nowrap;padding-left:12px}
.foot{font-size:18px;margin-top:9px;line-height:1.4}

/* ---- directions ---- */
.dir{width:840px}
.dir h2{font-size:44px;font-weight:700;letter-spacing:-1px}
.dir p{font-size:27px;line-height:1.5;margin-top:14px}
.dir .warn{margin-top:26px;font-size:24px;line-height:1.5;padding-top:18px;border-top:1px solid ${GOLD}}
.dir .badges{margin-top:26px;font-size:24px;font-weight:600;letter-spacing:2px;line-height:1.9}
</style>
<body>
  <div class="panel dir">
    <div class="rule"></div><div class="rule inner"></div>
    <div style="padding:26px 22px">
      <h2>Directions</h2>
      <p>${product.serving.directions}</p>
      <div class="warn">
        <strong>Contains:</strong> ${product.allergens.join(', ')}.<br>
        Keep out of reach of children. Store in a cool, dry place.
        Consult your doctor if pregnant, nursing or taking medication.
      </div>
      <div class="badges">${product.dietary_badges.map(b => b.toUpperCase()).join('<br>')}</div>
    </div>
  </div>

  <div class="panel front">
    <div class="rule"></div><div class="rule inner"></div>
    <div class="wordmark">Glow<i>✦</i></div>
    <div class="name">HAIR, SKIN<br>&amp; NAILS</div>
    <div class="kind">GUMMIES</div>
    <div class="flavour">${product.flavor.toUpperCase()}<br>FLAVOR</div>
    <div class="net">NET WT. ${product.net_weight} | ${product.serving.gummy_count} GUMMIES</div>
  </div>

  <div class="panel facts">
    <div class="rule"></div><div class="rule inner"></div>
    <div style="padding:26px 22px">
      <h2>Supplement Facts</h2>
      <div class="serving">Serving size ${product.serving.size} &middot; ${product.serving.per_container} servings per container</div>
      <table>
        <thead><tr><th>Amount per serving</th><th class="n"></th><th class="n">%DV</th></tr></thead>
        <tbody>${factsRows}</tbody>
      </table>
      <div class="foot">
        ${product.supplement_facts_footnotes.map((n, i) => `${'*'.repeat(i + 2)} ${n}`).join('<br>')}
      </div>
    </div>
  </div>
</body>`;
