# Installed-extension QA — 2026-10-21

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

**Not verified.** Brave and Safari 0.0.6 were not run. Selecting text inside the card relies on Chrome's shadow-root selection; Safari uses `getComposedRanges`, with a plain-selection fallback, and that path has not been run. No VoiceOver pass, so the status announcements were checked as text only. Keyboard-only selection inside the definition needs caret browsing; without it, a keyboard user changes terms by editing the headline. Wikipedia links in the definition are not clickable (plain-text summary).
