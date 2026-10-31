import { Money } from "@commerce-os/domain";
import { formatJalaliDate } from "@commerce-os/localization";

export interface TaxPartyInfo {
  name: string;
  nationalId: string;
  economicCode?: string;
  postalCode: string;
  phone: string;
  province: string;
  city: string;
  address: string;
}

export interface TaxInvoiceLine {
  rowNumber: number;
  itemCode: string;
  itemTitle: string;
  quantity: number;
  unitPriceRials: bigint;
  totalPriceRials: bigint;
  discountRials: bigint;
  netPriceRials: bigint;
  vatRateBps: number;
  vatAmountRials: bigint;
  finalTotalRials: bigint;
}

export interface OfficialTaxInvoice {
  invoiceNumber: string;
  invoiceDateJalali: string;
  seller: TaxPartyInfo;
  buyer: TaxPartyInfo;
  lines: TaxInvoiceLine[];
  subtotalRials: bigint;
  discountTotalRials: bigint;
  taxableTotalRials: bigint;
  vatTotalRials: bigint;
  shippingTotalRials: bigint;
  grandTotalRials: bigint;
  grandTotalTomansInWords: string;
  paymentMethodFa: string;
  transactionRef: string;
  ledgerJournalRef: string;
}

const ONES = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const TEENS = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
const TENS = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const HUNDREDS = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
const THOUSANDS = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

export function numberToPersianWords(num: number | bigint): string {
  let n = typeof num === "bigint" ? num : BigInt(num);
  if (n === 0n) return "صفر";
  if (n < 0n) return `منفی ${numberToPersianWords(-n)}`;

  const chunks: number[] = [];
  while (n > 0n) {
    chunks.push(Number(n % 1000n));
    n = n / 1000n;
  }

  const parts: string[] = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];
    if (chunk === 0) continue;

    const chunkWords = chunkToPersianWords(chunk);
    const unit = THOUSANDS[i];
    parts.push(unit ? `${chunkWords} ${unit}` : chunkWords);
  }

  return parts.join(" و ");
}

function chunkToPersianWords(n: number): string {
  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const rem = n % 100;

  if (h > 0) parts.push(HUNDREDS[h]);

  if (rem >= 10 && rem < 20) {
    parts.push(TEENS[rem - 10]);
  } else {
    const t = Math.floor(rem / 10);
    const o = rem % 10;
    if (t > 0) parts.push(TENS[t]);
    if (o > 0) parts.push(ONES[o]);
  }

  return parts.join(" و ");
}

export const DEFAULT_SELLER_INFO: TaxPartyInfo = {
  name: "شرکت توسعه فناوری تجارت الکترونیک کامرس او اس (سهامی خاص)",
  nationalId: "14012345678",
  economicCode: "411589632145",
  postalCode: "1458963214",
  phone: "02188888888",
  province: "تهران",
  city: "تهران",
  address: "خیابان آزادی، تقاطع حبیب‌الهی، پلاک ۱۲، برج فناوری، طبقه ۴",
};

export function generateOfficialTaxInvoiceHtml(invoice: OfficialTaxInvoice): string {
  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>صورتحساب الکترونیکی فروش کالا و خدمات - ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Tahoma, Vazirmatn, Arial, sans-serif; font-size: 11px; margin: 20px; color: #111; line-height: 1.5; }
    .tax-sheet { border: 2px solid #222; padding: 16px; border-radius: 8px; max-width: 900px; margin: 0 auto; }
    .tax-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 12px; }
    .tax-title { text-align: center; font-size: 15px; font-weight: bold; }
    .tax-party-box { border: 1px solid #444; border-radius: 6px; padding: 10px; margin-bottom: 10px; }
    .tax-party-title { font-weight: bold; background: #eee; padding: 4px 8px; margin: -10px -10px 8px -10px; border-radius: 5px 5px 0 0; }
    .party-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #444; padding: 6px 8px; text-align: center; }
    th { background: #f0f0f0; font-weight: bold; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .tax-summary-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-top: 14px; }
    .words-box { border: 1px solid #666; border-radius: 6px; padding: 10px; }
    .totals-box table { margin: 0; }
    .totals-box td { padding: 4px 8px; }
    .tax-footer { display: flex; justify-content: space-between; margin-top: 30px; padding: 0 40px; }
    .sign-box { text-align: center; height: 70px; }
    @media print { body { margin: 0; } .tax-sheet { border: 1px solid #000; } }
  </style>
</head>
<body>
  <div class="tax-sheet">
    <div class="tax-header">
      <div>آرم شرکت / فروشگاه</div>
      <div class="tax-title">
        صورتحساب فروش کالا و خدمات (ماده ۱۹ قانون مالیات بر ارزش افزوده)
        <div style="font-size: 11px; font-weight: normal; margin-top: 4px;">سیستم‌عامل تجارت Commerce OS</div>
      </div>
      <div>
        <div>شماره سریال: <strong>${invoice.invoiceNumber}</strong></div>
        <div>تاریخ صدور: <strong>${invoice.invoiceDateJalali}</strong></div>
        <div>سند دفترکل: <strong dir="ltr">${invoice.ledgerJournalRef}</strong></div>
      </div>
    </div>

    <div class="tax-party-box">
      <div class="tax-party-title">مشخصات فروشنده</div>
      <div class="party-grid">
        <div>نام شخص حقوقی: <strong>${invoice.seller.name}</strong></div>
        <div>شناسه ملی: <strong dir="ltr">${invoice.seller.nationalId}</strong></div>
        <div>کد اقتصادی: <strong dir="ltr">${invoice.seller.economicCode || "-"}</strong></div>
        <div>استان / شهر: ${invoice.seller.province} - ${invoice.seller.city}</div>
        <div>کد پستی: <span dir="ltr">${invoice.seller.postalCode}</span></div>
        <div>شماره تلفن: <span dir="ltr">${invoice.seller.phone}</span></div>
        <div style="grid-column: span 3;">نشانی کامل: ${invoice.seller.address}</div>
      </div>
    </div>

    <div class="tax-party-box">
      <div class="tax-party-title">مشخصات خریدار</div>
      <div class="party-grid">
        <div>نام خریدار: <strong>${invoice.buyer.name}</strong></div>
        <div>کد ملی: <strong dir="ltr">${invoice.buyer.nationalId}</strong></div>
        <div>شماره تماس: <span dir="ltr">${invoice.buyer.phone}</span></div>
        <div>استان / شهر: ${invoice.buyer.province} - ${invoice.buyer.city}</div>
        <div>کد پستی: <span dir="ltr">${invoice.buyer.postalCode}</span></div>
        <div>روش پرداخت: ${invoice.paymentMethodFa} (پیگیری: <span dir="ltr">${invoice.transactionRef}</span>)</div>
        <div style="grid-column: span 3;">نشانی تحویل: ${invoice.buyer.address}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>ردیف</th>
          <th>کد کالا</th>
          <th>شرح کالا یا خدمت</th>
          <th>تعداد</th>
          <th>مبلغ واحد (ریال)</th>
          <th>مبلغ کل (ریال)</th>
          <th>تخفیف (ریال)</th>
          <th>مبلغ پس از تخفیف (ریال)</th>
          <th>نرخ مالیات</th>
          <th>مالیات بر ارزش افزوده (ریال)</th>
          <th>مبلغ نهایی (ریال)</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.lines
          .map(
            (l) => `
          <tr>
            <td>${l.rowNumber}</td>
            <td dir="ltr">${l.itemCode}</td>
            <td class="text-right">${l.itemTitle}</td>
            <td>${l.quantity}</td>
            <td>${new Intl.NumberFormat("fa-IR").format(l.unitPriceRials)}</td>
            <td>${new Intl.NumberFormat("fa-IR").format(l.totalPriceRials)}</td>
            <td>${new Intl.NumberFormat("fa-IR").format(l.discountRials)}</td>
            <td>${new Intl.NumberFormat("fa-IR").format(l.netPriceRials)}</td>
            <td>۱۰٪</td>
            <td>${new Intl.NumberFormat("fa-IR").format(l.vatAmountRials)}</td>
            <td style="font-weight: bold;">${new Intl.NumberFormat("fa-IR").format(l.finalTotalRials)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="tax-summary-grid">
      <div class="words-box">
        <div><strong>مبلغ قابل پرداخت به حروف (تومان):</strong></div>
        <div style="font-size: 13px; font-weight: bold; margin-top: 8px; color: #0b6e66;">
          ${invoice.grandTotalTomansInWords} تومان تمام
        </div>
        <div style="margin-top: 14px; font-size: 10px; color: #555;">
          * این صورتحساب معتبر بوده و ثبت‌های آن با سند دوبل‌اندر شماره ${invoice.ledgerJournalRef} در سیستم مالی تطبیق یافته است.
        </div>
      </div>

      <div class="totals-box">
        <table>
          <tr>
            <td>جمع ناخالص کالاها:</td>
            <td class="text-left">${new Intl.NumberFormat("fa-IR").format(invoice.subtotalRials)} ریال</td>
          </tr>
          <tr>
            <td>تخفیفات کل:</td>
            <td class="text-left">${new Intl.NumberFormat("fa-IR").format(invoice.discountTotalRials)} ریال</td>
          </tr>
          <tr>
            <td>مأخذ مشمول مالیات:</td>
            <td class="text-left">${new Intl.NumberFormat("fa-IR").format(invoice.taxableTotalRials)} ریال</td>
          </tr>
          <tr>
            <td>مالیات ارزش افزوده (۱۰٪):</td>
            <td class="text-left">${new Intl.NumberFormat("fa-IR").format(invoice.vatTotalRials)} ریال</td>
          </tr>
          <tr>
            <td>هزینه ارسال و بسته‌بندی:</td>
            <td class="text-left">${new Intl.NumberFormat("fa-IR").format(invoice.shippingTotalRials)} ریال</td>
          </tr>
          <tr style="font-weight: bold; background: #e6f3f1;">
            <td>مبلغ کل صورتحساب:</td>
            <td class="text-left">${new Intl.NumberFormat("fa-IR").format(invoice.grandTotalRials)} ریال</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="tax-footer">
      <div class="sign-box">
        مهر و امضای فروشنده
      </div>
      <div class="sign-box">
        امضا و تحویل گیرنده
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
