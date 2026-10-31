#!/usr/bin/env node
/**
 * Commerce OS — Load Check (W14)
 * بارسنجی سبک‌وزن به‌جای k6: استخر کارگر همزمان روی سه اندپوینت عمومی
 * بدون وابستگی خارجی (فقط node:*) — Node 22+ / ESM
 *
 * استفاده:
 *   node scripts/load-check.mjs --target http://localhost:4000 --n 60 --c 10
 *
 * منطق نتیجه:
 *   PASS برای هر اندپوینت اگر موفقیت مؤثر ≥۹۰٪ (درخواست‌های 429 از شمارش خارج می‌شوند اما گزارش می‌شوند)
 *   و p95 تأخیر موفق‌ها < ۸۰۰ میلی‌ثانیه. نتیجهٔ نهایی PASS فقط اگر همهٔ اندپوینت‌ها PASS باشند.
 */

import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    target: { type: "string", default: "http://localhost:4000" },
    n: { type: "string", default: "60" },
    c: { type: "string", default: "10" },
  },
});

const TARGET = (values.target ?? "http://localhost:4000").replace(/\/$/, "");
const N = Math.max(1, Number.parseInt(values.n, 10) || 60);
const C = Math.max(1, Math.min(N, Number.parseInt(values.c, 10) || 10));
const REQUEST_TIMEOUT_MS = 5000;
const P95_BUDGET_MS = 800;
const MIN_SUCCESS_RATE = 0.9;

const ENDPOINTS = [
  { name: "سلامت هسته API (GET /v1/health)", path: "/v1/health" },
  { name: "کاتالوگ محصولات (GET /v1/stores/demo/products)", path: "/v1/stores/demo/products" },
  { name: "جست‌وجوی فارسی (GET /v1/search?q=قهوه)", path: `/v1/search?q=${encodeURIComponent("قهوه")}` },
];

function percentile(sortedAsc, p) {
  if (sortedAsc.length === 0) return null;
  const idx = Math.max(0, Math.min(sortedAsc.length - 1, Math.ceil((p / 100) * sortedAsc.length) - 1));
  return Math.round(sortedAsc[idx]);
}

/**
 * استخر کارگر: n درخواست با c کارگر همزمان؛ جمع‌آوری تأخیر و وضعیت هر درخواست.
 */
async function probe(path, n, c) {
  const latenciesMs = []; // فقط درخواست‌های موفق (2xx غیر از 429)
  const statusCounts = new Map();
  let success = 0;
  let rateLimited = 0;
  let failed = 0;
  let next = 0;

  async function worker() {
    while (next < n) {
      next++;
      const t0 = performance.now();
      try {
        const res = await fetch(`${TARGET}${path}`, {
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        const ms = performance.now() - t0;
        statusCounts.set(res.status, (statusCounts.get(res.status) ?? 0) + 1);
        if (res.status === 429) {
          rateLimited++;
        } else if (res.ok) {
          success++;
          latenciesMs.push(ms);
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(c, n) }, worker));

  const sorted = latenciesMs.slice().sort((a, b) => a - b);
  return {
    n,
    success,
    rateLimited,
    failed,
    statusCounts,
    p50: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    max: percentile(sorted, 100),
  };
}

function statusSummary(counts) {
  return [...counts.entries()].map(([s, k]) => `${s}×${k}`).join(" · ");
}

async function main() {
  console.log(`\n⚡ Commerce OS — Load Check against ${TARGET}`);
  console.log(`   n=${N} درخواست در هر اندپوینت · c=${C} همزمان · سقف p95=${P95_BUDGET_MS}ms`);
  console.log("─".repeat(64));

  // ── پیش‌ پرواز: یک درخواست سلامت؛ اگر API پاسخ ندهد زودتر خارج می‌شویم ──
  try {
    const pre = await fetch(`${TARGET}/v1/health`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!pre.ok) {
      console.log(`❌ API پاسخ غیرسالم داد (HTTP ${pre.status}) — بارسنجی متوقف شد.`);
      process.exit(1);
    }
  } catch (e) {
    console.log(`❌ API در دسترس نیست (${e.message}) — بارسنجی متوقف شد.`);
    process.exit(1);
  }

  const results = [];
  let totalSuccess = 0;
  let totalRateLimited = 0;
  let totalFailed = 0;

  for (const [i, ep] of ENDPOINTS.entries()) {
    const r = await probe(ep.path, N, C);
    const effective = r.n - r.rateLimited; // 429 از داوری موفقیت خارج می‌شود اما گزارش می‌شود
    const successRate = effective > 0 ? r.success / effective : 0;
    const rateOk = successRate >= MIN_SUCCESS_RATE;
    const latencyOk = r.success > 0 && r.p95 !== null && r.p95 < P95_BUDGET_MS;
    const passed = rateOk && latencyOk;

    results.push({ name: ep.name, passed, successRate, ...r });
    totalSuccess += r.success;
    totalRateLimited += r.rateLimited;
    totalFailed += r.failed;

    const icon = passed ? "✅" : "❌";
    const parts = [
      `${r.success}/${r.n} موفق`,
      `p50=${r.p50 ?? "—"}ms`,
      `p95=${r.p95 ?? "—"}ms`,
      `max=${r.max ?? "—"}ms`,
    ];
    if (r.rateLimited > 0) parts.push(`${r.rateLimited}×429 (rate limit فعال است — از داوری خارج شد)`);
    if (r.failed > 0) parts.push(`${r.failed} خطا`);
    console.log(`${icon} ${i + 1}. ${ep.name} — ${parts.join(" · ")}`);
    if (process.env.LOAD_CHECK_DEBUG === "1") {
      console.log(`   └─ وضعیت‌ها: ${statusSummary(r.statusCounts) || "—"}`);
    }
  }

  // ── جمع‌بندی ──
  const passedCount = results.filter((r) => r.passed).length;
  const totalRequests = N * ENDPOINTS.length;
  console.log("─".repeat(64));
  console.log(
    `📊 نتیجه: ${passedCount}/${ENDPOINTS.length} اندپوینت PASS · ${totalRequests} درخواست · ` +
      `${totalSuccess} موفق · ${totalRateLimited}×429 · ${totalFailed} خطا`
  );
  if (passedCount === ENDPOINTS.length) {
    console.log(
      `✅ بارسنجی سالم است — p95 زیر ${P95_BUDGET_MS}ms و موفقیت مؤثر ≥۹۰٪ در همهٔ اندپوینت‌ها.` +
        (totalRateLimited > 0 ? " (rate limit فعال است — درخواست‌های 429 از داوری تأخیر خارج شدند)" : "")
    );
  } else {
    const failedOnes = results.filter((r) => !r.passed).map((r) => r.name).join(" · ");
    console.log(`❌ معیار تأخیر/موفقیت برآورده نشد — اندپوینت‌های ناموفق: ${failedOnes}`);
  }
  process.exit(passedCount === ENDPOINTS.length ? 0 : 1);
}

main().catch((e) => {
  console.error("Load check error:", e);
  process.exit(1);
});
