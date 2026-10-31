import { describe, it, expect } from "vitest";
import { Money } from "@commerce-os/domain";
import {
  buildSepidarCsv,
  escapeCsvCell,
  formatAccountingJalaliDate,
  getFiscalYear,
} from "../src/index.js";

describe("Sepidar & Iranian Accounting CSV Export", () => {
  it("escapes formula injection cells starting with =, +, -, @, or tab", () => {
    expect(escapeCsvCell("=SUM(A1:A10)")).toBe("\"'=SUM(A1:A10)\"");
    expect(escapeCsvCell("+1000")).toBe("\"'+1000\"");
    expect(escapeCsvCell("-250")).toBe("\"'-250\"");
    expect(escapeCsvCell("@secret")).toBe("\"'@secret\"");
    expect(escapeCsvCell('Hello "World"')).toBe('"Hello ""World"""');
  });

  it("formats dates in standard accounting Jalali (YYYY/MM/DD) and fiscal year", () => {
    const d = new Date("2026-10-29T12:00:00Z");
    const jDate = formatAccountingJalaliDate(d);
    expect(jDate).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
    const fiscalYear = getFiscalYear(d);
    expect(fiscalYear).toBe("1405");
  });

  it("builds CSV with UTF-8 BOM (\\uFEFF) and correct Persian headers", () => {
    const rows = [
      {
        entryNumber: "JRN-SALE-1001",
        jalaliDate: "1405/08/07",
        isoDate: "2026-10-29T12:00:00Z",
        fiscalPeriod: "1405",
        accountCode: "1010",
        accountName: "موجودی نزد درگاه‌های پرداخت شتاب",
        entryDescription: "دریافت وجه سفارش 1001",
        lineDescription: "واریز از طریق زرین‌پال",
        debit: Money.fromRials(10_000_000n),
        credit: Money.zero(),
        currency: "IRR",
        referenceType: "ORDER",
        referenceId: "1001",
      },
      {
        entryNumber: "JRN-SALE-1001",
        jalaliDate: "1405/08/07",
        isoDate: "2026-10-29T12:00:00Z",
        fiscalPeriod: "1405",
        accountCode: "4010",
        accountName: "درآمد حاصل از فروش کالا",
        entryDescription: "دریافت وجه سفارش 1001",
        lineDescription: "فروش قهوه تخصصی",
        debit: Money.zero(),
        credit: Money.fromRials(10_000_000n),
        currency: "IRR",
        referenceType: "ORDER",
        referenceId: "1001",
      },
    ];

    const csv = buildSepidarCsv(rows);
    // Starts with BOM
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("شماره سند");
    expect(csv).toContain("بدهکار (ریال)");
    expect(csv).toContain("JRN-SALE-1001");
    expect(csv).toContain("10000000");
  });
});
