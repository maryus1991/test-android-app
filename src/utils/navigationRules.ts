/**
 * Navigation and URL routing rules for Sorna Educational Group Android WebView (Tauri 2)
 * Ensures strict security:
 * 1. Internal sornac.ir domains remain inside the app
 * 2. Iranian payment gateways (Shaparak, Zarinpal, etc.) are allowed for course/order checkout
 * 3. Payment returns back to sornac.ir seamlessly restore the user's session
 * 4. Special schemes (tel, mailto, sms, whatsapp, tg) launch native Android intents
 * 5. Other external links open in system browser (Chrome/Firefox)
 */

export type UrlClassification =
  | 'INTERNAL'
  | 'PAYMENT_GATEWAY'
  | 'PAYMENT_RETURN'
  | 'NATIVE_SCHEME'
  | 'EXTERNAL'
  | 'BLOCKED';

export const PRIMARY_DOMAIN = 'sornac.ir';

// Official Iranian banking & payment gateways
export const PAYMENT_GATEWAY_PATTERNS = [
  /\.shaparak\.ir($|\/)/i,
  /bpm\.shaparak\.ir/i,
  /sep\.shaparak\.ir/i,
  /pec\.shaparak\.ir/i,
  /pep\.shaparak\.ir/i,
  /sadadpsp\.ir/i,
  /asanpardakht\.ir/i,
  /zarinpal\.com/i,
  /idpay\.ir/i,
  /pay\.ir/i,
  /jibit\.ir/i,
  /nextpay\.org/i,
  /vandar\.io/i,
];

// Special URI schemes handled natively on Android
export const NATIVE_SCHEMES = [
  'tel:',
  'mailto:',
  'sms:',
  'geo:',
  'whatsapp:',
  'tg:',
  'intent:',
];

export function isInternalUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase();
    return hostname === PRIMARY_DOMAIN || hostname.endsWith(`.${PRIMARY_DOMAIN}`);
  } catch {
    return false;
  }
}

export function isPaymentGatewayUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase();
    return PAYMENT_GATEWAY_PATTERNS.some((pattern) => pattern.test(host));
  } catch {
    return false;
  }
}

export function isPaymentReturnUrl(urlString: string): boolean {
  try {
    if (!isInternalUrl(urlString)) return false;
    const parsed = new URL(urlString);
    const path = parsed.pathname.toLowerCase();
    const hasPaymentParam =
      parsed.searchParams.has('track_id') ||
      parsed.searchParams.has('ref_id') ||
      parsed.searchParams.has('Authority') ||
      parsed.searchParams.has('status') ||
      parsed.searchParams.has('order_id');

    return (
      path.includes('/payment') ||
      path.includes('/checkout') ||
      path.includes('/verify') ||
      path.includes('/callback') ||
      hasPaymentParam
    );
  } catch {
    return false;
  }
}

export function classifyUrl(urlString: string): {
  type: UrlClassification;
  reason: string;
  targetAction: 'WEBVIEW_LOAD' | 'EXTERNAL_BROWSER' | 'NATIVE_INTENT' | 'BLOCK';
} {
  if (!urlString || typeof urlString !== 'string') {
    return {
      type: 'BLOCKED',
      reason: 'آدرس نامعتبر یا خالی است',
      targetAction: 'BLOCK',
    };
  }

  const trimmed = urlString.trim();

  // Check special schemes
  for (const scheme of NATIVE_SCHEMES) {
    if (trimmed.toLowerCase().startsWith(scheme)) {
      return {
        type: 'NATIVE_SCHEME',
        reason: `پروتکل بومی سیستم (${scheme.replace(':', '')})`,
        targetAction: 'NATIVE_INTENT',
      };
    }
  }

  // Security: Block non-http/https unless specified
  if (!/^https?:\/\//i.test(trimmed)) {
    return {
      type: 'BLOCKED',
      reason: 'پروتکل ناامن یا ناشناخته',
      targetAction: 'BLOCK',
    };
  }

  // In production Android, HTTP is upgraded to HTTPS for sornac.ir to protect sessions
  if (trimmed.startsWith('http://sornac.ir')) {
    return {
      type: 'INTERNAL',
      reason: 'ارتقای خودکار به HTTPS برای حفظ امنیت نشست کاربر',
      targetAction: 'WEBVIEW_LOAD',
    };
  }

  if (isPaymentReturnUrl(trimmed)) {
    return {
      type: 'PAYMENT_RETURN',
      reason: 'بازگشت از درگاه پرداخت به سامانه گروه آموزشی سورنا',
      targetAction: 'WEBVIEW_LOAD',
    };
  }

  if (isInternalUrl(trimmed)) {
    return {
      type: 'INTERNAL',
      reason: 'صفحه داخلی وب‌سایت گروه آموزشی سورنا (sornac.ir)',
      targetAction: 'WEBVIEW_LOAD',
    };
  }

  if (isPaymentGatewayUrl(trimmed)) {
    return {
      type: 'PAYMENT_GATEWAY',
      reason: 'درگاه پرداخت شاپرک / بانکی معتبر',
      targetAction: 'WEBVIEW_LOAD',
    };
  }

  return {
    type: 'EXTERNAL',
    reason: 'پیوند به وب‌سایت خارجی',
    targetAction: 'EXTERNAL_BROWSER',
  };
}

export interface NetworkErrorInfo {
  title: string;
  description: string;
  advice: string;
  canRetry: boolean;
}

export function getNetworkErrorPersianCopy(errorCode: number | string): NetworkErrorInfo {
  const code = typeof errorCode === 'string' ? parseInt(errorCode, 10) : errorCode;

  switch (code) {
    case -2: // ERROR_HOST_LOOKUP
      return {
        title: 'عدم دسترسی به اینترنت',
        description: 'اتصال به سرورهای گروه آموزشی سورنا برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.',
        advice: 'بررسی کنید داده همراه (موبایل دیتا) یا وای‌فای روشن باشد.',
        canRetry: true,
      };
    case -6: // ERROR_CONNECT
      return {
        title: 'خطا در برقراری ارتباط با سرور',
        description: 'سرور در دسترس نیست یا اتصال قطع شده است.',
        advice: 'چند لحظه دیگر مجدداً تلاش کنید.',
        canRetry: true,
      };
    case -8: // ERROR_TIMEOUT
      return {
        title: 'زمان اتصال به پایان رسید (Timeout)',
        description: 'سرعت اینترنت شما برای بارگذاری اطلاعات سامانه سورنا پایین است.',
        advice: 'لطفاً وضعیت شبکه را بررسی کرده و مجدداً تلاش فرمایید.',
        canRetry: true,
      };
    case -11: // ERROR_FAILED_SSL_HANDSHAKE
      return {
        title: 'خطای گواهی امنیتی (SSL)',
        description: 'امکان برقراری ارتباط امن با درگاه یا سرور مقدور نیست.',
        advice: 'لطفاً ساعت و تاریخ گوشی خود را به‌روزرسانی کنید.',
        canRetry: true,
      };
    default:
      return {
        title: 'خطا در بارگذاری صفحه',
        description: 'امکان دریافت محتوای گروه آموزشی سورنا در این لحظه وجود ندارد.',
        advice: 'روی دکمه تلاش مجدد ضربه بزنید.',
        canRetry: true,
      };
  }
}
