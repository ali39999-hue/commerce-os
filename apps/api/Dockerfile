# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# Commerce OS — API (NestJS) production image
#
# The build context MUST be the repository root (pnpm workspace), e.g.:
#   docker build -f apps/api/Dockerfile .
#   (docker-compose.prod.yml already does exactly that.)
#
# NOTE ON PNPM DEPLOY / HOISTING:
#   This image intentionally does NOT use `pnpm deploy`. pnpm's deploy and
#   node_modules hoisting behave differently on Windows dev machines vs
#   Linux CI (symlinked isolated layout vs hoisted layout), which is a
#   common source of "module not found" for workspace packages. This
#   Dockerfile is written for LINUX CI where pnpm's default isolated
#   node-linker works fine: the builder installs with the default linker
#   and the runner copies the exact installed workspace layout verbatim.
#   If you ever have to build this image on/for Windows and hit missing
#   workspace modules, append `--config.node-linker=hoisted` to the
#   `pnpm install` line below.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Corepack ships with node:22 and pins pnpm to the version declared in the
# root package.json ("packageManager": "pnpm@12.16.1").
ENV COREPACK_HOME=/corepack
RUN corepack enable && corepack prepare pnpm@12.16.1 --activate

# prisma.config.ts reads DATABASE_URL from the environment. `prisma generate`
# never opens a DB connection, but the config loader validates the env var,
# so a throwaway placeholder keeps the build hermetic (no real .env is baked
# into the image — .env files are excluded by .dockerignore).
ENV DATABASE_URL="postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder?schema=public"

# 1) Copy workspace manifests first so `pnpm install` is a cached layer.
#    Every workspace manifest is copied (they are tiny): pnpm-lock.yaml has
#    an importer per workspace project, and letting the frozen-lockfile
#    check see the full set avoids importer mismatches. The --filter below
#    still limits what is actually installed.
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

# 2) Install everything the API needs (`@commerce-os/api...` = the api plus
#    its workspace dependencies). Dev dependencies stay installed on
#    purpose: the `prisma` CLI and `tsx` (seed runner) are devDependencies
#    and are required inside the container for `prisma db push` / seeding.
RUN pnpm install --frozen-lockfile --filter @commerce-os/api...

# 3) Copy sources.
COPY tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# 4) Build. The workspace packages must be compiled first: their
#    package.json "types" point to dist/ and `nest build` (tsc) type-checks
#    against them. finance/gateways depend on domain/localization, so the
#    order below is topological. The api build script itself is
#    `prisma generate && nest build` — `prisma generate` writes the typed
#    client into apps/api/src/generated/prisma before nest compiles it.
RUN pnpm --filter @commerce-os/domain run build \
 && pnpm --filter @commerce-os/security run build \
 && pnpm --filter @commerce-os/localization run build \
 && pnpm --filter @commerce-os/finance run build \
 && pnpm --filter @commerce-os/gateways run build \
 && pnpm --filter @commerce-os/api run build

# ── Stage 2: runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV COREPACK_HOME=/corepack

WORKDIR /app

# Enable the pnpm shims while still root (before dropping to `node`), so
# `docker compose exec api pnpm exec prisma db push` works at runtime.
# The /corepack cache copied from the builder makes pnpm available offline.
RUN corepack enable

# Recreate the installed pnpm workspace layout. The relative symlinks inside
# node_modules point back into this exact structure, so everything the build
# produced keeps resolving without `pnpm deploy` or any hoisting tricks.
COPY --from=builder --chown=node:node /corepack /corepack
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=node:node /app/.npmrc ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/packages ./packages

COPY --from=builder --chown=node:node /app/apps/api/package.json apps/api/package.json
COPY --from=builder --chown=node:node /app/apps/api/node_modules apps/api/node_modules
COPY --from=builder --chown=node:node /app/apps/api/dist apps/api/dist
# Prisma schema + migrations (+ seed.ts), needed for db push / migrate / seed.
COPY --from=builder --chown=node:node /app/apps/api/prisma apps/api/prisma
COPY --from=builder --chown=node:node /app/apps/api/prisma.config.ts apps/api/prisma.config.ts

# Run as the unprivileged `node` user shipped with the official image.
USER node

WORKDIR /app/apps/api

EXPOSE 4000

# Liveness: NestJS serves GET /v1/health (global prefix "v1" is set in
# src/main.ts). busybox wget --spider ships with alpine.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:4000/v1/health || exit 1

# api "start" script == `node dist/main.js`.
CMD ["node", "dist/main.js"]
