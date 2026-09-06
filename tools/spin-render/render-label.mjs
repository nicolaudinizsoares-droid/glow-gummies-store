import { chromium } from 'playwright';
import { labelHtml, W, H } from './label-wrap.mjs';
import { fontCss, loadFonts } from './fonts.mjs';

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.setContent(labelHtml(fontCss));
await loadFonts(p);
await p.waitForTimeout(300);
await p.screenshot({ path: '/tmp/claude-0/-home-user-glow-gummies-store/04088324-e480-5289-986a-ca89e8cd80f3/scratchpad/art/label-wrap.png' });
console.log('label wrap rendered', W + 'x' + H);
await b.close();
