# Zoom while the card is open (0.0.10, 2026-10-23)

**Reported in 0.0.7 Safari QA** ([report](installed-extension-0.0.7-2026-10-22.md#findings-to-carry-forward)): a card opened at normal zoom extended below the visible window after the page zoom was increased; opening a fresh card at the new zoom placed it correctly.

**Likely cause.** The card's position comes from the word's page coordinates, measured once when the card opens. Zoom reflows the text, so those coordinates go stale. On `resize` the card also kept its original side (`placeCard(true)`), so a card placed below the word stayed below. Safari page zoom may also not deliver a window `resize` event to the card in every case. Neither cause was observed directly in Safari.

**Change (card.js only, byte-identical in all three copies; both manifests 0.0.10, Chrome name still "Be Curious").**
- On a window resize, a visual-viewport resize, or any change to the page's own layout box (`ResizeObserver` on `<html>`), one animation frame later the card measures the selected words again from the live selection range and picks below, above or pinned afresh. A visible Learn more button is re-placed the same way.
- The new watcher is disconnected when the toolbar button switches the card off.

**Scripted checks (not page zoom).** Neither Chrome automation nor Playwright WebKit can apply browser page zoom, so the checks shrink the viewport while the card is open: 1280×800 → 640×400 (the CSS-pixel equivalent of 200%), → 853×533 (150%), → 900×800, with the card first opened *below* "marine snow".

| Suite | 0.0.9 | 0.0.10 |
| --- | --- | --- |
| Chrome 155 headless, installed-extension test copy: resize while open, 3 sizes + back to 1280×800 | 10/10 | 10/10 |
| Playwright WebKit 26.0, standalone demo page (card.js in page): resize while open, 3 sizes | not run | 6/6 |
| Chrome 0.0.3 card regression / toolbar on-off / double-click | 15/15, 7/7, 4/4 | 15/15, 7/7, 4/4 |

0.0.9 already passes the viewport-resize check in Chrome, because a `resize` event there re-fits the card. So these checks show no regression; they do **not** reproduce or prove the Safari zoom fix.

**Owner hand check (installed Safari 27, then Brave).** Reload Curious and confirm 0.0.10.
1. On a long article, scroll so a word sits near the top of the window, select it and open the card. It opens below the word.
2. With the card open, press ⌘+ until 200% (Safari: View → Zoom In; check the level in the page menu). Expected: the card stays fully inside the window, either beside the word or pinned inside the window with its actions reachable by scrolling inside the card.
3. Press ⌘0 to return to 100%. Expected: the card returns beside the word.
4. Repeat steps 1–3 with the card opened above a word near the bottom of the window.

**Owner hand check, installed Safari 27 (2026-10-23):** the owner reported that zoom works with the card open in 0.0.10. Individual steps were not recorded one by one; Brave was not separately re-checked for this change.
