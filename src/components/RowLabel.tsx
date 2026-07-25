'use client'

import { useRowLabel } from '@payloadcms/ui'

/**
 * Универсальная подпись строки массива в админке: вместо «Feature 01»
 * показывает содержимое строки (первое осмысленное текстовое поле,
 * для пар «параметр — значение» — оба). Порядок ключей — по убыванию
 * «заголовочности» поля в наших глобалах.
 */
const TITLE_KEYS = [
  'label',
  'name',
  'title',
  'question',
  'symbol',
  'term',
  'heading',
  'city',
  'planId',
  'promoId',
  'webinarId',
  'serviceId',
  'videoId',
  'date',
  'slug',
  'text',
] as const

const MAX_LEN = 60

function truncate(s: string): string {
  return s.length > MAX_LEN ? s.slice(0, MAX_LEN - 1) + '…' : s
}

export function ArrayRowLabel() {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()

  let title: string | undefined
  let titleKey: string | undefined
  for (const key of TITLE_KEYS) {
    const v = data?.[key]
    if (typeof v === 'string' && v.trim() !== '') {
      title = v.trim()
      titleKey = key
      break
    }
  }

  if (title === undefined) {
    const n = typeof rowNumber === 'number' ? rowNumber + 1 : 1
    return <span>{`Элемент ${String(n).padStart(2, '0')}`}</span>
  }

  // Пары «параметр — значение» (характеристики тарифов, каналы связи…)
  const value = data?.['value']
  if (titleKey !== 'value' && typeof value === 'string' && value.trim() !== '') {
    return <span>{truncate(`${title} — ${value.trim()}`)}</span>
  }

  return <span>{truncate(title)}</span>
}
