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
  const expectedKey = process.env.CMS_API_KEY
  if (expectedKey && request.headers.get('x-api-key') !== expectedKey) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { path: segments } = await params
  const url = new URL(request.url)
  const locale: 'ru' | 'en' = url.searchParams.get('locale') === 'en' ? 'en' : 'ru'
  const draft = url.searchParams.get('draft') === 'true'
  const resource = segments[0] ?? ''

  try {
    const payload = await getPayload({ config })

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
