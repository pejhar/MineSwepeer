# Signed release build

Package name: `ir.keynu.hormuzmines`

GitHub Actions workflow: `.github/workflows/build-release.yml`

Required repository secrets:

- `KEYSTORE_BASE64`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

Run: Actions -> Build Signed Release APK -> Run workflow.
The artifact is named `ir.keynu.hormuzmines-release`.

Do not commit `release.jks` or `keystore-base64.txt`.
