import React from 'react';
import { Smartphone, Download, Layers, ShieldCheck, Terminal, BookOpen, ExternalLink } from 'lucide-react';

interface NavbarProps {
  activeTab: 'emulator' | 'apk' | 'code' | 'architecture';
  setActiveTab: (tab: 'emulator' | 'apk' | 'code' | 'architecture') => void;
  onDownloadZip: () => void;
  isDownloading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onDownloadZip,
  isDownloading,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold text-lg">
              ام
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  امواج سرمد
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                  Tauri 2 + Android
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                اپلیکیشن بومی اندروید وب‌سایت amvajsarmad.com
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1 max-w-[50vw] sm:max-w-none">
            <button
              onClick={() => setActiveTab('emulator')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'emulator'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>شبیه‌ساز</span>
            </button>

            <button
              onClick={() => setActiveTab('apk')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'apk'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>خروجی APK</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'code'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>کدها</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'architecture'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>معماری</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm px-3.5 py-2 rounded-lg font-medium shadow-md shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              title="دانلود فایل‌های کامل سورس Tauri 2 و پروژه گریدل اندروید"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">دانلود سورس کامل</span>
              <span className="font-mono text-[11px] bg-black/20 px-1.5 py-0.5 rounded">ZIP</span>
            </button>

            <a
              href="https://amvajsarmad.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 hidden lg:block"
              title="مشاهده وب‌سایت امواج سرمد در تب جدید"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
