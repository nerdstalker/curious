# Apture-inspired extension: feature reconstruction

Research date: 2026-10-21

Status: discovery brief, not an implementation specification. Historical behavior is reconstructed from contemporary reviews and walkthroughs; an original executable or complete official manual has not been verified. Differences between versions and publisher integrations remain possible.

## Product intent and agreed boundaries

Follow curiosity without losing your place: select a concept in an article, summon a compact card, explore relevant information and media, dismiss it, and resume reading.

- Wikipedia is the default reference source, with user-selectable supported sources. Open YouTube and the chosen search website in compact browser windows. No API relay; see the current MVP spec for the return-to-reading contract.
- Target Chrome and Safari as first-class browsers. Specific operating-system coverage remains to be decided.
- End goals include an open-source GitHub repository and distribution through the Chrome Web Store and Apple's Safari extension distribution channels. Publication has not been requested yet.
- Saving is optional. Users choose their local destination and workflow; no mandatory app, vault, cloud library, or account.
- AI is optional and supplied by whatever tool or provider the user chooses. We do not provide an AI service, subscription, or required model.
- HotSpots, automatic insertion of links, and publisher engagement tooling are outside scope.
- Apture is the historical inspiration and working project reference; public branding and license are undecided.

## Historical core

| Feature | Evidence | What was delightful |
| --- | --- | --- |
| Select a word or phrase, then invoke Learn More | A small action appeared near the selection. [1, 2] | The term was already the query; little interruption or retyping. |
| Read a floating information card | A definition, photos, and routes to further results appeared over the original page. [1] | Reading and discovery shared the same place. |
| Explore, Videos, and Images views | A contemporary walkthrough explicitly identifies these three tabs. [2] | Different ways of understanding were close together. |
| Expand media | Images and videos could open in a larger overlay and be closed. [1] | Media remained part of the reading experience. |
| Find information across sources | Sources included reference, search, video, image, and map services. [2] | One selection opened several useful perspectives. |
| Location lookup | Selecting a place could produce a map. [2] | Results adapted to the kind of subject. |
| Tolerate imprecise selection | One account describes rounding an incomplete selection to a word or phrase. [3] | Selecting text did not require precision. Evidence is limited to this account. |
| Continue exploring within Apture | Searches also worked inside Apture content. [4] | Curiosity could continue without abandoning the article. |
| Multiple overlays in the wider Apture product | A 2009 publisher-product review describes separate media windows and multiple Apture windows on a page. [5] | Related material could remain available together. This is not yet verified as a Highlights feature. |

The repeatable loop is selection → deliberate invocation → quick understanding → optional deeper exploration → return to reading.

Do not assume that movable cards, pinning, resizing, keyboard shortcuts, exact back-navigation behavior, or a saved research history were original Highlights features. They remain unverified or modern proposals.

## Proposed modern reconstruction

These are design proposals, not historical claims or a committed release scope.

### 1. Select and invoke

Show a discreet nearby Learn More action. Add keyboard and context-menu entry points. Ordinary selection and copying should continue to work. Do not send a query merely because text was selected.

### 2. Understand in a compact card

Show the selected term, a short attributed reference excerpt or definition, a source link, and relevant media previews. The basic explanation comes from reference material and works without AI. If the subject is ambiguous, make it easy to choose the intended meaning or refine the query.

Proposed views: Explore, Images, and Videos. Show maps when relevant. Keep source identities visible and offer an explicit open-original action.

### 3. Explore without losing the thread

Allow lookup from within the card, with a visible back path. Enlarge media when requested. Test whether a single navigable card, a pinned card, or multiple cards best preserves orientation; do not commit to a window-management system before trying the interaction.

### 4. Resume reading

Provide a visible close control and Escape support. Closing should restore focus sensibly, stop overlay media, and preserve the article's scroll position. These are proposed quality requirements to verify in the prototype.

### 5. Save to the user's own system

Offer copy and export options before specialized integrations. Candidate formats are Markdown, plain text, and structured JSON. A save should include the selected passage, page title and URL, relevant source links, and optional user notes. Users decide what to retain and where it goes.

Optional local-app integrations can follow demand. Exact folder-writing and application handoff capabilities must be checked in both browsers; do not promise arbitrary filesystem access or automatic saving of every media asset.

### 6. Ask the user's AI, optionally

Let the user choose a destination and inspect the selected text and surrounding context before sharing. A copyable prompt is a candidate baseline; supported handoffs or direct integrations can improve on it.

Do not assume that an existing AI subscription grants API access or permits answers to be embedded in our card. Inline AI responses depend on the chosen tool's supported integration. Never require AI setup to use reference lookup, media exploration, or saving.

## Prototype priorities

First validate selection, invocation, a useful sourced card, image/video exploration, further lookup, and a clean return to the article. Include a simple user-controlled copy/export action. Demonstrate the same core journey in Chrome and Safari early.

Provider availability, media embedding restrictions, permissions, caching, accessibility, browser packaging, and store requirements belong in subsequent feasibility work. We are not promising that old source integrations still work today.

## Sources

1. [PCWorld — Apture Highlights for Chrome, January 2011](https://www.pcworld.com/article/486403/apture_highlights_for_chrome.html)
2. [Dicas-L — Firefox: Apture Highlights, June 2011](https://www.dicas-l.com.br/arquivo/firefox_apture_highlights.php)
3. [David Iwanow — Apture Helps with Highlights, May 2011](https://davidiwanow.com/technology/apture-helps-with-highlights-2455650/)
4. [VentureBeat — Apture Highlights brings richer browsing to any website, August 2010](https://venturebeat.com/business/apture-highlights-brings-richer-browsing-to-any-website)
5. [Richard MacManus — Apture Packs a Lot of Media Into a Little Pop-up, February 2009](https://ricmac.org/2009/02/16/apture-packs-a-lot-of-media-into-a-little-pop-up/)
6. [Mozilla — Firefox 4 Add-on collection competition winners, March 2011](https://blog.mozilla.org/addons/2011/03/22/firefox-4-add-on-collection-competition-the-winners/)
