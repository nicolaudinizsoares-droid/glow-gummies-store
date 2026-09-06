// Shared @font-face CSS with the real font files inlined, since Google Fonts
// is unreachable from the browser in this environment.
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const b64 = f => fs.readFileSync(path.join(HERE, f)).toString('base64');
const face = (fam, file, w = 400) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-display:block;` +
  `src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;

const pac = fs.readdirSync(HERE).filter(f => f.startsWith('pacifico') && f.endsWith('.woff2'));
const arc = fs.readdirSync(HERE).filter(f => f.startsWith('archivo') && f.endsWith('.woff2'));

export const fontCss = [
  ...pac.map(f => face('Pacifico', f)),
  ...arc.flatMap(f => [500, 600, 700].map(w => face('Archivo', f, w))),
].join('\n');

export const loadFonts = async (page) => {
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('100px Pacifico'),
      document.fonts.load('500 40px Archivo'),
      document.fonts.load('600 40px Archivo'),
      document.fonts.load('700 40px Archivo'),
    ]);
    await document.fonts.ready;
  });
};
