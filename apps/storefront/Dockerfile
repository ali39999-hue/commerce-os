# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# Commerce OS — Storefront (Next.js 16) production image, standalone output.
#
# The build context MUST be the repository root (pnpm workspace), e.g.:
#   docker build -f apps/storefront/Dockerfile .
#
# Build args (both are NEXT_PUBLIC_*, i.e. baked into the client bundle at
# build time — changing them requires a rebuild):
#   NEXT_PUBLIC_API_URL    e.g. https://api.example.com
#   NEXT_PUBLIC_SITE_URL   e.g. https://example.com
#
# NOTE ON PNPM DEPLOY / HOISTING:
#   No `pnpm deploy`; default isolated node-linker (fine on Linux CI). The
#   runner only ships Next's self-contained `.next/standalone` bundle, which
#   already traces and bundles every node_modules dependency it needs, so
#   the standalone runtime needs no pnpm/node_modules copy at all.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

ENV COREPACK_HOME=/corepack
RUN corepack enable && corepack prepare pnpm@12.16.1 --activate

ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* variables are inlined into the client bundle by the compiler,
# so they must be present as real env vars before `next build` runs.
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# 1) Workspace manifests first (cacheable install layer). Every workspace
#    manifest is copied (tiny files) so pnpm's --frozen-lockfile check sees
#    the full importer set; the --filter below limits what is installed.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY apps/storefront/package.json apps/storefront/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/security/package.json packages/security/package.json
COPY packages/localization/package.json packages/localization/package.json
COPY packages/finance/package.json packages/finance/package.json
COPY packages/gateways/package.json packages/gateways/package.json
COPY packages/ui/package.json packages/ui/package.json

# 2) Install what the storefront needs (`...` includes its workspace deps).
RUN pnpm install --frozen-lockfile --filter @commerce-os/storefront...

# 3) Copy sources.
COPY tsconfig.base.json ./
COPY packages ./packages
COPY apps/storefront ./apps/storefront

# 4) Build. Workspace packages compile first (their "types" point to dist/);
#    `output: "standalone"` in next.config.ts makes `next build` emit a
#    self-contained server bundle into apps/storefront/.next/standalone.
RUN pnpm --filter @commerce-os/domain run build \
 && pnpm --filter @commerce-os/localization run build \
 && pnpm --filter @commerce-os/storefront run build

# ── Stage 2: runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app

# Next standalone monorepo layout: the server entry is
# apps/storefront/server.js with its traced node_modules at the bundle root.
COPY --from=builder --chown=node:node /app/apps/storefront/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/storefront/.next/static ./apps/storefront/.next/static
COPY --from=builder --chown=node:node /app/apps/storefront/public ./apps/storefront/public

# Run as the unprivileged `node` user shipped with the official image.
USER node

EXPOSE 3000

# Liveness: the storefront serves / (busybox wget --spider ships with alpine).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:3000/ || exit 1

CMD ["node", "apps/storefront/server.js"]
