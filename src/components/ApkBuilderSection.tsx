import React, { useState } from 'react';
import {
  Download,
  Terminal,
  Cloud,
  CheckCircle2,
  Copy,
  AlertCircle,
  Cpu,
  Key,
  Sparkles,
} from 'lucide-react';
import { generateAndDownloadProjectZip } from '../utils/zipExporter';
import { GITHUB_WORKFLOW_YML } from '../data/projectFiles';

export const ApkBuilderSection: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownload = async () => {
    setIsGeneratingZip(true);
    try {
      await generateAndDownloadProjectZip();
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Updated Brand & Workflow Alert */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-slate-100">
        <div className="flex items-start gap-3.5">
          <img
            src="/assets/aistudio/favicon_6999939e.png"
            alt="گروه آموزشی سورنا"
            className="w-12 h-12 rounded-xl bg-white p-1 object-contain shrink-0 shadow"
          />
          <div>
            <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>نسخه اختصاصی «گروه آموزشی سورنا» (sornac.ir) آماده بیلد در گیت‌هاب</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              تمامی فایل‌های پروژه و اسکریپت <code className="font-mono text-amber-300">.github/workflows/build-apk.yml</code> به نام <strong>گروه آموزشی سورنا</strong>، آدرس <strong>https://sornac.ir/</strong>، شناسه پکیج <strong>ir.sornac.app</strong> و <strong>لوگوی رسمی ارسالی شما</strong> (به‌صورت تصویر PNG واقعی درون خود فایل ورک‌فلو) بروزرسانی شدند. حتی اگر فقط کد جدید <code className="font-mono text-amber-300">build-apk.yml</code> را در مخزن قبلی گیت‌هاب خود جایگزین کنید، به‌صورت خودکار فایل‌های قدیمی را پاک کرده و اپلیکیشن سورنا را با لوگوی جدید می‌سازد!
            </p>
          </div>
        </div>
      </div>

      {/* Main Download CTA */}
      <div className="bg-gradient-to-r from-[#001F54] via-blue-950 to-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src="/assets/aistudio/favicon_6999939e.png"
            alt="SORNA Logo"
            className="hidden sm:block w-20 h-20 rounded-2xl bg-white p-2 object-contain shrink-0 shadow-lg border border-amber-400/40"
          />
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
              پکیج کامل ir.sornac.app + لوگوی رسمی سورنا
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-3">
              دریافت سورس کامل و ورک‌فلو گیت‌هاب «گروه آموزشی سورنا»
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              شامل ساختار کامل <code className="text-amber-300 font-mono">src-tauri/</code>، پروژه‌ی کامل Gradle اندروید، آیکون رسمی سورنا، مانیفست متصل به <code className="text-amber-300 font-mono">https://sornac.ir/</code> و خروجی‌های <code className="text-emerald-300 font-mono">sorna-debug-apk</code> و <code className="text-emerald-300 font-mono">sorna-release-apk</code>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => copyToClipboard(GITHUB_WORKFLOW_YML, 'workflow')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            {copiedKey === 'workflow' ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'workflow' ? 'کد جدید build-apk.yml کپی شد!' : 'کپی کد جدید build-apk.yml (سورنا)'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isGeneratingZip}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2.5 shrink-0"
          >
            <Download className="w-5 h-5 text-slate-950" />
            <span>{isGeneratingZip ? 'در حال ساخت ZIP...' : 'دانلود پروژه سورنا (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* 3 Guaranteed Build Pathways */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pathway 1: GitHub Actions (Recommended) */}
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30">
                روش ۱ (پیشنهادی - سریع در گیت‌هاب شما)
              </span>
              <Cloud className="w-5 h-5 text-amber-400" />
            </div>

            <h3 className="text-base font-bold text-white">
              بروزرسانی ۱ دقیقه‌ای در GitHub Actions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              فایل جدید <code className="text-amber-300 font-mono text-[10px]">.github/workflows/build-apk.yml</code> لوگوی سورنا را به‌صورت Base64 درون خود دارد و تمام فایل‌ها را به سورنا تغییر می‌دهد.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1.5 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">۱.</span> کد جدید <strong>build-apk.yml</strong> را کپی و در گیت‌هاب خود جایگزین کنید.
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">۲.</span> در تب <strong>Actions</strong> صبر کنید تا تیک سبز بخورد.
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">۳.</span> در پایین صفحه بیلد (بخش Artifacts)، فایل <strong>sorna-debug-apk</strong> را دانلود کنید!
              </div>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(GITHUB_WORKFLOW_YML, 'git')}
            className="mt-4 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {copiedKey === 'git' ? <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'git' ? 'فایل build-apk.yml کپی شد!' : 'کپی کامل فایل build-apk.yml'}</span>
          </button>
        </div>

        {/* Pathway 2: Local Gradle CLI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                روش ۲ (سیستم شخصی)
              </span>
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>

            <h3 className="text-base font-bold text-white">
              بیلد لوکال با اسکریپت یا Gradle
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              اگر فایل ZIP پروژه را دانلود کرده‌اید و روی سیستم خود Android Studio یا JDK 17 دارید:
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 space-y-1 text-left" dir="ltr">
              <div className="text-slate-400 text-[10px]"># Linux & macOS:</div>
              <div className="truncate">chmod +x build-apk.sh && ./build-apk.sh</div>
              <div className="text-slate-400 text-[10px] pt-1"># Or Gradle directly:</div>
              <div className="truncate">cd src-tauri/gen/android && ./gradlew assembleDebug</div>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard('cd src-tauri/gen/android && ./gradlew assembleDebug', 'local')}
            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            {copiedKey === 'local' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>کپی دستور گریدل</span>
          </button>
        </div>

        {/* Pathway 3: Docker Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                روش ۳ (داکر ایزوله)
              </span>
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>

            <h3 className="text-base font-bold text-white">
              بیلد با داکر بدون نصب SDK
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              فایل آماده‌ی <code className="text-purple-300 font-mono text-[10px]">Dockerfile.build-apk</code> تمامی ابزارها را داخل کانتینر دانلود و کامپایل می‌کند.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-purple-300 space-y-1 overflow-x-auto text-left" dir="ltr">
              <div className="text-slate-400 text-[10px]"># One-line Docker build:</div>
              <div className="text-[11px]">docker build -t sorna-builder -f Dockerfile.build-apk .</div>
              <div className="text-[11px]">docker run --rm -v $(pwd):/out sorna-builder</div>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard('docker build -t sorna-builder -f Dockerfile.build-apk . && docker run --rm -v $(pwd):/out sorna-builder', 'docker')}
            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            {copiedKey === 'docker' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>کپی دستور داکر</span>
          </button>
        </div>
      </div>

      {/* Release Signing & Keystore Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              راهنمای امضای دیجیتال (Signing Release APK) برای کافه‌بازار و مایکت
            </h3>
            <p className="text-xs text-slate-400">
              مراحل ساخت کلید اختصاصی برای پکیج <code className="font-mono text-amber-300">ir.sornac.app</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="font-semibold text-slate-200">۱. ساخت فایل کلید (Keystore):</div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-slate-300 text-[11px] relative text-left" dir="ltr">
              <pre className="whitespace-pre-wrap">keytool -genkey -v -keystore sorna-release.jks -alias sornac -keyalg RSA -keysize 2048 -validity 10000</pre>
              <button
                onClick={() => copyToClipboard('keytool -genkey -v -keystore sorna-release.jks -alias sornac -keyalg RSA -keysize 2048 -validity 10000', 'keytool')}
                className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-400"
                title="کپی"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-slate-200">۲. ساخت نسخه رسمی Release:</div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-slate-300 text-[11px] relative text-left" dir="ltr">
              <pre className="whitespace-pre-wrap">cd src-tauri/gen/android && ./gradlew assembleRelease</pre>
              <button
                onClick={() => copyToClipboard('cd src-tauri/gen/android && ./gradlew assembleRelease', 'release')}
                className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-400"
                title="کپی"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
