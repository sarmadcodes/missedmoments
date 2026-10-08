# iOS release checklist (do this on your Mac)

Everything that can be prepared in the repo is already done. These are the steps that
need Xcode, your Apple Developer account, or the Firebase/App Store Connect consoles.

## 1. Build setup
```bash
npm ci
cd ios && pod install && cd ..
open ios/MissedMoments.xcworkspace      # the .xcworkspace, NOT the .xcodeproj
```
The Podfile builds pods as **static frameworks** (required by Firebase, because
`AppDelegate.swift` does `import FirebaseCore`). If `pod install` or the build ever
complains about modular headers, that setting is the first place to look.

## 2. Signing (Xcode > MissedMoments target > Signing & Capabilities)
- Tick **Automatically manage signing** and pick your **Team**.
- Bundle identifier is `com.missedmoments.app` (change it in Xcode + the Firebase iOS app
  together if you want a different one).
- Click **+ Capability** and add **Push Notifications** and **Background Modes >
  Remote notifications**. The entitlements file (`MissedMoments.entitlements`) and
  `Info.plist` already declare them, this just registers them on your App ID.

## 3. Push notifications (APNs key -> Firebase) -- REQUIRED for iOS push
1. developer.apple.com > Certificates, Identifiers & Profiles > **Keys** > create a key with
   **Apple Push Notifications service (APNs)** enabled. Download the `.p8` (one-time download).
2. Firebase console > Project settings > **Cloud Messaging** > Apple app configuration >
   upload the `.p8`, with its **Key ID** and your **Team ID**.
Without this step the app works but iOS devices never receive pushes.

## 4. Archive and upload
- Set the run destination to **Any iOS Device (arm64)**.
- Bump **Build** (General tab) for every upload; **Version** is `1.0`.
- **Product > Archive** > **Distribute App** > **App Store Connect** > Upload.

## 5. App Store Connect listing (cannot be done from code)
- **Privacy Policy URL** (required) -- a public page describing what you collect.
- **App Privacy** questionnaire. Data the app collects, all linked to the user's identity:
  name, email, phone number, date of birth/age, gender, photos, precise location (used to
  match people nearby; never shown to others), user content (chat messages), device token
  (push). No tracking, no third-party advertising.
- **Age rating**: dating app with user-generated content -> answer honestly (17+ is typical).
- **Account deletion**: already in-app (Profile > Delete Account). Mention this in review notes.
- **Report/Block**: already in-app (profile menu). Apple requires this for UGC apps.
- **Review notes**: give the reviewer a working login (create a dedicated reviewer account on
  production and use the `/admin` panel to approve its photo). The app is location-based, so
  tell them matches appear after a check-in near other users.
- **Screenshots**: iPhone 6.9" (1320x2868) and 6.5" sets. The app is iPhone-only
  (`TARGETED_DEVICE_FAMILY = 1`), so no iPad screenshots are needed.

## What is already configured in the repo
- Production API `https://missedmoments-api.threadique.live` (release builds only; the
  localhost URL is `__DEV__`-only). WebSocket uses `wss://` derived from it.
- ATS: `NSAllowsArbitraryLoads = false`. Portrait only. iPhone only.
- Permission strings: location (when in use), camera, photo library.
- `PrivacyInfo.xcprivacy` bundled in the app target's Resources.
- `GoogleService-Info.plist` bundled (bundle ID matches `com.missedmoments.app`).
- `ITSAppUsesNonExemptEncryption = false`, icon fonts registered (`UIAppFonts`),
  all app icons opaque RGB (no alpha) incl. the 1024 marketing icon, branded launch screen.
