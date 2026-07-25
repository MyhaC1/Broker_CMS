import { createHmac, randomUUID } from 'node:crypto'

/**
 * Вебхуки инвалидации контента: CMS → сайты (спецификация §6).
 * Мульти-тенантность: у каждого сайта свой webhookUrl/webhookSecret
 * (поля карточки sites, фолбэк — env SITE_WEBHOOK_URL/SECRET).
 * Теги: `cms:<resource>:<slug>` всегда; плюс `cms:<resource>` без slug —
 * только для сайта по умолчанию (обратная совместимость текущего сайта).
 */

export function defaultSiteSlug(): string {
  return process.env.DEFAULT_SITE ?? 'apex-ru'
}

async function sendWebhook(url: string, secret: string, tags: string[]): Promise<void> {
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
        console.info(`[notify-site] ${url} tags=[${tags.join(',')}] status=${res.status}`)
        return
      }
      console.warn(`[notify-site] attempt ${attempt}: HTTP ${res.status} (${url})`)
    } catch (error) {
      console.warn(`[notify-site] attempt ${attempt} failed (${url}):`, error)
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1_000))
  }
  console.error(`[notify-site] giving up after 3 attempts, url=${url} tags=[${tags.join(',')}]`)
}

/** Вебхук сайту по умолчанию (env) — используется seed'ом и хуком sites. */
export async function notifySite(tags: string[]): Promise<void> {
  const url = process.env.SITE_WEBHOOK_URL
  const secret = process.env.SITE_WEBHOOK_SECRET
  if (!url || !secret) {
    console.warn('[notify-site] skipped: SITE_WEBHOOK_URL / SITE_WEBHOOK_SECRET not set')
    return
  }
  await sendWebhook(url, secret, tags)
}

interface SiteDoc {
  slug?: string
  webhookUrl?: string | null
  webhookSecret?: string | null
}

/** Вебхук конкретному сайту: его URL/секрет или фолбэк на env. */
export async function notifySiteFor(site: SiteDoc, tags: string[]): Promise<void> {
  const url = site.webhookUrl || process.env.SITE_WEBHOOK_URL
  const secret = site.webhookSecret || process.env.SITE_WEBHOOK_SECRET
  if (!url || !secret) {
    console.warn(`[notify-site] skipped for site=${site.slug}: no webhook url/secret`)
    return
  }
  await sendWebhook(url, secret, tags)
}

type AfterChangeArgs = {
  doc: Record<string, unknown>
  req: { url?: string | null; payload: unknown }
}

/**
 * Хук afterChange per-site контентных коллекций: вебхук ТОМУ сайту,
 * которому принадлежит документ. Публикации и restore-версий (B-012);
 * черновики — нет.
 */
export const notifyContentChange =
  (resource: string) =>
  async ({ doc, req }: AfterChangeArgs) => {
    const status = doc?._status
    const isVersionRestore = typeof req?.url === 'string' && req.url.includes('/versions/')
    if (!isVersionRestore && status !== undefined && status !== 'published') return doc

    try {
      const siteRef = doc.site as { id?: string | number; slug?: string } | string | number
      const payloadApi = req.payload as {
        findByID: (a: { collection: 'sites'; id: string | number; depth?: number }) => Promise<unknown>
      }
      const site =
        typeof siteRef === 'object' && siteRef?.slug
          ? (siteRef as SiteDoc & { slug: string })
          : ((await payloadApi.findByID({
              collection: 'sites',
              id: typeof siteRef === 'object' ? (siteRef.id as string | number) : siteRef,
              depth: 0,
            })) as SiteDoc)

      const slug = site?.slug ?? 'unknown'
      const tags = [`cms:${resource}:${slug}`]
      // Обратная совместимость: сайт по умолчанию слушает теги без slug
      if (slug === defaultSiteSlug()) tags.unshift(`cms:${resource}`)
      void notifySiteFor(site ?? {}, tags)
    } catch (error) {
      console.warn(`[notify-site] failed to resolve site for ${resource}:`, error)
    }
    return doc
  }

/**
 * Старый хук глобалов (файлы глобалов остаются источником полей —
 * их конфиги больше не регистрируются, но импорты должны собираться).
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
