# Broker CMS

Самостоятельный CMS-сервис платформы брокера на [Payload CMS 3](https://payloadcms.com) (Next.js 15, Postgres). Управляет контентом маркетингового сайта и отдаёт его по платформенному контракту.

- Админка: `http://localhost:3001/admin`
- Контрактный API (потребляет сайт): `GET /v1/cms/{resource}?locale=ru|en[&draft=true]`, заголовок `X-API-Key`
- Здоровье: `GET /v1/health`

## Архитектурные договорённости

- **Отдельная система = отдельный репозиторий** (ADR-021 сайта): никакого общего кода с сайтом.
- **Канон контракта — JSON Schema + фикстуры** (`contract/`): копия артефактов из `platform-contracts` (генерируются в репо сайта из Zod: `packages/api-client`). CMS валидирует каждый ответ `/v1/cms/*` через ajv — невалидный ответ никогда не уходит (лучше 500: сайт переживёт его фолбэком).
- **Инвалидация кеша сайта** — при публикации хук `afterChange` шлёт подписанный вебхук `POST {SITE_WEBHOOK_URL}` (`X-Signature: sha256=<hex HMAC>`, тело `{event_id, occurred_at, tags}`). Сохранение черновика вебхук не шлёт; **восстановление версии шлёт всегда** (Payload при restore отдаёт в хук `_status: draft`, хотя published-контент меняется — B-012 сайта).
- **Локализация** — `ru` (основная) и `en`, fallback на `ru`; совпадает с локалями сайта.
- `X-Content-Version` в ответах = `updatedAt` источника (ADR-020).
- **Preview** — кнопка Preview в админке ведёт на `{SITE_URL}/api/preview?secret&path`: сайт ставит draftMode-куку и запрашивает CMS с `draft=true` — редактор видит черновик до публикации, обычные посетители — нет. Сохранение черновика вебхук не шлёт.
- **Контрактный тест** — `node scripts/contract-check.mjs` сверяет живые ответы со всеми фикстурами (datetime — по моменту времени; медиа бренда — только форма); гоняется в CI против production-сборки.
- **Схема БД** — прод — ТОЛЬКО миграции: `pnpm migrate:create <name>` при изменении схемы → компоуз-сервис `migrate` накатывает их до старта CMS (db → migrate → cms). ⚠️ **Никогда не смешивать dev-push и миграции в одной БД** (B-016 сайта): на мигрируемой БД seed запускать c `NODE_ENV=production` (push отключён), `push-schema.ts` — только для чисто-dev БД хостового dev-сервера. Смешение вешает мигратор на интерактивном вопросе.
- **Мульти-тенантность (ПОЛНАЯ, 2026-07-25)** — ВСЕ ресурсы контракта per-site: `?site=<slug>` на любом `/v1/cms/*`; без параметра — сайт по умолчанию (`DEFAULT_SITE`, обратная совместимость). Модель: коллекция **sites** = реестр тенантов + бренд (поля карточки) + вебхук-конфиг (webhookUrl/Secret per-site, фолбэк env); бывшие глобалы = **per-site коллекции** `site-*` (один документ на сайт, `unique` по site, drafts/локализация/Preview сохранены; фабрика `collections/content/factory.ts`); статьи — с полем site (slug уникален в пределах сайта). Вебхуки шлются САЙТУ-владельцу документа: теги `cms:<res>:<slug>` (+ `cms:<res>` без slug — только дефолтному сайту). Новая страна = карточка в sites + сид контента, ноль кода.
- **Роли** — `admin` (всё, включая пользователей) и `editor` (весь контент, но не учётки; чужих пользователей не видит, свою роль поднять не может). Роль в JWT (`saveToJWT`).
- **Рабочий сайт админки** — дашборд `/admin` = экран выбора сайта: карточка на сайт (название, slug, создан, интерфейс обновлён, последняя новость) с кнопкой «Редактировать этот сайт»; выбор хранится в куке редактора (`cms-active-site`), все списки контента фильтруются по нему (`admin.baseListFilter`), бейдж над навигацией всегда показывает рабочий сайт. Сброс — ссылкой на дашборде.

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
| `pnpm migrate` / `pnpm migrate:create <name>` / `pnpm migrate:status` | Прод-миграции БД (src/migrations) |
| `node scripts/contract-check.mjs` | Контрактный тест против фикстур (нужна запущенная CMS) |
| `pnpm payload run scripts/push-schema.ts` | Синхронизация схемы БД с конфигом БЕЗ сида (контент редакторов не трогается); нужна после изменения коллекций/глобалов, если БД создавалась раньше |

## UX админки

- Черновики **автосохраняются** (~1 с) во всех глобалах и статьях — правки не теряются при переходе между разделами; вебхук на сайт уходит только по кнопке «Опубликовать».
- Строки массивов подписаны данными строки (общий `src/components/RowLabel.tsx`, зарегистрирован в importMap): «Минимальный депозит — $100» вместо «Feature 01».
