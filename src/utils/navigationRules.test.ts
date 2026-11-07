import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyUrl,
  isInternalUrl,
  isPaymentGatewayUrl,
  isPaymentReturnUrl,
  getNetworkErrorPersianCopy,
} from './navigationRules';

test('isInternalUrl identifies amvajsarmad.com and its subdomains correctly', () => {
  assert.equal(isInternalUrl('https://amvajsarmad.com'), true);
  assert.equal(isInternalUrl('https://amvajsarmad.com/products/cables'), true);
  assert.equal(isInternalUrl('https://panel.amvajsarmad.com/dashboard'), true);
  assert.equal(isInternalUrl('https://google.com'), false);
  assert.equal(isInternalUrl('https://evil-amvajsarmad.com'), false);
});

test('isPaymentGatewayUrl catches official Iranian payment gateways', () => {
  assert.equal(isPaymentGatewayUrl('https://bpm.shaparak.ir/pgwchannel/startpay.mellat'), true);
  assert.equal(isPaymentGatewayUrl('https://sep.shaparak.ir/OnlinePayment'), true);
  assert.equal(isPaymentGatewayUrl('https://www.zarinpal.com/pg/StartPay/000000'), true);
  assert.equal(isPaymentGatewayUrl('https://sadadpsp.ir/Payment'), true);
  assert.equal(isPaymentGatewayUrl('https://amvajsarmad.com/checkout'), false);
});

test('isPaymentReturnUrl correctly flags return callbacks', () => {
  assert.equal(
    isPaymentReturnUrl('https://amvajsarmad.com/payment/verify/?status=OK&track_id=12345'),
    true
  );
  assert.equal(
    isPaymentReturnUrl('https://amvajsarmad.com/checkout/callback?Authority=A000000'),
    true
  );
  assert.equal(isPaymentReturnUrl('https://amvajsarmad.com/about-us/'), false);
});

test('classifyUrl routes URLs to correct WebView actions', () => {
  const internal = classifyUrl('https://amvajsarmad.com/cart/');
  assert.equal(internal.type, 'INTERNAL');
  assert.equal(internal.targetAction, 'WEBVIEW_LOAD');

  const payment = classifyUrl('https://bpm.shaparak.ir/online');
  assert.equal(payment.type, 'PAYMENT_GATEWAY');
  assert.equal(payment.targetAction, 'WEBVIEW_LOAD');

  const ext = classifyUrl('https://instagram.com/amvajsarmad');
  assert.equal(ext.type, 'EXTERNAL');
  assert.equal(ext.targetAction, 'EXTERNAL_BROWSER');

  const tel = classifyUrl('tel:02188888888');
  assert.equal(tel.type, 'NATIVE_SCHEME');
  assert.equal(tel.targetAction, 'NATIVE_INTENT');
});

test('getNetworkErrorPersianCopy returns localized Persian messages', () => {
  const lookupErr = getNetworkErrorPersianCopy(-2);
  assert.match(lookupErr.title, /اینترنت/);
  assert.equal(lookupErr.canRetry, true);

  const timeoutErr = getNetworkErrorPersianCopy(-8);
  assert.match(timeoutErr.title, /Timeout|پایان/);
});
