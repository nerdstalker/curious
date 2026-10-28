# Curious privacy policy

Effective October 26, 2026. Applies to the Curious browser extension for Chrome, Brave and other Chromium browsers, and to the Curious app and extension for Safari on Mac.

Curious has no account, no server of its own, no analytics and no ads. It does not collect, sell or share personal information. This page explains exactly what leaves your device and why.

## When Curious runs

Curious runs only on pages and sites you turn it on for.

**One page at a time (the default).** Curious does nothing on a page until you click its toolbar button on that tab. Clicking it again, reloading the page or opening a new page turns it off. Installing Curious does not give it access to any website.

**Sites you choose.** If you want, right-click the toolbar button and choose **Always on this site** or **On all sites**. Your browser asks you to approve that access first, and Curious gets nothing unless you approve. After that, Curious loads by itself on pages of that site (or of every site) when they open. On those pages it does nothing until you select text and click Learn more, and then it sends only the words you selected, as described below.

You can take that access back at any time: choose **Stop on this site** or **Stop on all sites** from the same menu, remove a site in Curious settings, or remove the access in your browser's own extension settings. Clicking the toolbar button still turns Curious off for the page you are on.

Curious cannot read pages or sites you have not turned it on for.

## What is sent, and where

**Wikipedia definitions and pictures.** When you click Learn more (or press Option+L / Alt+L), Curious sends the word or phrase you selected, up to 200 characters, to English Wikipedia's public API at `en.wikipedia.org`. Nothing else from the page is sent: not the page address, not the surrounding text, not the page title. These requests are made without cookies and without a referrer, so Wikipedia cannot link them to your Wikipedia account or to the page you were reading.

When you open the Images view, your browser loads the pictures from Wikimedia's image servers, `upload.wikimedia.org` and `thumb.wikimedia.org`, also without cookies or a referrer.

Like any website, Wikimedia receives your IP address and browser type with these requests. The [Wikimedia Foundation privacy policy](https://foundation.wikimedia.org/wiki/Policy:Privacy_policy) covers how it handles them.

**Web and YouTube, only when you click them.** The Web button opens a small browser window that searches for the term with your browser's default search engine (in Chrome and Brave) or with the engine you chose in Curious settings (Google, DuckDuckGo or Bing). The YouTube button opens a small window searching YouTube for the term. These are ordinary visits to those sites, under their own privacy policies, in the same way as if you had typed the search yourself.

**Links.** Read on Wikipedia, the license links and the Source links under pictures open those pages normally when you click them.

## What is stored

Curious stores two things, in the browser's extension storage on this device only. They are not synced or sent anywhere.

- Your search engine choice from its settings page.
- The sites where you chose Always on this site (for example `www.example.com`), whether you chose On all sites, and any sites you then stopped. This is only the list of sites you picked, never the pages you visit there. Removing a site deletes it from the list.

The terms you look up and the Back trail inside the card exist only while the card is open on that page. They are not saved, and they are gone when you close the card or leave the page.

## What Curious does not do

- No analytics, telemetry, crash reporting or tracking of any kind.
- No reading of pages or sites you have not turned Curious on for.
- No record of the pages you visit, including on sites where it is always on.
- No access to your cookies, passwords, browsing history or bookmarks.
- No selling, sharing or transferring of data to anyone, and no use of data for advertising, credit or lending decisions.
- No remote code. Everything Curious runs is included in the extension package.

## The Safari app

On Mac, Curious is installed as a small app that contains the Safari extension. The app itself only shows how to turn the extension on in Safari Settings. It collects nothing. The extension works as described above, except that Safari does not let extensions use the browser's default search engine, so Web searches use the engine you choose once in Curious settings. Safari also asks you itself before Curious can run on a website, and keeps its own per-site choices in Safari Settings > Extensions > Curious. If you choose On all sites in Safari, Safari may still ask once for each website before Curious runs there, unless you allow every website in those settings.

## Children

Curious does not knowingly collect information from anyone, including children.

## Changes

If this policy changes, the new version will be posted at this address with a new effective date. Because Curious collects nothing, a change would only happen if a new feature sends something new, and that would be described here before it ships.

## Contact

Questions or concerns: open an issue at [github.com/nerdstalker/curious/issues](https://github.com/nerdstalker/curious/issues). The source code is public at [github.com/nerdstalker/curious](https://github.com/nerdstalker/curious), so every statement on this page can be checked against it.
