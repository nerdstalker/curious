# Chrome and Safari feasibility

Researched 2026-10-21. This is a documentation-based assessment, not a claim that an extension has been built or tested. Proposed MVP target: desktop Chrome and Safari on macOS; other desktop platforms and mobile need separate validation.

## Findings and MVP consequences

| Capability | Chrome | Safari on macOS | MVP decision |
| --- | --- | --- | --- |
| Card beside selected article text | Content scripts can read selection and add UI. | Safari Web Extensions can read and modify permitted pages. | Shared card UI with browser-specific extension packaging. |
| Automatically offer Learn More after selection | Requires an injected script with access to that page. | Requires website permission. | Offer per-site enablement; toolbar/context-menu invocation for occasional use. |
| Reference explanation and source links | Extension-side requests can use declared source hosts. | Supported extension architecture, subject to Safari permissions. | Fetch structured reference data; render our own UI. |
| Images and video | Rendering is feasible; availability, CSP, and formats matter. | Same, with actual Safari playback validation required. | Limited initial sources, explicit empty/error states, click-to-play video. |
| Copy a note or AI prompt | Clipboard write is available with appropriate context/permissions. | Clipboard writes require a user gesture in a secure context. | Prepare text before the click; retain a manual-copy fallback. |
| Download an exported note | downloads API supports a Save As chooser. | MDN compatibility data lists downloads API as unsupported. | Chrome Save As; Safari browser-managed download with user-controlled download location. |
| Force an arbitrary folder picker from shared web code | File System Access APIs exist, with constraints. | showSaveFilePicker is not supported in current MDN compatibility data. | Do not base shared saving on this API. |
| Open the user's AI website | A new tab can be opened. | Web Extensions support opening tabs. | Optional copy-and-open handoff. User pastes and sends. |
| Return AI answers to our card using any existing subscription | No universal contract established. | No universal contract established. | Exclude automatic answer retrieval and session reuse. |

### The permission detail changes onboarding

Chrome's activeTab grants temporary access after an extension invocation. Selecting ordinary page text alone does not grant it. Safari also requires permission for websites. Therefore the effortless selection button must be described as working on enabled sites, rather than appearing everywhere immediately after installation. Initial setup should explain site access and offer a deliberate invocation route. Permission revocation must remove or disable the feature. [Chrome activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab), [Apple permissions](https://developer.apple.com/documentation/safariservices/managing-safari-web-extension-permissions).

A content script can position a small overlay without changing article layout. Shadow DOM can limit style collisions, but it is not a security boundary against the host page. A strict-CSP prototype must check actual image/video behavior. Restricted browser pages and built-in document viewers cannot be assumed to behave like ordinary articles. [Chrome content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts), [Safari extensions](https://developer.apple.com/safari/extensions/).

### Content is a larger uncertainty than the card

Start with Wikipedia search and attributed excerpts for Explore. Use Wikimedia Commons for image discovery and optional video, alongside YouTube discovery and playback in its own browser window. MediaWiki exposes search, page images, and video derivative metadata. The Wikimedia adapters do not require an owned search or AI service; YouTube uses ordinary browser navigation as described below. It does not establish good coverage for every topic; source relevance and playable formats require a real sample evaluation. [Search API](https://www.mediawiki.org/wiki/API:Search), [TextExtracts](https://www.mediawiki.org/wiki/Extension:TextExtracts), [Pageimages](https://www.mediawiki.org/wiki/API:Pageimages), [video metadata](https://www.mediawiki.org/wiki/Extension:TimedMediaHandler/API).

Keep third-party requests in the extension's permitted network layer and return validated data, not arbitrary remote HTML. Source adapters should return attribution and original URLs. Loading media itself contacts its host; explain this rather than promising all browsing is local. [Chrome cross-origin requests](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests).

YouTube and web search open their real websites in compact top-level browser windows. This uses ordinary website navigation, not the YouTube Data API: no project, API key, relay or shared application quota. The same browser profile uses its normal site sessions; private mode or a different profile may not share those sessions. We neither read cookies nor scrape results. Full search pages are not embedded in an iframe.

Use the WebExtension windows API for the installed prototype, requesting popup type and bounded dimensions. Browser chrome, placement and focus differ; test actual Chrome and Safari on macOS. A standalone window.open demo is useful for interaction evaluation, but does not validate extension permissions or packaging. Keep normal-tab links as a fallback. [Chrome windows](https://developer.chrome.com/docs/extensions/reference/api/windows), [Apple compatibility](https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility).

Wikipedia stays the default reference source. Preferences select enabled sources by content type and the default among qualified reference adapters. Initial integrations are Wikipedia, Commons, and YouTube; Grokipedia remains an unqualified candidate, not a working alternative. Disabled sources receive no requests. No silent fallback changes the user's provider choice.

### Local saving: ownership without a compulsory companion

Use editable Markdown/plain-text exports and clipboard copying. Chrome can request a save dialog through its downloads API. Safari can use a user-initiated Blob download; its destination follows browser settings and may require choosing a location there. Prototype this from an extension-owned export view if the page context interferes. The shared UI must not claim to force Safari's file picker or to know that a file was saved when only the download was requested. [Chrome downloads](https://developer.chrome.com/docs/extensions/reference/api/downloads), [Safari downloads API compatibility](https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/downloads.json), [download links](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a), [Apple download settings](https://support.apple.com/en-gb/guide/safari/sfri40598/27.0/mac/27).

Current compatibility data lists Safari's showSaveFilePicker as unsupported. Persistent folder access, app-specific note insertion, and a native save-dialog bridge are separate future capabilities. The MVP lets users copy into their preferred local application or download a portable file, without binding them to a vault or a service. [File picker compatibility](https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/Window.json).

### AI handoff experiment

Proposed interaction: Ask my AI → edit a short prompt preview → Copy & open → paste/send in the chosen tool → return to the still-open article card. A separate Copy action supports local/native AI applications. The web destination is a user-configured HTTPS URL; no provider-specific query parameters or undocumented prompt links are assumed.

Build the prompt before the Copy & open click, initiate clipboard writing during that gesture, and only open the destination after a successful copy. If copy fails, show selectable text and a separate open action. Never put article text in the destination URL, automatically submit a prompt, read a logged-in AI session, or scrape the answer. [WebKit clipboard](https://webkit.org/blog/10855/async-clipboard-api/), [tabs.create](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/create).

This is technically modest but intentionally changes tabs. Test five genuine reading tasks with the project owner, including a login-required case and a copy failure. Keep it only if the owner finds the detour worthwhile and return-to-reading remains straightforward. Otherwise remove the AI-specific entry point; ordinary copy/export remains useful. No AI account is needed for core use.

### Distribution

Use a shared WebExtension implementation and small browser adapters. Apple's documentation lists several API differences, so conversion is not proof of parity. Current Apple documentation also offers App Store Connect packaging from a ZIP, alongside the Xcode conversion route; a separate native product is not inherently required for this scope. Safari distribution targets the App Store's Extensions category. [Apple compatibility](https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility), [Apple packaging and distribution](https://developer.apple.com/safari/extensions/).

## Required prototype evidence

1. Install in actual Chrome and Safari; record browser/macOS versions.
2. Enable a site, select text, invoke, navigate within the card, enlarge media, close, and verify scroll/focus and playback cleanup.
3. Repeat on narrow/zoomed pages, dynamically changing articles, and strict-CSP fixtures. Show an honest unsupported/error state where necessary.
4. Export to a user-selected local workflow in each browser; inspect file contents, cancellation, Unicode, and browser download settings.
5. Copy/open the AI handoff and return to the same article/card state. Do not send private content to test services.
6. Evaluate reference and media relevance on 20 varied terms chosen before testing; record results and gaps, then decide whether the limited sources deliver enough value.

7. Exercise provider choices, real YouTube/search windows, query encoding, close/return, blocked-popup fallback and existing sessions without reading credentials.

See the prototype README for the limited runtime evidence; the full installed-extension acceptance suite remains required.

### Default engine and separate settings

Chrome can use its profile default via chrome.search.query with the search permission and a target tab in the compact window. Safari currently lacks the search API, so choose an engine once in extension settings. Persistent provider/source preferences stay outside the card. A web demo must also use an explicit saved provider, since it has no extension API access. [Chrome API](https://developer.chrome.com/docs/extensions/reference/api/search), [compatibility data](https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/search.json).
