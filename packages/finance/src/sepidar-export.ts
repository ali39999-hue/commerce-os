import { Money } from "@commerce-os/domain";

export interface AccountingExportRow {
  entryNumber: string;
  jalaliDate: string;
  isoDate: string;
  fiscalPeriod: string;
  accountCode: string;
  accountName: string;
  entryDescription: string;
  lineDescription: string;
  debit: Money | string | number | bigint;
  credit: Money | string | number | bigint;
  currency: string;
  referenceType?: string;
  referenceId?: string;
  status?: string;
}

export const IRANIAN_ACCOUNTING_HEADERS = [
  "شماره سند",
  "تاریخ (شمسی)",
  "تاریخ (میلادی)",
  "دوره مالی",
  "کد حساب معین",
  "نام حساب معین",
  "شرح سند",
  "شرح ردیف",
  "بدهکار (ریال)",
  "بستانکار (ریال)",
  "واحد پول",
  "نوع منبع",
  "مرجع تراکنش",
  "وضعیت",
];

/**
 * Escapes CSV values against formula injection (RFC 4180 / OWASP CSV Injection):
 * Cells starting with '=', '+', '-', '@' or tab are prefixed with an apostrophe.
 */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value).trim();

  // Guard against spreadsheet formula injection
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape double quotes
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Converts a Gregorian Date into a standardized Jalali date string (YYYY/MM/DD)
 * for Iranian accounting software import (Sepidar, Holoo, Mahak).
 */
export function formatAccountingJalaliDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")?.value || "";
  const m = parts.find((p) => p.type === "month")?.value || "";
  const d = parts.find((p) => p.type === "day")?.value || "";

  return `${y}/${m}/${d}`;
}

/**
 * Derives the 4-digit Jalali fiscal period (e.g. "1405").
 */
export function getFiscalYear(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
  }).formatToParts(date);
  return parts.find((p) => p.type === "year")?.value || String(date.getFullYear());
}

/**
 * Builds a UTF-8 with BOM CSV document.
 * The leading BOM (\uFEFF) guarantees that Microsoft Excel and Sepidar natively display Persian
 * typography without requiring manual encoding selection.
 */
export function buildSepidarCsv(rows: AccountingExportRow[]): string {
  const BOM = "\uFEFF";
  const headerLine = IRANIAN_ACCOUNTING_HEADERS.map(escapeCsvCell).join(",");

  const dataLines = rows.map((r) => {
    let debitStr = "0";
    if (r.debit instanceof Money) {
      debitStr = r.debit.amount.toString();
    } else if (typeof r.debit === "bigint") {
      debitStr = r.debit.toString();
    } else {
      debitStr = String(r.debit || 0);
    }

    let creditStr = "0";
    if (r.credit instanceof Money) {
      creditStr = r.credit.amount.toString();
    } else if (typeof r.credit === "bigint") {
      creditStr = r.credit.toString();
    } else {
      creditStr = String(r.credit || 0);
    }

    return [
      escapeCsvCell(r.entryNumber),
      escapeCsvCell(r.jalaliDate),
      escapeCsvCell(r.isoDate),
      escapeCsvCell(r.fiscalPeriod),
      escapeCsvCell(r.accountCode),
      escapeCsvCell(r.accountName),
      escapeCsvCell(r.entryDescription),
      escapeCsvCell(r.lineDescription),
      escapeCsvCell(debitStr),
      escapeCsvCell(creditStr),
      escapeCsvCell(r.currency),
      escapeCsvCell(r.referenceType || ""),
      escapeCsvCell(r.referenceId || ""),
      escapeCsvCell(r.status || "POSTED"),
    ].join(",");
  });

  return `${BOM}${headerLine}\r\n${dataLines.join("\r\n")}`;
}
