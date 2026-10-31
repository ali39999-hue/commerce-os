import { describe, it, expect } from "vitest";
import {
  numberToPersianWords,
  generateOfficialTaxInvoiceHtml,
  DEFAULT_SELLER_INFO,
} from "../src/index.js";

describe("Official Tax Invoice & Persian Number to Words", () => {
  it("converts numbers to Persian words accurately", () => {
    expect(numberToPersianWords(0)).toBe("صفر");
    expect(numberToPersianWords(5)).toBe("پنج");
    expect(numberToPersianWords(17)).toBe("هفده");
    expect(numberToPersianWords(25)).toBe("بیست و پنج");
    expect(numberToPersianWords(340)).toBe("سیصد و چهل");
    expect(numberToPersianWords(1000)).toBe("یک هزار");
    expect(numberToPersianWords(1500000)).toBe("یک میلیون و پانصد هزار");
    expect(numberToPersianWords(36450000)).toBe("سی و شش میلیون و چهارصد و پنجاه هزار");
  });

  it("generates complete official VAT invoice HTML", () => {
    const html = generateOfficialTaxInvoiceHtml({
      invoiceNumber: "INV-1405-0012",
      invoiceDateJalali: "1405/08/07",
      seller: DEFAULT_SELLER_INFO,
      buyer: {
        name: "علی علوی",
        nationalId: "0010312013",
        postalCode: "1458963214",
        phone: "09121234567",
        province: "تهران",
        city: "تهران",
        address: "خیابان آزادی، پلاک ۱۲",
      },
      lines: [
        {
          rowNumber: 1,
          itemCode: "COF-ETH-250",
          itemTitle: "قهوه تخصصی اتیوپی ۲۵۰ گرم",
          quantity: 2,
          unitPriceRials: 45000000n,
          totalPriceRials: 90000000n,
          discountRials: 0n,
          netPriceRials: 90000000n,
          vatRateBps: 1000,
          vatAmountRials: 9000000n,
          finalTotalRials: 99000000n,
        },
      ],
      subtotalRials: 90000000n,
      discountTotalRials: 0n,
      taxableTotalRials: 90000000n,
      vatTotalRials: 9000000n,
      shippingTotalRials: 1500000n,
      grandTotalRials: 100500000n,
      grandTotalTomansInWords: numberToPersianWords(10050000), // 10,050,000 Tomans
      paymentMethodFa: "درگاه پرداخت شاپرک",
      transactionRef: "SHP-98765432",
      ledgerJournalRef: "JRN-SALE-ORD-1001",
    });

    expect(html).toContain("صورتحساب فروش کالا و خدمات");
    expect(html).toContain("INV-1405-0012");
    expect(html).toContain("علی علوی");
    expect(html).toContain("ده میلیون و پنجاه هزار");
    expect(html).toContain("JRN-SALE-ORD-1001");
  });
});
