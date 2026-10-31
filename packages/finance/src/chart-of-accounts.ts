/**
 * Chart of Accounts (COA) canonical coding for Commerce OS.
 * Synthesized from itrip-platform & commerce-os ledger definitions.
 */

export type AccountCategory = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

export interface AccountDefinition {
  code: string;
  nameFa: string;
  nameEn: string;
  category: AccountCategory;
}

export const CHART_OF_ACCOUNTS: Record<string, AccountDefinition> = {
  // 1000 - Assets (دارایی‌ها)
  "1010": { code: "1010", nameFa: "موجودی نزد درگاه‌های پرداخت شتاب", nameEn: "Gateway Cash & Settlements", category: "ASSET" },
  "1020": { code: "1020", nameFa: "حساب‌های بانکی فروشگاه (کارت‌به‌کارت)", nameEn: "Merchant Bank Accounts", category: "ASSET" },
  "1030": { code: "1030", nameFa: "حساب‌های دریافتنی مشتریان B2B", nameEn: "Accounts Receivable B2B", category: "ASSET" },
  "1040": { code: "1040", nameFa: "موجودی انبار کالا", nameEn: "Merchandise Inventory", category: "ASSET" },

  // 2000 - Liabilities (بدهی‌ها)
  "2010": { code: "2010", nameFa: "بدهی کیف پول مشتریان (امانت)", nameEn: "Customer Wallet Liability", category: "LIABILITY" },
  "2020": { code: "2020", nameFa: "بستانکاران تجاری و تامین‌کنندگان", nameEn: "Supplier Payables", category: "LIABILITY" },
  "2030": { code: "2030", nameFa: "مالیات بر ارزش افزوده پرداختنی (VAT)", nameEn: "VAT Payable", category: "LIABILITY" },
  "2040": { code: "2040", nameFa: "پیش‌دریافت‌های سفارشات در جریان", nameEn: "Unearned Revenue / Order Escrow", category: "LIABILITY" },

  // 4000 - Revenue (درآمدها)
  "4010": { code: "4010", nameFa: "درآمد حاصل از فروش کالا", nameEn: "Sales Revenue", category: "REVENUE" },
  "4020": { code: "4020", nameFa: "درآمد حاصل از هزینه ارسال و لجستیک", nameEn: "Shipping & Delivery Revenue", category: "REVENUE" },
  "4030": { code: "4030", nameFa: "تخفیفات و تعدیلات فروش (کاهنده درآمد)", nameEn: "Sales Discounts & Allowances", category: "REVENUE" },

  // 5000 - Expenses (هزینه‌ها)
  "5010": { code: "5010", nameFa: "بهای تمام‌شده کالای فروش‌رفته (COGS)", nameEn: "Cost of Goods Sold", category: "EXPENSE" },
  "5020": { code: "5020", nameFa: "هزینه‌های کارمزد درگاه‌های پرداخت", nameEn: "Payment Processing Fees", category: "EXPENSE" },
  "5030": { code: "5030", nameFa: "هزینه‌های پرداخت‌شده به شرکت‌های حمل‌ونقل", nameEn: "Carrier Shipping Expenses", category: "EXPENSE" },
};
