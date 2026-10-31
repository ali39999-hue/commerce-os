import { describe, it, expect } from "vitest";
import { Money } from "@commerce-os/domain";
import {
  ZarinpalGateway,
  CardToCardGateway,
  IranPostShippingGateway,
  TipaxShippingGateway,
  AlopeykShippingGateway,
} from "../src/index.js";

describe("Payment Gateways", () => {
  it("initiates Zarinpal payment with offline sandbox fallback", async () => {
    // The all-zeros placeholder merchant ID deterministically uses the offline
    // sandbox fallback (no network) — the same path local dev and E2E take.
    const gateway = new ZarinpalGateway({
      merchantId: "00000000-0000-0000-0000-000000000000",
      isSandbox: true,
    });
    const init = await gateway.initiate({
      intentId: "intent_123",
      orderId: "ord_123",
      amount: Money.fromTomans(500_000n),
      callbackUrl: "https://shop.local/callback",
      description: "تست خرید",
    });

    expect(init.gatewayTrackingId).toBeDefined();
    expect(init.redirectUrl).toContain("StartPay");

    const verified = await gateway.verifyCallback({
      intentId: "intent_123",
      expectedAmount: Money.fromTomans(500_000n),
      queryOrBody: { Status: "OK", Authority: init.gatewayTrackingId },
    });

    expect(verified.success).toBe(true);
    expect(verified.refId).toBeDefined();
  });

  it("handles Card-to-Card bank transfer workflow", async () => {
    const c2c = new CardToCardGateway({
      cardNumber: "6219861012345678",
      cardHolder: "فروشگاه تست",
      bankName: "بانک سامان",
    });

    const info = c2c.getMerchantInfo();
    expect(info.bank?.nameFa).toBe("بانک سامان");
    expect(info.formattedCard).toBe("6219-8610-1234-5678");

    const init = await c2c.initiate({
      intentId: "intent_c2c_1",
      orderId: "ord_c2c_1",
      amount: Money.fromTomans(200_000n),
      callbackUrl: "https://shop.local/checkout/c2c",
      description: "کارت به کارت",
    });

    expect(init.redirectUrl).toContain("c2c_intent=intent_c2c_1");

    const verified = await c2c.verifyCallback({
      intentId: "intent_c2c_1",
      expectedAmount: Money.fromTomans(200_000n),
      queryOrBody: { referenceNumber: "9876543210", payerCardNumber: "6037991122334455" },
    });

    expect(verified.success).toBe(true);
    expect(verified.refId).toBe("C2C-9876543210");
  });
});

describe("Logistics & Shipping Gateways", () => {
  it("calculates Iran Post rate", async () => {
    const post = new IranPostShippingGateway();
    const quotes = await post.calculateRate({
      originCity: "تهران",
      destinationProvince: "اصفهان",
      destinationCity: "اصفهان",
      totalWeightGrams: 1200,
      packageValue: Money.fromTomans(1_000_000n),
    });

    expect(quotes.length).toBe(1);
    expect(quotes[0].carrier).toBe("IRAN_POST");
    expect(quotes[0].cost.amount).toBeGreaterThan(500_000n);
  });

  it("calculates Tipax courier rate", async () => {
    const tipax = new TipaxShippingGateway();
    const quotes = await tipax.calculateRate({
      originCity: "تهران",
      destinationProvince: "فارس",
      destinationCity: "شیراز",
      totalWeightGrams: 2000,
      packageValue: Money.fromTomans(2_000_000n),
      isFragile: true,
    });

    expect(quotes.length).toBe(1);
    expect(quotes[0].carrier).toBe("TIPAX");
    expect(quotes[0].cost.amount).toBeGreaterThan(850_000n);
  });

  it("offers Alopeyk only for intra-city orders", async () => {
    const alopeyk = new AlopeykShippingGateway();
    const intraCity = await alopeyk.calculateRate({
      originCity: "تهران",
      destinationProvince: "تهران",
      destinationCity: "تهران",
      totalWeightGrams: 500,
      packageValue: Money.fromTomans(500_000n),
    });
    expect(intraCity.length).toBe(1);
    expect(intraCity[0].carrier).toBe("ALOPEYK");

    const interCity = await alopeyk.calculateRate({
      originCity: "تهران",
      destinationProvince: "البرز",
      destinationCity: "کرج",
      totalWeightGrams: 500,
      packageValue: Money.fromTomans(500_000n),
    });
    expect(interCity.length).toBe(0);
  });
});
