# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# Commerce OS — Worker (outbox/notification/webhook processor) production image
#
# The build context MUST be the repository root (pnpm workspace), e.g.:
#   docker build -f apps/worker/Dockerfile .
#
# COUPLING NOTE (why the api sources are built here too):
#   apps/worker/src/worker-entrypoint.ts imports the generated Prisma client
#   directly from apps/api ("../../api/src/generated/prisma/client.js"), so
#   `tsc` for the worker compiles that generated client into
#   dist/api/src/generated/prisma/. Therefore the builder must run
#   `prisma generate` (api devDependency: the `prisma` CLI) BEFORE building
#   the worker — hence the extra `--filter @commerce-os/api...` install.
#
# NOTE ON PNPM DEPLOY / HOISTING:
#   Same policy as apps/api/Dockerfile: no `pnpm deploy`, default isolated
#   node-linker (fine on Linux CI), and the runner copies the installed
#   workspace layout verbatim. If building on/for Windows and workspace
#   modules go missing, append `--config.node-linker=hoisted` to the
#   `pnpm install` line below.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

ENV COREPACK_HOME=/corepack
RUN corepack enable && corepack prepare pnpm@12.16.1 --activate

# Placeholder DATABASE_URL so prisma.config.ts validates; `prisma generate`
# never connects to a database and no real .env is baked into the image.
ENV DATABASE_URL="postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder?schema=public"

# 1) Workspace manifests first (cacheable install layer). Every workspace
#    manifest is copied (tiny files) so pnpm's --frozen-lockfile check sees
#    the full importer set; the --filter below limits what is installed.
#    The api manifest matters here because its `prisma` CLI devDependency is
#    needed for `prisma generate` before the worker build.
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

# 2) Install the worker plus the api (its generated client is compiled into
#    the worker bundle; see the coupling note at the top).
RUN pnpm install --frozen-lockfile --filter @commerce-os/api... --filter @commerce-os/worker...

# 3) Copy sources.
COPY tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY apps/worker ./apps/worker

# 4) Build: regenerate the typed Prisma client into apps/api/src/generated,
#    then compile the worker (`tsc`), which pulls that client into
#    apps/worker/dist/api/... exactly like a local `pnpm --filter @commerce-os/worker run build`.
RUN pnpm --filter @commerce-os/api exec prisma generate \
 && pnpm --filter @commerce-os/worker run build

# ── Stage 2: runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV COREPACK_HOME=/corepack

WORKDIR /app

RUN corepack enable

# Recreate the installed pnpm workspace layout (same policy as apps/api).
COPY --from=builder --chown=node:node /corepack /corepack
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=node:node /app/.npmrc ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/packages ./packages

COPY --from=builder --chown=node:node /app/apps/worker/package.json apps/worker/package.json
COPY --from=builder --chown=node:node /app/apps/worker/node_modules apps/worker/node_modules
# dist/ contains both dist/worker-entrypoint.js and the compiled generated
# Prisma client under dist/api/src/generated/prisma/ (relative import).
COPY --from=builder --chown=node:node /app/apps/worker/dist apps/worker/dist

USER node

WORKDIR /app/apps/worker

# No HTTP server, therefore no port and no HTTP healthcheck.
# Process liveness check instead: busybox pgrep matches the full command line
# of the running worker. The `[.]` trick keeps the check from matching the
# healthcheck shell itself (its own cmdline contains the literal pattern).
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD pgrep -f "node dist/worker-entrypoint[.]js" || exit 1

# worker "start" script == `node dist/worker-entrypoint.js`.
CMD ["node", "dist/worker-entrypoint.js"]
