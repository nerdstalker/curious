# Installed-extension QA — 2026-10-21

Installed 0.0.7 Brave/Safari hand-check results: [2026-10-22 observed results and evidence](installed-extension-0.0.7-2026-10-22.md).

Target: local Apture compact-window experiment, initially 0.0.1 and then 0.0.2, installed in the owner's existing Brave and Safari profiles on macOS 27.0.1 (26A434). No extension API relay or YouTube API credentials.

Versions: Brave application bundle 155.1.97.56; Safari 27.0.1. Brave's Chromium engine version was not separately collected.

## Setup and installation

- Brave loaded `prototypes/compact-window/extension` with activeTab, scripting, storage and search permissions. The Extensions page showed Apture 0.0.1 enabled, ID `bcecdcochjaioomielepheeahmhinejd`.
- Safari loaded `prototypes/compact-window/safari-extension` with activeTab, scripting and storage permissions. The Temporary extensions list showed Apture (Safari) 0.0.1 enabled.
- The owner approved the development settings and completed loading. Safari's automated Add Temporary Extension click was blocked by its click protection; the manual route worked. Brave's chooser also required manual completion.
- Fixture: `http://127.0.0.1:8765/reader.html`. It contains no card script; the extension toolbar action must inject the card. Both installed packages did so.
- Submitted only public terms: bioluminescence, symbiosis and marine snow. Authentication was assessed through visible account/Premium controls. No credentials, cookies or tokens were read or copied.

## Results

| Check | Brave | Safari |
| --- | --- | --- |
| Installed card | Pass: toolbar invocation and sample button worked; real selection of symbiosis showed Learn more and updated the card only after invocation. | Pass: toolbar injection and sample concept opened the card. Arbitrary article selection was not independently exercised here. |
| Settings outside card | Pass: no engine selector in card; default setting untouched. | Pass: installed extension Settings opened its own safari-web-extension options page. Google saved once and used by the existing card. |
| Default search | Pass for this profile: chrome.search.query opened Google in a compact window for both terms. Existing address-bar UI identified Google; sourceid=chrome was visible on the symbiosis destination. No override configured. | Runtime confirms unavailable default-provider API: untouched setting produced recovery guidance without silently choosing a source. Safari Settings → Search showed Google. Matching Google was then chosen once in extension settings. This is a manual preference, not automatic following of later Safari changes. |
| YouTube existing session | Pass: extension-created popups showed YouTube Premium Home, Create, Notifications and Account menu, matching the pre-existing signed-in Brave session. | Pass after owner signed in: a fresh extension-created popup showed the same signed-in controls. Owner also opened a video and paused at about 5 seconds in the original test popup; automated playback was not tested. |
| Close search window | Pass: original article/card/query retained. With symbiosis, document scrollTop was exactly 533 before and after; focus remained on Search. | Pass after saving provider: original article/card/query retained; normalized scrollbar stayed at 1 before and after. |
| Close YouTube window | Pass: repeat from symbiosis retained scrollTop 533 and focus on YouTube. | Pass: fresh authenticated popup closed back to the same article/card/bioluminescence; normalized scrollbar stayed at 1. |
| Close card | Not separately checked in this installed run. | Close button dismissed card without changing the scrolled article position. |

## Defect and limits

**Original 0.0.1 defect, resolved in 0.0.2:** after returning from an external window, the page had focus and Escape did not dismiss the visible card. The Close button worked. The old key listener was scoped to the card's shadow root. The document-level Escape fix passed the installed Safari retest below. Full keyboard accessibility is still outside this focused check.

Default-provider switching in Brave, browser restarts, multi-monitor/window geometry, private profiles, denied permissions, narrow/zoomed viewports, VoiceOver, popup failure, and general HTTPS-page coverage remain untested. Live Wikipedia excerpts were added and checked in 0.0.2; export, Commons and AI handoff remain outside this focused experiment. No claim of complete MVP acceptance.

## Environment left for the owner

Both development extensions remain installed and enabled. Safari's extension provider is Google, matching its current browser preference; Brave's extension remains on browser default. Test search/video windows were closed; the test article remains available. Development settings were enabled with approval. Safari's unsigned setting follows Safari's session rules.

## Interpretation

The compact top-level window approach works with real browser sessions and preserves the article. It removes the shared API quota and avoids scraping search results. Brave can use the profile default automatically. Safari needs the one-time preference in extension settings. The observed Escape/focus defect is resolved in 0.0.2, with the focused return-path verification below.

## Follow-up: live definition card (0.0.2)

The owner requested the Wikipedia definition in the card itself. Both installed packages were reloaded to 0.0.2 with the narrow en.wikipedia.org host permission. Actual Brave and Safari displayed live, attributed definitions for bioluminescence and marine snow without requiring an external navigation. Brave rapid edits ended on the latest symbiosis definition, and clearing the input displayed its empty state. The marine snow card was visually inspected in Brave with all exploration controls visible. The standalone fixture now also loads the Wikipedia adapter.

A bounded adapter check passed correct article URLs, two-sentence trimming, exact-title miss → search fallback, ambiguous/missing results, HTTP failure, input limits, and requests without cookies/referrer. Live adapter smoke checks passed all three article terms. No new saved browsing history or owned service.

The earlier Escape defect was addressed by handling Escape while a card is visible even when focus is on the document, while leaving page edit fields alone. The first retest was interrupted by native inspection timeouts. The completed retest follows.

## Completed return-path and Escape retest (0.0.2)

Safari native inspection recovered after the owner brought the test article to the foreground. No implementation changes were needed during this retest. The installed card displayed the live two-sentence marine snow excerpt with the Marine snow article link and CC BY-SA attribution.

| Check | Observed result |
| --- | --- |
| Safari search return | Pass: Google search opened for marine snow using the saved extension provider. Closing the compact window returned to the same article, term, full excerpt, attribution and article link. The article's normalized scrollbar was 1 before and after. Focus returned to the article's HTML content. |
| Safari Escape after search | Pass: Escape from page focus removed the card. The article scrollbar remained 1 and focus remained on the article. |
| Safari YouTube return | Pass: a fresh compact window searched marine snow and showed YouTube Premium Home, Create, Notifications and Account menu. Closing it retained the same term, excerpt, attribution and article link. The normalized article scrollbar stayed at 1; focus returned to the article's HTML content. |
| Safari Escape after YouTube | Pass: Escape from page focus removed the card. The normalized article scrollbar remained 1 and focus stayed on the article. |
| Brave search and YouTube return | Pass: both compact windows closed back to the visible marine snow card with the identical full excerpt and term. The document's scrollTop was exactly 351 before and after each return. YouTube showed the existing signed-in Premium/account controls. |

Safari position is measured through its accessibility scrollbar, not DOM pixel coordinates. The screenshot captures the retained card and visible reading context after YouTube return. The final Safari state has the card dismissed by Escape and the article still scrolled to the same position. The sample button was used to reopen the card between the two Safari paths; that deliberately scrolls the button into view, so the scrolled baseline was established again before launching YouTube.

- [Definition and reading context after Safari return](safari-return-definition-2026-10-21.png)
- [Same reading context after Escape](safari-escape-after-return-2026-10-21.png)

These checks verify the reported defect and local fixture return paths. They do not establish complete keyboard/VoiceOver or arbitrary-site acceptance; the unrelated page-edit-field exemption was not independently exercised in Safari.

## Margin Note redesign (0.0.3)

The card was redesigned as a note anchored to the selection (see the compact-window README). Lookup, provider windows and Escape logic were unchanged from 0.0.2; placement, markup and styling changed.

| Check | Chrome 155 (scripted) | Brave 155 (installed, owner profile) | Safari |
| --- | --- | --- | --- |
| Learn more beside a drag selection | Pass | Pass | Owner reported working |
| Learn more after a double-click selection | Pass: bold and plain words | Pass: bold and plain words; selection is set by the second mouseup | Owner reported working |
| Card anchored to the word, live definition, focus on Close | Pass | Pass: Marine snow, below the word, all actions in view | Owner reported working |
| Search window return keeps term, definition and scroll | Pass: scrollY 524 before and after | Pass: scrollY 573.5 before and after | Not independently re-measured |
| YouTube window return | Pass: scrollY 524 before and after | Not re-run in 0.0.3 | Not independently re-measured |
| Escape from page focus | Pass: no scroll change | Pass | Not independently re-measured |
| Option+L shortcut | Pass | Not run | Not run |
| Flips above near the bottom edge; fits a 400px window; dark mode | Pass | Not run | Not run |

Chrome ran in a throwaway profile through puppeteer-core with the unpacked extension loaded. The test copy added only the fixture origin to `host_permissions`, so the worker could inject the card in place of the toolbar click. Google showed its automated-traffic page in the headless search window; the query was correct. Double-click concern raised by the owner was not reproduced in Chrome or Brave; the owner then confirmed the card working in all three browsers. Full keyboard, VoiceOver and arbitrary-site accessibility testing remains outstanding.

## Images view and Explore / Images switcher (0.0.4)

Both manifests are 0.0.4. `card.js` and `wikipedia.js` are byte-identical across the demo, `extension` and `safari-extension`; the two `background.js` files are identical and gained an `images` message. A Videos view was built and then removed at the owner's request (it only repeated the YouTube chip). Host permissions are unchanged (`https://en.wikipedia.org/*` only); see the compact-window README for why no Commons permission was needed.

**How it was verified.** Chrome 155.0.8059.85, headless, throwaway profile, via puppeteer-core with the unpacked extension loaded. As in 0.0.3, the test copy of the extension added only `http://127.0.0.1:8765/*` to `host_permissions` so the worker could inject the card in place of the toolbar click. The fixture was `reader.html` served by `python3 -m http.server` on 127.0.0.1:8765. Selections were real mouse drags. All Wikipedia and Wikimedia traffic was live. The standalone demo (`index.html`, adapter in the page) ran in the same Chrome with request interception used only to force failures and delays. `node --check` passed for every changed script and the manifests parse as JSON. A live adapter run returned 6 images for bioluminescence, 3 for marine snow, 6 for symbiosis, `ambiguous` for Mercury and `empty` for a nonsense term.

| Check (Chrome 155) | Result |
| --- | --- |
| Switcher is a tablist; Explore selected by default and again on every reopen; focus still lands on Close | Pass |
| Two segments only (no Videos tab or panel); Arrow Left/Right move and select with wrap; Home/End | Pass |
| Images: live thumbnails load (marine snow 3/3, bioluminescence 6/6); each shows author, license and a Source link to its Commons file page; image URLs only from upload/thumb.wikimedia.org | Pass |
| Returning to Images does not refetch | Pass |
| Click enlarges in a lightbox over the article (848×650 px at 1280×800); caption and credit shown; focus on Close image; Tab stays in the lightbox; card stays open underneath | Pass |
| Escape with focus in the lightbox closes the image first and refocuses its thumbnail; the next Escape closes the card; scrollY unchanged (524) | Pass |
| Escape from page focus while enlarged also closes the image before the card | Pass |
| Rapid term edits while on Images end on the last term | Pass |
| Demo: an older term's response delayed 4 s by interception arrives after a newer term; it is ignored and the newer results stay | Pass |
| No-article, ambiguous (Mercury) states explained, no retry offered | Pass |
| Demo: media-list request aborted shows an error with Try again; Try again recovers (6 images) | Pass |
| YouTube chip opens its separate window from the Images view; card, Images view and scrollY kept | Pass |
| Term, switcher and actions stay in view in Images; card fits a 400px window; card flipped above the word with Images open stays clear of the word | Pass |
| Lightbox fits 400×760 and 1280×800; dark tokens on card and selected segment | Pass |
| The 15 checks from 0.0.3 (selection trigger, anchoring, search/YouTube return, Escape, Alt+L, flip, 400px, dark) rerun against 0.0.4 | 15/15 pass |

Screenshots (Chrome, installed extension): [Images, light](chrome-0.0.4-images-light-2026-10-21.png), [enlarged, light](chrome-0.0.4-enlarged-light-2026-10-21.png), [Images, dark, card above the word](chrome-0.0.4-images-dark-above-2026-10-21.png), [Images at 400px](chrome-0.0.4-images-400px-2026-10-21.png), [enlarged at 400px](chrome-0.0.4-enlarged-400px-2026-10-21.png).

**Not verified.** Brave and Safari 0.0.4 were not run. No VoiceOver or other screen-reader pass. Pages with a strict image Content-Security-Policy were not tried (pictures are expected to show the blocked message there). When the card has little room, the grid scrolls inside the card and credits for lower rows sit below the fold; that was observed, not changed. Credits are Wikimedia's own metadata and can be terse (for example "self" or a username).


## Toolbar on/off state (0.0.5)

Scripted Chrome 155: the 15 checks from 0.0.3 still pass; on, off (card and page listeners removed, Option+L inert), back on with a single card, and reset to off on reload all pass. Owner hand check after reloading both installed packages: the icon switches between off and on in Brave and Safari. Safari tints the off-state outline blue while the extension has page access; the filled on state remains distinct. The 0.0.4 Images hand checks (credits, Escape order, arrow keys between tabs) were not separately recorded here.

## Brave re-install check (Curious 0.0.5)

After the project folder was renamed to `Curious`, the owner re-installed both packages. Brave 155, owner profile, `reader.html`, card turned on by the owner's toolbar click; the rest driven through the Claude browser extension with real mouse and key input.

| Check | Result |
| --- | --- |
| Drag-select "marine snow" → Learn more → card below the word, Marine snow definition, focus on Close | Pass |
| Images tab: 3 Wikimedia Commons images loaded, credit line shown | Pass |
| Arrow keys move between Explore and Images | Pass |
| Enlarged image: caption, NOAA National Ocean Service · Public domain · Commons link; focus on Close image | Pass |
| First Escape closes only the enlarged image; focus returns to the thumbnail; card stays open | Pass |
| Web search window return: same term, definition, Images view; scrollY 573.5 before and after | Pass |
| YouTube window return: same term and definition; scrollY 573.5 before and after | Pass (clean re-run; the first attempt was invalidated by page interaction while the window was open) |
| Escape from page focus closes the card; scrollY unchanged | Pass |

Not re-run here: toolbar off click (owner confirmed the icon switches in both browsers earlier), Safari after the re-install.

Safari after the re-install: the owner confirmed Curious 0.0.5 working in Safari after re-installing the package. This is the owner's report; no scripted or measured checks were run in Safari.

## Follow-up lookups and Back trail (0.0.6)

Both manifests are 0.0.6. `card.js` is byte-identical across the demo, `extension` and `safari-extension` (checked with `cmp`); no other script changed and host permissions are unchanged. `node --check card.js` passed.

**How it was verified.** Same setup as 0.0.4: Chrome 155.0.8059.85, headless, throwaway profile, puppeteer-core with a test copy of `extension/` whose manifest adds only `http://127.0.0.1:8765/*` to `host_permissions`, so the worker injects `card.js` in place of the toolbar click. Fixture `reader.html` (and `index.html` for the demo) served by `python3 -m http.server` on 127.0.0.1:8765. Selections in the article and inside the card were real mouse drags; keys were real key presses; Wikipedia traffic was live. The toolbar off/on checks call the same `__curiousCard.off()` function the toolbar click runs, through the worker. 27 new checks, plus the earlier suites re-run against 0.0.6.

| Check (Chrome 155) | Result |
| --- | --- |
| Card opened from the article has no trail; focus on Close | Pass |
| Dragging across "detritus" in the marine snow definition shows "Look up “detritus”" next to it | Pass |
| Look up shows Detritus in the same card on Explore; card position unchanged (same left/top, still below the word) | Pass |
| Trail reads "← marine snow"; focus on Back; "Showing detritus" announced in the status line | Pass |
| Term, trail and actions stay inside the window | Pass |
| Headline edit to "plankton" adds one step ("Back to detritus, 2 earlier terms"); an edit that ends on the same term adds none | Pass |
| Back by keyboard (Enter) restores detritus with its Images view and both pictures immediately, not busy; trail "← marine snow"; "Back to detritus" announced | Pass |
| Back again (Space) returns to marine snow on Explore with its definition; trail hidden; focus on Close | Pass |
| Option/Alt+L with "organic" selected in the definition looks it up in the same card | Pass |
| Stale guard: start an uncached lookup, go Back before it answers; 3 s later the restored term and text are unchanged | Pass |
| YouTube window from a follow-up term: closing it keeps term, definition, trail and scrollY (524) | Pass |
| Escape closes the enlarged image first (card and trail stay), then the card; scrollY unchanged | Pass |
| Reopening from the article starts fresh; the Close button also clears the trail | Pass |
| 12 headline edits leave exactly 10 Back steps | Pass |
| Card flipped above the word: follow-up keeps it above and clear of the word, actions visible | Pass |
| 400px window: card and trail fit | Pass |
| Dark mode: dark card background, Back link uses the dark link color | Pass |
| Toolbar off removes the card and Option+L does nothing; back on gives one card with no trail; reload resets to off | Pass |
| Standalone demo: follow-up and Back work; going Back made 0 Wikipedia requests | Pass |
| The 15 checks from 0.0.3 (anchoring, search/YouTube return, Escape, Option+L, flip above, 400px, dark) | 15/15 pass |
| The 26 Images checks from 0.0.4 (switcher, lightbox, Escape order, stale results, demo error/retry) | 26/26 pass |

Two first-run failures were fixed before the final run: an edit that ended on the same term still added a step (the browser fires no `change` event when the value is unchanged; the step is now committed on blur or Enter), and the toolbar-on check was dragging over text that was still selected, which starts a drag-and-drop instead of a selection (a test-script issue; the selection is now cleared first).

Screenshots (Chrome, installed extension): [Look up offer](chrome-0.0.6-lookup-offer-2026-10-21.png), [trail, light](chrome-0.0.6-trail-light-2026-10-21.png), [trail, dark](chrome-0.0.6-trail-dark-2026-10-21.png), [trail at 400px](chrome-0.0.6-trail-400px-2026-10-21.png).

**Owner hand check.** After reloading both installed packages to 0.0.6 (the first attempt was still running 0.0.5, so no Look up button appeared), the owner confirmed follow-up lookups and the Back trail working in Brave and Safari. This is the owner's report; no scripted or measured checks were run in either browser, so it also covers Safari's `getComposedRanges` selection path only by that report.

**Not verified.** Individual hand-check items in Brave and Safari were not recorded one by one. No VoiceOver pass, so the status announcements were checked as text only. Keyboard-only selection inside the definition needs caret browsing; without it, a keyboard user changes terms by editing the headline. Wikipedia links in the definition are not clickable (plain-text summary).

## Real websites and accessibility pass (0.0.7, 2026-10-22)

Both manifests are 0.0.7. `card.js` is byte-identical across the demo, `extension` and `safari-extension`, and `background.js` is identical across the two packages (checked with `cmp`). `node --check` passed for both. Permissions and host permissions are unchanged in the shipped manifests (activeTab, scripting, storage, and search for Chrome only; host `https://en.wikipedia.org/*`).

**How it was run.** Chrome 155.0.8059.85, headless, throwaway profile, puppeteer-core, with a test copy of `extension/`. For real sites the copy's manifest adds `<all_urls>` to `host_permissions` (copy only), so the worker injects `card.js` in place of the toolbar click. The fixture tests add only `http://127.0.0.1:8765/*`. Selections are real mouse drags, keys are real key presses, and Wikipedia and the sites are live (fetched 2026-10-22, desktop Chrome user agent, 1280×800). The same suites were also run against the committed 0.0.6 files (`git archive HEAD`) to separate real defects from test artifacts. The test scripts are not in the repository; they live in the session scratchpad and the shared side-session notes folder (`realsites-a11y-0.0.7.md` describes them), so these counts can't be reproduced from the tree alone. **0.0.6: 121/143 real-site checks and 53/59 accessibility checks. 0.0.7: all pass (counts below).** Test-side only: where a site's own overlay covered the article, the harness removed it before selecting text (Guardian `aside` sign-in prompt; Verge `zephr` paywall script blocked). That is site behavior, not Curious, and it is logged in the run.

### Sites

| Site | URL (2026-10-22) | Notable for |
| --- | --- | --- |
| English Wikipedia | en.wikipedia.org/wiki/Bioluminescence | CSP with `default-src` allowing Wikimedia; sticky sidebars |
| Long-form news | The Guardian long read (Oxford Street pedestrianisation), discovered from /news/series/the-long-read | `img-src https: data: blob:`; sticky ad slot; consent and sign-in overlays |
| Substack | astralcodexten.com/p/mistakes | Fixed menu, custom fonts |
| Docs with sticky header | MDN, CSS `position` | Sticky 98px header; strict CSP `default-src 'self'`, `img-src` allows upload.wikimedia.org but **not** thumb.wikimedia.org |
| Strict CSP | github.com/microsoft/TypeScript (README) | `default-src 'none'`, `img-src` without Wikimedia; keyboard shortcuts `/`, `s`, `t` |
| Dark theme | GitHub with system dark; The Verge article (always dark, discovered from the home page) | Dark page backgrounds; Verge paywall overlay locks body scroll |
| Single-page app | react.dev/learn (Next.js) | Client-side navigation rewrites the article |

### Checks per site (Chrome 155, installed test copy)

Run on all seven sites, every one passing on 0.0.7:

- Page load; card injected into a shadow root.
- A mouse drag over an article word shows Learn more beside the word's end, and nothing covers it.
- The card opens anchored to the word (gap 12px, above or below) with a live definition. Card and actions are inside the window, and five sample points on the card are on top of the page.
- Focus moves to Close.
- Page CSS doesn't leak: 50 computed styles on the card (fonts, sizes, line-height, colors, padding, borders, letter-spacing, text-transform, direction, width…) equal those on the fixture page in the same color scheme.
- Images view (term set to "octopus" so the check doesn't depend on the picked word) loads all 6 thumbnails under the page's CSP. The enlarged image covers the window and loads. Escape closes it first, with focus back on its thumbnail.
- Escape closes the card without moving the article (scrollX/scrollY unchanged). Focus/selection is back in the article.
- Option/Alt+L opens the card for a selection.

Extra checks:

| Check | Site(s) | 0.0.6 | 0.0.7 |
| --- | --- | --- | --- |
| Page CSS leaks into the card | Guardian | **Fail**: card text 16px Times, line-height normal (a page `*` rule matched the host and beat `:host`) | Pass |
| Pictures under a strict CSP | GitHub (6 CSP violations), MDN (5 violations, thumb host blocked) | **Fail on GitHub**: 0/6 loaded, all "Image blocked" | Pass: 6/6, via the worker's `data:` fallback |
| Typing `/st` (GitHub) or `/` (MDN) in the headline stays in the card; a bubble-phase page `keydown` listener on `document` sees none of the card's keys (capture-phase page listeners on `window`/`document` still run first and are not blocked) | GitHub, MDN | **Fail**: GitHub's search took focus and the headline lost the text; page listener saw 2–3 key events; Escape then no longer reached the card | Pass: 0 events reach the page |
| Escape from the headline field closes the card | GitHub, MDN | Fail (after the above) | Pass |
| After Escape, focus/selection back in the article, not `<body>` | all | **Fail** (focus on `<body>`) | Pass (selection restored on the word) |
| Web and YouTube windows open; closing each keeps the card, term and article scroll | Wikipedia (scrollY 706), Guardian (1179), MDN (1795) | Pass | Pass |
| Word just under the sticky header: card below, anchored, actions visible, drawn over the header; word near the bottom: card above | MDN | Pass | Pass |
| A full-window `position:fixed; z-index:2147483647` layer appended to `<html>` after the card | Wikipedia, MDN | **Fail**: covered at all 3 sample points | Pass (top layer) |
| Selection in a text input, textarea, iframe: no Learn more, Option+L inert | Wikipedia, MDN | Pass | Pass |
| Selection in `contenteditable` and `contenteditable="plaintext-only"` ignored | Wikipedia, MDN | **Fail**: Learn more shown, Option+L opened the card | Pass |
| `<html>` positioned (`top:40px; left:24px`) | Wikipedia, MDN | **Fail**: trigger 46px low, card overlaps the word | Pass |
| `<html>` transformed (`translateX(30px)`), including the enlarged image | Wikipedia, MDN | **Fail**: enlarged image drawn at y −2061 (MDN) / −769 (Wikipedia), 30px off | Pass |
| Positioned and transformed `<body>` | Wikipedia, MDN | Pass | Pass |
| `<html>` CSS zoom 1.25 | Wikipedia, MDN | **Fail**: trigger and card hundreds of px away | Pass |
| Horizontal overflow, page scrolled 300px right | Wikipedia, MDN | Pass | Pass |
| Dark site: card uses its own dark palette (`#1f2228`) and dark text colors | GitHub (system dark), Verge (system light: card stays light) | Pass | Pass |
| Client-side navigation (no page load) keeps the card; selecting on the new content works | react.dev | Pass | Pass |
| Page removes the card host (as a full re-render would): Curious puts it back | react.dev | **Fail** | Pass |

Not covered by the scripted run: pages inside cross-origin iframes as the target article (the card runs in the top frame only, by design), Shadow-DOM-heavy article markup, right-to-left pages (the card now forces `direction: ltr` on itself), and sites behind sign-in. Google answered the scripted Web window with its automated-traffic page; the window opening and the return are what was checked.

### Accessibility (fixture article, Chrome 155)

| Check | 0.0.6 | 0.0.7 |
| --- | --- | --- |
| Option/Alt+L with a keyboard selection opens the card; focus on Close | Pass | Pass |
| Tab order: Close → (Back, when there is a trail) → headline → Explore tab → CC BY-SA 4.0 link → Read on Wikipedia → Web → YouTube. Nothing hidden is focusable | Pass | Pass |
| Explore/Images: Arrow Right/Left select and focus with wrap; Home/End | Pass | Pass |
| Tab from Images goes into the gallery; Enter enlarges; focus on Close image; Tab stays inside; Escape closes only the image and returns to its thumbnail | Pass | Pass |
| Headline edit by keyboard adds Back; Back is the next stop after Close; name "Back to marine snow"; Enter restores and focus moves to Close when the trail is empty | Pass | Pass |
| Escape closes the card; article does not move | Pass | Pass |
| Focus returns to the article: the looked-up words are selected again, so Tab and caret browsing continue from there | **Fail**: focus dropped to `<body>`, the next Tab started at the top of the page | Pass |
| Opened from a focused link: Escape returns focus to that link | Pass | Pass |
| AX tree (Chrome, via CDP): dialog "Learn more: marine snow", button "Close card", textbox "Search term", tablist "View" with tabs Explore/Images, tabpanel, link "Read on Wikipedia (opens in a new tab)", buttons Web/YouTube, status regions | Pass | Pass |
| No page landmarks from the card | **Fail**: card header and footer exposed as banner and contentinfo | Pass (`role="none"`) |
| 200% zoom (640×400 CSS px), word mid-window and near the bottom | **Fail** (mid-window word; near the bottom passed): Read on Wikipedia, Web and YouTube clipped inside the card where nobody could reach them | Pass: card pinned inside the window, all visible |
| 400% zoom (320×200 CSS px) | **Fail**: headline and actions clipped | Pass: pinned card shows term, tabs and at least 3 lines of definition; actions reached by scrolling the card (mouse, trackpad or Tab) |
| Narrow 320px window | Pass | Pass |
| Short 1280×360 window | **Fail** for a mid-window word (actions clipped); near the bottom passed | Pass |
| `prefers-reduced-motion: reduce`: no animation, no transitions; `no-preference`: 160ms fade-in | Pass | Pass |

Contrast, read from the live card's tokens (WCAG 2.2: 4.5:1 text, 3:1 non-text). All pass in both themes; the values are unchanged from 0.0.6.

| Pair | Light | Dark |
| --- | --- | --- |
| Ink on card (term, definition, status, chips, selected tab) | 17.03:1 | 13.61:1 |
| Muted on card (Wikipedia label, credits, Esc hint, icons) | 5.27:1 | 6.44:1 |
| Muted on tab track / thumbnail background (unselected tab, "Image blocked") | 4.70:1 | 5.51:1 |
| Link on card (Read on Wikipedia, Back, fallback) | 8.01:1 | 8.34:1 |
| Link on hover background (Back hover) | 7.13:1 | 7.13:1 |
| Ink on hover background (chip hover) | 15.17:1 | 11.64:1 |
| Learn more / Look up pill (card color on ink) | 17.03:1 | 13.61:1 |
| Learn more shortcut hint (65% opacity) | 7.85:1 | 4.69:1 (closest to the limit) |
| Focus ring vs card (non-text) | 8.01:1 | 8.34:1 |
| Headline dotted underline vs card (non-text) | 5.27:1 | 6.44:1 |
| Chip and tab borders (advisory: text labels identify the controls) | 1.29:1 | 1.37:1 |

Advisory, not changed: the selected tab is marked by a white pill, weight 500 and ink color versus muted. The pill against the track is only 1.1:1, so the state rests on the text difference. Tab after the last card control (YouTube) leaves the card to the top of the document; Escape is the documented way back to the article.

### Fixes in 0.0.7

`card.js`:
- Popovers (top layer) for Learn more, the card and the enlarged image, with fallback to the old positioning where popover is unsupported.
- `all:initial !important` inline on the host, with tokens and fonts moved to the card's own elements.
- Key events stopped at the shadow root, with Escape and Option+L handled there.
- `isContentEditable` covers editable text.
- Keyboard-only selection restore on close; focus still returns to the opening control.
- A MutationObserver re-attaches the host.
- CSS-zoom-aware coordinates.
- Pinned, scrollable layout when there is less than 240px beside the word.
- Header and footer `role="none"`.

`background.js` (both packages): an `image` message fetches only from upload/thumb.wikimedia.org with credentials and referrer omitted, accepts JPEG/PNG/GIF/WebP/SVG up to 8 MB, and returns a `data:` URL. It runs only after an image fails to load.

### Regression suites re-run on 0.0.7

| Suite | Result |
| --- | --- |
| 0.0.3 card (anchoring, search/YouTube return, Escape, Option+L, flip above, 400px, dark) | 15/15 |
| 0.0.4 images (switcher, lightbox, Escape order, stale results, demo error/retry) | 26/26 |
| 0.0.6 trail (follow-ups, Back, cap of 10, stale guard, toolbar off/on, demo) | 27/27 |
| Accessibility pass (above) | 59/59 |
| Real sites (above) | 145/145 (0.0.6: 121/143; GitHub's two lightbox checks only run once pictures load) |

The first 0.0.7 run of the trail suite failed one check: closing with the mouse restored the article selection, so the suite's next drag over the same word became a drag-and-drop. Since then, only a keyboard close (Escape, or Enter/Space on Close) restores the selection.

Screenshots (Chrome, installed test copy): [GitHub, dark, strict CSP](chrome-0.0.7-github-dark-csp-2026-10-22.png), [MDN, word under the sticky header](chrome-0.0.7-mdn-sticky-header-2026-10-22.png), [Wikipedia with transformed `<html>`](chrome-0.0.7-wikipedia-transformed-html-2026-10-22.png), [200% zoom](chrome-0.0.7-zoom-200-2026-10-22.png), [400% zoom, pinned card](chrome-0.0.7-zoom-400-2026-10-22.png).

**VoiceOver.** Not run. Turning VoiceOver on and driving Safari needs system accessibility settings and Safari keyboard control, which this session doesn't have. The Chrome AX tree above is the closest automated evidence. VoiceOver steps are in the hand-check list.

### Owner hand-check list (Brave and Safari, 0.0.7)

Reload both packages first and confirm the version reads 0.0.7 (Brave: brave://extensions; Safari: Settings → Extensions). In Safari, rebuild and run the Curious app from Xcode, or re-add the temporary extension. Turn Curious on with the toolbar button on each page.

Both browsers, on a real page (e.g. en.wikipedia.org/wiki/Bioluminescence and a GitHub README):

1. Select a word with the mouse. Learn more appears beside it; open the card. The card sits under or over the word and is drawn above the page's sticky header.
2. Images on GitHub: thumbnails appear (0.0.6 showed "Image blocked"). Click one: the enlarged image covers the window. **Safari is the open question here.** If Safari still shows "Image blocked", note it: Safari may apply the page CSP to `data:` images differently.
3. On GitHub, click into the headline and type `/` and `s`. The letters go into the headline and GitHub's search does not open. Escape closes the card.
4. On the Guardian or any site with a cookie or consent banner: the card is drawn above the banner.
5. In any comment box or text field, select text: no Learn more, and Option+L does nothing.
6. Option+L on a selected word opens the card; Escape closes it. The word is selected again, and the next Tab moves on from the word, not from the top of the page.
7. Web and YouTube from a word far down a long article: close each window, and the article is at the same place with the card open.
8. Browser zoom 200% (Cmd + four times) on the fixture or any article: open the card. The actions are visible, or reachable by scrolling inside the card. Then try 400% if the browser allows it (Brave up to 500%; Safari up to 300%).
9. Dark mode (System Settings → Appearance → Dark): the card is dark on a light site and on GitHub.
10. **Safari 17+ only:** step 1 also checks the card renders at all, because 0.0.7 shows it with the popover API. If the card shows but sits in the wrong place, or does not appear, report the Safari version.

VoiceOver in Safari (Cmd+F5 turns it on; VO = Control+Option):

1. Select "marine snow" on the fixture (http://127.0.0.1:8765/reader.html), then press Option+L. Expected: VoiceOver says "Close card, button", in a "Learn more: marine snow" dialog or web dialog.
2. VO+Right through the card. Expected order: Close card; Search term, edit text "marine snow"; View, tab group, Explore, selected tab, 1 of 2; then the definition text, "From “Marine snow”", "CC BY-SA 4.0, link", "Read on Wikipedia (opens in a new tab), link", "Web, button", "YouTube, button", "Esc to close".
3. When the definition arrives, VoiceOver should read it once (polite live region). Note whether it reads it twice or not at all.
4. On the Explore tab, press Right Arrow (not VO+Right). Expected: "Images, selected tab". When the pictures load, note how much is announced: the Images panel is a live region, and reading six credits may be too verbose.
5. Tab to the first thumbnail. Expected: "Enlarge image: <caption>, button". Press VO+Space. Expected: "Close image, button" inside an "Enlarged image" dialog. VO+Right should not leave the dialog. Escape returns to the thumbnail.
6. Edit the headline to "plankton" and press Return. Then Shift+Tab to Back. Expected: "Back to marine snow, button". Press VO+Space. Expected: "Back to marine snow" announced, and focus on Close card.
7. Escape. Expected: the card closes, and VoiceOver lands back on the article text at "marine snow" rather than at the top of the page.
8. VO+U (rotor) → Landmarks while the card is open: there should be no extra banner or content-information landmark from the card.
