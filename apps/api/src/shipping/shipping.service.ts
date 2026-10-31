import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  IranPostShippingGateway,
  TipaxShippingGateway,
  AlopeykShippingGateway,
  ShippingQuoteOption,
} from "@commerce-os/gateways";
import { Money } from "@commerce-os/domain";

@Injectable()
export class ShippingService {
  private readonly post = new IranPostShippingGateway();
  private readonly tipax = new TipaxShippingGateway();
  private readonly alopeyk = new AlopeykShippingGateway();

  constructor(private readonly prisma: PrismaService) {}

  async calculateQuotes(params: {
    originCity: string;
    destinationProvince: string;
    destinationCity: string;
    totalWeightGrams: number;
    packageValueRials: bigint | number;
    isFragile?: boolean;
  }): Promise<ShippingQuoteOption[]> {
    const input = {
      originCity: params.originCity,
      destinationProvince: params.destinationProvince,
      destinationCity: params.destinationCity,
      totalWeightGrams: params.totalWeightGrams,
      packageValue: Money.fromRials(params.packageValueRials),
      isFragile: params.isFragile,
    };

    const [postQuotes, tipaxQuotes, alopeykQuotes] = await Promise.all([
      this.post.calculateRate(input),
      this.tipax.calculateRate(input),
      this.alopeyk.calculateRate(input),
    ]);

    return [...postQuotes, ...tipaxQuotes, ...alopeykQuotes];
  }

  async track(carrier: string, trackingCode: string) {
    if (carrier.toUpperCase().includes("TIPAX")) {
      return this.tipax.track(trackingCode);
    }
    if (carrier.toUpperCase().includes("ALOPEYK")) {
      return this.alopeyk.track(trackingCode);
    }
    return this.post.track(trackingCode);
  }
}
