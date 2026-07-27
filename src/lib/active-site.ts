/**
 * «Рабочий сайт» админки: выбирается ОДИН раз на дашборде (карточки сайтов),
 * хранится в куке редактора; все списки контента фильтруются по нему
 * (admin.baseListFilter). Кука пустая/битая → списки без фильтра.
 */

export const ACTIVE_SITE_COOKIE = 'cms-active-site'
const SLUG_PATTERN = /^[a-z0-9-]{2,32}$/

/** Достаёт slug рабочего сайта из Cookie-заголовка запроса. */
export function activeSiteSlug(headers: Headers | undefined): string | null {
  const cookie = headers?.get('cookie')
  if (!cookie) return null
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ACTIVE_SITE_COOKIE}=([^;]+)`))
  const slug = match?.[1]?.trim()
  return slug && SLUG_PATTERN.test(slug) ? slug : null
}

/** baseListFilter контентных коллекций: показывать только рабочий сайт. */
export function siteListFilter({ req }: { req: { headers?: Headers } }) {
  const slug = activeSiteSlug(req.headers)
  return slug ? { 'site.slug': { equals: slug } } : null
}
