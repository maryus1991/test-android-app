import React, { useState } from 'react';
import {
  Smartphone,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  Lock,
  Wifi,
  WifiOff,
  Battery,
  Share2,
  AlertTriangle,
  CheckCircle2,
  ShoppingBag,
  User,
  CreditCard,
  Home,
  Layers,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { classifyUrl, getNetworkErrorPersianCopy } from '../utils/navigationRules';

export const AndroidEmulator: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://amvajsarmad.com');
  const [urlInput, setUrlInput] = useState('https://amvajsarmad.com');
  const [isOnline, setIsOnline] = useState(true);
  const [activePage, setActivePage] = useState<'home' | 'products' | 'cart' | 'login' | 'payment'>('home');
  const [history, setHistory] = useState<string[]>(['https://amvajsarmad.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [sessionCookies, setSessionCookies] = useState({
    sessionid: 'sarmad_sess_89f0a21e4b',
    csrftoken: 'dj_csrf_9c82b1d34e908f',
    arvan_arcsco: '1e95725e0d2504bbd06ff820',
  });

  const [testUrlInput, setTestUrlInput] = useState('https://bpm.shaparak.ir/pay');
  const [lastRouteResult, setLastRouteResult] = useState(() => classifyUrl('https://bpm.shaparak.ir/pay'));

  const navigateTo = (url: string, pageKey?: 'home' | 'products' | 'cart' | 'login' | 'payment') => {
    const classification = classifyUrl(url);

    if (classification.targetAction === 'EXTERNAL_BROWSER') {
      window.open(url, '_blank');
      return;
    }

    if (classification.targetAction === 'NATIVE_INTENT') {
      alert(`در محیط واقعی اندروید، اینتنت بومی فراخوانی می‌شود: ${url}`);
      return;
    }

    const nextHistory = [...history.slice(0, historyIndex + 1), url];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setCurrentUrl(url);
    setUrlInput(url);

    if (pageKey) {
      setActivePage(pageKey);
    } else if (url.includes('/cart')) {
      setActivePage('cart');
    } else if (url.includes('/products')) {
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
      setUrlInput(prevUrl);
      if (prevUrl.includes('/cart')) setActivePage('cart');
      else if (prevUrl.includes('/products')) setActivePage('products');
      else if (prevUrl.includes('/login')) setActivePage('login');
      else if (prevUrl.includes('shaparak')) setActivePage('payment');
      else setActivePage('home');
    } else {
      alert('این دکمه در ابتدای تاریخچه است؛ فشردن بیشتر دکمه Back در اندروید باعث خروج از برنامه می‌شود.');
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
            <div className="h-7 bg-slate-900 text-slate-300 text-[11px] px-5 flex items-center justify-between font-mono z-20">
              <span className="font-semibold text-slate-200">14:35</span>
              {/* Notch camera */}
              <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
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
            <div className="bg-sky-900 border-b border-sky-800/60 p-2 z-10 text-white">
              <div className="flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleBack}
                    className="p-1 hover:bg-sky-800 rounded text-slate-200 transition-colors"
                    title="بازگشت (Back)"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="p-1 hover:bg-sky-800 rounded text-slate-200 transition-colors"
                    title="تازه‌سازی (Reload)"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* URL display */}
                <div className="flex-1 bg-sky-950/80 px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1.5 border border-sky-700/50 text-slate-200 truncate font-mono">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{currentUrl.replace('https://', '')}</span>
                </div>

                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                </div>
              </div>

              {/* Native Progress Bar */}
              {isRefreshing && (
                <div className="w-full h-0.5 bg-sky-950 mt-1 overflow-hidden">
                  <div className="h-full bg-cyan-400 animate-pulse w-3/4"></div>
                </div>
              )}
            </div>

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
                    className="bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-sky-500/20 transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{offlineError.canRetry ? 'تلاش مجدد' : 'بستن'}</span>
                  </button>
                  <p className="text-[10px] text-slate-500 mt-4">
                    این صفحه با کدهای Kotlin و BroadcastReceiver اختصاصی در زمان قطع شبکه به نمایش درمی‌آید.
                  </p>
                </div>
              ) : (
                /* Dynamic Simulated Page Views */
                <div className="h-full flex flex-col">
                  {/* Page: HOME */}
                  {activePage === 'home' && (
                    <div className="p-4 space-y-4">
                      {/* Hero Banner */}
                      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 rounded-2xl p-4 border border-sky-800/50 shadow-md">
                        <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold bg-sky-950/60 px-2 py-0.5 rounded">
                          امواج سرمد
                        </span>
                        <h2 className="text-base font-extrabold text-white mt-2">
                          پلتفرم تخصصی تجهیزات مخابراتی، الکترونیک و ابزار دقیق
                        </h2>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          سیستم فروش یکپارچه سرور-محور قدرت گرفته از Django 5.2
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => navigateTo('https://amvajsarmad.com/products', 'products')}
                            className="bg-sky-500 hover:bg-sky-400 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
                          >
                            مشاهده کاتالوگ
                          </button>
                          <button
                            onClick={() => navigateTo('https://amvajsarmad.com/cart', 'cart')}
                            className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium border border-slate-700"
                          >
                            سبد خرید ({cartCount})
                          </button>
                        </div>
                      </div>

                      {/* Featured Categories */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-2">
                          <span>دسته‌بندی‌های اصلی</span>
                          <span className="text-sky-400 text-[11px]">مشاهده همه</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div
                            onClick={() => navigateTo('https://amvajsarmad.com/products?cat=rf', 'products')}
                            className="p-2.5 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer"
                          >
                            <span className="text-sky-400 font-bold text-sm">📡</span>
                            <div className="font-semibold mt-1">تجهیزات RF و فرکانسی</div>
                            <div className="text-[10px] text-slate-400">آنتن و ماژول فرستنده</div>
                          </div>
                          <div
                            onClick={() => navigateTo('https://amvajsarmad.com/products?cat=cables', 'products')}
                            className="p-2.5 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer"
                          >
                            <span className="text-emerald-400 font-bold text-sm">🔌</span>
                            <div className="font-semibold mt-1">کابل و کانکتورها</div>
                            <div className="text-[10px] text-slate-400">کواکسیال و فیبر نوری</div>
                          </div>
                          <div
                            onClick={() => navigateTo('https://amvajsarmad.com/products?cat=power', 'products')}
                            className="p-2.5 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer"
                          >
                            <span className="text-amber-400 font-bold text-sm">⚡</span>
                            <div className="font-semibold mt-1">منابع تغذیه دقیق</div>
                            <div className="text-[10px] text-slate-400">تثبیت‌شده صنعتی</div>
                          </div>
                          <div
                            onClick={() => navigateTo('https://amvajsarmad.com/products?cat=measuring', 'products')}
                            className="p-2.5 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 cursor-pointer"
                          >
                            <span className="text-purple-400 font-bold text-sm">🔬</span>
                            <div className="font-semibold mt-1">ابزار سنجش و تست</div>
                            <div className="text-[10px] text-slate-400">اسیلوسکوپ و آنالایزر</div>
                          </div>
                        </div>
                      </div>

                      {/* Django Session Status Card */}
                      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            وضعیت نشست Django:
                          </span>
                          <span className="text-emerald-400 font-mono text-[10px]">فعال (Active)</span>
                        </div>
                        <div className="text-slate-400 font-mono text-[10px] truncate">
                          CSRF: {sessionCookies.csrftoken.slice(0, 14)}...
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page: PRODUCTS */}
                  {activePage === 'products' && (
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                        <span>فهرست محصولات امواج سرمد</span>
                        <span className="text-sky-400 text-[11px]">۴ مورد</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: 1, title: 'ماژول تقویت‌کننده فرکانس رادیویی LNA 2.4GHz', price: '۳,۲۵۰,۰۰۰ تومان', code: 'AS-LNA24' },
                          { id: 2, title: 'کابل کواکسیال ابزار دقیق فیدرتست RG-316', price: '۸۵۰,۰۰۰ تومان', code: 'AS-CBL316' },
                          { id: 3, title: 'منبع تغذیه متغیر سوئیچینگ ۳۰ ولت ۵ آمپر', price: '۶,۴۰۰,۰۰۰ تومان', code: 'AS-PWR305' },
                          { id: 4, title: 'آنتن کالیبره هلیکال باند UHF صنعتی', price: '۴,۱۰۰,۰۰۰ تومان', code: 'AS-ANT433' },
                        ].map((prod) => (
                          <div key={prod.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold text-white">{prod.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{prod.code}</div>
                              <div className="text-[11px] text-sky-400 font-bold mt-1">{prod.price}</div>
                            </div>
                            <button
                              onClick={() => {
                                setCartCount(c => c + 1);
                                navigateTo('https://amvajsarmad.com/cart', 'cart');
                              }}
                              className="text-[11px] bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1.5 rounded-lg shrink-0 font-medium"
                            >
                              افزودن به سبد
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
                        <span>سبد خرید شما</span>
                        <span className="text-sky-400 text-[11px]">{cartCount} آیتم</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-white">ماژول تقویت‌کننده LNA</div>
                            <div className="text-[10px] text-slate-400">تعداد: ۱ عدد</div>
                          </div>
                          <span className="text-sky-400 font-bold">۳,۲۵۰,۰۰۰ تومان</span>
                        </div>
                        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-white">کابل کواکسیال RG-316</div>
                            <div className="text-[10px] text-slate-400">تعداد: ۱ عدد</div>
                          </div>
                          <span className="text-sky-400 font-bold">۸۵۰,۰۰۰ تومان</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40 text-xs space-y-2">
                        <div className="flex justify-between text-slate-300">
                          <span>مبلغ کل سفارش:</span>
                          <span className="font-bold text-white">۴,۱۰۰,۰۰۰ تومان</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>حمل و نقل:</span>
                          <span className="text-emerald-400">رایگان</span>
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
                        درگاه پرداخت داخل وب‌ویو لود شده و پس از تکمیل، به امواج سرمد بازمی‌گردد.
                      </p>
                    </div>
                  )}

                  {/* Page: PAYMENT GATEWAY (Shaparak Simulation) */}
                  {activePage === 'payment' && (
                    <div className="p-4 space-y-4 bg-slate-950 h-full">
                      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                        <div className="text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 mb-1">
                          <CreditCard className="w-4 h-4" />
                          <span>درگاه پرداخت اینترنتی شاپرک (بانک ملت)</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-mono">
                          bpm.shaparak.ir
                        </p>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex justify-between text-slate-400">
                          <span>پذیرنده:</span>
                          <span className="text-slate-200 font-bold">فروشگاه امواج سرمد</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>مبلغ قابل پرداخت:</span>
                          <span className="text-emerald-400 font-bold">۴,۱۰۰,۰۰۰ تومان</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>شماره ترمینال:</span>
                          <span className="font-mono text-slate-200">92817462</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            alert('پرداخت موفق بود! بازگشت به وب‌سایت امواج سرمد.');
                            navigateTo('https://amvajsarmad.com/payment/verify/?status=OK&track_id=8923412', 'home');
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>شبیه‌سازی پرداخت موفق و بازگشت</span>
                        </button>

                        <button
                          onClick={() => {
                            alert('پرداخت لغو شد. بازگشت به سبد خرید.');
                            navigateTo('https://amvajsarmad.com/cart', 'cart');
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
                        <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-sky-500/20">
                          <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-white">ورود به حساب کاربری</h3>
                        <p className="text-[11px] text-slate-400">سامانه احراز هویت جنگو (Django Auth)</p>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1 text-[11px]">شماره موبایل یا ایمیل:</label>
                          <input
                            type="text"
                            defaultValue="09120000000"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1 text-[11px]">رمز عبور:</label>
                          <input
                            type="password"
                            defaultValue="••••••••"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <button
                          onClick={() => {
                            setIsLoggedIn(true);
                            alert('ورود با موفقیت انجام شد! کوکی sessionid در CookieManager ذخیره شد.');
                            navigateTo('https://amvajsarmad.com', 'home');
                          }}
                          className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-2"
                        >
                          ورود امن به سامانه
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
                onClick={() => navigateTo('https://amvajsarmad.com', 'home')}
                className="p-2 hover:text-white transition-colors"
                title="صفحه اصلی (Home)"
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400"></div>
              </button>
              <button
                onClick={() => alert('برنامه‌های فعال اندروید: امواج سرمد (کامیونیتی Tauri 2)')}
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
        {/* Quick Simulator Control Header */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-400" />
                <span>پنل آزمایش و شبیه‌سازی وب‌ویو اندروید</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تست سناریوهای واقعی: قطع شبکه، درگاه‌های شاپرک، حفظ سشن جنگو و اینتنت‌ها
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
                onClick={() => navigateTo('https://amvajsarmad.com', 'home')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'home'
                    ? 'bg-sky-500 text-white border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                صفحه اصلی
              </button>
              <button
                onClick={() => navigateTo('https://amvajsarmad.com/products', 'products')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'products'
                    ? 'bg-sky-500 text-white border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                کاتالوگ محصولات
              </button>
              <button
                onClick={() => navigateTo('https://amvajsarmad.com/cart', 'cart')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'cart'
                    ? 'bg-sky-500 text-white border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                سبد خرید ({cartCount})
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
                onClick={() => navigateTo('https://amvajsarmad.com/account/login', 'login')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activePage === 'login'
                    ? 'bg-sky-500 text-white border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                ورود سشن جنگو
              </button>
            </div>
          </div>
        </div>

        {/* Real-time URL Routing & Security Classifier */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span>موتور هوشمند ناوبری و فیلتر آدرس‌ها (Navigation Engine)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">MainActivity.kt / Rust</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            بر اساس نیازمندی‌ها، آدرس‌های داخلی در اپ باز می‌مانند، درگاه‌های شاپرک در همان سشن اجرا می‌شوند و سایت‌های خارجی به مرورگر هدایت می‌شوند:
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                value={testUrlInput}
                onChange={(e) => handleTestUrlCheck(e.target.value)}
                placeholder="آدرس اینترنتی را وارد کنید..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Classification Card */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">طبقه‌بندی مسیر:</div>
                <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-sky-400">{lastRouteResult.type}</span>
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
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'https://amvajsarmad.com/products',
                'https://bpm.shaparak.ir/pay',
                'https://amvajsarmad.com/payment/verify/?status=OK',
                'tel:02188888888',
                'https://instagram.com/amvajsarmad',
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

        {/* Django Cookies & Session Inspector */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>پایش دائمی کوکی‌های Django و شبکه توزیع ابرآروان</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              CookieManager.flush()
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            در این اپلیکیشن کوکی‌های احراز هویت جنگو و محافظتی ابرآروان پس از بستن و باز کردن مجدد برنامه کاملاً پایدار باقی می‌مانند:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-sky-400 text-[10px] block">sessionid</span>
              <span className="text-slate-200 truncate block mt-0.5">{sessionCookies.sessionid}</span>
              <span className="text-[9px] text-emerald-400">HttpOnly, Secure</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-sky-400 text-[10px] block">csrftoken</span>
              <span className="text-slate-200 truncate block mt-0.5">{sessionCookies.csrftoken}</span>
              <span className="text-[9px] text-emerald-400">SameSite=Lax</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-sky-400 text-[10px] block">__arcsco (Arvan)</span>
              <span className="text-slate-200 truncate block mt-0.5">{sessionCookies.arvan_arcsco}</span>
              <span className="text-[9px] text-emerald-400">CDN Challenge OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
