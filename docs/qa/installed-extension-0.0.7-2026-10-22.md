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

## Cleanup

System Appearance was restored from Dark to its original **Auto** setting. Tested page zoom was restored to **100%**. Extension-created Web/YouTube windows were closed. Installed extensions remain enabled. Existing source/document changes were preserved. Only QA documentation and screenshots were added by this test; no commit or push was made.
