/**
 * «Рабочий сайт» админки: выбирается ОДИН раз на дашборде (карточки сайтов),
 * хранится в куке редактора. Все списки контента фильтруются по нему,
 * поле site скрыто из форм и проставляется автоматически.
 * Кука не выбрана → списки контента ПУСТЫЕ (сначала выбери сайт).
 */

export const ACTIVE_SITE_COOKIE = 'cms-active-site'
const SLUG_PATTERN = /^[a-z0-9-]{2,32}$/

interface ReqLike {
  headers?: Headers
  payload?: unknown
}

/** Достаёт slug рабочего сайта из Cookie-заголовка запроса. */
export function activeSiteSlug(headers: Headers | undefined): string | null {
  const cookie = headers?.get('cookie')
  if (!cookie) return null
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ACTIVE_SITE_COOKIE}=([^;]+)`))
  const slug = match?.[1]?.trim()
  return slug && SLUG_PATTERN.test(slug) ? slug : null
}

/** id рабочего сайта (slug из куки → запись реестра). null — не выбран/не найден. */
export async function activeSiteId(req: ReqLike): Promise<string | number | null> {
  const slug = activeSiteSlug(req.headers)
  if (!slug || !req.payload) return null
  const api = req.payload as {
    find: (a: { collection: 'sites'; where: unknown; limit: number; depth: number }) => Promise<{ docs: { id: string | number }[] }>
  }
  const found = await api.find({
    collection: 'sites',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return found.docs[0]?.id ?? null
}

/**
 * baseListFilter контентных коллекций: только документы рабочего сайта.
 * Сайт не выбран → заведомо пустой фильтр (id = -1): контент открывается
 * ПОСЛЕ выбора сайта на дашборде (структура сайтов может различаться).
 */
export async function siteListFilter({ req }: { req: ReqLike }) {
  const id = await activeSiteId(req)
  return { site: { equals: id ?? -1 } }
}

/**
 * beforeValidate-хук: поле site скрыто из формы — проставляем его
 * из рабочего сайта при создании документа.
 */
export async function fillSiteFromActive({
  data,
  req,
}: {
  data?: Record<string, unknown>
  req: ReqLike
}) {
  if (data && (data.site === undefined || data.site === null)) {
    const id = await activeSiteId(req)
    if (id !== null) data.site = id
  }
  return data
}
