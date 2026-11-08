# Proguard rules for Sorna Educational Group Android App
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class ir.sornac.app.** { *; }
-dontwarn ir.sornac.app.**

-keep public class android.webkit.** { *; }
