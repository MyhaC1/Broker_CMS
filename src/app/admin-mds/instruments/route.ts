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
 *
 * ФОРМА ОТВЕТА (решение штаба Р-027). Отказ обязан быть отличим от пустоты:
 *
 *   успех → 200 `{ state: 'ok', items: [...] }`  — `items` может быть пуст
 *           законно, и тогда это значит ровно «разрешено ничего» (Р-025);
 *   отказ → 503 `{ state: '<причина>' }`         — ключа `items` НЕТ ВОВСЕ.
 *
 * Было: отказ отдавался как `{ items: [], error: '...' }` с кодом 200, а
 * компонент решал по длине массива. Пустой доступ и мёртвый MDS выглядели
 * одинаково, и отказ соседа читался как «ничего не котируется». Тот же класс,
 * что Р-025, и он живой: этим интерфейсом владелец включает и отключает
 * котировки.
 *
 * Почему при отказе `items` именно ОТСУТСТВУЕТ, а не пуст: пустой массив
 * потребитель прочитает как данные, отсутствие ключа — не прочитает никак
 * (КОНТРАКТЫ.md §5б, «отсутствие прочитать неправильно нельзя»). Код 503 — по
 * той же причине с другой стороны: отказ должен быть виден и тому, кто в тело
 * не заглядывает.
 */
export const dynamic = 'force-dynamic'

interface MdsItem {
  symbol: string
  [key: string]: unknown
}

/** Причины отказа. Пустой доступ сайта сюда НЕ входит — это не отказ. */
type FailureState = 'mds_unavailable' | 'no_active_site' | 'allow_list_unavailable'

function ok(items: MdsItem[]) {
  return NextResponse.json({ state: 'ok', items })
}

function failure(state: FailureState) {
  return NextResponse.json({ state }, { status: 503 })
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
    // `items` не массив — ответ не той формы. Это отказ, а не пустая
    // вселенная: `data.items ?? []` подставлял здесь правдоподобное значение.
    return Array.isArray(data.items) ? data.items : null
  } catch (error) {
    console.warn('[admin-mds] instruments unavailable:', (error as Error).message)
    return null
  }
}

export async function GET(request: Request) {
  const items = await fetchUniverse()
  if (!items) return failure('mds_unavailable')

  const wantAll = new URL(request.url).searchParams.get('all') === '1'
  if (wantAll) return ok(items)

  // Режим «доступ сайта»: фильтр по списку instruments рабочего сайта
  const slug = activeSiteSlug(request.headers)
  if (!slug) return failure('no_active_site')
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
    // Пустой доступ — не отказ, а настройка: `state: 'ok'`, `items: []`.
    // Список прочитан, и он действительно пуст. Назвать это отказом значило
    // бы повторить ту же ошибку с другой стороны: тогда «ещё не настроено»
    // стало бы неотличимо от «не смогли прочитать».
    return ok(items.filter((i) => allowList.has(i.symbol)))
  } catch (error) {
    console.warn('[admin-mds] allow-list resolve failed:', (error as Error).message)
    return failure('allow_list_unavailable')
  }
}
