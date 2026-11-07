# Amvaj Sarmad Windows APK Build Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Amvaj Sarmad Android APK Builder (Tauri 2 + WebView)" -ForegroundColor Green
Write-Host "  Target URL: https://amvajsarmad.com" -ForegroundColor Yellow
Write-Host "  Package: com.amvajsarmad.app" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Check Java
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Java (JDK 17) is required. Please install OpenJDK 17." -ForegroundColor Red
    Exit 1
}

# Check Android SDK
if (-not $env:ANDROID_HOME) {
    if (Test-Path "$env:LOCALAPPDATA\Android\Sdk") {
        $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
        Write-Host "Found Android SDK at $env:ANDROID_HOME" -ForegroundColor Green
    } else {
        Write-Host "❌ Error: ANDROID_HOME environment variable is not set." -ForegroundColor Red
        Exit 1
    }
}

Write-Host "📦 1/2 Building web assets..." -ForegroundColor Cyan
npm run build

Write-Host "🔨 2/2 Building Android Debug APK..." -ForegroundColor Cyan
Set-Location "src-tauri\gen\android"

if (-not (Test-Path "gradlew.bat")) {
    gradle wrapper --gradle-version 8.5
}

.\gradlew.bat assembleDebug

Write-Host "🎉 Build Successful!" -ForegroundColor Green
Write-Host "APK location: src-tauri\gen\android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Yellow
