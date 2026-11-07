export interface ProjectFile {
  path: string;
  name: string;
  category: 'tauri' | 'rust' | 'android' | 'gradle' | 'ci' | 'docs';
  language: 'json' | 'toml' | 'rust' | 'kotlin' | 'xml' | 'groovy' | 'yaml' | 'bash' | 'markdown';
  content: string;
  description: string;
}

export const PROJECT_FILES: ProjectFile[] = [
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
            // Android native bridge initialization
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Amvaj Sarmad tauri application");
}`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/java/com/amvajsarmad/app/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'android',
    language: 'kotlin',
    description: 'هسته اکتیویتی اندروید: حفظ سشن و CSRF جنگو، مدیریت درگاه‌های شاپرک، وب‌ویو، دانلود و دوربین',
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
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
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
            userAgentString = "\${settings.userAgentString} AmvajSarmadAndroidApp/1.0.0"
        }

        // Django and ArvanCloud Cookie Persistence
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
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
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

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    progressBar.visibility = View.GONE
                    swipeRefresh.isRefreshing = false
                    showErrorState(getString(R.string.error_server_title), getString(R.string.error_server_msg))
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                progressBar.progress = newProgress
                if (newProgress == 100) progressBar.visibility = View.GONE
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
                Toast.makeText(this, R.string.error_no_internet_msg, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun handleUrlNavigation(url: String): Boolean {
        val uri = Uri.parse(url)
        val host = uri.host?.lowercase(Locale.ROOT) ?: ""

        if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("sms:")) {
            try { startActivity(Intent(Intent.ACTION_VIEW, uri)) } catch (e: Exception) {}
            return true
        }

        val isBankingGateway = host.endsWith("shaparak.ir") || host.contains("zarinpal.com") || host.contains("pay.ir")
        val isInternalDomain = host == "amvajsarmad.com" || host.endsWith(".amvajsarmad.com")

        return if (isInternalDomain || isBankingGateway) {
            false
        } else {
            try { startActivity(Intent(Intent.ACTION_VIEW, uri)) } catch (e: Exception) {}
            true
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }
}`
  },
  {
    path: 'src-tauri/gen/android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'android',
    language: 'xml',
    description: 'مجوزهای دسترسی به اینترنت، دیپ‌لینک‌های amvajsarmad.com و تنظیمات امنیتی اپلیکیشن',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.amvajsarmad.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
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
    </application>
</manifest>`
  },
  {
    path: 'src-tauri/gen/android/app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'gradle',
    language: 'groovy',
    description: 'اسکریپت بیلد ماژول اپ با کامپایلر API 34، بهینه‌ساز Proguard و ابزارهای WebKit',
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
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.webkit:webkit:1.10.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
}`
  },
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml',
    category: 'ci',
    language: 'yaml',
    description: 'اکشن گیت‌هاب برای بیلد خودکار و دانلود خروجی APK در کلاد بدون نیاز به سیستم قدرتمند',
    content: `name: Build Amvaj Sarmad Android APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-apk:
    name: Build Android APK (Tauri 2 & Android Gradle)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies & Build
        run: |
          npm ci || npm install
          npm run build

      - name: Build Android Debug APK
        run: |
          cd src-tauri/gen/android
          chmod +x gradlew || gradle wrapper
          ./gradlew assembleDebug --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: amvaj-sarmad-debug-apk
          path: src-tauri/gen/android/app/build/outputs/apk/debug/*.apk`
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
npm run build
cd src-tauri/gen/android
chmod +x gradlew || gradle wrapper
./gradlew assembleDebug
echo "APK Ready: src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk"`
  },
  {
    path: 'Dockerfile.build-apk',
    name: 'Dockerfile.build-apk',
    category: 'ci',
    language: 'yaml',
    description: 'داکرفایل استاندارد برای ساخت ایزوله APK در هر سیستمی',
    content: `FROM eclipse-temurin:17-jdk-jammy
RUN apt-get update && apt-get install -y curl git unzip build-essential nodejs npm
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
RUN npm ci || npm install && npm run build
WORKDIR /app/src-tauri/gen/android
RUN gradle wrapper || true && chmod +x gradlew && ./gradlew assembleDebug`
  }
];
