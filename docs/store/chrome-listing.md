# Chrome Web Store listing: Curious

Paste each block into the matching field of the Chrome Web Store Developer Dashboard. The same listing serves Brave, which installs from the Chrome Web Store. Customer-facing text here contains no em-dashes; keep it that way when editing.

## Store listing tab

**Name** (from the manifest): Curious

**Short description** (126 of 132 characters; the dashboard takes this from the manifest `description` if you leave it, which is the shorter "Select a word or phrase to learn more without losing your place."):

```
Select a word or phrase on any page to see a short Wikipedia definition, pictures and quick search, without losing your place.
```

To use the longer line as the store summary, set it as `description` in `prototypes/compact-window/extension/manifest.json` before building; the build script checks the 132-character limit.

**Full description:**

```
Reading something and hit a word you don't know? Select it and click Learn more. A small card opens right beside the word with a short definition from Wikipedia. Your page stays exactly where it was.

WHAT YOU GET
• A two-sentence Wikipedia definition, with a link to the full article
• Pictures from the article, each with its author, license and source
• Follow-up lookups: select a word inside the card to look it up too, then go Back
• Web and YouTube buttons that open a small window you can close to return to your spot
• Light and dark mode that follow your system
• Keyboard friendly: Option+L (Alt+L) opens the card for your selection, Esc closes it

HOW IT WORKS
1. Click the Curious button in your toolbar to turn it on for the page you're reading.
2. Select a word or phrase and click Learn more.
3. Read, look at pictures, or explore further. Press Esc when you're done.

PRIVATE BY DESIGN
• Curious only runs on a tab after you click its toolbar button.
• Only the words you select are sent to Wikipedia, without cookies or the page address.
• No account, no analytics, no ads, no tracking. The only thing saved is your search engine choice, on your device.
• Open source under the MIT License: github.com/nerdstalker/curious

Definitions and pictures come from Wikipedia and Wikimedia Commons and keep their original licenses. Curious is an independent project and is not affiliated with the Wikimedia Foundation.
```

**Category:** Education (alternative: Productivity > Tools, if the dashboard's category list has changed).

**Language:** English.

**Graphic assets** (all in this folder):

| Field | File | Size |
| --- | --- | --- |
| Store icon | `prototypes/compact-window/extension/icons/on-128.png` | 128x128 |
| Screenshots (up to 5) | `chrome-2-definition.png`, `chrome-3-images.png`, `chrome-4-follow-up.png`, `chrome-1-select.png`, `chrome-5-dark.png` | 1280x800 |
| Small promo tile | `chrome-promo-small-440x280.png` | 440x280 |

`chrome-6-settings.png` is a spare if you would rather show the settings page than one of the five above.

Suggested screenshot captions, if the dashboard asks: "A short definition right beside the word", "Pictures from the article, with credits", "Look up a word inside the card, then go Back", "Select any phrase and click Learn more", "Follows your dark mode".

**Official URL:** none. **Homepage URL:** `https://github.com/nerdstalker/curious`. **Support URL:** `https://github.com/nerdstalker/curious/issues`.

## Privacy practices tab

**Single purpose:**

```
Curious shows a small reference card for a word or phrase the reader selects on a web page: a short Wikipedia definition, pictures from the matching Wikipedia article, and buttons to look the term up further, so the reader can learn about it without leaving the page.
```

**Permission justifications:**

| Permission | Justification |
| --- | --- |
| `activeTab` | Lets Curious run on the current tab only after the user clicks its toolbar button, so it never has access to pages the user has not turned it on for. |
| `scripting` | Inserts the Curious card script into the tab the user turned it on for, and removes it when the user clicks the toolbar button again. |
| `storage` | Saves the user's search engine choice from the settings page, locally on this device. |
| `search` | When the user clicks Web, sends the selected term to the browser's own default search engine with chrome.search.query, so Curious never has to choose an engine for the user. |
| Host `https://en.wikipedia.org/*` | Fetches the short definition, the matching article title, and the article's picture list and credits for the term the user selected, from English Wikipedia's public API. |

**Remote code:** No, I am not using remote code. All JavaScript is in the package; the extension only fetches JSON data from Wikipedia.

**Data usage.** Recommended answers, chosen to be conservative:

| Data type | Check it? | Why |
| --- | --- | --- |
| Personally identifiable information | No | |
| Health information | No | |
| Financial and payment information | No | |
| Authentication information | No | |
| Personal communications | No | |
| Location | No | |
| Web history | No | The page address is never sent or stored. |
| User activity | No | No clicks, keystrokes or scrolling are recorded. |
| Website content | **Yes** | The text the user selects (up to 200 characters) is sent to en.wikipedia.org to fetch the definition. It is not stored. This is the only data that leaves the device. |

Some reviewers treat a user-initiated dictionary lookup as not "collection" at all. Checking Website content and describing it honestly is the safer answer and does not hurt the listing.

Then tick all three certifications:

- I do not sell or transfer user data to third parties, outside of the approved use cases.
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

**Privacy policy URL:** `https://nerdstalker.github.io/curious/privacy/` (after GitHub Pages is turned on; see README.md step 1). Fallback that works today without Pages: `https://github.com/nerdstalker/curious/blob/main/docs/privacy.md`.

## Distribution tab

Visibility: Public. Regions: all. Price: free (the Chrome Web Store no longer sells items).
