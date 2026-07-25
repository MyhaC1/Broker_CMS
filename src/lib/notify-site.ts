import { createHmac, randomUUID } from 'node:crypto'

/**
 * Уведомление сайта об изменении контента: POST /api/revalidate
 * с HMAC-подписью (X-Signature: sha256=<hex>) — контракт спецификации §6.
 * Сайт идемпотентен по event_id и сам душит шторм инвалидаций,
 * поэтому здесь только простые ретраи и fire-and-forget из хука.
 */
export async function notifySite(tags: string[]): Promise<void> {
  const url = process.env.SITE_WEBHOOK_URL
  const secret = process.env.SITE_WEBHOOK_SECRET
  if (!url || !secret) {
    console.warn('[notify-site] skipped: SITE_WEBHOOK_URL / SITE_WEBHOOK_SECRET not set')
    return
  }

  const body = JSON.stringify({
    event_id: randomUUID(),
    occurred_at: new Date().toISOString(),
    tags,
  })
  const signature = 'sha256=' + createHmac('sha256', secret).update(body, 'utf8').digest('hex')

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Signature': signature },
        body,
        signal: AbortSignal.timeout(3_000),
      })
      if (res.ok) {
        console.info(`[notify-site] tags=[${tags.join(',')}] status=${res.status}`)
        return
      }
      console.warn(`[notify-site] attempt ${attempt}: HTTP ${res.status}`)
    } catch (error) {
      console.warn(`[notify-site] attempt ${attempt} failed:`, error)
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1_000))
  }
  console.error(`[notify-site] giving up after 3 attempts, tags=[${tags.join(',')}]`)
}

/**
 * Хук afterChange для глобалов/коллекций: шлёт вебхук при публикации
 * (сохранение черновика не должно инвалидировать прод-кеш сайта).
 *
 * Особый случай — откат версии (POST …/versions/:id): Payload меняет
 * published-контент, но в хук doc приходит со статусом draft, из-за чего
 * вебхук молча пропускался и сайт не узнавал об откате (B-012).
 * Восстановление распознаём по URL запроса и шлём вебхук всегда.
 */
export const notifyAfterChange =
  (tags: string[]) =>
  ({ doc, req }: { doc: Record<string, unknown>; req?: { url?: string | null } }) => {
    const status = doc?._status
    const isVersionRestore = typeof req?.url === 'string' && req.url.includes('/versions/')
    if (!isVersionRestore && status !== undefined && status !== 'published') return doc
    void notifySite(tags)
    return doc
  }
