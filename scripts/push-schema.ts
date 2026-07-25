import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Синхронизация схемы БД с конфигом Payload БЕЗ сида данных
 * (контент, наработанный редакторами, не трогается).
 * В dev-режиме db-postgres сам допушивает недостающие таблицы/колонки.
 * Запуск: pnpm payload run scripts/push-schema.ts
 */
await getPayload({ config })
console.info('[push-schema] schema is in sync')
process.exit(0)
