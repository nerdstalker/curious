# Store submission checklist

Everything that can be prepared without the owner's accounts is in this repository. The steps below need the owner's own accounts or signature, in the order to do them. Owner decision: no new fees, and only existing developer accounts (the ones used for MatAdmin).

| What | Status | Cost |
| --- | --- | --- |
| GitHub Pages (privacy policy page) | Ready to turn on | Free |
| Mac App Store, existing Apple Developer membership (Individual) | Ready, step 3 | None now. Membership is active until July 11, 2027 with auto-renew off |
| Chrome Web Store (covers Brave) | **Blocked**: only if the owner's Google account already has a Chrome Web Store publisher account | None if it exists. Otherwise the one-time US$5 registration is a new fee and is not planned |

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

## 1. Publish the privacy policy (free, about 5 minutes)

Both stores need a privacy policy URL.

1. Commit and push this work to `main` on github.com/nerdstalker/curious.
2. On GitHub: repository Settings > Pages > Build and deployment > Source: "Deploy from a branch", Branch: `main`, folder: `/docs`. Save.
3. After a minute, open `https://nerdstalker.github.io/curious/privacy/` and check it loads.

Note: Pages serves everything in `docs/`, including the internal design notes. The repository is already public, so nothing new is exposed, but if you would rather publish only the policy, skip Pages and use `https://github.com/nerdstalker/curious/blob/main/docs/privacy.md` instead. Both stores accept it.

## 2. Chrome Web Store (and Brave): blocked

**Blocked until the owner confirms an existing Chrome Web Store publisher account.** A Chrome Web Store publisher account is separate from a Google Play Console account, so if MatAdmin was published through Google Play Console, that does not cover it. Owner to confirm which Google account MatAdmin used. To check at no cost: sign in at chrome.google.com/webstore/devconsole with that Google account. If the dashboard opens, the account exists and the steps below apply. If it asks for the registration fee, stop: that is a new fee and is not planned (see "No-fee alternatives" below).

The listing materials stay ready for when this is unblocked.

1. Sign in to the Chrome Web Store Developer Dashboard with the existing publisher account.
2. In Account, check the contact email is verified and the trader or non-trader choice is set; traders must show an address and phone publicly (EU rule).
3. Build the upload: `node scripts/build-chrome-zip.mjs`. It validates the manifest (permissions, host, version, description length, no test hosts, no remote code, matching card.js copies) and prints the zip path.
4. Dashboard > New item > upload `dist/curious-chrome-0.0.6.zip`.
5. Store listing tab: paste from `chrome-listing.md`, upload the icon, the five screenshots and the small promo tile.
6. Privacy practices tab: single purpose, the five permission justifications, remote code "No", the data-usage boxes and certifications, and the privacy policy URL from step 1. All in `chrome-listing.md`.
7. Distribution tab: Public, all regions.
8. Submit for review. Reviews usually take a few days; the dashboard emails the result. Brave users install from the same Chrome Web Store page; there is no separate Brave store.

## 3. Mac App Store (Safari), existing membership

Uses the existing Apple Developer Program membership (Individual) that MatAdmin uses. No enrollment and no fee.

- **Seller name.** Because the membership is Individual, the App Store shows the owner's personal legal name as the seller, not "Curious" or a company.
- **Membership end date: July 11, 2027, auto-renew off.** Owner decision, no action now: the app stays on the App Store only while the membership is active. If it lapses, Curious is removed from sale (existing installs keep working). Renewing next July is the owner's call.

1. In Xcode: Settings > Accounts, check the Apple ID is listed with its Individual team. This Mac's Xcode already knows a paid Individual team and has an Apple Development certificate. There is no Distribution certificate yet; Xcode's automatic signing creates one at the first archive.
2. Open `apps/safari/Curious/Curious.xcodeproj`. For both targets, **Curious** and **Curious Extension**: Signing & Capabilities > Team: choose the existing Individual team. Signing is already set to Automatic. The team is deliberately not saved in the repository files. Bundle IDs are `com.nerdstalker.Curious` and `com.nerdstalker.Curious.Extension`; change both together if you want a different prefix (the extension ID must start with the app ID).
3. Choose Product > Run once to check Curious appears in Safari Settings > Extensions and works on a page.
4. In App Store Connect (appstoreconnect.apple.com): Apps > + > New App. Platform macOS, name `Curious` (pick an alternative from `app-store-listing.md` if taken), primary language English (U.S.), bundle ID `com.nerdstalker.Curious`, SKU `curious-safari`, Full Access.
5. Fill the app record from `app-store-listing.md`: subtitle, category Reference, description, keywords, promotional text, support and privacy URLs, copyright, the six 2880x1800 screenshots.
6. App Privacy: answer "No, we do not collect data" (Data Not Collected). Pricing and Availability: Free, all countries. Age rating questionnaire: answer None to everything except "Unrestricted Web Access", which should be **Yes**, because the Web and YouTube buttons open ordinary web pages. That raises the age rating, which is normal for browser and search tools.
7. In Xcode: set the scheme destination to "Any Mac", then Product > Archive. In the Organizer: Distribute App > App Store Connect > Upload. Export compliance is already answered in the project (`ITSAppUsesNonExemptEncryption = NO`, it only uses HTTPS).
8. Back in App Store Connect, select the uploaded build for version 1.0, paste the App Review notes from `app-store-listing.md`, and Submit for Review. Reviews usually take one to three days.

## No-fee alternatives for Chrome and Brave (no action yet)

- **GitHub release.** Attach `dist/curious-chrome-<version>.zip` to a GitHub release. Users unzip it, open chrome://extensions (or brave://extensions), turn on Developer mode and click Load unpacked. Free, but Chrome shows a developer-mode warning and there are no automatic updates.
- **Microsoft Edge Add-ons.** Registration in Microsoft Partner Center is free and the same MV3 zip runs in Edge. The `search` permission works there too. Reuses the Chrome listing text, screenshots and privacy policy. Reaches Edge users only.

## Before you submit

- **Mac app icon.** Done: a sharp 1024x1024 icon is drawn as a vector in `apps/safari/AppIcon.svg` (the same blue bubble and yellow bar as the toolbar icon, on the standard macOS plate). `apps/safari/render-app-icon.cjs` renders every size in `AppIcon.appiconset` plus the app window's `Icon.png`.
- **Version numbers.** The extension is 0.0.6; the Mac app is 1.0 (build 1). Each new App Store upload needs a higher build number; each new Chrome upload needs a higher manifest version.
- **iOS and iPadOS.** The Xcode project is macOS only. Adding iPhone and iPad is possible with `xcrun safari-web-extension-converter --rebuild-project` but needs touch-friendly checks of the card first. Ask before adding it.

## Rebuilding things

- Chrome zip: `node scripts/build-chrome-zip.mjs`
- Screenshots: serve `docs/store/capture` on 127.0.0.1:8766 and run `docs/store/capture/capture.cjs` with puppeteer-core and Google Chrome (commands at the top of the script). It loads the real extension from `prototypes/compact-window/extension` into a temporary profile.
- Safari project: it references the files in `prototypes/compact-window/safari-extension` rather than copying them, so edits there are picked up on the next Xcode build. Unsigned local build check: `xcodebuild -project apps/safari/Curious/Curious.xcodeproj -scheme Curious -configuration Release CODE_SIGNING_ALLOWED=NO build`.
