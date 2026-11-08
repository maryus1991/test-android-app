import React, { useState } from 'react';
import {
  Smartphone,
  RotateCw,
  ArrowRight,
  Lock,
  Wifi,
  WifiOff,
  Battery,
  CheckCircle2,
  User,
  CreditCard,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';
import { classifyUrl, getNetworkErrorPersianCopy } from '../utils/navigationRules';

export const AndroidEmulator: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://sornac.ir/');
  const [isOnline, setIsOnline] = useState(true);
  const [activePage, setActivePage] = useState<'home' | 'products' | 'cart' | 'login' | 'payment'>('home');
  const [history, setHistory] = useState<string[]>(['https://sornac.ir/']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [sessionCookies] = useState({
    sessionid: 'sorna_sess_94b1e72c8a',
    csrftoken: 'dj_csrf_4f81a2d90e317b',
    arvan_arcsco: '7c95725e0d2504bbd06ff914',
  });

  const [testUrlInput, setTestUrlInput] = useState('https://bpm.shaparak.ir/pay');
  const [lastRouteResult, setLastRouteResult] = useState(() => classifyUrl('https://bpm.shaparak.ir/pay'));

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const navigateTo = (url: string, pageKey?: 'home' | 'products' | 'cart' | 'login' | 'payment') => {
    const classification = classifyUrl(url);

    if (classification.targetAction === 'EXTERNAL_BROWSER') {
      showNotice(`لینک خارجی در مرورگر پیش‌فرض اندروید باز می‌شود: ${url}`);
      return;
    }

    if (classification.targetAction === 'NATIVE_INTENT') {
      showNotice(`در محیط واقعی اندروید، اینتنت بومی فراخوانی می‌شود: ${url}`);
      return;
    }

    const nextHistory = [...history.slice(0, historyIndex + 1), url];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setCurrentUrl(url);

    if (pageKey) {
      setActivePage(pageKey);
    } else if (url.includes('/cart')) {
      setActivePage('cart');
    } else if (url.includes('/courses') || url.includes('/products')) {
      setActivePage('products');
    } else if (url.includes('/login') || url.includes('/account')) {
      setActivePage('login');
    } else if (url.includes('shaparak.ir') || url.includes('/payment')) {
      setActivePage('payment');
    } else {
      setActivePage('home');
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      const prevUrl = history[prevIndex];
      setCurrentUrl(prevUrl);
      if (prevUrl.includes('/cart')) setActivePage('cart');
      else if (prevUrl.includes('/courses') || prevUrl.includes('/products')) setActivePage('products');
      else if (prevUrl.includes('/login')) setActivePage('login');
      else if (prevUrl.includes('shaparak')) setActivePage('payment');
      else setActivePage('home');
    } else {
      showNotice('ابتدای تاریخچه وب‌ویو؛ فشردن مجدد دکمه Back در اندروید از برنامه خارج می‌شود.');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleTestUrlCheck = (url: string) => {
    setTestUrlInput(url);
    setLastRouteResult(classifyUrl(url));
  };

  const offlineError = getNetworkErrorPersianCopy(-2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Android Device Mockup */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="relative w-[340px] sm:w-[360px] h-[720px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-800 flex flex-col select-none">
          {/* Side Buttons decoration */}
          <div className="absolute -left-5 top-24 w-1 h-12 bg-slate-700 rounded-l-md"></div>
          <div className="absolute -left-5 top-40 w-1 h-16 bg-slate-700 rounded-l-md"></div>
          <div className="absolute -right-5 top-32 w-1 h-14 bg-slate-700 rounded-r-md"></div>

          {/* Android Screen Bezel */}
          <div className="w-full h-full bg-slate-950 rounded-[34px] overflow-hidden flex flex-col relative border border-slate-800/80">
            {/* Top Status Bar */}
            <div className="h-7 bg-[#001F54] text-slate-200 text-[11px] px-5 flex items-center justify-between font-mono z-20">
              <span className="font-semibold text-white">14:35</span>
              {/* Notch camera */}
              <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span className="text-[10px]">5G</span>
                <Battery className="w-3.5 h-3.5 text-slate-200" />
              </div>
            </div>

            {/* App Header & WebView URL Bar */}
            <div className="bg-[#001F54] border-b border-amber-500/30 p-2 z-10 text-white">
              <div className="flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleBack}
                    className="p-1 hover:bg-blue-900 rounded text-slate-200 transition-colors"
                    title="بازگشت (Back)"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="p-1 hover:bg-blue-900 rounded text-slate-200 transition-colors"
                    title="تازه‌سازی (Reload)"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* URL display */}
                <div className="flex-1 bg-slate-950/70 px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1.5 border border-amber-500/30 text-slate-200 truncate font-mono" dir="ltr">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{currentUrl.replace('https://', '')}</span>
                </div>

                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                </div>
              </div>

              {/* Native Progress Bar */}
              {isRefreshing && (
                <div className="w-full h-0.5 bg-slate-950 mt-1 overflow-hidden">
                  <div className="h-full bg-amber-400 animate-pulse w-3/4"></div>
                </div>
              )}
            </div>

            {/* Inline Android Toast Notice */}
            {statusNotice && (
              <div className="bg-amber-500/95 text-slate-950 text-[11px] font-bold px-3 py-1.5 text-center z-30 shadow">
                {statusNotice}
              </div>
            )}

            {/* WebView Body Canvas */}
            <div className="flex-1 bg-slate-900 overflow-y-auto text-slate-100 relative">
              {!isOnline ? (
                /* Native Persian Offline Screen */
                <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/50">
                    <WifiOff className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-2">
                    {offlineError.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {offlineError.description}
                  </p>
                  <button
                    onClick={() => {
                      setIsOnline(true);
                      handleRefresh();
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{offlineError.canRetry ? 'تلاش مجدد' : 'بستن'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400 mt-4">
                    این صفحه با کدهای Kotlin اختصاصی در زمان قطع شبکه به نمایش درمی‌آید.
                  </p>
                </div>
              ) : (
                /* Dynamic Simulated Page Views */
                <div className="h-full flex flex-col">
                  {/* Page: HOME */}
                  {activePage === 'home' && (
                    <div className="p-4 space-y-4">
                      {/* Hero Banner with SORNA Logo */}
                      <div className="bg-gradient-to-br from-[#001F54] via-blue-950 to-slate-900 rounded-2xl p-4 border border-amber-500/30 shadow-md">
                        <div className="flex items-center gap-3">
                          <img
                            src="/assets/aistudio/favicon_6999939e.png"
                            alt="گروه آموزشی سورنا"
                            className="w-12 h-12 rounded-xl bg-white p-1 object-contain shrink-0 shadow"
                          />
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded">
                              sornac.ir
                            </span>
                            <h2 className="text-sm font-extrabold text-white mt-1">
                              گروه آموزشی سورنا (SORNA)
                            </h2>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed">
                          سامانه جامع دوره‌های آموزشی، آزمون‌ها و خدمات هوشمند آموزشی در بستر Android WebView
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => navigateTo('https://sornac.ir/courses', 'products')}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-3 py-1.5 rounded-lg font-bold"
                          >
                            مشاهده دوره‌ها
                          </button>
                          <button
                            onClick={() => navigateTo('https://sornac.ir/cart', 'cart')}
                            className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium border border-slate-700"
                          >
                            سبد ثبت‌نام ({cartCount})
                          </button>
                        </div>
                      </div>

                      {/* Featured Categories */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-2">
                          <span>بخش‌های آموزشی سورنا</span>
                          <span className="text-amber-400 text-[11px]">مشاهده همه</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div
                            onClick={() => navigateTo('https://sornac.ir/courses?cat=specialized', 'products')}
                            className="p-2.5 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer"
                          >
                            <span className="text-amber-400 font-bold text-sm">📚</span>
                            <div className="font-semibold mt-1">دوره‌های تخصصی</div>
                            <div className="text-[10px] text-slate-400">آموزش گام‌به‌گام و جامع</div>
                          </div>
                          <div
                            onClick={() => navigateTo('https://sornac.ir/courses?cat=exams', 'products')}
                            className="p-2.5 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer"
                          >
                            <span className="text-emerald-400 font-bold text-sm">📝</span>
                            <div className="font-semibold mt-1">آزمون و سنجش</div>
                            <div className="text-[10px] text-slate-400">کارنامه و تحلیل هوشمند</div>
                          </div>
                          <div
                            onClick={() => navigateTo('https://sornac.ir/courses?cat=workshops', 'products')}
                            className="p-2.5 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer"
                          >
                            <span className="text-sky-400 font-bold text-sm">💡</span>
                            <div className="font-semibold mt-1">کارگاه‌های مهارتی</div>
                            <div className="text-[10px] text-slate-400">پروژه‌محور و کاربردی</div>
                          </div>
                          <div
                            onClick={() => navigateTo('https://sornac.ir/courses?cat=consulting', 'products')}
                            className="p-2.5 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer"
                          >
                            <span className="text-purple-400 font-bold text-sm">🎓</span>
                            <div className="font-semibold mt-1">مشاوره و برنامه‌ریزی</div>
                            <div className="text-[10px] text-slate-400">پشتیبانی اختصاصی سورنا</div>
                          </div>
                        </div>
                      </div>

                      {/* Session Status Card */}
                      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            وضعیت نشست کاربری sornac.ir:
                          </span>
                          <span className="text-emerald-400 font-mono text-[10px]">فعال (Active)</span>
                        </div>
                        <div className="text-slate-400 font-mono text-[10px] truncate">
                          CSRF: {sessionCookies.csrftoken.slice(0, 14)}...
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page: COURSES / PRODUCTS */}
                  {activePage === 'products' && (
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                        <span>فهرست دوره‌های گروه آموزشی سورنا</span>
                        <span className="text-amber-400 text-[11px]">۴ دوره</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: 1, title: 'دوره جامع آمادگی آزمون و مهارت‌های تخصصی سورنا', price: '۱,۸۵۰,۰۰۰ تومان', code: 'SRN-101' },
                          { id: 2, title: 'کارگاه عملی حل مسئله و تکنیک‌های تست‌زنی پیشرفته', price: '۹۵۰,۰۰۰ تومان', code: 'SRN-204' },
                          { id: 3, title: 'بسته آموزشی جامع به همراه جزوات و آزمون آزمایشی', price: '۲,۴۰۰,۰۰۰ تومان', code: 'SRN-310' },
                          { id: 4, title: 'جلسات مشاوره و هدایت تحصیلی اختصاصی سورنا', price: '۷۸۰,۰۰۰ تومان', code: 'SRN-405' },
                        ].map((prod) => (
                          <div key={prod.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between gap-2">
                            <div>
                              <div className="text-xs font-semibold text-white">{prod.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{prod.code}</div>
                              <div className="text-[11px] text-amber-400 font-bold mt-1">{prod.price}</div>
                            </div>
                            <button
                              onClick={() => {
                                setCartCount(c => c + 1);
                                navigateTo('https://sornac.ir/cart', 'cart');
                              }}
                              className="text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-lg shrink-0 font-bold"
                            >
                              ثبت‌نام دوره
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Page: CART */}
                  {activePage === 'cart' && (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                        <span>سبد ثبت‌نام شما در سورنا</span>
                        <span className="text-amber-400 text-[11px]">{cartCount} دوره</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-white">دوره جامع مهارت‌های تخصصی سورنا</div>
                            <div className="text-[10px] text-slate-400">دسترسی کامل آنلاین + جزوه</div>
                          </div>
                          <span className="text-amber-400 font-bold">۱,۸۵۰,۰۰۰ تومان</span>
                        </div>
                        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-white">کارگاه تکنیک‌های پیشرفته</div>
                            <div className="text-[10px] text-slate-400">ظرفیت ویژه</div>
                          </div>
                          <span className="text-amber-400 font-bold">۹۵۰,۰۰۰ تومان</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40 text-xs space-y-2">
                        <div className="flex justify-between text-slate-300">
                          <span>مبلغ کل ثبت‌نام:</span>
                          <span className="font-bold text-white">۲,۸۰۰,۰۰۰ تومان</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>فعال‌سازی پنل کاربری:</span>
                          <span className="text-emerald-400">آنی پس از پرداخت</span>
                        </div>
                      </div>

                      {/* Payment Action */}
                      <button
                        onClick={() => navigateTo('https://bpm.shaparak.ir/pgwchannel/startpay.mellat', 'payment')}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>اتصال به درگاه بانکی شاپرک</span>
                      </button>

                      <p className="text-[10px] text-slate-400 text-center leading-normal">
                        درگاه پرداخت داخل وب‌ویو لود شده و پس از تکمیل، به سایت گروه آموزشی سورنا (sornac.ir) بازمی‌گردد.
                      </p>
                    </div>
                  )}

                  {/* Page: PAYMENT GATEWAY (Shaparak Simulation) */}
                  {activePage === 'payment' && (
                    <div className="p-4 space-y-4 bg-slate-950 h-full">
                      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                        <div className="text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 mb-1">
                          <CreditCard className="w-4 h-4" />
                          <span>درگاه پرداخت اینترنتی شاپرک</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-mono">
                          bpm.shaparak.ir
                        </p>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex justify-between text-slate-400">
                          <span>پذیرنده:</span>
                          <span className="text-slate-200 font-bold">گروه آموزشی سورنا (sornac.ir)</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>مبلغ قابل پرداخت:</span>
                          <span className="text-emerald-400 font-bold">۲,۸۰۰,۰۰۰ تومان</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>شماره ترمینال:</span>
                          <span className="font-mono text-slate-200">94827165</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            showNotice('پرداخت موفق بود! بازگشت خودکار به پنل کاربری گروه آموزشی سورنا.');
                            navigateTo('https://sornac.ir/payment/verify/?status=OK&track_id=9812450', 'home');
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>شبیه‌سازی پرداخت موفق و بازگشت</span>
                        </button>

                        <button
                          onClick={() => {
                            showNotice('پرداخت لغو شد. بازگشت به سبد ثبت‌نام.');
                            navigateTo('https://sornac.ir/cart', 'cart');
                          }}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-xl"
                        >
                          انصراف از پرداخت
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Page: LOGIN */}
                  {activePage === 'login' && (
                    <div className="p-4 space-y-4">
                      <div className="text-center">
                        <img
                          src="/assets/aistudio/favicon_6999939e.png"
                          alt="لوگوی گروه آموزشی سورنا"
                          className="w-14 h-14 rounded-2xl bg-white p-1.5 object-contain mx-auto mb-2 shadow"
                        />
                        <h3 className="text-sm font-bold text-white">ورود به پنل کاربری سورنا</h3>
                        <p className="text-[11px] text-slate-400">حفظ پایدار کوکی‌های نشست در اپلیکیشن اندروید</p>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1 text-[11px]">شماره موبایل یا کد ملی:</label>
                          <input
                            type="text"
                            defaultValue="09120000000"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1 text-[11px]">رمز عبور:</label>
                          <input
                            type="password"
                            defaultValue="••••••••"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <button
                          onClick={() => {
                            showNotice('ورود با موفقیت انجام شد! کوکی نشست در حافظه دائمی اندروید ذخیره گردید.');
                            navigateTo('https://sornac.ir/', 'home');
                          }}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition-colors mt-2"
                        >
                          ورود به سامانه سورنا
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Android Navigation Bar */}
            <div className="h-11 bg-slate-950 border-t border-slate-800/80 flex items-center justify-around text-slate-400 px-6 z-20">
              <button
                onClick={handleBack}
                className="p-2 hover:text-white transition-colors"
                title="دکمه بازگشت (Back)"
              >
                <div className="w-0 h-0 border-y-4 border-y-transparent border-r-8 border-r-slate-400"></div>
              </button>
              <button
                onClick={() => navigateTo('https://sornac.ir/', 'home')}
                className="p-2 hover:text-white transition-colors"
                title="صفحه اصلی (Home)"
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400"></div>
              </button>
              <button
                onClick={() => showNotice('برنامه فعال اندروید: گروه آموزشی سورنا (ir.sornac.app)')}
                className="p-2 hover:text-white transition-colors"
                title="برنامه‌های اخیر (Recents)"
              >
                <div className="w-3 h-3 border-2 border-slate-400 rounded-sm"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Emulator Controls & Security / Cookie Diagnostics */}
      <div className="lg:col-span-7 space-y-5">
        {/* Brand Identity & Logo Verification Card */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-amber-500/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/favicon_6999939e.png"
              alt="لوگوی گروه آموزشی سورنا"
              className="w-16 h-16 rounded-2xl bg-white p-1.5 object-contain border border-amber-400/40 shadow-md shrink-0"
            />
            <div>
              <span className="text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                مشخصات جدید اپلیکیشن اعمال شد
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-1.5">
                گروه آموزشی سورنا • <span className="font-mono text-amber-400 text-sm">https://sornac.ir/</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                شناسه پکیج اندروید: <code className="font-mono text-sky-300">ir.sornac.app</code> • آیکون رسمی سورنا (PNG Adaptive Icon) در بیلد گیت‌هاب تعبیه شد
              </p>
            </div>
          </div>
        </div>

        {/* Quick Simulator Control Header */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span>پنل آزمایش و شبیه‌سازی وب‌ویو اندروید سورنا</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تست سناریوهای واقعی: قطع شبکه، درگاه‌های شاپرک، حفظ کوکی‌های لاگین و اینتنت‌ها
              </p>
            </div>

            {/* Online/Offline Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'وضعیت: آنلاین' : 'وضعیت: آفلاین (تست خطا)'}</span>
            </button>
          </div>

          {/* Quick Page Navigators */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              پرش سریع به صفحات و سناریوها در وب‌ویو:
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => navigateTo('https://sornac.ir/', 'home')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'home'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                صفحه اصلی سورنا
              </button>
              <button
                onClick={() => navigateTo('https://sornac.ir/courses', 'products')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'products'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                فهرست دوره‌های آموزشی
              </button>
              <button
                onClick={() => navigateTo('https://sornac.ir/cart', 'cart')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'cart'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                سبد ثبت‌نام ({cartCount})
              </button>
              <button
                onClick={() => navigateTo('https://bpm.shaparak.ir/pay', 'payment')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'payment'
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                تست درگاه پرداخت شاپرک
              </button>
              <button
                onClick={() => navigateTo('https://sornac.ir/account/login', 'login')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'login'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                ورود به پنل کاربری
              </button>
            </div>
          </div>
        </div>

        {/* Real-time URL Routing & Security Classifier */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>موتور هوشمند ناوبری و فیلتر آدرس‌ها (sornac.ir)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">MainActivity.kt / Rust</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            آدرس‌های دامنه <code className="font-mono text-amber-300">sornac.ir</code> و زیرشاخه‌های آن داخل اپلیکیشن باز می‌مانند، درگاه‌های بانکی شاپرک در همان سشن اجرا می‌شوند و لینک‌های خارجی به مرورگر هدایت می‌شوند:
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={testUrlInput}
                onChange={(e) => handleTestUrlCheck(e.target.value)}
                placeholder="آدرس اینترنتی را وارد کنید..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                dir="ltr"
              />
            </div>

            {/* Classification Card */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">طبقه‌بندی مسیر:</div>
                <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-amber-400">{lastRouteResult.type}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-200">{lastRouteResult.reason}</span>
                </div>
              </div>

              <span
                className={`text-[11px] font-mono px-2.5 py-1 rounded-full font-bold ${
                  lastRouteResult.targetAction === 'WEBVIEW_LOAD'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : lastRouteResult.targetAction === 'EXTERNAL_BROWSER'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : lastRouteResult.targetAction === 'NATIVE_INTENT'
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {lastRouteResult.targetAction}
              </span>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1" dir="ltr">
              {[
                'https://sornac.ir/courses',
                'https://bpm.shaparak.ir/pay',
                'https://sornac.ir/payment/verify/?status=OK',
                'tel:02188888888',
                'https://instagram.com/sornac.ir',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => handleTestUrlCheck(example)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono px-2 py-1 rounded border border-slate-700/60"
                >
                  {example.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cookies & Session Inspector */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>پایش دائمی کوکی‌های نشست sornac.ir</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              CookieManager.flush()
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            در اپلیکیشن گروه آموزشی سورنا کوکی‌های احراز هویت و نشست کاربری پس از بستن و باز کردن مجدد برنامه کاملاً پایدار باقی می‌مانند:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono" dir="ltr">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-amber-400 text-[10px] block">sessionid</span>
              <span className="text-slate-200 truncate block mt-0.5">{sessionCookies.sessionid}</span>
              <span className="text-[9px] text-emerald-400">HttpOnly, Secure</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-amber-400 text-[10px] block">csrftoken</span>
              <span className="text-slate-200 truncate block mt-0.5">{sessionCookies.csrftoken}</span>
              <span className="text-[9px] text-emerald-400">SameSite=Lax</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-amber-400 text-[10px] block">__arcsco (CDN)</span>
              <span className="text-slate-200 truncate block mt-0.5">{sessionCookies.arvan_arcsco}</span>
              <span className="text-[9px] text-emerald-400">Persistent Cookie</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
