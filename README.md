# پروژه نرم‌افزار اندروید امواج سرمد (Amvaj Sarmad Android App)
### توسعه‌یافته با معماری Tauri 2 + Android Native WebView

این پروژه یک نرم‌افزار حرفه‌ای، سریع و بهینه‌سازی‌شده برای سیستم‌عامل اندروید است که پلتفرم فروشگاهی **امواج سرمد** (`https://amvajsarmad.com`) را در قالب یک نرم‌افزار بومی (Native Android Application) لود و اجرا می‌کند.

---

## 📋 مشخصات و پیکربندی پروژه

- **نام اپلیکیشن:** امواج سرمد (Amvaj Sarmad)
- **شناسه پکیج (Package ID):** `com.amvajsarmad.app`
- **آدرس وب‌سایت اصلی:** `https://amvajsarmad.com`
- **حداقل نسخه اندروید (minSdk):** Android 8.0 (API Level 26)
- **نسخه هدف (targetSdk):** Android 14 (API Level 34)
- **فناوری:** Tauri 2, Rust, Android SDK, Gradle, Kotlin, Android System WebView

---

## ✨ قابلیت‌ها و ویژگی‌های فنی پیاده‌سازی شده

1. **مدیریت نشست‌های Django (Session & CSRF):**
   - حفظ کوکی‌های امنیتی (`sessionid`, `csrftoken`) در سراسر اجرای برنامه و پس از راه‌اندازی مجدد.
   - همگام‌سازی دائمی کوکی‌ها با `CookieManager.getInstance().flush()`.
   - سازگاری با سیستم امنیتی ابرآروان (ArvanCloud Challenge Bypass).

2. **پشتیبانی کامل از درگاه‌های پرداخت شاپرک:**
   - هدایت هوشمند درگاه‌های بانکی (`*.shaparak.ir`، زرین‌پال، به‌پرداخت، سامان‌کیش، سداد و...).
   - بازگشت خودکار تراکنش‌ها به وب‌سایت امواج سرمد بدون باز شدن پنجره متفرقه.

3. **مدیریت ناوبری هوشمند و دکمه بازگشت (Back Navigation):**
   - پیمایش در تاریخچه صفحات WebView با فشردن دکمه Back گوشی.
   - خروج از برنامه فقط زمانی که کاربر در صفحه اصلی باشد.
   - باز کردن لینک‌های متفرقه خارجی در مرورگر پیش‌فرض سیستم.

4. **آپلود تصاویر و اسناد با دوربین و گالری:**
   - پیاده‌سازی متد `WebChromeClient.onShowFileChooser`.
   - اتصال مستقیم به دوربین دستگاه و گالری عکس با مجوزهای امنیتی و `FileProvider`.

5. **مدیریت دانلود فاکتورها و رسیدها:**
   - اتصال به `DownloadManager` اندروید همراه با ارسال کوکی‌های نشست برای دریافت فاکتورهای PDF و رسیدهای خرید.

6. **پایش اتصال اینترنت و صفحه خطای اختصاصی فارسی:**
   - تشخیص خودکار قطع اینترنت با `ConnectivityManager.NetworkCallback`.
   - نمایش صفحه خطای زیبای فارسی با دکمه **«تلاش مجدد»**.
   - بارگذاری مجدد خودکار بلافاصله پس از وصل شدن اینترنت.

---

## 🚀 روش‌های دریافت خروجی APK (Build Instructions)

با توجه به اینکه این اپلیکیشن کامپایل به زبان ماشین اندروید (ARM64 / ARMv7) با NDK و Gradle نیاز دارد، ۳ روش ساده و تضمینی برای دریافت فایل APK آماده شده است:

### روش ۱: ساخت خودکار در کلاد با گیت‌هاب (پیشنهادی - ۱۰۰٪ رایگان و بدون نیاز به نصب نرم‌افزار)
یک فایل ورک‌فلو کامل در مسیر `.github/workflows/build-apk.yml` قرار داده شده است.
1. این پروژه را در مخزن گیت‌هاب خود Push کنید.
2. به برگه **Actions** در گیت‌هاب بروید.
3. ورک‌فلو **Build Amvaj Sarmad Android APK** را اجرا کنید.
4. پس از ۳ دقیقه، فایل‌های `app-debug.apk` و `app-release.apk` را از بخش **Artifacts** به صورت مستقیم دانلود کنید!

### روش ۲: بیلد محلی در سیستم شما (Linux / macOS / Windows)
پیش‌نیازها:
- جاوا ۱۷ (OpenJDK 17)
- اندروید استودیو یا Android SDK (API 34)

**در لینوکس و مک:**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

**در ویندوز (PowerShell):**
```powershell
.\build-apk.ps1
```

یا مستقیماً با گریدل:
```bash
cd src-tauri/gen/android
./gradlew assembleDebug
```
فایل خروجی APK در مسیر زیر تولید می‌شود:
`src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk`

### روش ۳: بیلد با داکر (Docker)
```bash
docker build -t amvaj-apk-builder -f Dockerfile.build-apk .
docker run --rm -v $(pwd)/dist-apk:/out amvaj-apk-builder
```
فایل APK در پوشه `dist-apk` ذخیره خواهد شد.

---

## 🔧 نحوه تغییر آدرس وب‌سایت در آینده

اگر دامنه وب‌سایت تغییر کرد:
1. در فایل `src-tauri/tauri.conf.json` مقدار `url` را ویرایش کنید.
2. در فایل `src-tauri/gen/android/app/src/main/res/values/strings.xml` مقدار `website_url` را ویرایش کنید.
3. در فایل `src-tauri/gen/android/app/src/main/AndroidManifest.xml` دامنه را در بخش `<data android:host="..." />` تغییر دهید.
4. در فایل `src-tauri/gen/android/app/src/main/res/xml/network_security_config.xml` دامنه جدید را ثبت کنید.
