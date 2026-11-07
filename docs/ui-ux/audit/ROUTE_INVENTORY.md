# ROUTE INVENTORY
# Dr Dermer UK Clinical & Commerce OS Storefront
# Exhaustive Route Registry & Operational Status Audit

> **Target Application**: `apps/storefront`  
> **Framework**: Next.js 16.4.3 (Turbopack, App Router, React 19)  
> **Audit Status**: Verified Active (registry reconciled against `apps/storefront/app/` source: 31 `page.tsx` route files = 27 static + 4 parameterized families, plus metadata routes and branded 404)  
> **Last Verified**: 2026-11-07

---

## 1. Overview of Route Architecture

The Dr Dermer UK storefront utilizes Next.js 16 App Router architecture, supporting:
- **Static Pages (○ Static)**: Fully prerendered as static HTML at build time for optimal CDN edge caching.
- **Static Site Generation (● SSG)**: Prerendered parameterized pages generated via `generateStaticParams()`.
- **Dynamic Server-Rendered (ƒ Dynamic)**: Rendered on-demand per request for transactional, dynamic, or personalized contexts.
- **Metadata Routes**: Dedicated protocol endpoints for search engines and progressive web application installation (`sitemap.xml`, `robots.txt`, `manifest.webmanifest`).

---

## 2. Permanent Redirects (next.config.ts)

Legacy routes retired by the 2026-11-07 business pivot (device consoles, B2B portal, Academy, Vendors) no longer exist as pages; `apps/storefront/next.config.ts` returns `permanent: true` (308) redirects so old links and search-index entries land on live content:

| Legacy Source | Destination |
| :--- | :--- |
| `/carbox` | `/carboxygel` |
| `/plasmax` | `/carboxygel` |
| `/academy` | `/blog` |
| `/b2b/:path*` | `/#products` |
| `/vendors/:path*` | `/#products` |
| `/vendors` | `/#products` |
| `/blog/rahnamaye-entekhab-ghahve` | `/blog/clinical-skincare-selection-guide` |

---

## 3. Complete Route Register (Verified against `apps/storefront/app/`)

| # | Route Path | Component File Path | Type | Clinical & Commercial Purpose | Status |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **1** | `/` | `apps/storefront/app/page.tsx` | Dynamic / SSR | Flagship Clinical Storefront: Hero, Bohr Simulator, Visia Analyzer, Regimen Finder | Verified Active (200 OK) |
| **2** | `/_not-found` | `apps/storefront/app/not-found.tsx` | Static | Branded Clinical 404 Recovery: emergency navigation, clinical search prompt | Verified Active (200 OK) |
| **3** | `/about` | `apps/storefront/app/about/page.tsx` | Static | Institutional Heritage: Cambridge Science Park R&D, Istanbul hub, IFDA compliance | Verified Active (200 OK) |
| **4** | `/account` | `apps/storefront/app/account/page.tsx` | Static | Patient Account Portal: profile management, National ID Modulo-11, order history | Verified Active (200 OK) |
| **5** | `/auth` | `apps/storefront/app/auth/page.tsx` | Static | OTP Authentication Entry: unified login / registration hub (ورود و ثبت‌نام) | Verified Active (200 OK) |
| **6** | `/blog` | `apps/storefront/app/blog/page.tsx` | Static | Clinical Journal Archive: peer-reviewed dermatological papers, literature summaries | Verified Active (200 OK) |
| **7** | `/blog/bohr-effect-carboxy-therapy-needle-free` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | In-depth Biophysics: CO2 transcutaneous flux, tissue acidosis, oxyhemoglobin curve | Verified Active (200 OK) |
| **8** | `/blog/clinical-skincare-selection-guide` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | Dermatological Decision Guide: Fitzpatrick classification and regimen triage | Verified Active (200 OK) |
| **9** | `/blog/paydar-pardakht-shaparak-amniat` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | Payment Security Protocol: Shaparak TLS gateways, Card-to-Card verification | Verified Active (200 OK) |
| **10** | `/blog/post-laser-recovery-reemed-clinical` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | Post-Procedural Care: TEWL barrier management following CO2 laser and RF microneedling | Verified Active (200 OK) |
| **11** | `/blog/protocol-7-days-cellular-renewal` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | 7-Day Cellular Renewal Protocol: clinical regimen pairing CarboxyGel with Healene | Verified Active (200 OK) |
| **12** | `/blog/protocol-hyperpigmentation-retinol-niacinamide` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | Melanin Synthesis Regulation: tyrosinase inhibition via Retinoids & Niacinamide | Verified Active (200 OK) |
| **13** | `/blog/retinol-and-hyaluronic-acid-layering` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | Molecular Stratification: multi-weight HA osmotic hydration paired with pure Retinol | Verified Active (200 OK) |
| **14** | `/blog/sharayet-tahvil-pishtaz-tipax` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | Cold-Chain Logistics: thermal phase-change dry gel packing and express courier SLA | Verified Active (200 OK) |
| **15** | `/blog/signal-peptides-vs-copper-peptides` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | Biomimetic Chemistry: copper tripeptide-1 vs palmitoyl pentapeptide-4 mechanisms | Verified Active (200 OK) |
| **16** | `/blog/skin-barrier-restoration-post-procedure` | `apps/storefront/app/blog/[slug]/page.tsx` | SSG | Lamellar Barrier Recovery: Madecassoside and medical D-Panthenol lipid cascades | Verified Active (200 OK) |
| **17** | `/carboxygel` | `apps/storefront/app/carboxygel/page.tsx` | Static | CarboxyGel™ Pro: Bohr Effect telemetry, transdermal O2 release, direct order module | Verified Active (200 OK) |
| **18** | `/carboxypad` | `apps/storefront/app/carboxypad/page.tsx` | Static | CarboxyPad™ Activator Mask: 5 anatomical facial zones, 4 reaction phases | Verified Active (200 OK) |
| **19** | `/carboxypod` | `apps/storefront/app/carboxypod/page.tsx` | Static | CarboxyPod™ Activator: 3-stage mechanical coupling, effervescent pod selection | Verified Active (200 OK) |
| **20** | `/cart` | `apps/storefront/app/cart/page.tsx` | Static | Shopping Cart: 2-tier milestone shipping tracker, coupon engine (`DERMER20`) | Verified Active (200 OK) |
| **21** | `/checkout` | `apps/storefront/app/checkout/page.tsx` | Static | 3-Step Checkout Wizard: National ID Modulo-11, cold-chain courier, Shaparak gateway | Verified Active (200 OK) |
| **22** | `/compare` | `apps/storefront/app/compare/page.tsx` | Static | Clinical Product Comparator: side-by-side active ingredient and claim differentiation | Verified Active (200 OK) |
| **23** | `/contact` | `apps/storefront/app/contact/page.tsx` | Static | Corporate Contact: Cambridge UK headquarters, Istanbul office, direct inquiry form | Verified Active (200 OK) |
| **24** | `/crystalene` | `apps/storefront/app/crystalene/page.tsx` | Static | Crystalene™ Microderm Polish: 12% rounded alumina crystals, INCI dossier, ordering | Verified Active (200 OK) |
| **25** | `/faq` | `apps/storefront/app/faq/page.tsx` | Static | Clinical & Regulatory FAQ: 8 categorical accordions (CE, TTAC, Cold-Chain, Invoicing) | Verified Active (200 OK) |
| **26** | `/healene` | `apps/storefront/app/healene/page.tsx` | Static | Healene™ Soothing Gel: 5% D-Panthenol + Centella, 48h TEWL reduction telemetry | Verified Active (200 OK) |
| **27** | `/ingredients` | `apps/storefront/app/ingredients/page.tsx` | Static | INCI Encyclopedia: pharmacological database, CAS registry numbers, CIR safety | Verified Active (200 OK) |
| **28** | `/legal` | `apps/storefront/app/legal/page.tsx` | Static | Regulatory & Legal Standards: GDP cold-chain assurance, TTAC authenticity, terms | Verified Active (200 OK) |
| **29** | `/login` | `apps/storefront/app/login/page.tsx` | Static | Customer Login: returning-user session entry (ورود به حساب کاربری) | Verified Active (200 OK) |
| **30** | `/manifest.webmanifest` | `apps/storefront/app/manifest.ts` | Static | PWA Web Application Manifest: offline app metadata, mobile icons, clinical theme | Verified Active (200 OK) |
| **31** | `/order/[id]` | `apps/storefront/app/order/[id]/page.tsx` | Dynamic | Real-time Order Tracking: 5-stage shipment timeline, sensor logs, tax invoice print | Verified Active (200 OK) |
| **32** | `/pay/[intentId]` | `apps/storefront/app/pay/[intentId]/page.tsx` | Dynamic | Payment Settlement & Receipt Verification: Shaparak callback & Card-to-Card upload | Verified Active (200 OK) |
| **33** | `/products/[slug]` | `apps/storefront/app/products/[slug]/page.tsx` | Dynamic / SSR | Comprehensive Clinical PDP: 6 consumable products with VISIA comparison, protocol timer, INCI | Verified Active (200 OK) |
| **34** | `/reemed` | `apps/storefront/app/reemed/page.tsx` | Static | ReeMed™ Clinical Solutions: professional dermocosmetic solution line (محلول‌های کلینیکی) | Verified Active (200 OK) |
| **35** | `/reeskin` | `apps/storefront/app/reeskin/page.tsx` | Static | ReeSkin™ Home-Care Line: clinical skincare consumable regimen (مصرفی خانگی) | Verified Active (200 OK) |
| **36** | `/register` | `apps/storefront/app/register/page.tsx` | Static | Customer Registration: new account creation (ثبت‌نام و عضویت) | Verified Active (200 OK) |
| **37** | `/robots.txt` | `apps/storefront/app/robots.ts` | Static | Search Engine Crawl Directives: production crawl allowlist, staging protection | Verified Active (200 OK) |
| **38** | `/rupak` | `apps/storefront/app/rupak/page.tsx` | Static | Rupak Shop Storefront Template: Persian WooCommerce-style hero & product demo grid | Verified Active (200 OK) |
| **39** | `/search` | `apps/storefront/app/search/page.tsx` | Static | Faceted Clinical Search: bilingual synonyms (کربوکسی/carboxy), concern filtering | Verified Active (200 OK) |
| **40** | `/shop` | `apps/storefront/app/shop/page.tsx` | Static | Full Shop Listing: خرید اینترنتی محصولات پوست و مو with filter toolbar | Verified Active (200 OK) |
| **41** | `/silicalene` | `apps/storefront/app/silicalene/page.tsx` | Static | Silicalene™ Mild Silica Scrub: amorphous silica spheres, sebum balance, ordering | Verified Active (200 OK) |
| **42** | `/sitemap.xml` | `apps/storefront/app/sitemap.ts` | Static | Canonical XML Sitemap: indexing all active canonical clinical routes | Verified Active (200 OK) |
| **43** | `/subscriptions` | `apps/storefront/app/subscriptions/page.tsx` | Static | Clinical Auto-Replenishment: recurring consumable orders, schedule controls | Verified Active (200 OK) |
| **44** | `/wishlist` | `apps/storefront/app/wishlist/page.tsx` | Static | Saved Regimens & Bookmarked Formulations: clinical patient wishlist | Verified Active (200 OK) |

*Note: The registry reconciles to 31 `page.tsx` files under `apps/storefront/app/` — 27 static pages plus 4 parameterized families. In the Next.js static build, static routes and SSG parameters (`/blog/[slug]`, `/products/[slug]`) render directly to disk (`.next/prerender-manifest.json`), while the dynamic parameterized routes (`/order/[id]`, `/pay/[intentId]`) and the root SSR handler (`/`) are executed on demand. API route handlers live under `apps/storefront/app/api/` and are excluded from the page registry. Legacy `/b2b`, `/vendors`, `/carbox`, `/plasmax` and `/academy` pages were removed in the 2026-11-07 pivot and are served by the permanent redirects in §2.*

---

## 4. Route Verification & Health Matrix

- **Build Output Verification**: Confirmed via `pnpm --filter @commerce-os/storefront run build` with zero TypeScript errors and zero prerendering exceptions.
- **SSR & Client Hydration**: All routes pass hydration tests with zero console hydration mismatches (`suppressHydrationWarning` applied where browser extensions manipulate DOM).
- **SEO & Structured Data**: Every public route embeds appropriate schema.org JSON-LD microdata (`MedicalBusiness`, `MedicalScholarlyArticle`, `Product`, or `FAQPage`).
