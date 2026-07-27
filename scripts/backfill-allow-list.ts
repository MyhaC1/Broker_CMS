import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Одноразовый бэкфилл доступа (ADR-027, allow-list per site):
 * сайтам без списка instruments включаем всю ТЕКУЩУЮ вселенную MDS
 * (то, что они и так показывали до введения доступа) — поведение
 * не меняется. Новые сайты создаются с пустым доступом (осознанный выбор).
 *
 * Запуск (на мигрированной БД — NODE_ENV=production, B-016):
 *   pnpm payload run scripts/backfill-allow-list.ts
 */

const base = process.env.MDS_HTTP_URL ?? 'http://localhost:3003'
const res = await fetch(`${base.replace(/\/$/, '')}/v1/instruments`)
if (!res.ok) throw new Error(`MDS /v1/instruments: HTTP ${res.status}`)
const universe = ((await res.json()) as { items: { symbol: string }[] }).items.map((i) => i.symbol)
console.info(`[backfill] вселенная MDS: ${universe.length} символов`)

const payload = await getPayload({ config })
const sites = await payload.find({ collection: 'sites', limit: 100, depth: 0 })
for (const site of sites.docs as { id: string | number; slug: string; instruments?: unknown }[]) {
  if (Array.isArray(site.instruments) && site.instruments.length > 0) {
    console.info(`[backfill] ${site.slug}: уже настроен (${site.instruments.length}) — пропуск`)
    continue
  }
  await payload.update({ collection: 'sites', id: site.id, data: { instruments: universe } })
  console.info(`[backfill] ${site.slug}: доступ = вся вселенная (${universe.length})`)
}
process.exit(0)
