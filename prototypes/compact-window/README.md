# Compact-window interaction prototype

Product name: **Curious** (chosen 2026-10-21). "Apture" was this project's working name; Apture was a separate company acquired by Google, so its name is not used in the product. Mentions of Apture in these docs refer to that historical product or to earlier test runs.

Question: can readers explore a concept on real search websites and return comfortably to their article, without provider controls cluttering the card?

Run from the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory prototypes/compact-window
```

Open http://127.0.0.1:8765 in Chrome or Safari. Use the sample button or select article text and click Learn more. YouTube opens directly. For web search in this standalone demo, open Settings once, choose a provider, and return. The demo cannot access a browser's default search API. Preferences persist only in this browser's local storage for this origin.

The `extension` directory contains an unpacked Chrome MV3 experiment. Its options page is registered with the extension, separate from the article. It defaults to Chrome's actual configured search engine via `chrome.search.query`, directing results to a newly created popup tab. An override is stored in `storage.local`. Activate the toolbar action on an ordinary article before selecting text. No host-wide or cookie permission is requested. Installed testing in Brave passed default-provider search, signed-in YouTube, real selection and return at a preserved scroll position; see the detailed QA report. The standalone-demo checks below are separate evidence.

The `safari-extension` directory contains the Safari-specific package, omitting the unsupported search permission. Installed testing passed injection, saved-provider search, signed-in YouTube and return-to-article. Its lack of the search API requires a one-time provider setting. Version 0.0.2 changes Escape handling to cover focus returned to the page; the installed Safari retest passed after both search and YouTube.

## Observed 2026-10-21

- Actual Chrome: demo loaded, sample card opened without provider controls, YouTube opened as a separate compact window with relevant results, closing returned to the article.
- Actual Safari: same card and YouTube popup worked; Safari showed YouTube signed out. Closing returned to the same open card and original scroll position (scrollbar value 0).
- Safari: separate settings page saved DuckDuckGo; Search from the existing card then opened DuckDuckGo results for bioluminescence without asking again. Closing returned to the card.
- JavaScript syntax checks passed for card, background worker and settings; Impeccable's mechanical detector returned no findings.

Installed-extension results and versions are recorded in [the QA report](../../docs/qa/installed-extension-2026-10-21.md). Not verified: automated video playback, arbitrary-page accessibility, narrow-screen/zoom behavior, popup blocking, multiple monitors, or the full MVP acceptance suite. Version 0.0.2 loads live English Wikipedia excerpts in the card; 0.0.4 adds Wikimedia images. Export and AI are not implemented here.

## Design decision

Keep the reading card focused on the concept, reference and exploration actions. Put persistent settings in the extension's own options page. Use Chrome's browser default where its API permits; never silently substitute a provider in Safari. A real top-level YouTube window keeps normal site behavior and avoids API relay capacity. Full YouTube search is not embedded inside the card.

## Live definitions (0.0.2)

Opening the card fetches a short English Wikipedia summary. The first two sentences (at most about 420 characters) are rendered as plain text with article identity, source link and CC BY-SA 4.0 attribution. Exact-title lookup follows Wikipedia redirects; missing titles try one search match, visibly identified as the closest match. Ambiguous/empty results and errors offer honest guidance. Query edits are debounced, stale results are ignored and closing cancels pending UI work. Only the term is sent, with cookies omitted and no article referrer.

Installed Brave and Safari 0.0.2 both displayed live bioluminescence and marine snow definitions. Brave also passed rapid query edits and clearing the query. A bounded adapter check covered search fallback, ambiguity, missing results, service failure, query limits and anonymous requests. JavaScript syntax checks passed.

The extension worker contacts only https://en.wikipedia.org using an explicit host permission. The standalone demo loads the same adapter using public CORS. No service, key, or relay is needed. Current provider contract: [Wikimedia summary service](https://www.mediawiki.org/wiki/Page_Content_Service#JSON_endpoints), [Search API](https://www.mediawiki.org/wiki/API:Search).

The installed 0.0.2 return-path retest passed: Safari kept the live definition, term, source and reading position after closing search or signed-in YouTube. Escape from page focus then dismissed the card without moving the article. Its normalized scrollbar remained 1 throughout each path. Brave retained the identical definition and scrollTop 351 after both returns. See the QA report for evidence and the remaining accessibility limits.

## Margin Note card (0.0.3)

The card was redesigned as a small note anchored to the selection instead of a panel pinned to the window corner. Learn more appears just below the end of the selected text; the card opens below the selection, or above it when there is more room there, with a pointer to the word. Its position is stored in page coordinates, so it stays beside the text if the reader scrolls. The selected term is the headline and stays editable in place. Read on Wikipedia is the primary link; Web and YouTube are secondary. The two permanent reassurance lines became a single Esc hint, and status text appears only after a Search or YouTube action. Long definitions scroll inside the card so the term and actions stay visible. Alt+L (Option+L on Mac) opens the card for the current selection. The card follows the system light/dark setting. The demo pages were restyled to match.

Lookup, stale-result handling, retry, provider windows and Escape logic are unchanged from 0.0.2. Checked in a Chromium preview of the standalone demo only: anchored trigger and card, live definition, focus on Close, Escape without scrolling, the sample button anchor, short-window layout, and dark mode. The installed Safari and Brave return-path checks need to be re-run against 0.0.3. The Explore / Images switcher landed in 0.0.4 (below).

## Images and the view switcher (0.0.4)

A segmented control under the term switches between Explore (the definition, default each time the card opens) and Images. It uses the tabs pattern: one Tab stop, Left/Right arrow keys move and select (wrapping), Home/End jump to the ends.

Images shows up to six pictures from the resolved Wikipedia article's own media list, in reading order, rather than a free-text Commons search, so they match the definition. The files are Wikimedia Commons (or rarely local Wikipedia) uploads. Author and license come from each file's metadata and are shown as plain text under every thumbnail, with the license link and a Source link to the file page. Clicking a thumbnail enlarges it in a lightbox over the article with caption and full credit; Escape (or Close image, or clicking the backdrop) closes the enlarged image first and returns focus to its thumbnail, and the next Escape closes the card. Loading, no-article, no-images, ambiguous-term and error-with-Try-again states are written out. Image lookups use their own version counter, so a late response for an older term is ignored. Images load only when the Images view is opened, and are re-fetched after the term changes.

There is no Videos view. A first build had one, but with no embedded player it only repeated the YouTube chip, so the owner had it removed; the YouTube chip stays the route to video. If in-card video ever returns, the candidate is short Wikimedia Commons clips (the spec lists Commons as an optional video source), not YouTube.

Permissions: unchanged. All API calls (summary, media list, file metadata) go to `https://en.wikipedia.org`, which is already the only host permission; requests omit cookies and referrer as before. Picture bytes are loaded by the card itself from `upload.wikimedia.org` / `thumb.wikimedia.org` as anonymous CORS images with no referrer, which needs no extension permission; the adapter only accepts image URLs on those two hosts. Known limit: a page whose Content-Security-Policy restricts `img-src` will block the pictures; each blocked thumbnail then says so and keeps its credit and source link. Proxying image bytes through the worker would need an extra host permission and is not done.

Checked in Chrome 155 (installed extension, scripted) and the standalone demo; see the QA report. Brave and Safari need a hand re-check.

## Toolbar on/off state (0.0.5)

The toolbar button now has its own icon and toggles the card per tab. Off is a gray outline note; on is a filled blue note with a yellow highlight, and the tooltip says which state the page is in. A second click removes the card and all of its page listeners (selection, Escape, Option+L). Reloading or leaving the page resets the button to off, since the injected card is gone. The Close button's keyboard focus ring now hugs the button. Checked in scripted Chrome 155: the 15 0.0.3 checks still pass, plus on, off, back on with a single card, Option+L inert while off, and reset on reload. The icon swap itself needs a look by hand in Brave and Safari.

## Follow-up lookups and the Back trail (0.0.6)

MVP user stories 14 and 15. Selecting a word or phrase inside the definition shows a small "Look up “…”" button next to the selection; clicking it (or pressing Option+L / Alt+L while the selection is in the card) looks the new term up in the same card. The headline, Explore and Images update; the card stays anchored to the original article word, above or below as before. Editing the headline also counts as a new step: one step per edit, committed on Enter or when the field loses focus, and an edit that ends on the same term adds nothing.

A Back link under the header ("← marine snow") steps back one term at a time and restores that term's definition, its active view (Explore or Images) and its pictures. Results already loaded in this card are reused, so going back makes no new requests. The trail keeps the last 10 terms. Back is an ordinary button; its accessible name says how many earlier terms there are; the new term is announced through a polite status line ("Showing detritus", "Back to marine snow"). After a follow-up, focus moves to Back; when the trail runs out, focus returns to Close.

Closing the card (Close, Escape, or the toolbar button) clears the trail, and opening a card from the article starts fresh. Escape order is unchanged: the enlarged image first, then the card. A lookup that answers after you have moved on is still ignored. Wikipedia links inside the definition are not clickable: the summary service returns plain text, and links would need its HTML plus sanitizing, so that was left out.

Checked in scripted Chrome 155 (installed extension) and the standalone demo; the owner confirmed it working by hand in Brave and Safari. See the QA report.

This is throwaway interaction code, not a production extension or complete MVP.

## Real websites and accessibility (0.0.7)

Tested on seven real sites (English Wikipedia, a Guardian long read, a Substack post, MDN, a GitHub README, a Verge article, react.dev) and in a keyboard, zoom and contrast pass. Fixes:

- The card, Learn more and the enlarged image now open in the browser's top layer (popover), so they stay above any page layer, including max-z-index consent banners. They also stay beside the word when the page moves, transforms or zooms `<html>`. Browsers without popover support use the old positioning.
- Page CSS can no longer restyle the card: the host carries `all: initial !important` inline, and the colors and fonts live on the card's own elements instead of the host. The Guardian previously turned the card's text into 16px Times.
- Keys typed in the card no longer reach the page's ordinary (bubble-phase) listeners, which is how GitHub and MDN bind their shortcuts. A page that listens in the capture phase still sees them first. Typing `/`, `s` or `t` in the headline no longer triggers GitHub or MDN search shortcuts. Escape and Option+L are handled inside the card.
- Selections in every kind of editable text (inputs, textareas, any `contenteditable`, including `plaintext-only`) are ignored.
- Escape puts the keyboard back where the reader was: on the link that opened the card, or on the looked-up words in the article (the selection is restored), instead of dropping focus to the top of the page. A mouse click on Close still leaves the article selection alone.
- If a page re-renders and removes the card, it is put back.
- Strict CSPs (GitHub, MDN) no longer block pictures. When a thumbnail or the enlarged image is blocked, the extension's worker fetches the same file from upload/thumb.wikimedia.org as an anonymous CORS request and returns it as a `data:` URL. No new permission is needed: Wikimedia allows any origin. If the page also blocks `data:` images, the existing "Image blocked" label remains.
- At 200%/400% zoom and in short windows, the card is pinned inside the window and its body scrolls, so the actions are never clipped out of reach.
- The card's header and footer are no longer announced as page-level banner and contentinfo landmarks.

Both manifests are 0.0.7; permissions are unchanged. See the QA report for every site and check, and the owner's hand-check list for Brave, Safari and VoiceOver.

## Always on a site (0.0.11)

Turning Curious on for every page was tedious, so it can now stay on for a site, or for all sites, if the reader asks. The default is unchanged: installing asks for no website access, and a toolbar click turns Curious on for the current page only.

**Where the choice lives: the toolbar button's own right-click menu.** Right-clicking (Control-clicking) the Curious button shows Always on this site and On all sites, or Stop on this site and Stop on all sites once one of them applies. Each "on" choice asks for access through the browser's own permission prompt: only that page's origin (`https://www.example.com/*`) for this site, `http://*/*` and `https://*/*` for all sites. Alternatives considered:

- *An action popup.* Setting a popup turns every left click into "open the popup", which would cost the one-click on/off toggle. Rejected.
- *A choice inside the card.* `permissions.request` is not available to content scripts and needs a user gesture in an extension page; it would need an extension iframe inside the card or a hop to another page, and it would add controls to a card that is meant to stay about the word. Rejected.
- *The action context menu.* Left click stays a one-click toggle. Chrome/Brave support menu items in the `action` context, and Safari since 15.4. In Chrome 155 a toolbar event in the service worker carries the user gesture that `permissions.request` needs (checked: the same call made without a gesture is refused with "This function must be called during a user gesture"). If a browser refuses the request from a menu click anyway, Curious opens its Settings page with an "Always on example.com" button that asks from a real click. Chosen.

Settings has a Sites section listing every site Curious turns on by itself, with Remove for each, All websites with Stop on all sites, sites stopped while all sites are on (Not on example.com, with Allow again), and a Turn on for all sites button.

**How it loads.** Granted sites get one registered content script (`scripting.registerContentScripts`, id `curious`, `card.js`, `document_idle`, top frame, `persistAcrossSessions`). Its matches are the chosen origins, or `http://*/*` and `https://*/*` (minus stopped sites, as `excludeMatches`) for all sites. The worker rebuilds it, one change at a time, on install, on browser start, on every Curious choice and on `permissions.onAdded` / `onRemoved`. A choice counts only while the browser still grants its access: if the reader removes the access in the browser's own settings, Curious drops the site from its list, unregisters it and takes the card off open tabs where it still can. Access that the browser grants some other way does not make Curious load by itself; only the reader's choice in Curious does. Stop on this site takes the card off open tabs of that site, then gives the optional access back with `permissions.remove`. Stop on all sites means Curious turns on by itself nowhere: it also clears sites chosen one by one and gives back their access. (Chrome most likely revokes those together with the all-sites patterns anyway, so this makes the result the same in every browser.) Each time an always-on page loads, the worker also checks that the browser still grants that site; if a grant lapsed without an event (Safari's Allow for One Day), the page is shown as off and the site is dropped.

**Toolbar states.** Off (gray outline note), on for this page (filled blue note), always on for this site (the blue note with a yellow-centred dot notched into its top-right corner, so the shape changes as well as the colour). Clicking on an always-on page turns that page off; the tooltip then says Curious comes back on the next page. See `docs/qa/toolbar-icons-0.0.11-2026-10-26.png` for 16 and 32 px on light and dark toolbars.

**card.js is unchanged** and byte-identical in all three places. Registered scripts and `executeScript` both run in the extension's isolated world, so the existing `#curious-card` check stops a second card and the toolbar's `window.__curiousCard.off()` reaches a card either path created. `background.js`, `settings.html` and `settings.js` are identical in both packages; no browser split was needed.

**Safari.** Safari supports the same pieces (`optional_host_permissions` 15.5, the `action` menu context 15.4, `registerContentScripts` with `persistAcrossSessions` 16.4, menu `visible` 14), so the same code runs. Two Safari behaviours differ, from MDN's compatibility notes rather than tested here: requesting all sites lets Safari prompt for each website through its toolbar access popover instead of granting every site at once (the reader can allow every website in Safari Settings > Extensions > Curious); and Safari keeps its own per-site choices, including "Allow for One Day", which lapses. When Safari's grant for a site is gone, Curious treats the site as off. Whether Safari counts a toolbar-menu click as a gesture for `permissions.request`, and whether it reveals the page address to that click, is not verified; if not, the Settings fallback asks instead.

Both manifests are 0.0.11 and add `contextMenus` plus the optional hosts; neither causes an install-time warning in Chrome. `scripts/build-chrome-zip.mjs` now expects them and ships the three `always-*` icons. Checked in scripted Chrome 155; Brave and Safari need the hand checks in [the QA report](../../docs/qa/always-on-sites-0.0.11-2026-10-26.md).

### Safari hand-check fixes (0.0.12)

The owner's Safari 27 check of 0.0.11 on cnbc.com, where they had chosen Always on this site and answered Safari's prompt with Allow for One Day, found that the icon could show off on pages where the card was working: on an inner page, and after going Back to the homepage. Auto-loading on other cnbc.com pages was correct. A first report that a plain click had caused it was withdrawn: Settings listed www.cnbc.com.

- **The icon now follows the card.** 0.0.11 set it at `loading` from storage and a `permissions.contains` re-check. It reset to off whenever that check said no, and also whenever an in-page URL change (`pushState`, hash) or a back/forward cache restore reported `loading` while the card stayed; the last of these was already true since 0.0.5. Now, at every `loading` and `complete`, the worker checks the tab for the card. `card.js` tells the worker when it starts and when its page returns from the back/forward cache (`pageshow` with `persisted`). The latest check per tab wins. "Always" is shown only when the card is on the page **and** the reader chose that site (or all sites) in Curious.
- **A lapsed browser grant (Safari's Allow for One Day).** The stored choice is no longer erased on page load. Where the browser no longer allows the site, the card does not load and the icon shows off. The menu offers Always on this site again, which asks the browser again. Settings lists the site as "(browser access ended, off for now)" with Allow again and Remove. The next sync (a permission change or a browser start) drops a site whose access is still gone.
- **Plain clicks.** Only Always on this site, On all sites and the Settings buttons store a site or register a script; a host grant from a plain click never does. That was already so in 0.0.11 and is now covered by a test.

`card.js` changed for the first time since 0.0.10 (the announcement only; it does nothing in the standalone demo) and stays byte-identical in all three places. Both manifests are 0.0.12.
