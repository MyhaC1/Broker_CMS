import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { RESOURCE_TO_COLLECTION } from '@/collections/content/index'
import { mapArticle } from '@/lib/contract/mappers'
import { RESOURCE_MAPPERS } from '@/lib/contract/resources'
import { validateContract } from '@/lib/contract/validate'
import { defaultSiteSlug } from '@/lib/notify-site'

/**
 * Контрактные эндпоинты CMS (мульти-тенантные):
 *   GET /v1/cms/{resource}?site=<slug>&locale=ru|en[&draft=true]
 *   GET /v1/cms/articles[?page=N] · /v1/cms/articles/{slug} — то же с ?site=
 *   GET /v1/cms/sites/{slug} — конфиг тенанта (server-side)
 * Без ?site= — сайт по умолчанию (DEFAULT_SITE): обратная совместимость,
 * действующие потребители работают без правок. Формы ответов не менялись.
 * Аутентификация X-API-Key; публичное исключение — brand?site= (тема
 * терминала грузится браузером, в т.ч. до логина).
 */

export const dynamic = 'force-dynamic'

const ARTICLES_PAGE_SIZE = 20
const SITE_SLUG_PATTERN = /^[a-z0-9-]{2,32}$/

function jsonWithVersion(dto: unknown, version: unknown, extra: Record<string, string> = {}) {
  return NextResponse.json(dto, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Version': String(version ?? ''),
      ...extra,
    },
  })
}

function contractViolation(resource: string, siteSlug: string, errors: string[]) {
  console.error(`[contract] ${resource} (site=${siteSlug}) violates schema:`, errors)
  return NextResponse.json({ error: 'contract_violation', details: errors }, { status: 500 })
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
  const siteSlug = url.searchParams.get('site') ?? defaultSiteSlug()

  if (!SITE_SLUG_PATTERN.test(siteSlug)) {
    return NextResponse.json({ error: 'invalid_site' }, { status: 400 })
  }

  // Публичное исключение: бренд читают браузеры (тема терминала до логина)
  const isPublicBrand =
    resource === 'brand' && segments.length === 1 && Boolean(url.searchParams.get('site')) && !draft

  const expectedKey = process.env.CMS_API_KEY
  if (!isPublicBrand && expectedKey && request.headers.get('x-api-key') !== expectedKey) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    // Реестр сайтов нужен всем веткам
    const sites = await payload.find({
      collection: 'sites',
      where: { slug: { equals: segments[0] === 'sites' ? (segments[1] ?? '') : siteSlug } },
      limit: 1,
      depth: 2,
    })
    const site = sites.docs[0] as Record<string, any> | undefined

    // Конфиг тенанта: /v1/cms/sites/{slug} (server-side, под ключом)
    if (resource === 'sites' && segments.length === 2) {
      if (!SITE_SLUG_PATTERN.test(segments[1] ?? '')) {
        return NextResponse.json({ error: 'invalid_site' }, { status: 400 })
      }
      if (!site) return NextResponse.json({ error: 'unknown_site' }, { status: 404 })
      return jsonWithVersion(
        {
          slug: String(site.slug),
          name: String(site.name ?? ''),
          demoStartBalanceCents: Number(site.demoStartBalanceCents ?? 1000000),
        },
        site.updatedAt,
      )
    }

    if (!site) return NextResponse.json({ error: 'unknown_site' }, { status: 404 })

    // Бренд = поля карточки сайта
    if (resource === 'brand' && segments.length === 1) {
      const dto = RESOURCE_MAPPERS.brand!(site)
      const check = validateContract('brand', dto)
      if (!check.valid) return contractViolation('brand', siteSlug, check.errors)
      return jsonWithVersion(dto, site.updatedAt, isPublicBrand
        ? { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=60' }
        : {})
    }

    // Деталка статьи: /v1/cms/articles/{slug}
    if (resource === 'articles' && segments.length === 2) {
      const found = await payload.find({
        collection: 'articles',
        where: { and: [{ site: { equals: site.id } }, { slug: { equals: segments[1] } }] },
        locale,
        draft,
        limit: 1,
      })
      const doc = found.docs[0]
      if (!doc) return NextResponse.json({ error: 'not_found' }, { status: 404 })
      const dto = mapArticle(doc as Record<string, any>)
      const check = validateContract('article', dto)
      if (!check.valid) return contractViolation('article', siteSlug, check.errors)
      return jsonWithVersion(dto, (doc as Record<string, any>).updatedAt)
    }

    if (segments.length !== 1) {
      return NextResponse.json({ error: 'unknown_resource' }, { status: 404 })
    }

    // Список статей сайта
    if (resource === 'articles') {
      const page = Math.max(1, Number.parseInt(url.searchParams.get('page') ?? '1', 10) || 1)
      const found = await payload.find({
        collection: 'articles',
        where: { site: { equals: site.id } },
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
      if (!check.valid) return contractViolation('articles', siteSlug, check.errors)
      const newest = found.docs[0] as Record<string, any> | undefined
      return jsonWithVersion(dto, newest?.updatedAt)
    }

    // Per-site контентные коллекции (бывшие глобалы)
    const collection = RESOURCE_TO_COLLECTION[resource]
    const mapper = RESOURCE_MAPPERS[resource]
    if (!collection || !mapper) {
      return NextResponse.json({ error: 'unknown_resource' }, { status: 404 })
    }

    const found = await payload.find({
      collection: collection as never,
      where: { site: { equals: site.id } },
      locale,
      draft,
      limit: 1,
      depth: 2,
    })
    const doc = found.docs[0] as Record<string, any> | undefined
    if (!doc) {
      return NextResponse.json({ error: 'no_content_for_site' }, { status: 404 })
    }

    const dto = mapper(doc)
    const check = validateContract(resource, dto)
    if (!check.valid) return contractViolation(resource, siteSlug, check.errors)
    return jsonWithVersion(dto, doc.updatedAt)
  } catch (error) {
    console.error(`[contract] ${segments.join('/')} (site=${siteSlug}) failed:`, error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
