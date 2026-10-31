/**
 * Zero-dependency native Jalali & Persian calendar utilities.
 * Leverages Node/Browser native Intl.DateTimeFormat with 'fa-IR-u-ca-persian'.
 */

const JALALI_FULL_FMT = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const JALALI_DATE_ONLY_FMT = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatJalaliDateTime(date: Date | string | number): string {
  const d = typeof date === "object" ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  return JALALI_FULL_FMT.format(d);
}

export function formatJalaliDate(date: Date | string | number): string {
  const d = typeof date === "object" ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  return JALALI_DATE_ONLY_FMT.format(d);
}
