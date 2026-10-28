# Chrome Web Store listing: Be Curious

Paste each block into the matching field of the Chrome Web Store Developer Dashboard. The same listing serves Brave, which installs from the Chrome Web Store. Customer-facing text here contains no em-dashes; keep it that way when editing.

## Store listing tab

**Name** (from the manifest): Be Curious. The store title comes from the manifest `name`, so set `"name": "Be Curious"` and `"short_name": "Curious"` in `extension/manifest.json` before packaging; the browser's own UI keeps saying Curious where space is short.

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
1. Click the Be Curious button in your toolbar to turn it on for the page you're reading.
2. Select a word or phrase and click Learn more.
3. Read, look at pictures, or explore further. Press Esc when you're done.
4. Reading a site often? Right-click the button and choose Always on this site, or On all sites, so Be Curious is ready without a click. Chrome asks you first, and you can stop any time from the same menu or the settings page.

PRIVATE BY DESIGN
• Be Curious runs only on pages you turn it on for, or on sites you choose to keep it on. Installing it gives it no access to any website.
• Only the words you select are sent to Wikipedia, without cookies or the page address.
• No account, no analytics, no ads, no tracking. The only things saved are your search engine choice and the sites you chose, on your device.
• Open source under the MIT License: github.com/nerdstalker/curious

Definitions and pictures come from Wikipedia and Wikimedia Commons and keep their original licenses. Be Curious is an independent project and is not affiliated with the Wikimedia Foundation.
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
Be Curious shows a small reference card for a word or phrase the reader selects on a web page: a short Wikipedia definition, pictures from the matching Wikipedia article, and buttons to look the term up further, so the reader can learn about it without leaving the page.
```

**Permission justifications:**

| Permission | Justification |
| --- | --- |
| `activeTab` | Lets Be Curious run on the current tab only after the user clicks its toolbar button, so it never has access to pages the user has not turned it on for. |
| `scripting` | Inserts the Be Curious card script into the tab the user turned it on for, and removes it when the user clicks the toolbar button again. On sites the user chose to keep it on, registers the same card script to load there automatically (scripting.registerContentScripts), and unregisters it when the user stops. |
| `storage` | Saves the user's search engine choice and the list of sites the user chose to keep Be Curious on, locally on this device. |
| `contextMenus` | Adds four items to the menu that opens when the user right-clicks the Be Curious toolbar button: Always on this site, Stop on this site, On all sites, Stop on all sites. Nothing is added to the menus of web pages. |
| `search` | When the user clicks Web, sends the selected term to the browser's own default search engine with chrome.search.query, so Be Curious never has to choose an engine for the user. |
| Host `https://en.wikipedia.org/*` | Fetches the short definition, the matching article title, and the article's picture list and credits for the term the user selected, from English Wikipedia's public API. |
| Optional host `http://*/*`, `https://*/*` | Not granted at install, and never requested on its own. Requested at runtime only when the user picks Always on this site (then only that site's origin is requested, for example `https://www.example.com/*`) or On all sites (both patterns), through Chrome's own permission prompt. Used only to load the Be Curious card script automatically on those sites, so the user does not have to click the toolbar button on every page. On those pages Be Curious does nothing until the user selects text and clicks Learn more, and it sends only that selected text to Wikipedia, as on any other page. The user can remove the access from the toolbar menu (Stop on this site, Stop on all sites), the settings page, or chrome://extensions, and Be Curious then unregisters the script. |

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
| Web history | No | The page address is never sent or stored. The list of sites the user chose to keep Be Curious on stays on the device and is never sent. |
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
