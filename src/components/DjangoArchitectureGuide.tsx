import React from 'react';
import {
  Server,
  Lock,
  RefreshCw,
  FileUp,
  CreditCard,
} from 'lucide-react';

export const DjangoArchitectureGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <img
          src="/assets/aistudio/favicon_6999939e.png"
          alt="گروه آموزشی سورنا"
          className="w-16 h-16 rounded-2xl bg-white p-1.5 object-contain shrink-0 shadow"
        />
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-1.5">
            <Server className="w-5 h-5 text-amber-400" />
            <span>معماری یکپارچگی سامانه «گروه آموزشی سورنا» (sornac.ir) و Android WebView</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            اپلیکیشن اندروید <strong className="text-amber-300">گروه آموزشی سورنا</strong> (<code className="font-mono text-sky-300">ir.sornac.app</code>) بر پایه هسته <strong>Tauri 2</strong> و <strong>Android System WebView</strong> طراحی شده تا وب‌سایت رسمی <strong className="text-amber-300">https://sornac.ir/</strong> را با حفظ کامل نشست‌های کاربری، آپلود فایل و تکالیف، درگاه‌های بانکی شاپرک و پشتیبانی از زبان فارسی (RTL) اجرا کند.
          </p>
        </div>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Session & CSRF */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>۱. پایداری نشست‌های احراز هویت و کوکی‌های امنیتی</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            کاربران و دانش‌پژوهان گروه آموزشی سورنا تنها یک بار وارد حساب کاربری خود می‌شوند و نشست آن‌ها پس از بستن برنامه نیز حفظ می‌گردد.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              استفاده از <code className="font-mono text-emerald-400">CookieManager.getInstance().setAcceptCookie(true)</code> برای پذیرش تمام کوکی‌های سشن.
            </li>
            <li>
              فراخوانی <code className="font-mono text-emerald-400">CookieManager.flush()</code> در متدهای <code className="font-mono">onPageFinished</code> و <code className="font-mono">onPause</code> برای ذخیره‌سازی آنی کوکی‌ها در حافظه دائمی گوشی.
            </li>
            <li>
              پشتیبانی کامل از توکن‌های CSRF و کوکی‌های امنیتی HTTPS در <code className="font-mono text-emerald-400">sornac.ir</code>.
            </li>
          </ul>
        </div>

        {/* Pillar 2: Shaparak Banking Gateways */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CreditCard className="w-4 h-4" />
            <span>۲. مسیریابی هوشمند درگاه‌های شاپرک و ثبت‌نام دوره‌ها</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            فرآیند ثبت‌نام دوره‌ها و پرداخت شهریه شامل انتقال به درگاه بانکی شاپرک (<code className="text-emerald-300 font-mono">*.shaparak.ir</code>) و بازگشت خودکار به دامنه <code className="text-emerald-300 font-mono">sornac.ir</code> است.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              در کلاس <code className="font-mono text-emerald-400">MainActivity.kt</code> متد <code className="font-mono">shouldOverrideUrlLoading</code> دامنه‌های بانکی شاپرک را شناسایی کرده و داخل همان وب‌ویو حفظ می‌کند تا سشن پرداخت قطع نشود.
            </li>
            <li>
              لینک‌های بازگشت به <code className="font-mono text-emerald-400">sornac.ir</code> با موفقیت درون برنامه دریافت می‌شوند.
            </li>
          </ul>
        </div>

        {/* Pillar 3: File & Camera Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <FileUp className="w-4 h-4" />
            <span>۳. آپلود تصاویر، مدارک و فایل‌های آموزشی</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            فرم‌های ارسال مدارک، تصویر پروفایل یا تمرین‌های آموزشی از تگ‌های <code className="text-sky-300 font-mono">&lt;input type="file"&gt;</code> پشتیبانی کامل دارند.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              پیاده‌سازی دقیق متد <code className="font-mono text-sky-400">WebChromeClient.onShowFileChooser</code>.
            </li>
            <li>
              اتصال مستقیم به گالری، مدیر فایل اندروید و دوربین جهت انتخاب و بارگذاری فایل در سایت سورنا.
            </li>
          </ul>
        </div>

        {/* Pillar 4: Network & Offline Resilience */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>۴. تاب‌آوری شبکه، صفحه خطای فارسی و بازیابی خودکار</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            در صورت قطع موقت اینترنت، کاربر هرگز با صفحه خطای خام اندروید مواجه نمی‌شود.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              ثبت شنونده شبکه <code className="font-mono text-purple-400">ConnectivityManager.NetworkCallback</code>.
            </li>
            <li>
              نمایش رابط کاربری فارسی با لوگوی گروه آموزشی سورنا و دکمه «تلاش مجدد».
            </li>
            <li>
              رفرش خودکار صفحه به محض وصل شدن مجدد اینترنت WiFi یا دیتا.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
