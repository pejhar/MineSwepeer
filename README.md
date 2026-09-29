# Hormuz Minesweeper v1.8

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
- Only the native Tapsell Plus SDK is allowed to use the network.
- Tapsell Plus SDK 2.3.3 is packaged and initialized with Tapsell's official test app key. Replace it with your production Tapsell app key before publishing. A production banner/interstitial also requires your dashboard zone ID.
- Added: pause overlay, sound toggle, best time per difficulty, win/lose overlay, particle/explosion effects, vibration permission, lifecycle-safe ad handling.

## Build APK online with GitHub Actions
1. Upload this project's CONTENTS to the root of a GitHub repository (do not upload the outer folder as another nested level).
2. Open the repository's Actions tab and select **Build Android APK**.
3. Click **Run workflow** and wait for the build to finish.
4. Open the successful run and download **HormuzMinesweeper-debug-apk** from Artifacts.
5. Extract the downloaded artifact ZIP; it contains `app-debug.apk`.


## v1.2 UI fixes
- Visible honeycomb rims with green closed cells and warm sand opened cells.
- Sound, pause and explicit flag-mode controls moved into the bottom dock.
- Flag mode: tap a cell to place/remove a flag; tap the flag button again to return to dig mode.
- Reworked start screen and instructions.
- AdMob removed; Tapsell Plus 2.3.3 packaged.

## v1.9 visual refactor
- Reference-driven third-panel gameplay HUD and floating controls.
- MediaAd slot remains at the top with `mediaad-JR3Ax` and keynu.ir loader.
- Full hexes only: edge-clipped cells are filtered out.
- Larger clue dots replace numeric clues.
- Glossy layered SVG hex rendering with stronger contrast.
- Start sound retained.
