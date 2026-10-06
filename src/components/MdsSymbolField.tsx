'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

import { loadMdsInstruments, MDS_FAILURE_TEXT, type MdsFailureReason } from '@/lib/admin-mds'

/**
 * Поле «Символ» раздела «Инструменты»: выбор из ДОСТУПА рабочего сайта
 * (пересечение вселенной MDS со списком instruments карточки сайта —
 * прокси /admin-mds/instruments фильтрует сам). При выборе автоматически
 * заполняются name/category/digits соседних полей строки.
 * Списка нет → обычный текстовый ввод (деградация без блокировки).
 *
 * Р-027: раньше здесь стояло `items.length > 0 ? items : null`, а подпись у
 * текстового ввода была одна — «MDS недоступен». Пустой доступ сайта,
 * невыбранный рабочий сайт и действительно мёртвый MDS давали одно и то же
 * сообщение, причём два раза из трёх — неправду. Состояний теперь три, и
 * подпись называет то, что произошло: чинятся они по-разному.
 */

interface MdsInstrument {
  symbol: string
  name: string
  category: string
  digits: number
  icon?: string | null
  /** Метка группы из MDS («Акции — Европа») — группируем как по данным */
  group?: string
}

export function MdsSymbolField({ path }: { path: string }) {
  const { value, setValue } = useField<string>({ path })
  const dispatchFields = useFormFields(([, dispatch]) => dispatch)
  const [items, setItems] = useState<MdsInstrument[] | null>(null)
  const [failure, setFailure] = useState<MdsFailureReason | null>(null)

  useEffect(() => {
    let alive = true
    loadMdsInstruments<MdsInstrument>('/admin-mds/instruments').then((result) => {
      if (!alive) return
      if (result.state === 'ok') setItems(result.items)
      else setFailure(result.reason)
    })
    return () => {
      alive = false
    }
  }, [])

  const rowBase = useMemo(() => path.slice(0, path.lastIndexOf('.') + 1), [path])

  // Группы в порядке появления в каталоге MDS (вселенная растёт — новые
  // группы появляются здесь сами, без правок CMS)
  const groups = useMemo(() => {
    const byGroup = new Map<string, MdsInstrument[]>()
    for (const i of items ?? []) {
      const key = i.group ?? 'Прочее'
      const list = byGroup.get(key)
      if (list) list.push(i)
      else byGroup.set(key, [i])
    }
    return [...byGroup.entries()]
  }, [items])

  const onSelect = (symbol: string) => {
    setValue(symbol)
    const instrument = items?.find((i) => i.symbol === symbol)
    if (instrument && rowBase) {
      dispatchFields({ type: 'UPDATE', path: `${rowBase}name`, value: instrument.name })
      dispatchFields({ type: 'UPDATE', path: `${rowBase}category`, value: instrument.category })
      dispatchFields({ type: 'UPDATE', path: `${rowBase}digits`, value: instrument.digits })
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '4px',
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-input-bg, var(--theme-elevation-0))',
    color: 'var(--theme-elevation-800)',
    fontSize: '13px',
  }

  return (
    <div style={{ marginBottom: 'var(--base, 20px)' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>
        Символ (из вселенной MDS)
      </label>
      {items && items.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Иконка выбранной монеты — из MDS через прокси CMS */}
          {value && items.find((i) => i.symbol === value)?.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/admin-mds/icons/${value}.svg`}
              alt=""
              width={28}
              height={28}
              style={{ flexShrink: 0, borderRadius: '50%' }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          <select
            value={value ?? ''}
            onChange={(e) => onSelect(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          >
            <option value="" disabled>
              — выберите инструмент —
            </option>
            {/* текущее значение, которого больше нет в MDS, не теряем */}
            {value && !items.some((i) => i.symbol === value) && (
              <option value={value}>{value} (нет в MDS)</option>
            )}
            {groups.map(([group, groupItems]) => (
              <optgroup key={group} label={group}>
                {groupItems.map((i) => (
                  <option key={i.symbol} value={i.symbol}>
                    {i.symbol} — {i.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            placeholder="BTCUSD"
            style={inputStyle}
          />
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '11px',
              color: failure ? 'var(--theme-error-500, #d93025)' : 'var(--theme-elevation-400)',
            }}
          >
            {failure
              ? `${MDS_FAILURE_TEXT[failure]} Символ вводится вручную.`
              : items
                ? 'Сайту не разрешён ни один инструмент — добавьте их на карточке сайта. ' +
                  'Символ вводится вручную.'
                : 'Загрузка списка…'}
          </p>
        </>
      )}
    </div>
  )
}
