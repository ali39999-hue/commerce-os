import { Money } from "@commerce-os/domain";

export type DeliverySpeed = "REGULAR" | "EXPRESS" | "SAME_DAY";

export interface ShippingQuoteInput {
  originCity: string;
  destinationProvince: string;
  destinationCity: string;
  totalWeightGrams: number;
  packageValue: Money;
  isFragile?: boolean;
}

export interface ShippingQuoteOption {
  methodCode: string;
  titleFa: string;
  descriptionFa: string;
  cost: Money;
  estimatedDeliveryHours: number;
  carrier: "IRAN_POST" | "TIPAX" | "ALOPEYK" | "INTERNAL";
}

export interface ShipmentTrackingStatus {
  trackingCode: string;
  carrier: string;
  status: "REGISTERED" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURNED";
  location?: string;
  lastUpdate: Date;
  events: Array<{
    title: string;
    description: string;
    timestamp: Date;
    location?: string;
  }>;
}

export interface ShippingGatewayPort {
  readonly carrierName: string;
  calculateRate(input: ShippingQuoteInput): Promise<ShippingQuoteOption[]>;
  track(trackingCode: string): Promise<ShipmentTrackingStatus>;
}
