import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AndroidEmulator } from './components/AndroidEmulator';
import { ApkBuilderSection } from './components/ApkBuilderSection';
import { CodeExplorer } from './components/CodeExplorer';
import { DjangoArchitectureGuide } from './components/DjangoArchitectureGuide';
import { generateAndDownloadProjectZip } from './utils/zipExporter';
import {
  Terminal,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'emulator' | 'apk' | 'code' | 'architecture'>('apk');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    setToastMessage('در حال آماده‌سازی پکیج کامل سورس اندروید گروه آموزشی سورنا (sornac.ir)...');
    try {
      await generateAndDownloadProjectZip();
      setToastMessage('فایل ZIP پروژه گروه آموزشی سورنا با موفقیت تولید و دانلود شد.');
    } catch {
      setToastMessage('خطا در تولید فایل ZIP.');
    } finally {
      setIsDownloading(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-sky-600 text-white text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-sky-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        isDownloading={isDownloading}
      />

      {/* Hero Badge Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap text-slate-300">
            <span className="font-semibold text-white">اپلیکیشن فعال:</span>
            <span className="font-bold text-amber-300">گروه آموزشی سورنا</span>
            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full font-mono text-[11px]">
              ir.sornac.app
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-mono" dir="ltr">https://sornac.ir/</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              لوگوی رسمی SORNA + آماده کامپایل در GitHub Actions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('apk')}
              className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>دریافت کد جدید build-apk.yml برای گیت‌هاب</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'emulator' && <AndroidEmulator />}
        {activeTab === 'apk' && <ApkBuilderSection />}
        {activeTab === 'code' && <CodeExplorer />}
        {activeTab === 'architecture' && <DjangoArchitectureGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/favicon_6999939e.png"
              alt="لوگوی سورنا"
              className="w-7 h-7 rounded-lg bg-white p-0.5 object-contain"
            />
            <span>اپلیکیشن اندروید گروه آموزشی سورنا (https://sornac.ir/) • معماری Tauri 2 و WebView</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]" dir="ltr">
            <span>ir.sornac.app</span>
            <span>•</span>
            <span>Rust + Kotlin</span>
            <span>•</span>
            <span>API 34 Target</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
