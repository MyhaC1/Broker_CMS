import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { activeSiteSlug } from '@/lib/active-site'

/**
 * Прокси для админки: инструменты MDS.
 *   GET /admin-mds/instruments        — ДОСТУП рабочего сайта (пересечение
 *     вселенной MDS со списком instruments карточки сайта) — для селекта
 *     на странице «Инструменты»: редактор наполняет страницу только тем,
 *     к чему сайт имеет доступ.
 *   GET /admin-mds/instruments?all=1  — вся вселенная MDS — для настройки
 *     доступа на карточке сайта (MdsAllowListField).
 */
export const dynamic = 'force-dynamic'

interface MdsItem {
  symbol: string
  [key: string]: unknown
}

async function fetchUniverse(): Promise<MdsItem[] | null> {
  const base = process.env.MDS_HTTP_URL
  if (!base) return null
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/v1/instruments`, {
      signal: AbortSignal.timeout(3_000),
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { items?: MdsItem[] }
    return data.items ?? []
  } catch (error) {
    console.warn('[admin-mds] instruments unavailable:', (error as Error).message)
    return null
  }
}

export async function GET(request: Request) {
  const items = await fetchUniverse()
  if (!items) return NextResponse.json({ items: [], error: 'mds_unavailable' })

  const wantAll = new URL(request.url).searchParams.get('all') === '1'
  if (wantAll) return NextResponse.json({ items })

  // Режим «доступ сайта»: фильтр по списку instruments рабочего сайта
  const slug = activeSiteSlug(request.headers)
  if (!slug) return NextResponse.json({ items: [], error: 'no_active_site' })
  try {
    const payload = await getPayload({ config })
    const sites = await payload.find({
      collection: 'sites',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const allowed = (sites.docs[0] as { instruments?: unknown } | undefined)?.instruments
    const allowList = Array.isArray(allowed) ? new Set(allowed.map(String)) : new Set<string>()
    return NextResponse.json({
      items: items.filter((i) => allowList.has(i.symbol)),
      // Пустой доступ — подсказка редактору, где его настроить
      ...(allowList.size === 0 ? { error: 'empty_allow_list' } : {}),
    })
  } catch (error) {
    console.warn('[admin-mds] allow-list resolve failed:', (error as Error).message)
    return NextResponse.json({ items: [], error: 'allow_list_unavailable' })
  }
}
