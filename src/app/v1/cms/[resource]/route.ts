import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { RESOURCES } from '@/lib/contract/resources'
import { validateContract } from '@/lib/contract/validate'

/**
 * Контрактный эндпоинт CMS: GET /v1/cms/{resource}?locale=ru|en[&draft=true]
 * — единственный API, который потребляет сайт (cmsFetch).
 * Аутентификация: X-API-Key. Ответ обязан пройти JSON Schema контракта,
 * иначе 500 contract_violation (сайт переживёт это фолбэком — риск R-06).
 * X-Content-Version — updatedAt источника (рекомендация ADR-020).
 */

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const expectedKey = process.env.CMS_API_KEY
  if (expectedKey && request.headers.get('x-api-key') !== expectedKey) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { resource } = await params
  const entry = RESOURCES[resource]
  if (!entry) {
    return NextResponse.json({ error: 'unknown_resource' }, { status: 404 })
  }

  const url = new URL(request.url)
  const localeParam = url.searchParams.get('locale')
  const locale: 'ru' | 'en' = localeParam === 'en' ? 'en' : 'ru'
  const draft = url.searchParams.get('draft') === 'true'

  try {
    const payload = await getPayload({ config })
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

    return NextResponse.json(dto, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Version': String((doc as Record<string, any>).updatedAt ?? ''),
      },
    })
  } catch (error) {
    console.error(`[contract] ${resource} (${locale}) failed:`, error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
