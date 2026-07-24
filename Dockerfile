# Broker CMS — production-образ (Next standalone + Payload).
# Сборка: docker compose build cms   (или docker build -t broker-cms .)

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# На этапе сборки БД не нужна: страницы админки динамические
ENV BUILD_STANDALONE=1
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 payload

COPY --from=build --chown=payload:nodejs /app/.next/standalone ./
COPY --from=build --chown=payload:nodejs /app/.next/static ./.next/static
# Контракт нужен в рантайме: ajv-валидация ответов читает contract/json-schema
COPY --from=build --chown=payload:nodejs /app/contract ./contract

# Каталог медиа (подключается volume'ом)
RUN mkdir -p /app/media && chown payload:nodejs /app/media

USER payload

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
