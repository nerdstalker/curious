# Installed Curious 0.0.7 — Brave and Safari hand check

Run date: 2026-10-22, America/Los_Angeles. Local `date` confirmed the date. This follows the numbered [owner hand-check list](installed-extension-2026-10-21.md#owner-hand-check-list-brave-and-safari-007). Results below are observations from the installed extensions, not the earlier Chrome test copy.

## Setup and control availability

Browser-control availability was checked before testing. CUA inventory exposed a connected Brave browser and native Brave/Safari apps. Native Safari inspection and interaction worked; Brave used both its browser connection and native controls. Native controls intermittently returned timeouts or `noWindowsAvailable`; recovery succeeded for Brave, but the final Safari next-Tab retest could not proceed.

- Brave app bundle: **155.1.97.57**. Extensions displayed **Be Curious 0.0.7**, enabled, ID `idhcldfokdopimdapmndnoimcoiodlgg`. Its Reload button was clicked and “Reloaded” appeared. The GitHub page was then refreshed and Curious activated again. Images, headline isolation, Escape, zoom and return paths were rechecked after this reload.
- Safari app bundle: **27.0.1**. Settings → Extensions displayed the enabled temporary **Curious 0.0.7**. Reload was clicked there before testing.
- Browser versions were read from the installed application Info.plist files. They are application bundle versions, not a separately measured Brave engine version.
- Main real-page fixture: `https://github.com/microsoft/TypeScript`, including the README. Additional page: `https://www.theguardian.com/international`. The local reader was also exercised. Its server was initially absent; a temporary loopback server was started later for the reader and stopped after testing.
- Public lookup terms included language, TypeScript, journalism, Disable and bioluminescence. No credentials were entered or copied. Search and video results used the existing sessions.

## Numbered results

“Partial” means a component of the numbered step was not established; it does not mean the whole step passed.

| Step | Brave | Safari |
| --- | --- | --- |
| 1. Mouse selection, Learn more, placement and sticky header | **Partial.** Double-click selection in the README produced Learn more and an anchored card. Card appeared below the word at normal size and fitted above/pinned inside the viewport at increased zoom. A deliberate overlap with a sticky header was not independently established. | **Partial.** Double-clicking “language” produced Learn more beside it; opening placed the card directly below the word, with all actions visible. Increased-zoom selections flipped above. Sticky-header overlap was not independently established. |
| 2. GitHub thumbnails and enlarged image | **Pass.** TypeScript thumbnails rendered after the package reload. The TypeScript logo enlarged, centered over the dimmed viewport, with Close image and source/credit controls. | **Pass.** The Language gallery rendered real thumbnails, including the Tepantitla mural and cuneiform tablet. Clicking the mural displayed a centered enlarged image over the dimmed viewport. No “Image blocked” state remained in this observed gallery. This resolves the checklist's open Safari question for this page and these images; the fallback transport itself was not instrumented. |
| 3. Headline `/` and `s`; Escape | **Pass.** Headline became `TypeScript/s`; GitHub's search did not open. Escape dismissed the card. | **Pass.** Headline became `language/s`; GitHub's search did not open. Escape dismissed the card and “language” was selected again. |
| 4. Above consent/cookie banner | **Partial, substitute overlay passed.** Guardian showed a small Global Privacy Control notice, then an anti-adblock overlay. The dark Curious card rendered above the white anti-adblock content and its controls. Exact overlap with the consent notice was not established. “Continue without disabling” dismissed the site's overlay; protection settings were not changed. | **Pass.** With Guardian's blue “Your privacy” consent banner visible, selecting “journalism” and opening Curious produced a card that visibly covered the banner and its text. |
| 5. Ignore selection in text fields | **Pass for tested input.** In GitHub's Search or jump to combo box, `marine snow` was entered and selected. Option+L left the search input active without opening Curious. | **Pass for tested input.** In GitHub's Search or jump to input, selected test text did not open Learn more or a card. Option+L was left to the editor (it inserted the macOS Option+L character `¬`). Comment boxes/contenteditable were not separately tested in this run. |
| 6. Option+L, Escape, selection restoration and next Tab | **Fail on next Tab.** Option+L opened the selected term; focus could reach Close. Escape closed the card and restored the actual README word. With native mouse/keyboard input after the reload, the next Tab focused GitHub's repository-name link near the top and `scrollY` became 0. | **Partial/inconclusive.** Option+L opened the selected term with focus on Close; Escape restored “language.” The final native next-Tab retest repeatedly failed with `noWindowsAvailable`, even after reconnecting the Safari app. Do not count next-Tab continuation as passed. |
| 7. Return from Web and YouTube while scrolled | **Pass for scrolled GitHub README.** Both destinations opened with the correct TypeScript query. Closing test windows retained the term and card. In the final paired run, `scrollY` was **1424.5** with the external window open and **1424.5** after closing it. Activating Web from the preceding card position had moved the page from 1408.5 to 1424.5; this small launch/focus movement is separate from the unchanged return position. | **Pass for scrolled GitHub README.** Google and YouTube opened for TypeScript; closing each returned to the same term, definition and card. The page's normalized accessibility scrollbar remained **1** before and after both returns. YouTube showed Premium Home. Safari's Window menu later listed only the main browser window, confirming the test windows were closed. Pixel scroll coordinates were not available. |
| 8. 200%, then higher zoom | **Pass.** Native toolbar indicated 200% and 400%. Reopened card showed actions at 200%. At 400%, scrolling inside the pinned card revealed Read on Wikipedia, Web and YouTube. Restored to 100%. | **Pass for opening after zoom.** Page Menu was used to verify the scale (four increments initially reached 175%; a further increment reached 200%). At 200%, the reopened OS card and its actions fitted above the word. At the menu-confirmed maximum 300%, the TypeScript card was scrollable; keyboard traversal exposed the action row. Restored to 100%. 400% was unavailable in Safari. |
| 9. System Dark on GitHub and a light site | **Pass.** The GitHub card became dark. On Guardian's white anti-adblock page, the card also remained dark with light text. | **Pass.** GitHub's card was dark. The journalism card on Guardian's light page was dark, including while covering the blue consent banner. |
| 10. Safari popover rendering | Not applicable as a Safari-specific check. | **Pass on Safari 27.0.1.** Trigger, card and enlarged image all rendered. Normal card anchoring and above-word placement at increased zoom were observed. No missing-card or offscreen-lightbox failure occurred in these checks. |

The return-path test used a scrolled repository README, rather than a second, long prose article. VoiceOver's separate eight-step list was not run. No claim of complete accessibility or all-site acceptance is made.

## Findings to carry forward

**Reproduced: Brave next Tab loses the reading position.** On the enabled, reloaded 0.0.7 package, find the README phrase “language for application,” dismiss Find, and double-click the actual word “language.” Press Option+L, Escape, then Tab. Escape restores the word, but Tab focuses the repository-name link and takes the page to the top. This was repeated with native mouse and keyboard input to exclude an explicit automation focus on `<body>` as the cause. No implementation fix was attempted.

**Additional Safari observation: changing zoom while a card is already open.** A card opened at normal zoom extended below the visible viewport after increasing zoom. Dismissing it and opening from a fresh selection at the new zoom corrected the position. The numbered zoom check specifies opening after setting zoom, and that path passed. The resize-while-open behavior merits a separate reproduction check.

**Tool limitations.** Safari's Wikipedia activation produced a site-permission prompt whose automated Allow for One Day click did not take effect. The prompt was dismissed and testing continued on GitHub and Guardian; no manual action remains pending. Intermittent native focus/inspection failures were not treated as extension failures or passes. Brave recovered sufficiently to verify and reload its installed version without owner assistance.

## Evidence

- [Safari GitHub enlarged image](safari-0.0.7-github-lightbox-2026-10-22.png)
- [Brave GitHub enlarged image after reload](brave-0.0.7-github-lightbox-2026-10-22.png)
- [Safari card above Guardian consent banner, system Dark](safari-0.0.7-guardian-consent-dark-2026-10-22.png)
- [Brave dark card above Guardian overlay](brave-0.0.7-guardian-overlay-dark-2026-10-22.png)
- [Brave GitHub dark card](brave-installed-github-dark-2026-10-22.png)
- [Safari 200%](safari-0.0.7-zoom-200-2026-10-22.png)
- [Safari 300%, actions exposed](safari-0.0.7-zoom-300-actions-2026-10-22.png)
- [Brave 200%](brave-0.0.7-zoom-200-2026-10-22.png)
- [Brave 400%, actions exposed](brave-0.0.7-zoom-400-actions-2026-10-22.png)
- [Brave retained card after YouTube](brave-0.0.7-after-youtube-2026-10-22.png)
- [Brave next Tab at top, restored language selection](brave-0.0.7-next-tab-top-2026-10-22.png)

## Fix in 0.0.8: next Tab after Escape (2026-10-22)

Both manifests are 0.0.8 (Chrome name stays "Be Curious", short name "Curious"). Only `card.js` changed. It is byte-identical in the demo, `extension` and `safari-extension` (checked with `cmp`), and `node --check` passes.

**Cause.** On GitHub, the double-click that selects "language" also focuses GitHub's content pane (`div#repos-split-pane-content`, `tabindex="0"`, no role). Curious remembered that pane as the "previously focused control", and Escape focused it again, so the next Tab started at the pane's first link (the repository name) and the page scrolled up. On pages with no focused container, a second cause gave the same result: focus fell to `<body>` when the hidden Close button lost it, and the restored selection doesn't move Chrome's Tab starting point. The next Tab or Shift+Tab then started from the card's host at the end of the document.

**Change.** On a keyboard close, if the remembered element is a plain container around the looked-up words (not a link, button, tab or similar), the reader's place is the words. Curious inserts an empty `tabindex="-1"` span just after the words, focuses it with `preventScroll`, then restores the selection. The span removes itself as soon as focus moves on in the page (Tab, a click, the toolbar off). Switching windows or tabs leaves it in place for the reader's return. Unchanged: focus going back to a link or button that opened the card, mouse Close leaving the selection alone, and the Escape order (enlarged image first, then card).

**Scripted repro** (Chrome 155.0.8059.85, headless, puppeteer-core, test copy with `http://127.0.0.1:8765/*` plus `https://github.com/*` added to host permissions, copy only). Real double-click, Option/Alt+L, Escape, then a real Tab or Shift+Tab. Fixtures: a plain article with links before and after the word, and a GitHub-like page with header links, a `tabindex="0"` content pane and the README sentence. Plus the live `github.com/microsoft/TypeScript` README. The harness is `nexttab-0.0.8-harness.js` in the shared side-session notes folder, not in the repository.

| Check | 0.0.7 | 0.0.8 |
| --- | --- | --- |
| Plain fixture: next Tab | `<body>` (left the page) | link right after the word, scroll unchanged (1292) |
| Plain fixture: Shift+Tab | last link on the page, scroll 1292 → 2608 | link right before the word, scroll unchanged |
| GitHub-like: next Tab | pane's first link, scroll 803 → 0 | link after the word, scroll unchanged |
| GitHub-like: Shift+Tab | header "Pull requests", scroll → 0 | link before the word, scroll unchanged |
| Live GitHub README: next Tab | `/microsoft/TypeScript` repo link, scroll 1164 → 309 | README "playground" link, scroll unchanged (1164) |
| Switch tabs and back, then Tab | `<body>` | link after the word |
| Whole repro suite | 18/28 | **28/28** |

Also covered, passing on 0.0.8: Escape still restores the word with no scroll, focus still returns to a focused page button, mouse Close adds no marker, a click elsewhere and the toolbar off remove it, and the page DOM is back as it was after Tab. Two real defects in the first draft of the fix were caught here and fixed: removing the focused marker threw, which stopped toolbar off from removing the card, and a link wrapping the words lost its focus return (caught by the accessibility suite).

**Regression suites re-run on 0.0.8:** 0.0.3 card 15/15, 0.0.4 images 26/26, 0.0.6 trail 27/27, accessibility 59/59. The live real-sites suite was not re-run.

**Safari (reasoning, not run).** No WebKit build was available here. In WebKit's `FrameSelection::setFocusedElementIfNeeded`, a non-editable range selection only moves focus when caret browsing is on, so restoring the selection after focusing the marker leaves focus on the marker. Focusing first also avoids WebKit clearing the selection when focus moves. Safari's Tab skips links unless Settings → Advanced → "Press Tab to highlight each item on a webpage" is on, or Option+Tab is used.

**Owner hand check (Brave and Safari, 0.0.8).** Reload the package and confirm 0.0.8. In Safari, turn on "Press Tab to highlight each item" first, or use Option+Tab below.
1. Open `https://github.com/microsoft/TypeScript`, scroll to the README sentence "TypeScript is a language for application-scale JavaScript", and turn Curious on.
2. Double-click "language", press Option+L, then Escape. "language" should be selected again and the page should not move.
3. Press Tab. Focus should land on the next link after the word in the README (the "playground" link in this paragraph today), with no jump to the top. Reload and repeat with Shift+Tab: focus should land on the nearest link before the word, not at the top or bottom of the page. (Shift+Tab was scripted on the fixtures only, not on live GitHub.)
4. Open a card with the mouse (Learn more), then click Close. The selection and focus should behave as in 0.0.7.

## Cleanup

For the subsequent independent installed 0.0.8 check, see [next-Tab retest: Brave passes; Safari still jumps to the top](installed-extension-0.0.8-next-tab-2026-10-22.md).

The 0.0.8 Safari reasoning above did not hold in installed Safari. The 0.0.9 diagnosis, change, WebKit evidence and replacement hand check are in [Fix in 0.0.9](installed-extension-0.0.8-next-tab-2026-10-22.md#fix-in-009-safari-diagnosis-and-change-2026-10-22-not-yet-observed-in-installed-safari).

System Appearance was restored from Dark to its original **Auto** setting. Tested page zoom was restored to **100%**. Extension-created Web/YouTube windows were closed. Installed extensions remain enabled. Existing source/document changes were preserved. Only QA documentation and screenshots were added by this test; no commit or push was made.
