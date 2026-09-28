# Hormuz Minesweeper Android
Lightweight offline Android wrapper for the supplied Hormuz Minesweeper game.

- Offline: no INTERNET permission
- Portrait immersive fullscreen
- Tap to dig, long-press to flag
- Easy / Medium / Hard: 10 / 15 / 25 mines
- Local click / explosion / win / ambient sounds
- Release shrinking enabled

Build: `gradle assembleRelease` with Android SDK 35 and Gradle/AGP compatible environment.
Debug: `gradle assembleDebug`.


## Offline + Ads architecture
- All game HTML/CSS/JS, maps, fonts and sounds are packaged inside the APK.
- The WebView blocks all HTTP/HTTPS traffic, so gameplay cannot depend on the Internet.
- Only the native Google Mobile Ads SDK is allowed to use the network.
- Current App ID and banner unit are Google's official TEST IDs. Replace both with your own AdMob IDs before publishing.
- Added: pause overlay, sound toggle, best time per difficulty, win/lose overlay, particle/explosion effects, vibration permission, lifecycle-safe ad handling.

## Build APK online with GitHub Actions
1. Upload this project's CONTENTS to the root of a GitHub repository (do not upload the outer folder as another nested level).
2. Open the repository's Actions tab and select **Build Android APK**.
3. Click **Run workflow** and wait for the build to finish.
4. Open the successful run and download **HormuzMinesweeper-debug-apk** from Artifacts.
5. Extract the downloaded artifact ZIP; it contains `app-debug.apk`.
