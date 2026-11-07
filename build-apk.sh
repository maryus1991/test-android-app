#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Amvaj Sarmad Android APK Builder (Tauri 2 + WebView)"
echo "  Target URL: https://amvajsarmad.com"
echo "  Package: com.amvajsarmad.app"
echo "=========================================================="

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Error: Java (JDK 17) is required but not found."
    echo "Please install OpenJDK 17: sudo apt install openjdk-17-jdk"
    exit 1
fi

echo "✅ Java version: $(java -version 2>&1 | head -n 1)"

# Check Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️ Warning: ANDROID_HOME is not set. Looking in standard locations..."
    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
        echo "Found Android SDK at $ANDROID_HOME"
    else
        echo "❌ Error: Android SDK not found. Set ANDROID_HOME to your Android SDK directory."
        exit 1
    fi
fi

# Build web distribution
echo "📦 1/3 Building web distribution..."
npm run build

# Navigate to Android Gradle project
echo "🔨 2/3 Compiling Android APK with Gradle..."
cd src-tauri/gen/android

# Initialize gradle wrapper if not present
if [ ! -f "gradlew" ]; then
    gradle wrapper --gradle-version 8.5
fi
chmod +x gradlew

# Build Debug APK
./gradlew assembleDebug

echo ""
echo "=========================================================="
echo "🎉 Build Successful!"
echo "Your Debug APK is ready at:"
echo "src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk"
echo "=========================================================="
