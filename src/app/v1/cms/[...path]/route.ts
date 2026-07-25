import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { mapArticle } from '@/lib/contract/mappers'
import { RESOURCES } from '@/lib/contract/resources'
import { validateContract } from '@/lib/contract/validate'

/**
 * Контрактные эндпоинты CMS (единственный API, который потребляет сайт):
 *   GET /v1/cms/{resource}?locale=ru|en[&draft=true]   — глобалы
 *   GET /v1/cms/articles?locale=…[&page=N]             — список статей (пагинация)
 *   GET /v1/cms/articles/{slug}?locale=…               — деталка статьи
 * Аутентификация: X-API-Key. Ответ обязан пройти JSON Schema контракта,
 * иначе 500 contract_violation (сайт переживёт это фолбэком — риск R-06).
 * X-Content-Version — updatedAt источника (рекомендация ADR-020).
 */

export const dynamic = 'force-dynamic'

const ARTICLES_PAGE_SIZE = 20

function jsonWithVersion(dto: unknown, version: unknown) {
  return NextResponse.json(dto, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Version': String(version ?? ''),
    },
  })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params
  const url = new URL(request.url)
  const locale: 'ru' | 'en' = url.searchParams.get('locale') === 'en' ? 'en' : 'ru'
  const draft = url.searchParams.get('draft') === 'true'
  const resource = segments[0] ?? ''

  // Публичное исключение: brand?site= читают браузеры (загрузчик темы терминала,
  // в т.ч. ДО логина, когда postMessage-токена ещё нет). Бренд публичен по
  // определению — он виден на публичном сайте; остальной контракт под ключом.
  const isPublicBrand =
    resource === 'brand' && segments.length === 1 && Boolean(url.searchParams.get('site')) && !draft

  const expectedKey = process.env.CMS_API_KEY
  if (!isPublicBrand && expectedKey && request.headers.get('x-api-key') !== expectedKey) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    // Бренд конкретного сайта (мульти-тенантность): /v1/cms/brand?site=<slug>
    // Форма ответа — тот же контракт cms.brand; источник — коллекция sites
    const siteSlug = url.searchParams.get('site')
    if (resource === 'brand' && siteSlug && segments.length === 1) {
      if (!/^[a-z0-9-]{2,32}$/.test(siteSlug)) {
        return NextResponse.json({ error: 'invalid_site' }, { status: 400 })
      }
      const found = await payload.find({
        collection: 'sites',
        where: { slug: { equals: siteSlug } },
        limit: 1,
        depth: 2,
      })
      const site = found.docs[0] as Record<string, any> | undefined
      if (!site) {
        return NextResponse.json({ error: 'unknown_site' }, { status: 404 })
      }
      const dto = RESOURCES.brand!.map(site)
      const check = validateContract('brand', dto)
      if (!check.valid) {
        console.error(`[contract] brand?site=${siteSlug} violates schema:`, check.errors)
        return NextResponse.json({ error: 'contract_violation', details: check.errors }, { status: 500 })
      }
      // Публичная ручка читается браузером терминала с другого origin — CORS открыт
      // (только здесь: публичные данные, только GET)
      return NextResponse.json(dto, {
        headers: {
          'Cache-Control': 'public, max-age=60',
          'X-Content-Version': String(site.updatedAt ?? ''),
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Конфиг тенанта для бэкендов платформы (терминал): /v1/cms/sites/{slug}
    // Под X-API-Key (server-side), НЕ публичный: стартовый баланс и будущие
    // настройки тенанта — не для браузера
    if (resource === 'sites' && segments.length === 2) {
      const slug = segments[1] ?? ''
      if (!/^[a-z0-9-]{2,32}$/.test(slug)) {
        return NextResponse.json({ error: 'invalid_site' }, { status: 400 })
      }
      const found = await payload.find({
        collection: 'sites',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
      })
      const site = found.docs[0] as Record<string, any> | undefined
      if (!site) {
        return NextResponse.json({ error: 'unknown_site' }, { status: 404 })
      }
      return jsonWithVersion(
        {
          slug: String(site.slug),
          name: String(site.name ?? ''),
          demoStartBalanceCents: Number(site.demoStartBalanceCents ?? 1000000),
        },
        site.updatedAt,
      )
    }

    // Деталка статьи: /v1/cms/articles/{slug}
    if (resource === 'articles' && segments.length === 2) {
      const found = await payload.find({
        collection: 'articles',
        where: { slug: { equals: segments[1] } },
        locale,
        draft,
        limit: 1,
      })
      const doc = found.docs[0]
      if (!doc) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 })
      }
      const dto = mapArticle(doc as Record<string, any>)
      const check = validateContract('article', dto)
      if (!check.valid) {
        console.error(`[contract] article/${segments[1]} (${locale}) violates schema:`, check.errors)
        return NextResponse.json({ error: 'contract_violation', details: check.errors }, { status: 500 })
      }
      return jsonWithVersion(dto, (doc as Record<string, any>).updatedAt)
    }

    if (segments.length !== 1) {
      return NextResponse.json({ error: 'unknown_resource' }, { status: 404 })
    }

    // Список статей: коллекция с пагинацией
    if (resource === 'articles') {
      const page = Math.max(1, Number.parseInt(url.searchParams.get('page') ?? '1', 10) || 1)
      const found = await payload.find({
        collection: 'articles',
        locale,
        draft,
        sort: '-publishedAt',
        page,
        limit: ARTICLES_PAGE_SIZE,
      })
      const dto = {
        items: found.docs.map((doc) => mapArticle(doc as Record<string, any>)),
        total: found.totalDocs,
        page: found.page ?? page,
        pageSize: ARTICLES_PAGE_SIZE,
      }
      const check = validateContract('articles', dto)
      if (!check.valid) {
        console.error(`[contract] articles (${locale}) violates schema:`, check.errors)
        return NextResponse.json({ error: 'contract_violation', details: check.errors }, { status: 500 })
      }
      const newest = found.docs[0] as Record<string, any> | undefined
      return jsonWithVersion(dto, newest?.updatedAt)
    }

    const entry = RESOURCES[resource]
    if (!entry) {
      return NextResponse.json({ error: 'unknown_resource' }, { status: 404 })
    }

    const doc = await payload.findGlobal({
      slug: entry.slug as never,
      locale,
      draft,
      depth: 2,
    })

    const dto = entry.map(doc as Record<string, any>)
    const check = validateContract(resource, dto)
    if (!check.valid) {
      console.error(`[contract] ${resource} (${locale}) violates schema:`, check.errors)
      return NextResponse.json(
        { error: 'contract_violation', details: check.errors },
        { status: 500 },
      )
    }

    return jsonWithVersion(dto, (doc as Record<string, any>).updatedAt)
  } catch (error) {
    console.error(`[contract] ${segments.join('/')} (${locale}) failed:`, error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
