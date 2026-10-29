# Store submission checklist

Everything that can be prepared without the owner's accounts is in this repository. The steps below need the owner's own accounts or signature, in the order to do them. Owner decision: no new fees, and only existing developer accounts (the ones used for MatAdmin).

| What | Status | Cost |
| --- | --- | --- |
| GitHub Pages (privacy policy page) | **Live** at `https://nerdstalker.github.io/curious/privacy/` | Free |
| Chrome Web Store (covers Brave) | **Submitted for review 2026-10-28** (version 0.0.12) | None: the owner's existing publisher account |
| Mac App Store, existing Apple Developer membership (Individual) | Ready, step 3 | None now. Membership is active until July 11, 2027 with auto-renew off |

## What is already prepared

| Item | Where |
| --- | --- |
| Privacy policy (Markdown) | `docs/privacy.md` |
| Privacy policy page for GitHub Pages | `docs/privacy/index.html` (plus `docs/.nojekyll`, so Pages serves the folder as is) |
| Chrome listing text, permission justifications, data-usage answers | `docs/store/chrome-listing.md` |
| Mac App Store listing text, privacy label answer, review notes | `docs/store/app-store-listing.md` |
| Chrome screenshots, 1280x800 | `docs/store/chrome-1-select.png` to `chrome-6-settings.png` |
| Chrome small promo tile, 440x280 | `docs/store/chrome-promo-small-440x280.png` |
| Mac App Store screenshots, 2880x1800 | `docs/store/mac-1-select.png` to `mac-6-settings.png` |
| Chrome upload zip | `node scripts/build-chrome-zip.mjs` writes `dist/curious-chrome-<version>.zip` |
| Safari Mac app (Xcode project) | `apps/safari/Curious/Curious.xcodeproj` |
| Screenshot capture script and sample article | `docs/store/capture/` |

## 1. Publish the privacy policy: done

GitHub Pages serves `main` /`docs`, so `https://nerdstalker.github.io/curious/privacy/` republishes on every push. Pages serves everything in `docs/`, including the internal design notes; the repository is already public, so nothing new is exposed.

## 2. Chrome Web Store (and Brave): submitted

Submitted for review on 2026-10-28 from the owner's existing publisher account, so no fee.

- **Item:** Be Curious, ID `ljhakdhddlgedpglifohenfojpdllgkh`, version 0.0.12, built with `node scripts/build-chrome-zip.mjs` from commit `2998a27`.
- **Dashboard:** chrome.google.com/webstore/devconsole. Status and the review result show there, and Google emails the publisher's verified contact email.
- **Publisher settings:** contact email verified, non-trader account (so no public address).
- **Listing:** filled from `chrome-listing.md`: five screenshots in the order listed there, the small promo tile, Education, English, homepage and support URLs, the seven permission justifications, remote code "No", only Website content under data usage, all three certifications.
- **Review:** the optional all-sites host permission triggers an in-depth review, so expect several days. If it is rejected, the email names the policy; fix it, raise the manifest version and resubmit.
- **While in review:** don't upload a new package, because that restarts the review. Changes ship as the next version after approval.
- **If it passes:** if automatic publishing was turned off at submit, click Publish within 30 days or the approval expires. Brave users install from the same Chrome Web Store page; there is no separate Brave store.
- **Later updates:** raise `version` in the manifest, rebuild the zip, then Package > Upload new package on the same item, and Submit for review.

## 3. Mac App Store (Safari), existing membership

Uses the existing Apple Developer Program membership (Individual) that MatAdmin uses. No enrollment and no fee.

- **Seller name.** Because the membership is Individual, the App Store shows the owner's personal legal name as the seller, not "Curious" or a company.
- **Membership end date: July 11, 2027, auto-renew off.** Owner decision, no action now: the app stays on the App Store only while the membership is active. If it lapses, Curious is removed from sale (existing installs keep working). Renewing next July is the owner's call.

1. In Xcode: Settings > Accounts, check the Apple ID is listed with its Individual team. This Mac's Xcode already knows a paid Individual team and has an Apple Development certificate. There is no Distribution certificate yet; Xcode's automatic signing creates one at the first archive.
2. Open `apps/safari/Curious/Curious.xcodeproj`. For both targets, **Curious** and **Curious Extension**: Signing & Capabilities > Team: choose the existing Individual team. Signing is already set to Automatic. The team is deliberately not saved in the repository files. Bundle IDs are `com.nerdstalker.Curious` and `com.nerdstalker.Curious.Extension`; change both together if you want a different prefix (the extension ID must start with the app ID).
3. Choose Product > Run once to check Curious appears in Safari Settings > Extensions and works on a page.
4. In App Store Connect (appstoreconnect.apple.com): Apps > + > New App. Platform macOS, name `Be Curious` (see `app-store-listing.md`; "Curious" is not used as a store name), primary language English (U.S.), bundle ID `com.nerdstalker.Curious`, SKU `curious-safari`, Full Access.
5. Fill the app record from `app-store-listing.md`: subtitle, category Reference, description, keywords, promotional text, support and privacy URLs, copyright, the six 2880x1800 screenshots.
6. App Privacy: answer "No, we do not collect data" (Data Not Collected). Pricing and Availability: Free, all countries. Age rating questionnaire: answer None to everything except "Unrestricted Web Access", which should be **Yes**, because the Web and YouTube buttons open ordinary web pages. That raises the age rating, which is normal for browser and search tools.
7. In Xcode: set the scheme destination to "Any Mac", then Product > Archive. In the Organizer: Distribute App > App Store Connect > Upload. Export compliance is already answered in the project (`ITSAppUsesNonExemptEncryption = NO`, it only uses HTTPS).
8. Back in App Store Connect, select the uploaded build for version 1.0, paste the App Review notes from `app-store-listing.md`, and Submit for Review. Reviews usually take one to three days.

## No-fee alternatives for Chrome and Brave (not needed now that the Chrome Web Store item exists)

- **GitHub release.** Attach `dist/curious-chrome-<version>.zip` to a GitHub release. Users unzip it, open chrome://extensions (or brave://extensions), turn on Developer mode and click Load unpacked. Free, but Chrome shows a developer-mode warning and there are no automatic updates.
- **Microsoft Edge Add-ons.** Registration in Microsoft Partner Center is free and the same MV3 zip runs in Edge. The `search` permission works there too. Reuses the Chrome listing text, screenshots and privacy policy. Reaches Edge users only.

## Before you submit

- **Mac app icon.** Done: a sharp 1024x1024 icon is drawn as a vector in `apps/safari/AppIcon.svg` (the same blue bubble and yellow bar as the toolbar icon, on the standard macOS plate). `apps/safari/render-app-icon.cjs` renders every size in `AppIcon.appiconset` plus the app window's `Icon.png`.
- **Version numbers.** The extension is 0.0.12; the Mac app is 1.0 (build 1). Each new App Store upload needs a higher build number; each new Chrome upload needs a higher manifest version.
- **iOS and iPadOS.** The Xcode project is macOS only. Adding iPhone and iPad is possible with `xcrun safari-web-extension-converter --rebuild-project` but needs touch-friendly checks of the card first. Ask before adding it.

## Rebuilding things

- Chrome zip: `node scripts/build-chrome-zip.mjs`
- Screenshots: serve `docs/store/capture` on 127.0.0.1:8766 and run `docs/store/capture/capture.cjs` with puppeteer-core and Google Chrome (commands at the top of the script). It loads the real extension from `prototypes/compact-window/extension` into a temporary profile.
- Safari project: it references the files in `prototypes/compact-window/safari-extension` rather than copying them, so edits there are picked up on the next Xcode build. Unsigned local build check: `xcodebuild -project apps/safari/Curious/Curious.xcodeproj -scheme Curious -configuration Release CODE_SIGNING_ALLOWED=NO build`.

## Store name

Both stores list the extension as **Be Curious** (owner decision, 2026-10-21). Curious.com Inc. holds registered US CURIOUS marks for educational software and online learning (Classes 9, 41, 42), and the App Store already has learning apps named Curious. The product itself keeps the name Curious. Before packaging for the Chrome Web Store, set the manifest `name` to `Be Curious` and `short_name` to `Curious`. "Be Curious" still contains the word CURIOUS in the same field, so have a trademark professional confirm it before investing in branding.
