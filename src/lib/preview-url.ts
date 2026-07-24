/**
 * Кнопка Preview в админке: ведёт редактора на сайт через /api/preview —
 * сайт ставит draftMode-куку и начинает запрашивать CMS с draft=true,
 * показывая черновой контент до публикации (этап 3 интеграции сайта).
 */
type PreviewArgs = { locale?: string | null }

export const sitePreviewUrl =
  (path: string) =>
  (_doc: unknown, { locale }: PreviewArgs): string | null => {
    const site = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
    const secret = process.env.SITE_PREVIEW_SECRET
    if (!secret) return null
    const localized = locale === 'en' ? `/en${path === '/' ? '' : path}` : path
    return `${site}/api/preview?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(localized || '/')}`
  }

/** Вариант для коллекций с путём, зависящим от документа (например, /blog/{slug}). */
export const sitePreviewUrlFor =
  (buildPath: (doc: Record<string, any>) => string) =>
  (doc: unknown, { locale }: PreviewArgs): string | null =>
    sitePreviewUrl(buildPath((doc ?? {}) as Record<string, any>))(doc, { locale })
