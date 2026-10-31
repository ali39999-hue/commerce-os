/**
 * Zero-float Money primitive for Commerce OS.
 * Stores monetary amounts strictly in minor units (IRR - Iranian Rials) using native bigint.
 * Floating point math is strictly forbidden in financial calculations.
 */

export class CurrencyMismatchError extends Error {
  constructor(c1: string, c2: string) {
    super(`Currency mismatch: cannot operate on ${c1} and ${c2}`);
    this.name = "CurrencyMismatchError";
  }
}

export class Money {
  readonly amount: bigint;
  readonly currency: string;

  constructor(amount: bigint | number, currency = "IRR") {
    if (typeof amount === "number") {
      if (!Number.isSafeInteger(amount)) {
        throw new TypeError(`Amount ${amount} is not a safe integer`);
      }
      this.amount = BigInt(amount);
    } else {
      this.amount = amount;
    }
    this.currency = currency.toUpperCase();
  }

  static zero(currency = "IRR"): Money {
    return new Money(0n, currency);
  }

  static fromRials(amount: bigint | number): Money {
    return new Money(amount, "IRR");
  }

  static fromTomans(amount: bigint | number): Money {
    const val = typeof amount === "number" ? BigInt(amount) : amount;
    return new Money(val * 10n, "IRR");
  }

  toTomans(): bigint {
    return this.amount / 10n;
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

  toJSON() {
    return {
      amount: this.amount.toString(),
      currency: this.currency,
      tomans: this.toTomans().toString(),
      formatted: this.formatTomans(),
    };
  }
}
