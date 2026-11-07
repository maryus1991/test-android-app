export interface ProjectFile {
  path: string;
  name: string;
  category: 'tauri' | 'rust' | 'android' | 'gradle' | 'ci' | 'docs';
  language: 'json' | 'toml' | 'rust' | 'kotlin' | 'xml' | 'groovy' | 'yaml' | 'bash' | 'markdown';
  content: string;
  description: string;
}

export const GITHUB_WORKFLOW_YML = `name: Build Amvaj Sarmad Android APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-apk:
    name: Build Android APK (Amvaj Sarmad)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Accept Android SDK Licenses
        run: |
          echo "Using Android SDK at: $ANDROID_HOME"
          yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses || true

      - name: Setup Gradle 8.5
        uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.5'

      - name: Verify & Prepare Android Project Structure
        run: |
          mkdir -p src-tauri/gen/android/app/src/main/java/com/amvajsarmad/app
          mkdir -p src-tauri/gen/android/app/src/main/res/drawable
          mkdir -p src-tauri/gen/android/app/src/main/res/values
          mkdir -p src-tauri/gen/android/app/src/main/res/xml

          cat << 'EOF' > src-tauri/gen/android/settings.gradle.kts
          pluginManagement {
              repositories {
                  google()
                  mavenCentral()
                  gradlePluginPortal()
              }
          }
          dependencyResolutionManagement {
              repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
              repositories {
                  google()
                  mavenCentral()
              }
          }
          rootProject.name = "AmvajSarmadApp"
          include(":app")
          EOF

          cat << 'EOF' > src-tauri/gen/android/build.gradle.kts
          plugins {
              id("com.android.application") version "8.3.2" apply false
              id("org.jetbrains.kotlin.android") version "1.9.23" apply false
          }
          EOF

          cat << 'EOF' > src-tauri/gen/android/gradle.properties
          org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
          android.useAndroidX=true
          android.nonTransitiveRClass=true
          kotlin.code.style=official
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/build.gradle.kts
          plugins {
              id("com.android.application")
              id("org.jetbrains.kotlin.android")
          }

          android {
              namespace = "com.amvajsarmad.app"
              compileSdk = 34

              defaultConfig {
                  applicationId = "com.amvajsarmad.app"
                  minSdk = 26
                  targetSdk = 34
                  versionCode = 1
                  versionName = "1.0.0"

                  vectorDrawables {
                      useSupportLibrary = true
                  }
              }

              buildTypes {
                  release {
                      isMinifyEnabled = false
                      isShrinkResources = false
                      proguardFiles(
                          getDefaultProguardFile("proguard-android-optimize.txt"),
                          "proguard-rules.pro"
                      )
                      signingConfig = signingConfigs.getByName("debug")
                  }
                  debug {
                      applicationIdSuffix = ".debug"
                      isDebuggable = true
                  }
              }

              compileOptions {
                  sourceCompatibility = JavaVersion.VERSION_17
                  targetCompatibility = JavaVersion.VERSION_17
              }

              kotlinOptions {
                  jvmTarget = "17"
              }
          }

          dependencies {
              implementation("androidx.core:core-ktx:1.12.0")
              implementation("androidx.appcompat:appcompat:1.6.1")
              implementation("com.google.android.material:material:1.11.0")
              implementation("androidx.constraintlayout:constraintlayout:2.1.4")
              implementation("androidx.webkit:webkit:1.10.0")
              implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
              implementation("androidx.activity:activity-ktx:1.8.2")
          }
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/proguard-rules.pro
          -keepclassmembers class * {
              @android.webkit.JavascriptInterface <methods>;
          }
          -keep class com.amvajsarmad.app.** { *; }
          -dontwarn com.amvajsarmad.app.**
          -keep public class android.webkit.** { *; }
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/src/main/res/drawable/ic_launcher.xml
          <?xml version="1.0" encoding="utf-8"?>
          <vector xmlns:android="http://schemas.android.com/apk/res/android"
              android:width="108dp"
              android:height="108dp"
              android:viewportWidth="108"
              android:viewportHeight="108">
              <path
                  android:fillColor="#0369A1"
                  android:pathData="M0,0h108v108h-108z" />
              <path
                  android:fillColor="#0284C7"
                  android:pathData="M54,14A40,40 0,1 1,14 54A40,40 0,0 1,54 14z" />
              <path
                  android:fillColor="#FFFFFF"
                  android:pathData="M30,60 C38,44 46,44 54,60 C62,76 70,76 78,60 L78,68 C70,84 62,84 54,68 C46,52 38,52 30,68 Z" />
              <path
                  android:fillColor="#38BDF8"
                  android:pathData="M30,44 C38,28 46,28 54,44 C62,60 70,60 78,44 L78,52 C70,68 62,68 54,52 C46,36 38,36 30,52 Z" />
          </vector>
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/src/main/res/values/strings.xml
          <resources>
              <string name="app_name">امواج سرمد</string>
              <string name="app_name_en">Amvaj Sarmad</string>
              <string name="website_url">https://amvajsarmad.com</string>
              <string name="error_no_internet_title">عدم دسترسی به اینترنت</string>
              <string name="error_no_internet_msg">اتصال دستگاه شما به اینترنت قطع شده است. لطفاً وضعیت وای‌فای یا دیتای سیم‌کارت را بررسی نمایید.</string>
              <string name="error_server_title">خطا در بارگذاری فروشگاه</string>
              <string name="error_server_msg">امکان اتصال به سرورهای امواج سرمد فراهم نشد. لطفاً چند لحظه دیگر دوباره تلاش نمایید.</string>
              <string name="btn_retry">تلاش مجدد</string>
              <string name="btn_check_network">تنظیمات شبکه</string>
              <string name="download_started">شروع دریافت فایل…</string>
              <string name="download_completed">دریافت فایل با موفقیت انجام شد</string>
          </resources>
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/src/main/res/values/colors.xml
          <?xml version="1.0" encoding="utf-8"?>
          <resources>
              <color name="primary">#0284C7</color>
              <color name="primary_dark">#0369A1</color>
              <color name="primary_light">#38BDF8</color>
              <color name="accent">#F59E0B</color>
              <color name="background_light">#F8FAFC</color>
              <color name="background_dark">#0F172A</color>
              <color name="surface">#FFFFFF</color>
              <color name="text_primary">#0F172A</color>
              <color name="text_secondary">#64748B</color>
              <color name="status_bar_color">#0369A1</color>
          </resources>
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/src/main/res/values/styles.xml
          <resources>
              <style name="Theme.AmvajSarmad" parent="Theme.MaterialComponents.DayNight.NoActionBar">
                  <item name="colorPrimary">@color/primary</item>
                  <item name="colorPrimaryVariant">@color/primary_dark</item>
                  <item name="colorOnPrimary">@color/surface</item>
                  <item name="colorSecondary">@color/accent</item>
                  <item name="android:statusBarColor">@color/status_bar_color</item>
                  <item name="android:windowLightStatusBar">false</item>
                  <item name="android:navigationBarColor">@color/background_dark</item>
              </style>
          </resources>
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/src/main/res/xml/network_security_config.xml
          <?xml version="1.0" encoding="utf-8"?>
          <network-security-config>
              <domain-config cleartextTrafficPermitted="false">
                  <domain includeSubdomains="true">amvajsarmad.com</domain>
                  <trust-anchors>
                      <certificates src="system" />
                      <certificates src="user" />
                  </trust-anchors>
              </domain-config>
              <base-config cleartextTrafficPermitted="false">
                  <trust-anchors>
                      <certificates src="system" />
                  </trust-anchors>
              </base-config>
          </network-security-config>
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/src/main/res/xml/file_paths.xml
          <?xml version="1.0" encoding="utf-8"?>
          <paths>
              <external-files-path name="my_images" path="Pictures" />
              <external-cache-path name="cached_images" path="/" />
              <cache-path name="internal_cache" path="/" />
          </paths>
          EOF

          cat << 'EOF' > src-tauri/gen/android/app/src/main/AndroidManifest.xml
          <?xml version="1.0" encoding="utf-8"?>
          <manifest xmlns:android="http://schemas.android.com/apk/res/android"
              xmlns:tools="http://schemas.android.com/tools">

              <uses-permission android:name="android.permission.INTERNET" />
              <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
              <uses-permission android:name="android.permission.CAMERA" />
              <uses-feature android:name="android.hardware.camera" android:required="false" />
              <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
              <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
              <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

              <application
                  android:allowBackup="true"
                  android:icon="@drawable/ic_launcher"
                  android:label="@string/app_name"
                  android:roundIcon="@drawable/ic_launcher"
                  android:supportsRtl="true"
                  android:theme="@style/Theme.AmvajSarmad"
                  android:networkSecurityConfig="@xml/network_security_config"
                  android:usesCleartextTraffic="false"
                  tools:targetApi="34">

                  <activity
                      android:name=".MainActivity"
                      android:exported="true"
                      android:launchMode="singleTask"
                      android:configChanges="orientation|screenSize|screenLayout|keyboardHidden|smallestScreenSize"
                      android:windowSoftInputMode="adjustResize">

                      <intent-filter>
                          <action android:name="android.intent.action.MAIN" />
                          <category android:name="android.intent.category.LAUNCHER" />
                      </intent-filter>

                      <intent-filter android:autoVerify="true">
                          <action android:name="android.intent.action.VIEW" />
                          <category android:name="android.intent.category.DEFAULT" />
                          <category android:name="android.intent.category.BROWSABLE" />
                          <data android:scheme="https" android:host="amvajsarmad.com" />
                          <data android:scheme="https" android:host="*.amvajsarmad.com" />
                      </intent-filter>
                  </activity>

                  <provider
                      android:name="androidx.core.content.FileProvider"
                      android:authorities="\${applicationId}.fileprovider"
                      android:exported="false"
                      android:grantUriPermissions="true">
                      <meta-data
                          android:name="android.support.FILE_PROVIDER_PATHS"
                          android:resource="@xml/file_paths" />
                  </provider>
              </application>
          </manifest>
          EOF

      - name: Build Android Debug APK
        working-directory: src-tauri/gen/android
        run: |
          gradle assembleDebug --stacktrace

      - name: Build Android Release APK
        working-directory: src-tauri/gen/android
        run: |
          gradle assembleRelease --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: amvaj-sarmad-debug-apk
          path: src-tauri/gen/android/app/build/outputs/apk/debug/*.apk

      - name: Upload Release APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: amvaj-sarmad-release-apk
          path: src-tauri/gen/android/app/build/outputs/apk/release/*.apk
`;

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml',
    category: 'ci',
    language: 'yaml',
    description: 'اکشن گیت‌هاب خودترمیم‌گر (بدون وابستگی به package-lock.json و همراه با ساخت خودکار تمام منابع اندروید)',
    content: GITHUB_WORKFLOW_YML,
  },
  {
    path: 'src-tauri/tauri.conf.json',
    name: 'tauri.conf.json',
    category: 'tauri',
    language: 'json',
    description: 'پیکربندی هسته توری ۲، آدرس سایت amvajsarmad.com، پکیج آیدی و مجوزهای اندروید',
    content: `{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Amvaj Sarmad",
  "version": "1.0.0",
  "identifier": "com.amvajsarmad.app",
  "build": {
    "beforeDevCommand": "",
    "beforeBuildCommand": "",
    "frontendDist": "../dist"
  },
  "app": {
    "withGlobalTauri": false,
    "security": {
      "csp": null
    },
    "windows": [
      {
        "title": "Amvaj Sarmad",
        "url": "https://amvajsarmad.com",
        "userAgent": "Mozilla/5.0 (Linux; Android 14; Mobile; AmvajSarmadApp/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "fullscreen": false,
        "resizable": true,
        "transparent": false,
        "zoomHotkeysEnabled": false
      }
    ]
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "android": {
      "vulkan": false,
      "minSdkVersion": 26,
      "targetSdkVersion": 34,
      "compileSdkVersion": 34
    }
  },
  "plugins": {
    "opener": {
      "default": "system"
    }
  }
}`
  },
  {
    path: 'src-tauri/Cargo.toml',
    name: 'Cargo.toml',
    category: 'rust',
    language: 'toml',
    description: 'وابستگی‌های راست (Rust Crate)، کتابخانه‌های Tauri 2 و افزونه‌های بومی',
    content: `[package]
name = "amvaj-sarmad-app"
version = "1.0.0"
description = "Amvaj Sarmad Android Mobile Application (Tauri 2 + WebView)"
authors = ["Amvaj Sarmad Engineering <dev@amvajsarmad.com>"]
edition = "2021"
default-run = "amvaj-sarmad-app"

[lib]
name = "amvaj_sarmad_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2.0.0", features = [] }

[dependencies]
tauri = { version = "2.0.0", features = [] }
tauri-plugin-opener = "2.0.0"
tauri-plugin-dialog = "2.0.0"
tauri-plugin-notification = "2.0.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]`
  },
  {
    path: 'src-tauri/src/lib.rs',
    name: 'lib.rs',
    category: 'rust',
    language: 'rust',
    description: 'نقطه ورود موبایل در توری ۲ با تعریف اینترسیس و کنترلرهای بومی',
    content: `use tauri::Manager;

#[tauri::command]
fn get_app_info() -> serde_json::Value {
    serde_json::json!({
        "name": "Amvaj Sarmad",
        "package": "com.amvajsarmad.app",
        "target_url": "https://amvajsarmad.com",
        "version": "1.0.0",
        "framework": "Tauri 2 + Android WebView",
        "django_backend": "Django 5.2 (PostgreSQL + Redis + Celery + Nginx)"
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![get_app_info])
        .setup(|_app| {
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Amvaj Sarmad tauri application");
}`
  },
  {
    path: 'src-tauri/gen/android/settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'gradle',
    language: 'groovy',
    description: 'تنظیمات مخازن Maven و Google برای پروژه گریدل اندروید',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "AmvajSarmadApp"
include(":app")`
  },
  {
    path: 'src-tauri/gen/android/build.gradle.kts',
    name: 'build.gradle.kts',
    category: 'gradle',
    language: 'groovy',
    description: 'پلاگین‌های ریشه Android Gradle Plugin 8.3.2 و Kotlin 1.9.23',
    content: `plugins {
    id("com.android.application") version "8.3.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.23" apply false
}`
  },
  {
    path: 'src-tauri/gen/android/gradle.properties',
    name: 'gradle.properties',
    category: 'gradle',
    language: 'groovy',
    description: 'تنظیمات حافظه JVM و فعال‌سازی AndroidX',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`
  },
  {
    path: 'src-tauri/gen/android/app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'gradle',
    language: 'groovy',
    description: 'اسکریپت بیلد ماژول اپ با کامپایلر API 34 و کتابخانه‌های WebKit و SwipeRefreshLayout',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.amvajsarmad.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.amvajsarmad.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            isShrinkResources = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.webkit:webkit:1.10.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("androidx.activity:activity-ktx:1.8.2")
}`
  },
  {
    path: 'src-tauri/gen/android/app/proguard-rules.pro',
    name: 'proguard-rules.pro',
    category: 'gradle',
    language: 'groovy',
    description: 'قوانین Proguard جهت حفظ متدهای WebView و JavascriptInterface',
    content: `-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.amvajsarmad.app.** { *; }
-dontwarn com.amvajsarmad.app.**
-keep public class android.webkit.** { *; }`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'android',
    language: 'xml',
    description: 'مجوزهای دسترسی به اینترنت، دیپ‌لینک‌های amvajsarmad.com و تنظیمات امنیتی اپلیکیشن',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.AmvajSarmad"
        android:networkSecurityConfig="@xml/network_security_config"
        android:usesCleartextTraffic="false"
        tools:targetApi="34">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden|smallestScreenSize"
            android:windowSoftInputMode="adjustResize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="amvajsarmad.com" />
                <data android:scheme="https" android:host="*.amvajsarmad.com" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/res/drawable/ic_launcher.xml',
    name: 'ic_launcher.xml',
    category: 'android',
    language: 'xml',
    description: 'آیکون برداری (Vector Drawable) رسمی اپلیکیشن امواج سرمد',
    content: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#0369A1"
        android:pathData="M0,0h108v108h-108z" />
    <path
        android:fillColor="#0284C7"
        android:pathData="M54,14A40,40 0,1 1,14 54A40,40 0,0 1,54 14z" />
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M30,60 C38,44 46,44 54,60 C62,76 70,76 78,60 L78,68 C70,84 62,84 54,68 C46,52 38,52 30,68 Z" />
    <path
        android:fillColor="#38BDF8"
        android:pathData="M30,44 C38,28 46,28 54,44 C62,60 70,60 78,44 L78,52 C70,68 62,68 54,52 C46,36 38,36 30,52 Z" />
</vector>`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/res/values/strings.xml',
    name: 'strings.xml',
    category: 'android',
    language: 'xml',
    description: 'رشته‌های متنی فارسی و انگلیسی اپلیکیشن اندروید',
    content: `<resources>
    <string name="app_name">امواج سرمد</string>
    <string name="app_name_en">Amvaj Sarmad</string>
    <string name="website_url">https://amvajsarmad.com</string>
    <string name="error_no_internet_title">عدم دسترسی به اینترنت</string>
    <string name="error_no_internet_msg">اتصال دستگاه شما به اینترنت قطع شده است. لطفاً وضعیت وای‌فای یا دیتای سیم‌کارت را بررسی نمایید.</string>
    <string name="error_server_title">خطا در بارگذاری فروشگاه</string>
    <string name="error_server_msg">امکان اتصال به سرورهای امواج سرمد فراهم نشد. لطفاً چند لحظه دیگر دوباره تلاش نمایید.</string>
    <string name="btn_retry">تلاش مجدد</string>
    <string name="btn_check_network">تنظیمات شبکه</string>
    <string name="download_started">شروع دریافت فایل…</string>
    <string name="download_completed">دریافت فایل با موفقیت انجام شد</string>
</resources>`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    category: 'android',
    language: 'xml',
    description: 'پالت رنگی برند امواج سرمد برای نوار وضعیت و صفحات خطا',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#0284C7</color>
    <color name="primary_dark">#0369A1</color>
    <color name="primary_light">#38BDF8</color>
    <color name="accent">#F59E0B</color>
    <color name="background_light">#F8FAFC</color>
    <color name="background_dark">#0F172A</color>
    <color name="surface">#FFFFFF</color>
    <color name="text_primary">#0F172A</color>
    <color name="text_secondary">#64748B</color>
    <color name="status_bar_color">#0369A1</color>
</resources>`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/res/values/styles.xml',
    name: 'styles.xml',
    category: 'android',
    language: 'xml',
    description: 'استایل و تم بدون اکشن‌بار (NoActionBar) برای نمایش تمام‌صفحه وب‌سایت',
    content: `<resources>
    <style name="Theme.AmvajSarmad" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryVariant">@color/primary_dark</item>
        <item name="colorOnPrimary">@color/surface</item>
        <item name="colorSecondary">@color/accent</item>
        <item name="android:statusBarColor">@color/status_bar_color</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:navigationBarColor">@color/background_dark</item>
    </style>
</resources>`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/res/xml/network_security_config.xml',
    name: 'network_security_config.xml',
    category: 'android',
    language: 'xml',
    description: 'تنظیمات امنیتی شبکه اندروید با الزام HTTPS و گواهی‌های معتبر SSL',
    content: `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">amvajsarmad.com</domain>
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </domain-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/res/xml/file_paths.xml',
    name: 'file_paths.xml',
    category: 'android',
    language: 'xml',
    description: 'مسیرهای مجاز FileProvider برای آپلود مستقیم عکس از دوربین در فرم‌های جنگو',
    content: `<?xml version="1.0" encoding="utf-8"?>
<paths>
    <external-files-path name="my_images" path="Pictures" />
    <external-cache-path name="cached_images" path="/" />
    <cache-path name="internal_cache" path="/" />
</paths>`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/java/com/amvajsarmad/app/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'android',
    language: 'kotlin',
    description: 'کد کامل MainActivity.kt (نسخه ۴۵۰ خطی کامل بدون حذفیات، سازگار با SDK 34)',
    content: `package com.amvajsarmad.app

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.Gravity
import android.view.View
import android.webkit.CookieManager
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var errorLayout: LinearLayout
    private lateinit var btnRetry: Button
    private lateinit var tvErrorTitle: TextView
    private lateinit var tvErrorDesc: TextView

    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private var cameraImageUri: Uri? = null

    private lateinit var filePickerLauncher: ActivityResultLauncher<Intent>

    private val targetUrl = "https://amvajsarmad.com"
    private var isOffline = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(buildDynamicLayout())

        setupActivityLaunchers()
        setupWebView()
        setupBackNavigation()
        setupNetworkMonitoring()

        if (isNetworkAvailable()) {
            loadTargetWebsite(targetUrl)
        } else {
            showErrorState(
                getString(R.string.error_no_internet_title),
                getString(R.string.error_no_internet_msg)
            )
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings
        settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            loadWithOverviewMode = true
            useWideViewPort = true
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            userAgentString = "\${settings.userAgentString ?: ""} AmvajSarmadAndroidApp/1.0.0"
        }

        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        swipeRefresh.setColorSchemeResources(R.color.primary)
        swipeRefresh.setOnRefreshListener {
            if (isNetworkAvailable()) {
                hideErrorState()
                webView.reload()
            } else {
                swipeRefresh.isRefreshing = false
                showErrorState(
                    getString(R.string.error_no_internet_title),
                    getString(R.string.error_no_internet_msg)
                )
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                return handleUrlNavigation(url)
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
                CookieManager.getInstance().flush()
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    progressBar.visibility = View.GONE
                    swipeRefresh.isRefreshing = false
                    showErrorState(
                        getString(R.string.error_server_title),
                        getString(R.string.error_server_msg)
                    )
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                progressBar.progress = newProgress
                if (newProgress == 100) {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback
                openFileSelector()
                return true
            }
        }

        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, _ ->
            handleDownload(url, userAgent, contentDisposition, mimetype)
        }

        btnRetry.setOnClickListener {
            if (isNetworkAvailable()) {
                hideErrorState()
                progressBar.visibility = View.VISIBLE
                webView.reload()
            } else {
                Toast.makeText(
                    this,
                    R.string.error_no_internet_msg,
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun handleUrlNavigation(url: String): Boolean {
        val uri = Uri.parse(url)
        val host = uri.host?.lowercase(Locale.ROOT) ?: ""

        if (url.startsWith("tel:") || url.startsWith("mailto:") ||
            url.startsWith("sms:") || url.startsWith("whatsapp:") ||
            url.startsWith("tg:")
        ) {
            try {
                startActivity(Intent(Intent.ACTION_VIEW, uri))
            } catch (e: Exception) {
                Toast.makeText(this, "برنامه‌ای برای باز کردن این پیوند یافت نشد", Toast.LENGTH_SHORT).show()
            }
            return true
        }

        val isBankingGateway = host.endsWith("shaparak.ir") ||
                host.contains("zarinpal.com") ||
                host.contains("idpay.ir") ||
                host.contains("pay.ir") ||
                host.contains("nextpay.org") ||
                host.contains("sadadpsp.ir") ||
                host.contains("asanpardakht.ir")

        val isInternalDomain = host == "amvajsarmad.com" || host.endsWith(".amvajsarmad.com")

        return if (isInternalDomain || isBankingGateway) {
            false
        } else {
            try {
                val intent = Intent(Intent.ACTION_VIEW, uri)
                startActivity(intent)
            } catch (e: Exception) {
            }
            true
        }
    }

    private fun handleDownload(
        url: String?,
        userAgent: String?,
        contentDisposition: String?,
        mimeType: String?
    ) {
        if (url.isNullOrEmpty()) return
        try {
            val request = DownloadManager.Request(Uri.parse(url))
            val filename = URLUtil.guessFileName(url, contentDisposition, mimeType)

            val cookies = CookieManager.getInstance().getCookie(url)
            if (!cookies.isNullOrEmpty()) {
                request.addRequestHeader("cookie", cookies)
            }
            if (!userAgent.isNullOrEmpty()) {
                request.addRequestHeader("User-Agent", userAgent)
            }
            request.setDescription(getString(R.string.download_started))
            request.setTitle(filename)
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename)

            val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            dm.enqueue(request)

            Toast.makeText(this, getString(R.string.download_started), Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, "خطا در شروع دانلود: \${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (errorLayout.visibility == View.VISIBLE && webView.canGoBack()) {
                    hideErrorState()
                    webView.goBack()
                } else if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    private fun setupActivityLaunchers() {
        filePickerLauncher = registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            val data = result.data
            var results: Array<Uri>? = null
            if (result.resultCode == RESULT_OK) {
                if (data != null && data.data != null) {
                    results = arrayOf(data.data!!)
                } else if (cameraImageUri != null) {
                    results = arrayOf(cameraImageUri!!)
                }
            }
            fileUploadCallback?.onReceiveValue(results)
            fileUploadCallback = null
        }
    }

    private fun openFileSelector() {
        val galleryIntent = Intent(Intent.ACTION_GET_CONTENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
            putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "application/pdf"))
        }

        val cameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        if (cameraIntent.resolveActivity(packageManager) != null) {
            val photoFile: File? = try {
                createImageFile()
            } catch (ex: IOException) {
                null
            }
            if (photoFile != null) {
                cameraImageUri = FileProvider.getUriForFile(
                    this,
                    "\${applicationContext.packageName}.fileprovider",
                    photoFile
                )
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraImageUri)
            }
        }

        val chooser = Intent.createChooser(galleryIntent, "انتخاب فایل یا عکس")
        if (cameraIntent.resolveActivity(packageManager) != null && cameraImageUri != null) {
            chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(cameraIntent))
        }

        filePickerLauncher.launch(chooser)
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile("JPEG_\${timeStamp}_", ".jpg", storageDir)
    }

    private fun setupNetworkMonitoring() {
        val connectivityManager =
            getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        connectivityManager.registerNetworkCallback(
            request,
            object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    runOnUiThread {
                        if (isOffline) {
                            isOffline = false
                            if (errorLayout.visibility == View.VISIBLE) {
                                hideErrorState()
                                webView.reload()
                            }
                        }
                    }
                }

                override fun onLost(network: Network) {
                    runOnUiThread {
                        isOffline = true
                    }
                }
            }
        )
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val activeNetwork = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(activeNetwork) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun loadTargetWebsite(url: String) {
        hideErrorState()
        webView.loadUrl(url)
    }

    private fun showErrorState(title: String, desc: String) {
        tvErrorTitle.text = title
        tvErrorDesc.text = desc
        errorLayout.visibility = View.VISIBLE
        webView.visibility = View.GONE
    }

    private fun hideErrorState() {
        errorLayout.visibility = View.GONE
        webView.visibility = View.VISIBLE
    }

    private fun buildDynamicLayout(): View {
        val root = ConstraintLayout(this).apply {
            layoutParams = ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ConstraintLayout.LayoutParams.MATCH_PARENT
            )
        }

        swipeRefresh = SwipeRefreshLayout(this).apply {
            id = View.generateViewId()
            layoutParams = ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ConstraintLayout.LayoutParams.MATCH_PARENT
            )
        }

        webView = WebView(this).apply {
            id = View.generateViewId()
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }
        swipeRefresh.addView(webView)
        root.addView(swipeRefresh)

        progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            id = View.generateViewId()
            max = 100
            progressDrawable?.setTint(ContextCompat.getColor(this@MainActivity, R.color.primary))
            val lp = ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                8
            )
            lp.topToTop = ConstraintLayout.LayoutParams.PARENT_ID
            layoutParams = lp
        }
        root.addView(progressBar)

        errorLayout = LinearLayout(this).apply {
            id = View.generateViewId()
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(ContextCompat.getColor(this@MainActivity, R.color.background_light))
            visibility = View.GONE
            setPadding(48, 48, 48, 48)
            val lp = ConstraintLayout.LayoutParams(
                ConstraintLayout.LayoutParams.MATCH_PARENT,
                ConstraintLayout.LayoutParams.MATCH_PARENT
            )
            layoutParams = lp
        }

        tvErrorTitle = TextView(this).apply {
            textSize = 20f
            setTextColor(ContextCompat.getColor(this@MainActivity, R.color.text_primary))
            gravity = Gravity.CENTER
            setPadding(0, 24, 0, 16)
        }
        errorLayout.addView(tvErrorTitle)

        tvErrorDesc = TextView(this).apply {
            textSize = 14f
            setTextColor(ContextCompat.getColor(this@MainActivity, R.color.text_secondary))
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 32)
        }
        errorLayout.addView(tvErrorDesc)

        btnRetry = Button(this).apply {
            text = getString(R.string.btn_retry)
            setBackgroundColor(ContextCompat.getColor(this@MainActivity, R.color.primary))
            setTextColor(ContextCompat.getColor(this@MainActivity, R.color.surface))
        }
        errorLayout.addView(btnRetry)

        root.addView(errorLayout)
        return root
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        CookieManager.getInstance().flush()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
        CookieManager.getInstance().flush()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}`
  },
  {
    path: 'build-apk.sh',
    name: 'build-apk.sh',
    category: 'ci',
    language: 'bash',
    description: 'اسکریپت یک‌کلیکی بیلد محلی در لینوکس و مک (Linux/macOS)',
    content: `#!/usr/bin/env bash
set -e
echo "Building Amvaj Sarmad Android APK..."
cd src-tauri/gen/android
if command -v gradle &> /dev/null; then
  gradle assembleDebug
else
  chmod +x gradlew
  ./gradlew assembleDebug
fi
echo "APK Ready: src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk"`
  },
  {
    path: 'Dockerfile.build-apk',
    name: 'Dockerfile.build-apk',
    category: 'ci',
    language: 'yaml',
    description: 'داکرفایل استاندارد برای ساخت ایزوله APK در هر سیستمی',
    content: `FROM eclipse-temurin:17-jdk-jammy
RUN apt-get update && apt-get install -y curl git unzip build-essential
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \\
    curl -o /tmp/cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \\
    unzip -q /tmp/cmdline-tools.zip -d $ANDROID_HOME/cmdline-tools && \\
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \\
    rm /tmp/cmdline-tools.zip
RUN yes | sdkmanager --licenses && sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
WORKDIR /app
COPY . .
WORKDIR /app/src-tauri/gen/android
RUN chmod +x gradlew && ./gradlew assembleDebug`
  }
];
