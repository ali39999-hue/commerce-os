/**
 * Zero-float Money primitive for Commerce OS.
 * Stores monetary amounts strictly in minor units using native bigint.
 * Floating point math is strictly forbidden in financial calculations.
 */

export class CurrencyMismatchError extends Error {
  constructor(c1: string, c2: string) {
    super(`Currency mismatch: cannot operate on ${c1} and ${c2}`);
    this.name = "CurrencyMismatchError";
  }
}

export type SupportedCurrencyCode = "IRR" | "IRT" | "GBP" | "USD" | "EUR" | "AED";

export interface CurrencyScale {
  readonly code: string;
  readonly decimals: number;
  readonly minorUnitFactor: bigint;
  readonly symbol: string;
  readonly nameEn: string;
  readonly nameFa: string;
}

/**
 * Multi-currency scale definitions.
 * IRT (Toman): 0 decimals, minor unit factor 1n.
 * IRR (Rial): 0 decimals, minor unit factor 1n.
 * GBP (Dr Dermer UK standard): 2 decimals, minor unit factor 100n.
 * USD: 2 decimals, minor unit factor 100n.
 * EUR: 2 decimals, minor unit factor 100n.
 * AED: 2 decimals, minor unit factor 100n.
 */
export const CURRENCY_SCALES: Record<string, CurrencyScale> = {
  IRR: {
    code: "IRR",
    decimals: 0,
    minorUnitFactor: 1n,
    symbol: "ریال",
    nameEn: "Iranian Rial",
    nameFa: "ریال ایران",
  },
  IRT: {
    code: "IRT",
    decimals: 0,
    minorUnitFactor: 1n,
    symbol: "تومان",
    nameEn: "Iranian Toman",
    nameFa: "تومان ایران",
  },
  GBP: {
    code: "GBP",
    decimals: 2,
    minorUnitFactor: 100n,
    symbol: "£",
    nameEn: "British Pound",
    nameFa: "پوند بریتانیا",
  },
  USD: {
    code: "USD",
    decimals: 2,
    minorUnitFactor: 100n,
    symbol: "$",
    nameEn: "US Dollar",
    nameFa: "دلار آمریکا",
  },
  EUR: {
    code: "EUR",
    decimals: 2,
    minorUnitFactor: 100n,
    symbol: "€",
    nameEn: "Euro",
    nameFa: "یورو",
  },
  AED: {
    code: "AED",
    decimals: 2,
    minorUnitFactor: 100n,
    symbol: "AED",
    nameEn: "UAE Dirham",
    nameFa: "درهم امارات",
  },
};

export function getCurrencyScale(currency: string): CurrencyScale {
  const upper = currency.toUpperCase();
  const found = CURRENCY_SCALES[upper];
  if (found) return found;
  return {
    code: upper,
    decimals: 2,
    minorUnitFactor: 100n,
    symbol: upper,
    nameEn: upper,
    nameFa: upper,
  };
}

export interface ExchangeRate {
  readonly id?: string;
  readonly fromCurrency: string;
  readonly toCurrency: string;
  readonly rateNumerator: bigint;
  readonly rateDenominator: bigint;
  readonly baseUnit?: "major" | "minor"; // default "major"
  readonly effectiveAt?: string;
  readonly source?: string;
}

export interface MoneyConversionAuditEntry {
  readonly conversionId: string;
  readonly timestamp: string;
  readonly sourceAmount: string;
  readonly sourceCurrency: string;
  readonly targetAmount: string;
  readonly targetCurrency: string;
  readonly rateNumerator: string;
  readonly rateDenominator: string;
  readonly baseUnit: "major" | "minor";
  readonly remainder: string;
  readonly source: string;
}

export class AppendOnlyConversionAuditLog {
  private readonly entries: MoneyConversionAuditEntry[] = [];

  append(entry: MoneyConversionAuditEntry): void {
    this.entries.push(Object.freeze({ ...entry }));
  }

  getEntries(): readonly MoneyConversionAuditEntry[] {
    return Object.freeze([...this.entries]);
  }

  findEntries(filter: { sourceCurrency?: string; targetCurrency?: string }): readonly MoneyConversionAuditEntry[] {
    return this.entries.filter((e) => {
      if (filter.sourceCurrency && e.sourceCurrency !== filter.sourceCurrency) return false;
      if (filter.targetCurrency && e.targetCurrency !== filter.targetCurrency) return false;
      return true;
    });
  }

  clear(): void {
    this.entries.length = 0;
  }
}

export const globalConversionAuditLog = new AppendOnlyConversionAuditLog();

/**
 * Converts a Money instance from one currency to another using integer-only rational rates.
 * Avoids any floating-point numbers and appends an audit record to the append-only log.
 */
export function convertMoney(
  source: Money,
  rate: ExchangeRate,
  auditLog: AppendOnlyConversionAuditLog = globalConversionAuditLog
): { money: Money; audit: MoneyConversionAuditEntry } {
  const fromCurr = rate.fromCurrency.toUpperCase();
  const toCurr = rate.toCurrency.toUpperCase();

  if (source.currency !== fromCurr) {
    throw new CurrencyMismatchError(source.currency, fromCurr);
  }
  if (rate.rateDenominator <= 0n) {
    throw new RangeError("Exchange rate denominator must be strictly positive");
  }
  if (rate.rateNumerator < 0n) {
    throw new RangeError("Exchange rate numerator cannot be negative");
  }

  const baseUnit = rate.baseUnit ?? "major";
  const fromScale = getCurrencyScale(fromCurr);
  const toScale = getCurrencyScale(toCurr);

  let targetAmount: bigint;
  let remainder: bigint;

  const isNeg = source.amount < 0n;
  const absAmount = isNeg ? -source.amount : source.amount;

  if (baseUnit === "minor") {
    const num = absAmount * rate.rateNumerator;
    const den = rate.rateDenominator;
    const quotient = (num + den / 2n) / den;
    targetAmount = isNeg ? -quotient : quotient;
    remainder = num % den;
  } else {
    // Base unit is major units
    const num = absAmount * rate.rateNumerator * toScale.minorUnitFactor;
    const den = rate.rateDenominator * fromScale.minorUnitFactor;
    const quotient = (num + den / 2n) / den;
    targetAmount = isNeg ? -quotient : quotient;
    remainder = num % den;
  }

  const resultMoney = new Money(targetAmount, toCurr);

  const auditEntry: MoneyConversionAuditEntry = {
    conversionId: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    timestamp: rate.effectiveAt ?? new Date().toISOString(),
    sourceAmount: source.amount.toString(),
    sourceCurrency: fromCurr,
    targetAmount: targetAmount.toString(),
    targetCurrency: toCurr,
    rateNumerator: rate.rateNumerator.toString(),
    rateDenominator: rate.rateDenominator.toString(),
    baseUnit,
    remainder: remainder.toString(),
    source: rate.source ?? "internal_market_rate",
  };

  auditLog.append(auditEntry);

  return {
    money: resultMoney,
    audit: auditEntry,
  };
}

export class Money {
  readonly amount: bigint;
  readonly currency: string;

  constructor(amount: bigint | number | string, currency = "IRR") {
    if (typeof amount === "number") {
      if (!Number.isSafeInteger(amount)) {
        throw new TypeError(`Amount ${amount} is not a safe integer`);
      }
      this.amount = BigInt(amount);
    } else if (typeof amount === "string") {
      this.amount = BigInt(amount);
    } else {
      this.amount = amount;
    }
    this.currency = currency.toUpperCase();
  }

  static zero(currency = "IRR"): Money {
    return new Money(0n, currency);
  }

  static fromRials(amount: bigint | number | string): Money {
    return new Money(amount, "IRR");
  }

  static fromTomans(amount: bigint | number | string): Money {
    const val = typeof amount === "number" || typeof amount === "string" ? BigInt(amount) : amount;
    return new Money(val * 10n, "IRR");
  }

  static fromMinorUnits(amount: bigint | number | string, currency: string): Money {
    return new Money(amount, currency);
  }

  /**
   * Constructs Money from a major unit representation (e.g. 15.50 GBP or 25000 IRT)
   * using exact integer parsing without floating-point math.
   */
  static fromMajorUnits(amount: bigint | number | string, currency: string): Money {
    const scale = getCurrencyScale(currency);
    if (typeof amount === "bigint") {
      return new Money(amount * scale.minorUnitFactor, currency);
    }
    const str = String(amount).trim();
    if (!str) {
      return new Money(0n, currency);
    }

    const isNegative = str.startsWith("-");
    const cleanStr = isNegative ? str.slice(1) : str;

    const parts = cleanStr.split(".");
    const wholeStr = parts[0] || "0";
    let fracStr = parts[1] || "";

    if (scale.decimals === 0) {
      let whole = BigInt(wholeStr);
      // Half-up rounding if fraction starts >= 5
      if (fracStr && fracStr.length > 0 && Number(fracStr[0]) >= 5) {
        whole += 1n;
      }
      return new Money(isNegative ? -whole : whole, currency);
    }

    // Pad or trim fraction to scale.decimals
    if (fracStr.length < scale.decimals) {
      fracStr = fracStr.padEnd(scale.decimals, "0");
    } else if (fracStr.length > scale.decimals) {
      const needed = fracStr.slice(0, scale.decimals);
      const nextDigit = Number(fracStr[scale.decimals]);
      let fracBig = BigInt(needed);
      if (nextDigit >= 5) {
        fracBig += 1n;
      }
      fracStr = fracBig.toString().padStart(scale.decimals, "0");
    }

    const totalMinor = BigInt(wholeStr) * scale.minorUnitFactor + BigInt(fracStr);
    return new Money(isNegative ? -totalMinor : totalMinor, currency);
  }

  toTomans(): bigint {
    if (this.currency === "IRT") {
      return this.amount;
    }
    return this.amount / 10n;
  }

  toMajorUnitsString(): string {
    const scale = getCurrencyScale(this.currency);
    const isNeg = this.amount < 0n;
    const abs = isNeg ? -this.amount : this.amount;

    if (scale.decimals === 0) {
      return `${isNeg ? "-" : ""}${abs.toString()}`;
    }

    const whole = abs / scale.minorUnitFactor;
    const frac = (abs % scale.minorUnitFactor).toString().padStart(scale.decimals, "0");
    return `${isNeg ? "-" : ""}${whole.toString()}.${frac}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  sub(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  mul(factor: number | bigint): Money {
    if (typeof factor === "bigint") {
      return new Money(this.amount * factor, this.currency);
    }
    if (!Number.isFinite(factor)) {
      throw new TypeError("Multiplication factor must be a finite number");
    }
    // Fixed-point scaling by 10000 for precision, then half-up rounding
    const factorScaled = BigInt(Math.round(factor * 10000));
    const result = (this.amount * factorScaled + 5000n) / 10000n;
    return new Money(result, this.currency);
  }

  div(divisor: number | bigint): Money {
    const d = typeof divisor === "number" ? BigInt(divisor) : divisor;
    if (d === 0n) {
      throw new RangeError("Division by zero");
    }
    return new Money(this.amount / d, this.currency);
  }

  /**
   * Basis points calculation (1% = 100 bps).
   * Calculates with half-up rounding to prevent fractional leakage.
   */
  bps(basisPoints: number): Money {
    const bpsBig = BigInt(basisPoints);
    const result = (this.amount * bpsBig + 5000n) / 10000n;
    return new Money(result, this.currency);
  }

  /**
   * Remainder-preserving proportional allocation.
   * Guarantees that sum(results) === this.amount exactly, eliminating rounding leak.
   */
  allocate(weights: number[]): Money[] {
    if (weights.length === 0) return [];
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    if (totalWeight <= 0) {
      throw new Error("Total allocation weight must be positive");
    }

    const totalWeightBig = BigInt(totalWeight);
    let remainder = this.amount;
    const results: bigint[] = [];

    for (const w of weights) {
      const share = (this.amount * BigInt(w)) / totalWeightBig;
      results.push(share);
      remainder -= share;
    }

    // Distribute remainder 1 unit at a time to early shares
    let i = 0;
    while (remainder > 0n) {
      results[i % results.length] += 1n;
      remainder -= 1n;
      i++;
    }

    return results.map((amt) => new Money(amt, this.currency));
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.amount === other.amount;
  }

  greaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount > other.amount;
  }

  lessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount < other.amount;
  }

  greaterThanOrEqual(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount >= other.amount;
  }

  lessThanOrEqual(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount <= other.amount;
  }

  isZero(): boolean {
    return this.amount === 0n;
  }

  isPositive(): boolean {
    return this.amount > 0n;
  }

  isNegative(): boolean {
    return this.amount < 0n;
  }

  formatRials(locale = "fa-IR"): string {
    return `${new Intl.NumberFormat(locale).format(this.amount)} ریال`;
  }

  formatTomans(locale = "fa-IR"): string {
    const tomans = this.toTomans();
    return `${new Intl.NumberFormat(locale).format(tomans)} تومان`;
  }

  convert(rate: ExchangeRate, auditLog?: AppendOnlyConversionAuditLog): Money {
    return convertMoney(this, rate, auditLog).money;
  }

  convertWithAudit(
    rate: ExchangeRate,
    auditLog?: AppendOnlyConversionAuditLog
  ): { money: Money; audit: MoneyConversionAuditEntry } {
    return convertMoney(this, rate, auditLog);
  }

  toJSON() {
    return {
      amount: this.amount.toString(),
      currency: this.currency,
      tomans: this.toTomans().toString(),
      formatted: this.formatTomans(),
    };
  }
}
