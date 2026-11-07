# Proguard rules for Amvaj Sarmad Android App
# Preserve WebView JavaScript interfaces and native bindings
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class com.amvajsarmad.app.** { *; }
-dontwarn com.amvajsarmad.app.**

# Preserve WebKit callbacks
-keep public class android.webkit.** { *; }
