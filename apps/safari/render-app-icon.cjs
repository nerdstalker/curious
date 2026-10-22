// Renders apps/safari/AppIcon.svg into every Mac app icon size and the app window's Icon.png.
// Needs puppeteer-core and Google Chrome:
//   NODE_PATH=/path/to/node_modules node apps/safari/render-app-icon.cjs
const fs = require('fs'), path = require('path');
const puppeteer = require('puppeteer-core');
const svg = fs.readFileSync(path.join(__dirname, 'AppIcon.svg'), 'utf8');
const set = path.join(__dirname, 'Curious/Curious/Assets.xcassets/AppIcon.appiconset');
const sizes = {};
for (const n of [16, 32, 128, 256, 512]) { sizes[`mac-icon-${n}@1x.png`] = n; sizes[`mac-icon-${n}@2x.png`] = n * 2; }
// The app window shows Icon.png at 128 points; 256 pixels keeps it sharp on Retina screens.
sizes['../../Resources/Icon.png'] = 256;

(async () => {
  const browser = await puppeteer.launch({executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, pipe: true});
  try {
    const page = await browser.newPage();
    for (const [file, px] of Object.entries(sizes)) {
      await page.setViewport({width: px, height: px, deviceScaleFactor: 1});
      await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${px}px;height:${px}px}</style>${svg}`);
      await page.screenshot({path: path.join(set, file), omitBackground: true});
      console.log(px + 'px', path.relative(path.join(__dirname, '..', '..'), path.join(set, file)));
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
