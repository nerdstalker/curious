// Captures store screenshots from the real Chrome extension (prototypes/compact-window/extension).
// Needs puppeteer-core and Google Chrome. Run from the repository root:
//   python3 -m http.server 8766 --bind 127.0.0.1 --directory docs/store/capture &
//   NODE_PATH=/path/to/node_modules node docs/store/capture/capture.cjs
// Writes docs/store/chrome-*.png (1280x800), docs/store/mac-*.png (2880x1800) and docs/store/chrome-promo-small-440x280.png.
const fs = require('fs'), path = require('path'), os = require('os');
const puppeteer = require('puppeteer-core');
const ROOT = path.resolve(__dirname, '../../..');
const SRC = path.join(ROOT, 'prototypes/compact-window/extension');
const OUT = path.join(ROOT, 'docs/store');
const ARTICLE = 'http://127.0.0.1:8766/article.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  // A temporary copy may read the local article; the shipped manifest never lists this host.
  const ext = fs.mkdtempSync(path.join(os.tmpdir(), 'curious-ext-'));
  fs.cpSync(SRC, ext, {recursive: true});
  const m = JSON.parse(fs.readFileSync(path.join(ext, 'manifest.json')));
  m.host_permissions.push('http://127.0.0.1:8766/*');
  fs.writeFileSync(path.join(ext, 'manifest.json'), JSON.stringify(m, null, 2));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'curious-chrome-'));
  const browser = await puppeteer.launch({executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, pipe: true, enableExtensions: [ext], userDataDir: profile, args: ['--no-first-run', '--no-default-browser-check', '--hide-scrollbars']});
  let page;
  const sr = (fn, ...a) => page.evaluate((src, ...a) => { const r = document.getElementById('curious-card').shadowRoot; return new Function('r', '$', 'args', src)(r, id => r.getElementById(id), a); }, fn, ...a);
  const box = sel => sr(`const el=r.querySelector(args[0]);if(!el)return null;const b=el.getBoundingClientRect();return{x:b.left,y:b.top,w:b.width,h:b.height}`, sel);
  const click = async sel => { const b = await box(sel); await page.mouse.click(b.x + b.w / 2, b.y + b.h / 2); };
  const waitFor = async (src, tries = 60) => { for (let i = 0; i < tries; i++) { if (await sr(src)) return true; await sleep(250); } throw new Error('Timed out: ' + src); };
  const waitDefinition = () => waitFor(`return $('definition').getAttribute('aria-busy')==='false'&&!/Looking up/.test($('excerpt').textContent)`);
  const waitImages = () => waitFor(`const imgs=[...$('gallery').querySelectorAll('img')];return $('images').getAttribute('aria-busy')==='false'&&imgs.length>0&&imgs.every(i=>i.complete&&i.naturalWidth>0)`, 80);
  // Real mouse drag across a bold word, placed at a fixed height so the card opens below it.
  const select = async (text, y) => {
    await page.evaluate((text, y) => { const s = [...document.querySelectorAll('main strong')].find(e => e.textContent === text); if (y == null) window.scrollTo(0, 0); else window.scrollBy(0, s.getBoundingClientRect().top - y); }, text, y);
    await sleep(200);
    const r = await page.evaluate(text => { const b = [...document.querySelectorAll('main strong')].find(e => e.textContent === text).getBoundingClientRect(); return {x: b.left, y: b.top, h: b.height, right: b.right}; }, text);
    await page.mouse.move(r.x + 1, r.y + r.h / 2); await page.mouse.down(); await page.mouse.move(r.right - 1, r.y + r.h / 2, {steps: 8}); await page.mouse.up(); await sleep(250);
  };
  const open = async (text, y) => { await select(text, y); await click('#trigger'); await waitDefinition(); await sleep(300); };
  const dragDefinitionWord = async word => {
    const w = await sr(`const tn=$('excerpt').firstChild;const m=new RegExp(args[0],'i').exec(tn.data);const rg=document.createRange();rg.setStart(tn,m.index);rg.setEnd(tn,m.index+m[0].length);const b=rg.getBoundingClientRect();return{x:b.left,y:b.top,w:b.width,h:b.height}`, '\\b' + word + '\\b');
    await page.mouse.move(w.x + 1, w.y + w.h / 2); await page.mouse.down(); await page.mouse.move(w.x + w.w - 1, w.y + w.h / 2, {steps: 8}); await page.mouse.up(); await sleep(250);
  };
  const reset = async () => { await page.keyboard.press('Escape'); await page.evaluate(() => getSelection().removeAllRanges()); await sleep(150); };

  try {
    page = await browser.newPage();
    const worker = await (await browser.waitForTarget(t => t.type() === 'service_worker' && t.url().endsWith('background.js'), {timeout: 15000})).worker();
    const extId = new URL(worker.url()).host;
    const sets = [
      {prefix: 'chrome', viewport: {width: 1280, height: 800, deviceScaleFactor: 1}},
      {prefix: 'mac', viewport: {width: 1440, height: 900, deviceScaleFactor: 2}},
    ];
    for (const {prefix, viewport} of sets) {
      const shot = name => page.screenshot({path: path.join(OUT, `${prefix}-${name}.png`)});
      await page.setViewport(viewport);
      await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'light'}]);
      await page.goto(ARTICLE, {waitUntil: 'load'});
      // Same call the toolbar button makes.
      await worker.evaluate(async url => { const [tab] = await chrome.tabs.query({url}); await chrome.scripting.executeScript({target: {tabId: tab.id}, files: ['card.js']}); }, ARTICLE);
      const top = Math.round(viewport.height * 0.2);

      // 1. Select a phrase: Learn more appears beside it.
      await select('bioluminescence', null);
      await shot('1-select'); await reset();
      // 2. The definition card.
      await open('bioluminescence', top);
      await shot('2-definition'); await reset();
      // 3. Images from the article, with credits.
      await open('anglerfish', top - 40); await click('#tab-images'); await waitImages(); await sleep(400);
      await shot('3-images'); await reset();
      // 4. Follow-up lookup with the Back trail.
      await open('marine snow', top); await dragDefinitionWord('detritus'); await click('#lookup'); await waitDefinition(); await sleep(400);
      await shot('4-follow-up'); await reset();
      // 5. Dark mode.
      await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'dark'}]);
      await open('symbiosis', top); await sleep(300);
      await shot('5-dark'); await reset();
      await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'light'}]);
      // 6. Settings page.
      await page.goto(`chrome-extension://${extId}/settings.html`, {waitUntil: 'load'}); await sleep(300);
      await shot('6-settings');
      console.log('Captured', prefix, viewport.width * viewport.deviceScaleFactor + 'x' + viewport.height * viewport.deviceScaleFactor);
    }

    // Small promo tile (440x280), built from the definition card screenshot.
    const shotData = fs.readFileSync(path.join(OUT, 'mac-2-definition.png')).toString('base64');
    const icon = fs.readFileSync(path.join(SRC, 'icons/on-128.png')).toString('base64');
    // Find the card's top-left corner in the 1440x900 definition shot (same steps as above), then crop to it.
    await page.setViewport({width: 1440, height: 900, deviceScaleFactor: 1});
    await page.goto(ARTICLE, {waitUntil: 'load'});
    await worker.evaluate(async url => { const [tab] = await chrome.tabs.query({url}); await chrome.scripting.executeScript({target: {tabId: tab.id}, files: ['card.js']}); }, ARTICLE);
    await open('bioluminescence', 180); const card = await box('section');
    await page.setViewport({width: 440, height: 280, deviceScaleFactor: 1});
    await page.goto('about:blank');
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      body{margin:0;width:440px;height:280px;overflow:hidden;background:#e9eefc;font-family:system-ui,-apple-system,sans-serif;color:#1c1d21;position:relative}
      .copy{position:absolute;left:28px;top:40px;width:180px}
      .name{display:flex;align-items:center;gap:10px;font:700 30px/1 system-ui;letter-spacing:-.01em}
      .name img{width:40px;height:40px}
      p{margin:18px 0 0;font:500 17px/1.35 system-ui;color:#3a3f4a}
      .shot{position:absolute;left:224px;top:30px;width:260px;height:300px;border-radius:12px;overflow:hidden;box-shadow:0 10px 28px rgba(30,50,120,.22),0 0 0 1px rgba(30,50,120,.08)}
      .shot div{width:100%;height:100%;background:url(data:image/png;base64,${shotData}) no-repeat;background-size:1440px 900px;background-position:${-Math.round(card.x)}px ${-Math.round(card.y)}px}
    </style><div class="copy"><div class="name"><img src="data:image/png;base64,${icon}" alt="">Curious</div><p>Select a word. Learn more without losing your place.</p></div><div class="shot"><div></div></div>`);
    await sleep(300);
    await page.screenshot({path: path.join(OUT, 'chrome-promo-small-440x280.png')});
    console.log('Captured promo tile 440x280');
  } finally {
    await browser.close();
    fs.rmSync(profile, {recursive: true, force: true}); fs.rmSync(ext, {recursive: true, force: true});
  }
})().catch(e => { console.error(e); process.exit(1); });
