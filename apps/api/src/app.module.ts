import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { IdentityModule } from './identity/identity.module';
import { CatalogModule } from './catalog/catalog.module';
import { PricingModule } from './pricing/pricing.module';
import { InventoryModule } from './inventory/inventory.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { LedgerModule } from './ledger/ledger.module';
import { ShippingModule } from './shipping/shipping.module';
import { WalletModule } from './wallet/wallet.module';
import { OutboxModule } from './outbox/outbox.module';
import { SearchModule } from './search/search.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { OpsModule } from './ops/ops.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SettingsModule } from './settings/settings.module';
import { DigitalModule } from './digital/digital.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    DatabaseModule,
    HealthModule,
    IdentityModule,
    CatalogModule,
    SearchModule,
    PricingModule,
    InventoryModule,
    CheckoutModule,
    PaymentsModule,
    OrdersModule,
    LedgerModule,
    ShippingModule,
    WalletModule,
    OutboxModule,
    ReviewsModule,
    NotificationsModule,
    WebhooksModule,
    AnalyticsModule,
    OpsModule,
    RecommendationsModule,
    LoyaltyModule,
    SubscriptionsModule,
    SettingsModule,
    DigitalModule,
  ],
})
export class AppModule {}
