# MVP: explore selected concepts without losing your place

Product name: **Curious** (chosen 2026-10-21). "Apture" was this project's working name; Apture was a separate company acquired by Google, so its name is not used in the product. Mentions of Apture in these docs refer to that historical product or to earlier test runs.

Status: proposed MVP spec, 2026-10-21. The user approved testing through the complete installed-extension reader experience. Tracker publication is pending project tracker configuration. Intended triage label: ready-for-agent.

## Problem Statement

When readers encounter an unfamiliar concept, looking it up interrupts the article, creates extra tabs, and makes returning to the original thought harder. They want the quick, contextual exploration that Apture Highlights offered, with control over their browser access, saved notes, and any AI tools they choose to use.

## Solution

An open-source browser extension for Chrome and Safari that offers Learn More beside selected text on enabled sites. It opens a compact, sourced card with Explore, Images, and Videos views. Readers can refine a query, follow another concept, go back, enlarge available media, and close the card while keeping their place.

Wikipedia is the default reference source. Source preferences are user-controlled, and the prototype opens the real YouTube and chosen search-engine websites in compact browser windows alongside the article. No YouTube Data API, key, relay, or shared search quota is required. Wikimedia Commons supplies in-card images.

The MVP offers portable local copy/export and an optional AI handoff experiment. The complete reference experience works without AI or an extension account. The proposed initial release target is desktop Chrome and Safari on macOS; broader OS/mobile coverage follows separate validation.

## User Stories

1. As a reader, I want to enable the extension for a website, so that I control where selection assistance appears.
2. As an occasional user, I want toolbar and selection-context-menu entry points, so that I can look something up without enabling it everywhere.
3. As a reader, I want to select a word or short phrase and see Learn More nearby, so that I do not retype my query.
4. As a reader, I want selection alone to remain local, so that copying text does not trigger a search.
5. As a reader, I want to correct the query, so that ambiguous or imperfect selections are easy to resolve.
6. As a reader, I want a concise reference excerpt with its source, so that I can quickly understand the topic and assess the origin.
7. As a reader, I want plausible topic matches when a query is ambiguous, so that I can choose the meaning I intended.
8. As a reader, I want to open an original source explicitly, so that I can inspect fuller context.
9. As a reader, I want relevant images with credit and source links, so that visual material adds understanding.
10. As a reader, I want to enlarge an image inside the experience, so that I can examine details without navigating away.
11. As a reader, I want available relevant videos, so that I can understand topics through motion or demonstration.
12. As a reader, I want video to remain under my control in its browser window and stop when that window closes, so that it does not interrupt reading.
13. As a reader, I want missing or unplayable media to be explained, so that I do not mistake failure for loading.
14. As a curious reader, I want to look up another term within a card, so that I can follow a related idea.
15. As a reader, I want a back action within exploration, so that I can retrace my thoughts.
16. As a reader, I want the article's position preserved when closing the card, so that I can resume immediately.
17. As a keyboard user, I want to invoke, navigate, and dismiss the card, so that I can complete the same journey without a mouse.
18. As a screen-reader user, I want meaningful controls, focus handling, and result announcements, so that the card is understandable.
19. As a reader using zoom or a narrow window, I want the card to stay usable within the viewport, so that controls remain reachable.
20. As a reader, I want a slow or unavailable source to leave usable controls, so that I can retry, revise, or close.
21. As a reader, I want the latest requested term to determine the displayed results, so that delayed responses do not replace newer work.
22. As a reader, I want unsupported pages and denied permissions explained, so that I know why lookup is unavailable.
23. As a note taker, I want to preview and edit an export, so that I control what I keep.
24. As a note taker, I want to copy Markdown or plain text, so that I can paste into the local application I prefer.
25. As a note taker, I want to download a portable note using my browser's saving workflow, so that I choose where it lives.
26. As a note taker, I want the selected passage, article URL, source attribution, and optional notes preserved, so that the capture remains useful later.
27. As a note taker, I want cancellation and export failure to preserve my draft, so that I can recover without redoing the lookup.
28. As a privacy-conscious reader, I want no mandatory cloud library or browsing-history collection, so that using the extension does not create an unwanted archive.
29. As an AI user, I want to enable an optional handoff to my chosen tool, so that I can use the service I already prefer.
30. As an AI user, I want to inspect and edit the prompt and included context, so that I choose what leaves the reading experience.
31. As an AI user, I want Copy & open for my chosen website, so that I can paste the prepared question into it.
32. As a user of a local AI application, I want to copy the same prompt, so that I can use it without a web integration.
33. As an AI user, I want my article and card to remain available during the handoff, so that returning is straightforward.
34. As a reader, I want AI controls to be removable, so that an unhelpful detour does not clutter the core experience.
35. As a Chrome or Safari user, I want the same core journey with honest browser-specific saving instructions, so that platform differences do not surprise me.
36. As an open-source user, I want readable source, a license, and reproducible build instructions, so that I can inspect and build the extension.
37. As an extension-store user, I want clear installation, permissions, and data-use information, so that I understand what I am installing.

38. As a reader, I want to choose enabled sources and my default supported reference source, so that the extension reflects my preferences.
39. As a reader, I want YouTube search in a compact browser window, so that I can explore videos using the real website while my article remains open.
40. As a reader, I want to close the exploration window and resume the same card and article, so that exploration feels temporary.
41. As a reader, I want an ordinary-tab fallback when compact windows fail, so that I can still search.
42. As a reader, I want disabled sources to receive no requests, so that source selection controls actual behavior.

43. As a reader, I want to use my browser’s default search engine where supported, with a remembered override in extension settings, so that the card never asks me to choose an engine.
44. As a reader, I want search to use the current browser profile, so that existing site sessions work normally without sharing credentials with the extension.

## Implementation Decisions

1. **Scope and architecture.** Use a shared TypeScript WebExtension core with browser adapters for permissions, invocation, downloads, clipboard, and tab opening. Use Manifest V3 with browser-specific manifest/build outputs. Begin with actual Chrome and Safari on macOS. Record exact supported versions after the compatibility prototype; do not promise all historical versions.
2. **Logical modules.** Selection/invocation captures a bounded query and anchor; the card controller owns navigation and current results; source adapters supply reference/media data; export formatting creates portable notes; browser adapters perform external effects; preferences store user choices locally. No existing implementation, domain glossary, ADRs, or tests exist beyond the discovery brief.
3. **Permission behavior.** On enabled sites, a content script may offer Learn More after selection. Otherwise invoke through the browser's extension controls and request necessary access. Distinguish article-site access from declared reference/media hosts. Do not claim activeTab lets selection assistance run everywhere before invocation. Per-site disable/revocation must be respected.
4. **Eligible text.** Support visible, selectable text in the top-level HTTPS article document and in our own card. Suppress the trigger in inputs, password fields, textareas, and editable regions. Use a proposed 200-character query limit with visible editing guidance rather than silent truncation. Leave exact selected text intact; heuristic phrase expansion is deferred.
5. **Card interaction.** One active card per tab, anchored near the selection and constrained to the viewport. Explore opens first. Use bounded internal back history, retain the selected result and scroll within the card, and avoid changing article layout or URL. Loading, empty, partial, error, and unsupported states are explicit. A new selection replaces the current query only after invocation.
6. **Dismissal and accessibility.** Provide close and Escape. Escape first exits expanded media, then closes the card. Stop media and ignore/cancel stale work on dismissal. Restore focus to the invoking control or a sensible reading location without forcing an old scroll position if the reader deliberately scrolled. Use accessible tabs, labels, live status, keyboard navigation, reduced motion, and light/dark styles. Scope page keyboard handling to extension interactions.
7. **Sources and preferences.** Wikipedia remains the default reference adapter. Let users enable/disable supported sources by content type, configure enabled sources and defaults in a separate extension settings page. Initial source roles are Wikipedia for reference, Commons for images/optional video, and YouTube for video. Store choices locally and show source identity on every result. All persistent preferences live in extension settings, not the card. Changing sources must preserve the query and navigation context; disabled sources receive no requests. Grokipedia remains a candidate reference adapter pending documented access, reuse, and quality checks, not a promised working integration. Do not present an unimplemented source as selectable or claim that video-source selection is an alternative encyclopedia. If Wikipedia is the sole qualified reference adapter at first release, clearly show that limitation. Do not silently switch providers on failure; offer an explicit alternative.
8. **Media behavior.** YouTube search and playback occur on the real YouTube website in a compact top-level browser window. Do not iframe the search page, scrape results, or embed a player in the MVP. YouTube owns results, sign-in, ads, playback and errors. Closing the card does not close independent browser windows or stop their playback; closing the YouTube window stops it. Commons images remain in-card.
9. **Network boundary.** Reference adapters accept bounded lookups and render validated text and attribution. Search actions construct an HTTPS URL from an allowlisted provider and an encoded, user-reviewed query. Send no surrounding article or article URL. No remote code in extension scripts, cookie access, search-result scraping, or arbitrary URL proxying.
10. **State and privacy.** Store preferences locally and card history in the current tab session. No owned backend, relay, extension account, analytics, or automatic saved history. Search sites receive the explicitly submitted query and normal browser connection/session data. Existing logins apply only in the same profile and browsing mode; the extension never reads cookies. Normal site ads, consent and restrictions remain.
11. **Saving contract.** A capture contains the query, selected passage, article title/URL, reference excerpt and attribution, selected media source links, capture time, and optional notes. Preview/edit it; copy as Markdown/plain text or download .md/.txt. Save links and credits rather than downloading media assets. Sanitize suggested filenames and preserve Unicode.
12. **Browser-specific saving.** Chrome uses downloads with Save As. Safari uses a user-triggered Blob/download link, preferably from an extension-owned view if required by the host page. Its download destination follows Safari settings; show appropriate guidance. Never claim disk completion merely because a download request was initiated. Copy remains available when a download fails. If Safari's actual extension export fails the prototype, resolve that before accepting the saving story; a native save bridge is a separate scope decision.
13. **AI experiment.** Disabled by default and optional during onboarding. User configures a named HTTPS destination or uses copy-only for a native/local tool. Preview contains the question and selected text; including surrounding context and article URL is an explicit choice. Prepare text before the click, then write the clipboard on user gesture and open the destination only after successful copy. Provide manual-copy recovery. The user pastes and submits. No provider sessions, API keys, answer retrieval, prompt-in-URL transport, or provider DOM automation.
14. **Return from AI.** Preserve the original tab/card while another tab is active. Do not automatically switch back or scrape the AI answer. Normal navigation/reload may end the ephemeral session; state that limitation. Removing the experiment must leave card and export behavior intact.
15. **Open-source distribution.** Prepare public build/install/contribution instructions, data-use documentation, notices, and a license before public distribution. Choose the final name and license before publication. Target GitHub, Chrome Web Store, and Safari's App Store distribution. Store acceptance and signing/account setup are release dependencies. Packaging can use the supported Apple route; a native companion is not part of the product scope.

16. **Compact-window contract.** A deliberate Search or YouTube click opens a top-level popup browser window, initially about 720 × 680 pixels, bounded to available screen space. Keep the article and card in place. Chrome uses its profile’s default engine via chrome.search.query targeting the popup tab. Safari lacks this API, so remember a one-time provider choice made in extension settings. Keep all persistent provider controls outside the card. Never silently substitute Google or claim a machine-wide default. Browser/OS may adjust size and position. No always-on-top promise. Use extension window APIs in the installed build; a user-gesture window.open demo establishes interaction feel only.
17. **Return and fallback.** Track only extension-created window IDs, the originating tab/window, and card state. Reuse a still-owned exploration window when safe; never replace unrelated windows. Closing exploration should permit an immediate return to the original reading position. Avoid stealing focus if the reader switched elsewhere. Offer a normal-tab link when window creation fails. Reload or closed source tab ends the return guarantee. Validate Safari behavior in the installed extension separately from the standalone demo.
18. **Service ownership and saving.** There is no developer-owned YouTube search service or API quota. This does not exempt ordinary website use from provider restrictions. Do not inspect search DOM or capture watch history. Users can paste a chosen video URL into their editable note; automatic retrieval of the current external video URL is deferred. Local export and optional AI remain independent of search.

## Testing Decisions

- **Approved primary seam:** exercise the installed extension through the complete reader journey. Assert visible outcomes, selected queries, exported bytes, network effects, and opened destinations. Avoid testing internal component structure or duplicating implementation logic.
- **Prior art:** none in this repository. Build one shared acceptance scenario suite and replay equivalent scenarios in real Chrome and Safari. A generic WebKit engine alone is not evidence that a Safari Web Extension works.
- **Controlled sources:** substitute deterministic responses at the provider/network boundary for success, ambiguity, empty results, timeout, malformed data, rate limiting, unsupported media, and responses arriving out of order. Keep UI/controller/browser effects real. Use separate live-source smoke checks for reachability, relevance, credits, and playback.
- **Primary modules under test:** selection/invocation, card navigation/media, export, and optional AI handoff are covered together. Browser adapters receive real-browser verification at permission, clipboard, download, and tab boundaries. Add a focused unit test only if a significant edge case cannot be expressed clearly through this seam.
- **Card acceptance:** selecting alone makes no source request; invoking shows the correct query; a sourced result appears; deeper lookup/back restores the previous result; closing the card preserves reading position; closing the external video window stops its playback. Selection/copy on the host page continues to work. Newer requests win over stale results.
- **Browser acceptance:** record actual versions; test fresh permission, grant, deny, revoke, extension reload, zoom/narrow viewport, dynamic article changes, and strict CSP. On a static fixture, opening/closing must not shift the article viewport. Restricted-page failure must be understandable.
- **Accessibility acceptance:** complete the journey using keyboard and VoiceOver; verify focus visibility, result announcements, Escape behavior, media controls, reduced motion, and reachability at 200% zoom.
- **Save acceptance:** verify UTF-8 Markdown/text and all selected provenance fields, filename safety, cancellation/failure recovery, and the user's destination workflow. Chrome's actual chooser and Safari's actual download behavior must both be exercised. Do not count clipboard-only support as passing the file-export story.
- **AI acceptance:** prove only previewed text is copied; destination URLs contain no article payload; no prompt is automatically submitted; failed copying does not silently switch tabs; returning preserves the card. Simulate destination behavior in repeatable tests and manually try the owner's chosen tool with nonsensitive material.
- **AI keep/remove gate:** run five real reading tasks, including sign-in friction and copy recovery. Record actions, interruptions, and ease of return. Keep the AI-specific feature only if the owner finds the detour useful; otherwise remove it from the public MVP without blocking core release.
- **Source preferences:** test persistence, source switching/back navigation, default selection among supported adapters, and zero network requests to disabled providers. Failure must not silently change the selected source.
- **External-search acceptance:** in real Chrome and Safari, submit a query to YouTube and each supported search provider, confirm a real compact window and accurate encoding, close it and verify article/card preservation. Check popup failure/tab fallback, repeat invocation, resize, multiple monitors, profile/session boundaries, and ordinary site navigation. Do not automate account login or assume logged-in behavior was tested.
- **Content gate:** choose 20 varied terms before evaluation. Record useful reference matches, ambiguous results, relevant images/videos, and playback success in each browser. Review whether limited sources support the intended experience. If they do not, revise the provider decision explicitly before release.
- **Responsiveness target:** show the local card/loading state within 150 ms of invocation on the agreed test machine. Source loading remains asynchronous with a bounded timeout and retry; never freeze close/navigation controls waiting for a provider.
- **Current evidence:** see the compact-window prototype README for observed checks and remaining installed-extension acceptance work. A standalone web prototype is not proof of extension packaging or permissions.

## Out of Scope

- HotSpots, automatic contextual links, publisher tools, and engagement tracking.
- Hosted AI, bundled models, AI provider billing or credential management, embedded third-party chat, or automatic AI answer capture.
- General web search aggregation, extension access to YouTube account/personalized data, maps, and broad source-provider parity with historical Apture in the initial release.
- Multiple in-page cards, card pinning/dragging/resizing, persistent research libraries, synchronization, and automatic semantic phrase expansion.
- Direct app-specific note insertion, persistent folder permissions, arbitrary filesystem writes, native helper applications, media archiving, and structured JSON export.
- Mobile browsers, built-in PDF viewers, local files, browser-internal pages, editable documents, and cross-origin iframe selection in the initial support contract.
- Automatic publication to stores or creation of an unconfigured GitHub repository during this planning task.

## Further Notes

The discovery brief and browser-feasibility memo preserve historical context and supporting references. The browser evidence supports a shared extension, with special treatment for permissions, export, and gesture-sensitive clipboard operations. Wikipedia is the confirmed default, with user-selectable supported sources. YouTube discovery and playback are now part of the prototype, through compact browser windows, with interaction quality validated before release. This is not a claim of complete historical Apture parity.

Build order: prove the card and file export in both browsers; integrate reference/image sources and compact browser windows, validate search-to-return and usefulness; try the AI handoff; remove it if it harms the experience; then prepare public packaging and documentation.

The user approved the primary testing seam during planning. No further testing-method interview is needed. The to-spec skill requests issue publication with ready-for-agent, but no project issue-tracker destination is configured and the local repository has no remote. Run /setup-matt-pocock-skills to supply that project mapping. The prepared spec can then be published without another synthesis round.

Official browser evidence: [Chrome windows](https://developer.chrome.com/docs/extensions/reference/api/windows), [Safari compatibility](https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility). The previous API-relay proposal is superseded.

Search-default evidence: [Chrome search API](https://developer.chrome.com/docs/extensions/reference/api/search) supports the current default provider and a target tab; [MDN compatibility data](https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/search.json) lists Safari support as unavailable. A standalone webpage cannot exercise this extension API.

Installed prototype evidence: Brave and Safari checks verified real compact-window search, authenticated YouTube and return to the retained article/card. Brave used its profile default; Safari required one saved provider in extension settings. The 0.0.2 retest verified the live definition remains intact after either return, with unchanged reading position (Brave scrollTop 351; Safari normalized scrollbar 1). Safari Escape from page focus then dismissed the card without moving the article, resolving the earlier focus defect. Full keyboard/VoiceOver acceptance remains outstanding. See the installed-extension QA report for measured results and limits.

Definition-card prototype (0.0.2): the card now presents a live, short Wikipedia excerpt automatically after invocation. The full article is an optional deeper-reading action. Use the stable Wikipedia summary endpoint, exact-title/redirect lookup and one visibly labeled search fallback, plain-text rendering, article attribution and CC BY-SA notice. Only the invoked term is sent; retain empty/error/retry and stale-result handling. Installed Brave and Safari both displayed live excerpts. This replaces the earlier placeholder, without changing the separate-window YouTube decision.
