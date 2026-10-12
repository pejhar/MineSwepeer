# ساخت نسخه انتشار امضاشده

شناسه بسته پیشنهادی: `ir.exemplar.hormuzminesweeper`

**پیش از انتشار:** آزاد بودن این شناسه در مایکت را در پنل توسعه‌دهندگان بررسی کنید. اگر شناسه توسط برنامه دیگری رزرو شده باشد، باید شناسه دیگری انتخاب شود.

گردش‌کار GitHub Actions: `.github/workflows/build-release.yml`

Secrets لازم در مخزن GitHub:
- `KEYSTORE_BASE64`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

در تب Actions، گردش‌کار `Build Signed Release APK` را اجرا کنید. فایل خروجی `ir.exemplar.hormuzminesweeper-release.apk` خواهد بود.

فایل keystore را در ZIP یا مخزن عمومی قرار ندهید.
