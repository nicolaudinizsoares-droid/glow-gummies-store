// Shared SVG fragments for the Glow product artwork.
export const CREAM = '#F6E9CE';
export const GOLD  = '#C39A5B';
export const INK   = '#14110F';
export const BERRY = '#A81E28';
export const BERRY_HI = '#C8323C';

// A cluster of gummies, clipped to the bottle interior.
export const gummies = (cx, cy, w, h, seed = 0) => {
  const out = [];
  const rows = Math.ceil(h / 46);
  const cols = Math.ceil(w / 52);
  let n = seed;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      n = (n * 9301 + 49297) % 233280;
      const jx = (n / 233280 - 0.5) * 26;
      n = (n * 9301 + 49297) % 233280;
      const jy = (n / 233280 - 0.5) * 20;
      n = (n * 9301 + 49297) % 233280;
      const rot = (n / 233280 - 0.5) * 50;
      const x = cx - w / 2 + c * 52 + 26 + jx;
      const y = cy - h / 2 + r * 46 + 23 + jy;
      const fill = (r + c) % 3 === 0 ? BERRY_HI : BERRY;
      out.push(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})">
        <path d="M0-19c10.5 0 18 7.5 18 17.5v13c0 5-4 9-9 9h-18c-5 0-9-4-9-9v-13C-18-11.5-10.5-19 0-19Z" fill="${fill}"/>
        <ellipse cx="-6" cy="-8" rx="5" ry="6.5" fill="#fff" opacity=".22"/>
      </g>`);
    }
  }
  return out.join('\n');
};
