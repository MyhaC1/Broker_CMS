import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { ACTIVE_SITE_COOKIE } from '@/lib/active-site'

/**
 * Выбор рабочего сайта админки: GET /admin-active-site?site=<slug>
 * (кнопка «Редактировать этот сайт» на дашборде). Проверяет, что сайт
 * существует, ставит куку и возвращает в админку.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('site') ?? ''

  // Origin глазами БРАУЗЕРА (урок B-015): в standalone-контейнере url.origin —
  // это 0.0.0.0, редирект туда браузер отвергает
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  const origin = host ? `${proto}://${host}` : url.origin

  const response = NextResponse.redirect(new URL('/admin', origin))

  if (/^[a-z0-9-]{2,32}$/.test(slug)) {
    const payload = await getPayload({ config })
    const found = await payload.find({
      collection: 'sites',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    if (found.docs[0]) {
      response.cookies.set(ACTIVE_SITE_COOKIE, slug, {
        path: '/',
        sameSite: 'lax',
        maxAge: 365 * 24 * 3600,
      })
    }
  } else if (slug === '') {
    // /admin-active-site без параметра — сброс выбора
    response.cookies.delete(ACTIVE_SITE_COOKIE)
  }

  return response
}
