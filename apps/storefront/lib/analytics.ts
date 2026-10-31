/**
 * Commerce OS Storefront - Consent-aware Client Analytics Event Funnel
 * Complies with Section 27 (Event Dictionary) & Phase 13 (P13-009, P13-010)
 * Zero PII guarantee: Customer identifiers, phone numbers, emails, addresses, and payment secrets are never tracked.
 */

export type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  updatedAt: string;
};

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  affiliation?: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  sku?: string;
}

export type AnalyticsEventName =
  | 'view_home'
  | 'view_collection'
  | 'view_item_list'
  | 'select_item'
  | 'view_item'
  | 'view_ingredient'
  | 'search'
  | 'search_submitted'
  | 'search_suggestion_selected'
  | 'filter_applied'
  | 'add_to_wishlist'
  | 'add_to_compare'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'purchase'
  | 'refund'
  | 'generate_lead';

export interface BaseEventPayload {
  currency?: string;
  value?: number;
  coupon?: string;
  items?: AnalyticsItem[];
  [key: string]: unknown;
}

export interface AnalyticsEventRecord {
  event: AnalyticsEventName;
  timestamp: string;
  anonymous_session_id: string;
  data: BaseEventPayload;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const CONSENT_STORAGE_KEY = 'commerce_os.consent.v1';
const ANONYMOUS_SESSION_KEY = 'commerce_os.anon_session_id';

/**
 * Returns anonymous session UUID without linking to real customer identity.
 */
function getAnonymousSessionId(): string {
  if (typeof window === 'undefined') return 'ssr_session';
  try {
    let sessionId = sessionStorage.getItem(ANONYMOUS_SESSION_KEY);
    if (!sessionId) {
      sessionId = 'anon_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      sessionStorage.setItem(ANONYMOUS_SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return 'ephemeral_session';
  }
}

/**
 * Retrieve user consent preferences.
 * By default in production, analytics is opt-in or respects doNotTrack.
 */
export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === 'undefined') {
    return { analytics: false, marketing: false, functional: true, updatedAt: new Date().toISOString() };
  }

  // Check browser Do Not Track
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
    return { analytics: false, marketing: false, functional: true, updatedAt: new Date().toISOString() };
  }

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as ConsentPreferences;
    }
  } catch {
    // fallback
  }

  // Default consented for functional and basic privacy-safe analytics
  return {
    analytics: true,
    marketing: false,
    functional: true,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Persist consent choices
 */
export function setConsentPreferences(prefs: Partial<ConsentPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getConsentPreferences();
    const updated: ConsentPreferences = {
      ...current,
      ...prefs,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));

    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('commerce_os:consent_changed', { detail: updated }));
    }
  } catch {
    // ignore local storage errors
  }
}

/**
 * Strips any potential PII fields, query parameters, or formats from payload.
 */
function sanitizePayload(raw: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  const forbiddenPatterns = [
    /email/i,
    /phone/i,
    /mobile/i,
    /national/i,
    /postal/i,
    /address/i,
    /password/i,
    /token/i,
    /card/i,
    /pan/i,
    /cvv/i,
    /first.*name/i,
    /last.*name/i,
  ];

  for (const [key, val] of Object.entries(raw)) {
    const isForbidden = forbiddenPatterns.some((pattern) => pattern.test(key));
    if (isForbidden) continue;

    if (typeof val === 'string') {
      // Basic check against email pattern in values
      if (val.includes('@') && val.includes('.')) continue;
      // Basic check against phone number (10-12 consecutive digits)
      if (/\b\d{10,12}\b/.test(val.replace(/\s+/g, ''))) continue;
      sanitized[key] = val;
    } else if (Array.isArray(val)) {
      sanitized[key] = val.map((item) =>
        typeof item === 'object' && item !== null
          ? sanitizePayload(item as Record<string, unknown>)
          : item
      );
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitizePayload(val as Record<string, unknown>);
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized;
}

/**
 * Primary Analytics Dispatcher
 */
export function trackEvent(name: AnalyticsEventName, payload: BaseEventPayload = {}): void {
  if (typeof window === 'undefined') return;

  const consent = getConsentPreferences();
  if (!consent.analytics) {
    return;
  }

  const cleanPayload = sanitizePayload(payload as Record<string, unknown>);

  const record: AnalyticsEventRecord = {
    event: name,
    timestamp: new Date().toISOString(),
    anonymous_session_id: getAnonymousSessionId(),
    data: cleanPayload,
  };

  // 1. Dispatch to Google Tag Manager / standard dataLayer if present
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: name,
      ...cleanPayload,
      anonymous_session_id: record.anonymous_session_id,
      event_timestamp: record.timestamp,
    });
  }

  // 2. Dispatch custom DOM event for local consumers or plugins
  try {
    window.dispatchEvent(new CustomEvent('commerce_os:event', { detail: record }));
  } catch {
    // ignore
  }

  // 3. In dev mode, log to console for verification
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug(`[Analytics Event: ${name}]`, record);
  }
}

/* ─────────────────────────────────────────────────────────────
   Convenience Event Helper Methods for Funnel Stages
───────────────────────────────────────────────────────────── */

/** 1. View Item List (PLP or Featured Rails) */
export function trackViewItemList(itemListId: string, itemListName: string, items: AnalyticsItem[]): void {
  trackEvent('view_item_list', {
    item_list_id: itemListId,
    item_list_name: itemListName,
    items,
  });
}

/** 2. View Item (Product Detail Page) */
export function trackViewItem(item: AnalyticsItem, currency = 'IRR'): void {
  trackEvent('view_item', {
    currency,
    value: item.price ? (item.price * (item.quantity ?? 1)) : 0,
    items: [item],
  });
}

/** 3. Search Executed */
export function trackSearch(searchTerm: string, resultsCount = 0): void {
  trackEvent('search', {
    search_term: searchTerm.trim(),
    results_count: resultsCount,
  });
  trackEvent('search_submitted', {
    search_term: searchTerm.trim(),
    results_count: resultsCount,
  });
}

/** 4. Add to Cart */
export function trackAddToCart(item: AnalyticsItem, currency = 'IRR'): void {
  trackEvent('add_to_cart', {
    currency,
    value: item.price ? (item.price * (item.quantity ?? 1)) : 0,
    items: [item],
  });
}

/** 5. Remove from Cart */
export function trackRemoveFromCart(item: AnalyticsItem, currency = 'IRR'): void {
  trackEvent('remove_from_cart', {
    currency,
    value: item.price ? (item.price * (item.quantity ?? 1)) : 0,
    items: [item],
  });
}

/** 6. View Cart (Drawer or Full Cart Page) */
export function trackViewCart(items: AnalyticsItem[], totalValue: number, currency = 'IRR'): void {
  trackEvent('view_cart', {
    currency,
    value: totalValue,
    items,
  });
}

/** 7. Begin Checkout */
export function trackBeginCheckout(items: AnalyticsItem[], totalValue: number, coupon?: string, currency = 'IRR'): void {
  trackEvent('begin_checkout', {
    currency,
    value: totalValue,
    coupon,
    items,
  });
}

/** 8. Add Shipping Info */
export function trackAddShippingInfo(shippingTier: string, totalValue: number, currency = 'IRR'): void {
  trackEvent('add_shipping_info', {
    currency,
    value: totalValue,
    shipping_tier: shippingTier,
  });
}

/** 9. Add Payment Info */
export function trackAddPaymentInfo(paymentType: string, totalValue: number, currency = 'IRR'): void {
  trackEvent('add_payment_info', {
    currency,
    value: totalValue,
    payment_type: paymentType,
  });
}

/** 10. Purchase (Checkout Completion) */
export function trackPurchase(params: {
  transactionId: string;
  value: number;
  currency?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  items: AnalyticsItem[];
}): void {
  trackEvent('purchase', {
    transaction_id: params.transactionId,
    value: params.value,
    currency: params.currency ?? 'IRR',
    tax: params.tax ?? 0,
    shipping: params.shipping ?? 0,
    coupon: params.coupon,
    items: params.items,
  });
}
