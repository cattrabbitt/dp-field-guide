# DP Field Guide

Cinematography lessons, lighting setups and on-set tools built around Cameron Currin's own kit. Works offline.

- **Web app:** `docs/` (served by GitHub Pages at https://cattrabbitt.github.io/dp-field-guide/). Open it in Chrome on the phone and choose "Install app".
- **Android app:** every push to `main` builds an APK with GitHub Actions. Download it from the "Latest Android build" release on this repo.

## Editing

- Lesson text, glossary and sources: `docs/data/content.js`
- Your kit: `docs/config.js`
- After changing any file in `docs/`, run `python3 docs/tools/build.py` so the offline copy updates, then commit and push.

## How the Android app is built

`android/` is a Capacitor project that wraps the same files in `docs/`. The workflow in `.github/workflows/android.yml` runs `npx cap sync android` and `./gradlew assembleDebug`, then attaches `DP-Field-Guide.apk` to the release. Nothing needs to be installed on your PC.
