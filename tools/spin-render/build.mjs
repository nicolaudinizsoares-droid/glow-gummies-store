import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Read from the product data rather than restating it; a hardcoded net weight
// here is how the artwork drifts away from the site.
const DATA = fileURLToPath(new URL('../../src/data/products.json', import.meta.url));
const PRODUCT = JSON.parse(fs.readFileSync(DATA, 'utf8'))[0];
const NET_WEIGHT = PRODUCT.net_weight;
const GUMMY_COUNT = PRODUCT.serving.gummy_count;

export const CREAM = '#F7EBD1';
export const GOLD  = '#C6A063';
export const INK   = '#141210';
export const BERRY   = '#A81E28';
export const BERRY_2 = '#B72731';
export const BERRY_3 = '#8E1720';

/* Loose pile of gummies. Fewer, larger and irregular so it reads as sweets
   through glass rather than a dot pattern. */
const pile = (cx, cy, w, h, count, seed) => {
  let n = seed;
  const rnd = () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648);
  const out = [];
  for (let i = 0; i < count; i++) {
    const x = cx - w / 2 + rnd() * w;
    const y = cy - h / 2 + rnd() * h;
    const s = 0.52 + rnd() * 0.30;
    const rot = (rnd() - 0.5) * 70;
    const fill = [BERRY, BERRY_2, BERRY_3][Math.floor(rnd() * 3)];
    out.push(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s.toFixed(2)})">
      <path d="M0-30c17 0 29 12 29 28v20c0 8-6 15-14 15h-30c-8 0-14-7-14-15v-20C-29-18-17-30 0-30Z" fill="${fill}"/>
      <ellipse cx="-10" cy="-13" rx="8" ry="10" fill="#fff" opacity=".2"/>
    </g>`);
  }
  return out.join('\n');
};

const label = (x, y, w, h) => {
  const cx = x + w / 2;
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${CREAM}"/>
    <rect x="${x + 18}" y="${y + 18}" width="${w - 36}" height="${h - 36}" rx="18"
          fill="none" stroke="${GOLD}" stroke-width="3.5"/>
    <rect x="${x + 27}" y="${y + 27}" width="${w - 54}" height="${h - 54}" rx="12"
          fill="none" stroke="${GOLD}" stroke-width="1.5"/>

    <text x="${cx}" y="${y + 138}" text-anchor="middle"
          font-family="Pacifico" font-size="104" fill="${INK}">Glow</text>
    <path d="M${cx + 132} ${y + 36} q5 30 30 35 q-25 5 -30 35 q-5 -30 -30 -35 q25 -5 30 -35Z" fill="${INK}"/>

    <text x="${cx}" y="${y + 246}" text-anchor="middle" font-family="Archivo"
          font-weight="700" font-size="76" letter-spacing="-2" fill="${INK}">HAIR, SKIN</text>
    <text x="${cx}" y="${y + 324}" text-anchor="middle" font-family="Archivo"
          font-weight="700" font-size="76" letter-spacing="-2" fill="${INK}">&amp; NAILS</text>

    <text x="${cx}" y="${y + 392}" text-anchor="middle" font-family="Archivo"
          font-weight="600" font-size="46" letter-spacing="4" fill="${INK}">GUMMIES</text>
    <text x="${cx}" y="${y + 446}" text-anchor="middle" font-family="Archivo"
          font-weight="500" font-size="44" fill="${INK}">PASSION FRUIT</text>
    <text x="${cx}" y="${y + 494}" text-anchor="middle" font-family="Archivo"
          font-weight="500" font-size="44" fill="${INK}">FLAVOR</text>

    <line x1="${x + 48}" y1="${y + 532}" x2="${x + w - 48}" y2="${y + 532}"
          stroke="${GOLD}" stroke-width="1.5"/>
    <text x="${cx}" y="${y + 578}" text-anchor="middle" font-family="Archivo"
          font-weight="600" font-size="28" letter-spacing="-0.3" fill="${INK}">NET WT. ${NET_WEIGHT} | ${GUMMY_COUNT} GUMMIES</text>
  </g>`;
};

/* White ribbed screw cap, very slightly from above. */
export const capSvg = (id = 'a') => `
  <defs>
    <linearGradient id="cb${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#CFCBC3"/><stop offset=".08" stop-color="#FAF9F7"/>
      <stop offset=".45" stop-color="#FFFFFF"/><stop offset=".86" stop-color="#EBE8E1"/>
      <stop offset="1" stop-color="#C6C2BA"/>
    </linearGradient>
    <linearGradient id="ct${id}" x1=".2" y1="0" x2=".8" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EDEAE4"/>
    </linearGradient>
  </defs>
  <path d="M40 74 h540 v148 a270 54 0 0 1 -540 0 Z" fill="url(#cb${id})"/>
  ${Array.from({ length: 53 }, (_, i) => {
    const t = i / 52, x = 45 + t * 530, edge = Math.sin(Math.PI * t);
    return `<line x1="${x.toFixed(1)}" y1="${(82 + (1 - edge) * 10).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(220 + edge * 28).toFixed(1)}" stroke="#000" stroke-opacity="${(0.045 + (1 - edge) * 0.055).toFixed(3)}" stroke-width="3.4"/>`;
  }).join('')}
  <ellipse cx="310" cy="74" rx="270" ry="54" fill="url(#ct${id})"/>
  <ellipse cx="310" cy="74" rx="243" ry="45" fill="none" stroke="#000" stroke-opacity=".045"/>`;

export const cap = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 296" width="620" height="296">${capSvg('s')}</svg>`;

/* Clear PET jar with rounded shoulders. */
export const bottle = (capped) => {
  const BODY = 'M104 402 q0-104 96-140 h360 q96 36 96 140 v880 q0 86-86 86 h-380 q-86 0-86-86 Z';
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 1470" width="760" height="1470">
  <defs>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#B9B6AF" stop-opacity=".42"/>
      <stop offset=".07" stop-color="#FFFFFF" stop-opacity=".22"/>
      <stop offset=".40" stop-color="#FFFFFF" stop-opacity=".07"/>
      <stop offset=".82" stop-color="#CFCCC5" stop-opacity=".26"/>
      <stop offset="1" stop-color="#ABA8A1" stop-opacity=".45"/>
    </linearGradient>
    <clipPath id="inside"><path d="${BODY}"/></clipPath>
  </defs>

  <!-- threaded neck -->
  <path d="M292 ${capped ? 150 : 176} h176 v130 h-176 Z" fill="url(#glass)"/>
  ${capped ? '' : [0, 40, 80].map(o => `
    <path d="M292 ${188 + o} h176 v22 h-176 Z" fill="#fff" fill-opacity=".3"/>
    <path d="M292 ${188 + o} h176" stroke="#98958E" stroke-opacity=".42" stroke-width="2.5"/>`).join('')}
  ${capped ? '' : `<ellipse cx="380" cy="176" rx="88" ry="21" fill="#E8E5DF" fill-opacity=".75"/>
    <ellipse cx="380" cy="176" rx="66" ry="14" fill="#B9B6AF" fill-opacity=".55"/>`}

  <path d="${BODY}" fill="url(#glass)"/>
  <g clip-path="url(#inside)">
    ${pile(380, 585, 495, 205, 46, 991)}
    ${pile(380, 1336, 495, 70, 22, 553)}
  </g>
  <path d="${BODY}" fill="none" stroke="#98958E" stroke-opacity=".4" stroke-width="3"/>
  <path d="M168 430 q4-62 52-88 v856 q-48-20-52-74 Z" fill="#fff" fill-opacity=".16"/>
  <path d="M614 452 v800" stroke="#fff" stroke-opacity=".11" stroke-width="16"/>

  ${label(104, 690, 552, 620)}

  ${capped ? `<g transform="translate(70 -8) scale(0.79)">${capSvg('c')}</g>` : ''}
</svg>`;
};

export const gummy = (v) => {
  const rot = [-14, 9, 24][v] ?? 0;
  const fill = [BERRY, BERRY_2, BERRY_3][v] ?? BERRY;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140">
  <g transform="translate(70 74) rotate(${rot}) scale(1.75)">
    <path d="M0-30c17 0 29 12 29 28v20c0 8-6 15-14 15h-30c-8 0-14-7-14-15v-20C-29-18-17-30 0-30Z" fill="${fill}"/>
    <ellipse cx="-10" cy="-13" rx="8" ry="10" fill="#fff" opacity=".24"/>
  </g></svg>`;
};
