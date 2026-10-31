import { Money } from "@commerce-os/domain";
import {
  ShippingGatewayPort,
  ShippingQuoteInput,
  ShippingQuoteOption,
  ShipmentTrackingStatus,
} from "./shipping-port.js";

/**
 * Iran Post (شرکت ملی پست) - Pishtaz and Customized services.
 */
export class IranPostShippingGateway implements ShippingGatewayPort {
  readonly carrierName = "IRAN_POST";

  async calculateRate(input: ShippingQuoteInput): Promise<ShippingQuoteOption[]> {
    // Base rate in Rials: 500,000 Rials base + 150 Rials per gram above 500g
    const baseRials = 500_000n;
    const excessWeight = BigInt(Math.max(0, input.totalWeightGrams - 500));
    const weightFee = excessWeight * 150n;

    // Inter-provincial surcharge
    const isInterProvincial = input.destinationCity.trim() !== input.originCity.trim();
    const distanceFee = isInterProvincial ? 200_000n : 0n;

    const totalPost = baseRials + weightFee + distanceFee;

    return [
      {
        methodCode: "POST_PISHTAZ",
        titleFa: "پست پیشتاز سراسری",
        descriptionFa: "ارسال سریع به تمام نقاط ایران با بیمه استاندارد پستی",
        cost: Money.fromRials(totalPost),
        estimatedDeliveryHours: isInterProvincial ? 72 : 24,
        carrier: "IRAN_POST",
      },
    ];
  }

  async track(trackingCode: string): Promise<ShipmentTrackingStatus> {
    return {
      trackingCode,
      carrier: "شرکت ملی پست جمهوری اسلامی ایران",
      status: "IN_TRANSIT",
      location: "مرکز تجزیه و مبادلات چهارراه لشگر تهران",
      lastUpdate: new Date(),
      events: [
        {
          title: "قبول مرسوله در باجه پستی",
          description: "مرسوله توسط فرستنده تحویل باجه پستی مبدا گردید.",
          timestamp: new Date(Date.now() - 24 * 3600 * 1000),
          location: "دفتر پستی مبدا",
        },
        {
          title: "ورود به مرکز مبادلات پستی",
          description: "مرسوله در حال آماده‌سازی و ارسال به مقصد است.",
          timestamp: new Date(),
          location: "مرکز هاب پستی",
        },
      ],
    };
  }
}

/**
 * Tipax Courier (تیپاکس) - Express door-to-door courier.
 */
export class TipaxShippingGateway implements ShippingGatewayPort {
  readonly carrierName = "TIPAX";

  async calculateRate(input: ShippingQuoteInput): Promise<ShippingQuoteOption[]> {
    const baseRials = 850_000n;
    const weightFee = BigInt(Math.max(0, input.totalWeightGrams - 1000)) * 200n;
    const fragileFee = input.isFragile ? 150_000n : 0n;

    const totalTipax = baseRials + weightFee + fragileFee;

    return [
      {
        methodCode: "TIPAX_EXPRESS",
        titleFa: "تیپاکس (اکسپرس درب به درب)",
        descriptionFa: "تحویل سریع و امن در محل با رهگیری لحظه‌ای اختصاصی",
        cost: Money.fromRials(totalTipax),
        estimatedDeliveryHours: 48,
        carrier: "TIPAX",
      },
    ];
  }

  async track(trackingCode: string): Promise<ShipmentTrackingStatus> {
    return {
      trackingCode,
      carrier: "تیپاکس اکسپرس",
      status: "OUT_FOR_DELIVERY",
      location: "نمایندگی مقصد - آماده توزیع تیپاکسیار",
      lastUpdate: new Date(),
      events: [
        {
          title: "جمع‌آوری از فرستنده",
          description: "بسته از فرستنده دریافت و ثبت شد.",
          timestamp: new Date(Date.now() - 36 * 3600 * 1000),
        },
        {
          title: "تخصیص به تیپاکسیار",
          description: "بسته جهت تحویل به گیرنده در مسیر توزیع قرار گرفت.",
          timestamp: new Date(),
        },
      ],
    };
  }
}

/**
 * Alopeyk / SnappBox (پیک موتوری درون‌شهری)
 */
export class AlopeykShippingGateway implements ShippingGatewayPort {
  readonly carrierName = "ALOPEYK";

  async calculateRate(input: ShippingQuoteInput): Promise<ShippingQuoteOption[]> {
    // Only available for intra-city deliveries
    const isSameCity = input.destinationCity.trim() === input.originCity.trim();
    if (!isSameCity) {
      return [];
    }

    return [
      {
        methodCode: "ALOPEYK_ON_DEMAND",
        titleFa: "پیک موتوری فوری (تحویل روز)",
        descriptionFa: "ارسال سریع درون‌شهری در کمتر از ۳ ساعت",
        cost: Money.fromRials(750_000n),
        estimatedDeliveryHours: 3,
        carrier: "ALOPEYK",
      },
    ];
  }

  async track(trackingCode: string): Promise<ShipmentTrackingStatus> {
    return {
      trackingCode,
      carrier: "پیک درون‌شهری",
      status: "IN_TRANSIT",
      location: "در مسیر تحویل به گیرنده",
      lastUpdate: new Date(),
      events: [
        {
          title: "سفیر بسته را تحویل گرفت",
          description: "سفیر پیک در حال حرکت به سمت آدرس گیرنده است.",
          timestamp: new Date(),
        },
      ],
    };
  }
}
