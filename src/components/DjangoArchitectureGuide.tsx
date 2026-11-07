import React from 'react';
import {
  ShieldCheck,
  Server,
  Database,
  Lock,
  Layers,
  CheckCircle2,
  Cpu,
  RefreshCw,
  FileUp,
  CreditCard,
} from 'lucide-react';

export const DjangoArchitectureGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Server className="w-5 h-5 text-sky-400" />
          <span>معماری یکپارچگی Django 5.2 و Android WebView</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          وب‌سایت <strong className="text-sky-300">amvajsarmad.com</strong> بر پایه پشته فنی قدرتمند{' '}
          <strong>Django 5.2 SSR + PostgreSQL + Redis + Celery + Nginx + ArvanCloud CDN</strong> راه‌اندازی شده است.
          در این پروژه، کلاینت اندروید توری ۲ به‌گونه‌ای پیکربندی شده که بدون تغییر در بک‌اند، بالاترین پایداری و امنیت را در تعامل با پروتکل‌های جنگو و درگاه‌های بانکی تضمین نماید.
        </p>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Session & CSRF */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>۱. پایداری نشست‌های احراز هویت و توکن‌های CSRF</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            در فریم‌ورک جنگو، احراز هویت با کوکی <code className="text-sky-300 font-mono">sessionid</code> و محافظت از فرم‌ها با <code className="text-sky-300 font-mono">csrftoken</code> انجام می‌شود.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              استفاده از <code className="font-mono text-emerald-400">CookieManager.getInstance().setAcceptCookie(true)</code> برای پذیرش تمام کوکی‌های سشن.
            </li>
            <li>
              فراخوانی <code className="font-mono text-emerald-400">CookieManager.flush()</code> در متدهای <code className="font-mono">onPageFinished</code> و <code className="font-mono">onPause</code> تا پس از بسته شدن برنامه توسط سیستم‌عامل، سشن لاگین کاربر از بین نرود.
            </li>
            <li>
              فعال‌سازی <code className="font-mono text-emerald-400">setAcceptThirdPartyCookies(true)</code> جهت پذیرش کوکی‌های امنیتی ابرآروان (ArvanCloud Challenge Cookies).
            </li>
          </ul>
        </div>

        {/* Pillar 2: Shaparak Banking Gateways */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CreditCard className="w-4 h-4" />
            <span>۲. مسیریابی هوشمند درگاه‌های شاپرک و پرداخت آنلاین</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            فرآیند تسویه‌حساب فروشگاه شامل ریدایرکت مشتری به درگاه شاپرک (<code className="text-emerald-300 font-mono">bpm.shaparak.ir</code> و...) و سپس بازگشت (Callback POST/GET) به دامنه فروشگاه است.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              در کلاس <code className="font-mono text-emerald-400">MainActivity.kt</code> متد <code className="font-mono">shouldOverrideUrlLoading</code> دامنه‌های بانکی شاپرک را شناسایی کرده و داخل همان وب‌ویو حفظ می‌کند تا سشن خرید گم نشود.
            </li>
            <li>
              لینک‌های بازگشت به <code className="font-mono text-emerald-400">amvajsarmad.com/payment/verify/</code> با موفقیت درون‌برنامه‌ای دریافت و صفحه تایید سفارش بلافاصله بارگذاری می‌شود.
            </li>
          </ul>
        </div>

        {/* Pillar 3: File & Camera Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <FileUp className="w-4 h-4" />
            <span>۳. آپلود تصاویر، اسناد و عکس‌های دوربین</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            فرم‌های جنگو برای آپلود عکس پرسنلی، رسید فیش واریزی یا مدارک شرکتی از تگ‌های <code className="text-amber-300 font-mono">&lt;input type="file"&gt;</code> استفاده می‌کنند.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              پیاده‌سازی دقیق متد <code className="font-mono text-amber-400">WebChromeClient.onShowFileChooser</code>.
            </li>
            <li>
              اتصال همزمان به دوربین گوشی و گالری اندروید از طریق Intent Chooser و <code className="font-mono text-amber-400">FileProvider</code>.
            </li>
            <li>
              انتقال مستقیم بایت‌های تصویر به درخواست چندبخشی (Multipart/Form-Data) فرم‌های جنگو بدون شکستگی.
            </li>
          </ul>
        </div>

        {/* Pillar 4: Network & Offline Resilience */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>۴. تاب‌آوری شبکه، خطای فارسی و بازیابی خودکار</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            در صورت قطع موقت اینترنت یا اختلال در شبکه مخابراتی کشور، کاربر هرگز با صفحه سفید یا خطای خام مرورگر مواجه نمی‌شود.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              ثبت شنونده شبکه <code className="font-mono text-purple-400">ConnectivityManager.NetworkCallback</code>.
            </li>
            <li>
              نمایش رابط کاربری چشم‌نواز فارسی با عنوان «عدم دسترسی به اینترنت» و دکمه «تلاش مجدد».
            </li>
            <li>
              اتصال مجدد خودکار: به محض برقراری سیگنال WiFi یا همراه، صفحه به‌صورت هوشمند رفرش شده و خرید ادامه می‌یابد.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
