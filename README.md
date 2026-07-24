# Broker CMS

Самостоятельный CMS-сервис платформы брокера на [Payload CMS 3](https://payloadcms.com) (Next.js 15, Postgres). Управляет контентом маркетингового сайта и отдаёт его по платформенному контракту.

- Админка: `http://localhost:3001/admin`
- Контрактный API (потребляет сайт): `GET /v1/cms/{resource}?locale=ru|en[&draft=true]`, заголовок `X-API-Key`
- Здоровье: `GET /v1/health`

## Архитектурные договорённости

- **Отдельная система = отдельный репозиторий** (ADR-021 сайта): никакого общего кода с сайтом.
- **Канон контракта — JSON Schema + фикстуры** (`contract/`): копия артефактов из `platform-contracts` (генерируются в репо сайта из Zod: `packages/api-client`). CMS валидирует каждый ответ `/v1/cms/*` через ajv — невалидный ответ никогда не уходит (лучше 500: сайт переживёт его фолбэком).
- **Инвалидация кеша сайта** — при публикации хук `afterChange` шлёт подписанный вебхук `POST {SITE_WEBHOOK_URL}` (`X-Signature: sha256=<hex HMAC>`, тело `{event_id, occurred_at, tags}`). Сохранение черновика вебхук не шлёт.
- **Локализация** — `ru` (основная) и `en`, fallback на `ru`; совпадает с локалями сайта.
- `X-Content-Version` в ответах = `updatedAt` источника (ADR-020).

## Запуск

```bash
cp .env.example .env        # заполнить секреты
docker compose up -d db     # Postgres 16 на :5433 (БД broker_cms)
pnpm install
pnpm seed                   # админ + контент из contract/fixtures (ru+en), идемпотентно
pnpm dev                    # http://localhost:3001
```

Проверка контракта:

```bash
curl -H "X-API-Key: $CMS_API_KEY" "http://localhost:3001/v1/cms/brand?locale=ru"
```

Подключение сайта: в окружении сайта задать `CMS_API_URL=http://localhost:3001/v1` и `CMS_API_KEY`; секрет вебхука здесь (`SITE_WEBHOOK_SECRET`) должен совпадать с `CMS_WEBHOOK_SECRET` сайта.

## Структура

```
contract/            # копия платформенного контракта (канон — platform-contracts)
  json-schema/       #   JSON Schema ответов cms.*
  fixtures/          #   эталонные фикстуры (они же seed-данные), 14 ресурсов × ru/en
src/
  globals/           # глобалы Payload (brand, navigation, faq …)
  collections/       # users, media
  lib/contract/      # реестр ресурсов, мапперы Payload→DTO, ajv-валидация
  lib/notify-site.ts # подписанный вебхук инвалидации на сайт
  app/v1/cms/        # контрактные ручки
  seed/              # seed из фикстур
```

## Добавление ресурса контракта

1. Схема уже лежит в `contract/json-schema/cms.<resource>.schema.json` (иначе — сначала в контракт-репо).
2. Глобал или коллекция в `src/globals|collections` с `localized: true` на контентных полях и хуком `notifyAfterChange(['cms:<resource>'])`.
3. Маппер в `src/lib/contract/mappers.ts` (объект собирается явно — схемы с `additionalProperties: false`).
4. Строка в `RESOURCES` (`src/lib/contract/resources.ts`) + сид в `src/seed/index.ts`.

## Команды

| Команда | Что делает |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next dev/сборка/прод на :3001 |
| `pnpm seed` | Первичный администратор + контент из фикстур |
| `pnpm generate:types` | `src/payload-types.ts` из конфига |
| `pnpm generate:importmap` | importMap админки |
| `pnpm typecheck` | tsc --noEmit |
