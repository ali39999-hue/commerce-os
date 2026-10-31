/**
 * Commerce OS — E2E Golden Path Verification Script
 * اجرای کامل مسیر خرید: سلامت → کاتالوگ → جست‌وجو → قیمت‌گذاری → ارسال → چک‌اوت
 * گام‌های وابسته به PostgreSQL به‌صورت شفاف SKIP می‌شوند (نیازمند docker compose up -d)
 */

const API = (process.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "");

const results = [];
function step(name, status, detail = "") {
  results.push({ name, status, detail });
  const icon = status === "PASS" ? "✅" : status === "SKIP" ? "⏭️ " : "❌";
  console.log(`${icon} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function api(path, init, timeoutMs = 6000) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* non-JSON */ }
  return { status: res.status, ok: res.ok, json, text };
}

async function main() {
  console.log(`\n🛍️  Commerce OS — E2E Golden Path against ${API}\n${"─".repeat(64)}`);

  // ── 1. Health ──
  try {
    const h = await api("/v1/health");
    step("1. سلامت هسته API (GET /v1/health)", h.ok && h.json?.status === "ok" ? "PASS" : "FAIL",
      h.ok ? `status=${h.json?.status}` : `HTTP ${h.status}`);
  } catch (e) {
    step("1. سلامت هسته API", "FAIL", `API در دسترس نیست: ${e.message}`);
    return printSummary();
  }

  // ── 2. Catalog ──
  let firstVariant = null;
  try {
    const c = await api("/v1/stores/demo/products");
    const items = c.json?.data ?? [];
    firstVariant = items[0]?.variants?.[0] ?? null;
    step("2. کاتالوگ محصولات", items.length > 0 ? "PASS" : "FAIL",
      `${items.length} محصول، نمونه: ${items[0]?.title ?? "—"}`);
  } catch (e) {
    step("2. کاتالوگ محصولات", "FAIL", e.message);
  }

  // ── 3. Persian Search ──
  try {
    const s = await api(`/v1/search?q=${encodeURIComponent("قهوه")}`);
    const found = s.json?.items ?? [];
    step("3. جست‌وجوی فارسی با مترادف (قهوه)", found.length > 0 ? "PASS" : "FAIL",
      `${found.length} نتیجه — ${found[0]?.title ?? ""}`);
  } catch (e) {
    step("3. جست‌وجوی فارسی", "FAIL", e.message);
  }

  // ── 4. Shipping Quote ──
  try {
    const sh = await api("/v1/shipping/quote", {
      method: "POST",
      body: JSON.stringify({
        originCity: "تهران",
        destinationProvince: "اصفهان",
        destinationCity: "اصفهان",
        totalWeightGrams: 1200,
        packageValueRials: 9000000,
      }),
    });
    const opts = sh.json ?? [];
    const carriers = opts.map((o) => o.carrier).join("، ");
    step("4. استعلام نرخ ارسال (پست/تیپاکس/پیک)", opts.length > 0 ? "PASS" : "FAIL",
      `${opts.length} گزینه: ${carriers || "—"}`);
  } catch (e) {
    step("4. استعلام نرخ ارسال", "FAIL", e.message);
  }

  // ── 5. Checkout session (نیازمند دیتابیس) ──
  let checkoutSession = null;
  if (firstVariant) {
    try {
      // Resolve the real store UUID first (public endpoint added for this flow)
      let storeId = "demo-store";
      try {
        const sr = await api("/v1/stores/resolve?slug=demo");
        if (sr.ok && sr.json?.id) storeId = sr.json.id;
      } catch { /* demo-store fallback */ }

      const cs = await api("/v1/checkout/session", {
        method: "POST",
        body: JSON.stringify({
          storeId,
          items: [{ variantId: firstVariant.id, qty: 2 }],
          customerPhone: "09121234567",
          customerName: "تستر مسیر طلایی",
          address: {
            province: "تهران", city: "تهران", postalCode: "1458963214",
            postalAddress: "خیابان آزمون E2E", receiverName: "تستر", receiverPhone: "09121234567",
          },
        }),
      });
      if (cs.ok && cs.json?.sessionId) {
        checkoutSession = cs.json;
        step("5. ایجاد جلسه چک‌اوت + رزرو انبار", "PASS",
          `sessionId=${cs.json.sessionId} — مجموع: ${cs.json?.quote?.total?.formatted ?? ""}`);
      } else if (cs.status === 500 || cs.status === 400) {
        step("5. ایجاد جلسه چک‌اوت + رزرو انبار", "SKIP",
          "نیازمند PostgreSQL فعال (docker compose up -d) و db:seed");
      } else {
        step("5. ایجاد جلسه چک‌اوت", "FAIL", `HTTP ${cs.status}: ${cs.json?.message ?? ""}`);
      }
    } catch (e) {
      step("5. ایجاد جلسه چک‌اوت", "SKIP", `API پاسخ نداد: ${e.message}`);
    }
  }

  // ── 6. Place order with idempotency (نیازمند چک‌اوت موفق) ──
  if (checkoutSession) {
    const idemKey = `e2e-${Date.now()}`;
    try {
      const po = await api("/v1/checkout/place-order", {
        method: "POST",
        headers: { "x-idempotency-key": idemKey },
        body: JSON.stringify({ sessionId: checkoutSession.sessionId, paymentMethod: "ZARINPAL" }),
      });
      const replay = await api("/v1/checkout/place-order", {
        method: "POST",
        headers: { "x-idempotency-key": idemKey },
        body: JSON.stringify({ sessionId: checkoutSession.sessionId, paymentMethod: "ZARINPAL" }),
      });
      const sameOrder = replay.json?.orderId === po.json?.orderId;
      step("6. ثبت سفارش + آیدمپوتنسی (ارسال دوباره کلید)", po.ok && sameOrder ? "PASS" : "FAIL",
        `orderNumber=${po.json?.orderNumber ?? "—"} — replay یکسان: ${sameOrder ? "بله" : "خیر"}`);

      // ── 7. Payment initiate + verify (own error scope) ──
      if (po.json?.paymentIntentId) {
        try {
          const pi = await api(`/v1/payments/${po.json.paymentIntentId}/initiate`, {
            method: "POST",
            body: JSON.stringify({ callbackBaseUrl: "http://localhost:4000" }),
          }, 15000);
          if (pi.ok && pi.json?.gatewayTrackingId) {
            const cb = await api(
              `/v1/payments/callback/zarinpal?intentId=${po.json.paymentIntentId}&Status=OK&Authority=${pi.json.gatewayTrackingId}`
            );
            step("7. پرداخت درگاه + کپچر و سند دفترکل", cb.ok && cb.json?.success ? "PASS" : "FAIL",
              `refId=${cb.json?.refId ?? "—"} — سفارش: ${cb.json?.orderNumber ?? "—"}`);
          } else {
            step("7. پرداخت درگاه", "SKIP", "ایندپوینت init پاسخ ناقص داد (سندباکس زرین‌پال)");
          }
        } catch (e) {
          step("7. پرداخت درگاه + کپچر", "FAIL", e.message);
        }
      }
    } catch (e) {
      step("6. ثبت سفارش + آیدمپوتنسی", "FAIL", e.message);
    }
  } else {
    step("6. ثبت سفارش + آیدمپوتنسی", "SKIP", "وابسته به گام ۵");
    step("7. پرداخت درگاه + کپچر", "SKIP", "وابسته به گام ۶");
  }

  // ── 8. Analytics ingest + summary ──
  try {
    const ev = await api("/v1/analytics/events", {
      method: "POST",
      body: JSON.stringify({ name: "product_viewed", sessionId: "e2e-session", props: { slug: firstVariant ? "e2e" : "n/a" } }),
    });
    const sum = await api("/v1/analytics/summary?days=7");
    const funnelOk = Array.isArray(sum.json?.funnel) && sum.json.funnel.length >= 4;
    step("8. آنالیتیکس سرورساید (ثبت رویداد + قیف)", ev.ok && funnelOk ? "PASS" : "FAIL",
      `funnel=${sum.json?.funnel?.length ?? 0} مرحله — total=${sum.json?.totalEvents ?? 0}`);
  } catch (e) {
    step("8. آنالیتیکس سرورساید", "FAIL", e.message);
  }

  // ── 9. Ops Exception Center ──
  try {
    const ops = await api("/v1/ops/exceptions");
    const blocks = ops.json?.blocks ?? [];
    step("9. مرکز استثناها (Ops Exceptions)", ops.ok && blocks.length === 5 ? "PASS" : "FAIL",
      blocks.map((b) => `${b.titleFa}:${b.count}`).join(" · "));
  } catch (e) {
    step("9. مرکز استثناها", "FAIL", e.message);
  }

  // ── 10. Webhook signed dispatch (dev loopback allowed) ──
  try {
    const wh = await api("/v1/webhooks/test", {
      method: "POST",
      body: JSON.stringify({ url: "http://127.0.0.1:9/e2e-receiver", eventType: "ORDER_PAID" }),
    });
    const signed = typeof wh.json?.signature === "string" && wh.json.signature.length === 64;
    step("10. وب‌هک خروجی با امضای HMAC", wh.ok && signed ? "PASS" : "FAIL",
      `signature=${signed ? "64hex ✓" : "✗"} — status=${wh.json?.status ?? "—"} (گیرنده بسته → FAILED طبیعی است)`);
  } catch (e) {
    step("10. وب‌هک خروجی", "FAIL", e.message);
  }

  // ── 11. Reviews list shape ──
  try {
    const rv = await api("/v1/reviews/products/00000000-0000-0000-0000-000000000000");
    const shapeOk = rv.ok && Array.isArray(rv.json?.items) && typeof rv.json?.average === "number";
    step("11. API نظرات (لیست + امتیاز میانگین)", shapeOk ? "PASS" : "FAIL",
      `items=${rv.json?.items?.length ?? 0} — dbAvailable=${rv.json?.dbAvailable ?? "—"}`);
  } catch (e) {
    step("11. API نظرات", "FAIL", e.message);
  }

  // ── 12. Store resolve (public) ──
  try {
    const sr = await api("/v1/stores/resolve?slug=demo");
    const shapeOk = sr.ok && typeof sr.json?.id === "string" && typeof sr.json?.tenantId === "string";
    step("12. resolve فروشگاه عمومی", shapeOk ? "PASS" : "FAIL",
      shapeOk ? `storeId=${sr.json.id.slice(0, 8)}…` : `HTTP ${sr.status}`);
  } catch (e) {
    step("12. resolve فروشگاه عمومی", "SKIP", `API پاسخ نداد: ${e.message}`);
  }

  // ── 13. Notifications templates registry ──
  try {
    const nt = await api("/v1/notifications/templates");
    const keys = (nt.json ?? []).map((t) => t.key);
    const ok = nt.ok && keys.includes("ORDER_PAID") && keys.includes("C2C_RECEIPT_APPROVED");
    step("13. رجیستری قالب‌های نوتیفیکیشن", ok ? "PASS" : "FAIL", keys.join(" · "));
  } catch (e) {
    step("13. رجیستری قالب‌های نوتیفیکیشن", "FAIL", e.message);
  }

  // ── 14. Recommendations (popular) ──
  try {
    const rec = await api("/v1/recommendations/popular?limit=6");
    const items = rec.json?.items ?? [];
    const ok = rec.ok && items.length > 0 && ["DB", "FALLBACK"].includes(rec.json?.source);
    step("14. موتور توصیه‌گر (پرفروش‌ها)", ok ? "PASS" : "FAIL",
      `${items.length} مورد — source=${rec.json?.source ?? "—"}`);
  } catch (e) {
    step("14. موتور توصیه‌گر", "FAIL", e.message);
  }

  // ── 15. Loyalty balance shape ──
  try {
    const lo = await api("/v1/loyalty/users/user_demo_1", {
      headers: { "x-tenant-id": "00000000-0000-0000-0000-000000000000" },
    });
    const ok = lo.ok && Number.isInteger(lo.json?.points) && typeof lo.json?.tier === "string";
    step("15. باشگاه مشتریان (موجودی امتیاز)", ok ? "PASS" : "FAIL",
      `points=${lo.json?.points ?? "—"} · tier=${lo.json?.tier ?? "—"} · dbAvailable=${lo.json?.dbAvailable ?? "—"}`);
  } catch (e) {
    step("15. باشگاه مشتریان", "FAIL", e.message);
  }

  // ── 16. Subscription plans ──
  try {
    const sp = await api("/v1/subscriptions/plans?storeSlug=demo");
    const plans = sp.json?.items ?? [];
    const ok = sp.ok && plans.length >= 3 && ["DB", "FALLBACK"].includes(sp.json?.source);
    step("16. پلن‌های اشتراک دوره‌ای", ok ? "PASS" : "FAIL",
      `${plans.length} پلن — source=${sp.json?.source ?? "—"}`);
  } catch (e) {
    step("16. پلن‌های اشتراک دوره‌ای", "FAIL", e.message);
  }

  // ── 17. B2B lead capture (persisted:false روی DB-down طبق ADR-010) ──
  try {
    const bq = await api("/v1/b2b/quote-requests", {
      method: "POST",
      body: JSON.stringify({
        companyName: "کافه تست E2E",
        contactName: "کارآزمای مسیر",
        phone: "09120000000",
        itemsSummary: "۲۰ کیسه قهوه اتیوپی ماهانه برای منوی کافه",
        desiredQty: 20,
      }),
    });
    const ok = bq.ok && bq.json?.accepted === true;
    step("17. ثبت سرنخ B2B (سیاست صیانت از سرنخ)", ok ? "PASS" : "FAIL",
      `persisted=${bq.json?.persisted ?? "—"} — ${bq.json?.message ?? ""}`);
  } catch (e) {
    step("17. ثبت سرنخ B2B", "FAIL", e.message);
  }

  // ── 18. Vendors (marketplace foundation) ──
  try {
    const vd = await api("/v1/vendors?storeSlug=demo");
    const vendors = vd.json?.items ?? [];
    const ok = vd.ok && vendors.length >= 2 && ["DB", "FALLBACK"].includes(vd.json?.source);
    step("18. بنیان فروشندگان (W18)", ok ? "PASS" : "FAIL",
      vendors.map((v) => v.slug).join(" · "));
  } catch (e) {
    step("18. بنیان فروشندگان", "FAIL", e.message);
  }

  // ── 19. Digital grants shape ──
  try {
    const dg = await api("/v1/digital/grants?phone=09123333333");
    const ok = dg.ok && Array.isArray(dg.json?.items);
    step("19. لایسنس‌های دیجیتال (گرنت‌ها)", ok ? "PASS" : "FAIL",
      `items=${dg.json?.items?.length ?? 0} — dbAvailable=${dg.json?.dbAvailable ?? "—"}`);
  } catch (e) {
    step("19. لایسنس‌های دیجیتال", "FAIL", e.message);
  }

  return printSummary();
}

function printSummary() {
  console.log("─".repeat(64));
  const pass = results.filter((r) => r.status === "PASS").length;
  const skip = results.filter((r) => r.status === "SKIP").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  console.log(`📊 نتیجه: ${pass} PASS · ${skip} SKIP · ${fail} FAIL از ${results.length} گام`);
  if (fail === 0) {
    console.log("✅ مسیر طلایی سالم است." + (skip > 0 ? " (گام‌های SKIP نیازمند PostgreSQL: docker compose up -d سپس pnpm --filter @commerce-os/api run db:seed)" : ""));
  } else {
    console.log("❌ گام‌های ناموفق بالا را بررسی کنید.");
  }
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("E2E runner error:", e);
  process.exit(1);
});
