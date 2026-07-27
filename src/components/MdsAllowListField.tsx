'use client'

import { useField } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

/**
 * Доступ сайта к инструментам (карточка сайта): чекбоксы по группам
 * вселенной MDS. Выбранное здесь — единственное, что сайт получает
 * от MDS и что можно поставить на страницу «Инструменты».
 * Хранится массивом канонических символов (json-поле instruments).
 */

interface MdsInstrument {
  symbol: string
  name: string
  group?: string
  icon?: string | null
}

export function MdsAllowListField({ path }: { path: string }) {
  const { value, setValue } = useField<string[]>({ path })
  const selected = useMemo(() => new Set(Array.isArray(value) ? value : []), [value])
  const [items, setItems] = useState<MdsInstrument[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/admin-mds/instruments?all=1')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { items?: MdsInstrument[] }) => {
        if (!alive) return
        if (Array.isArray(data.items) && data.items.length > 0) setItems(data.items)
        else setFailed(true)
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [])

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

  const toggle = (symbol: string) => {
    const next = new Set(selected)
    if (next.has(symbol)) next.delete(symbol)
    else next.add(symbol)
    setValue([...next])
  }

  const toggleGroup = (groupItems: MdsInstrument[]) => {
    const all = groupItems.every((i) => selected.has(i.symbol))
    const next = new Set(selected)
    for (const i of groupItems) {
      if (all) next.delete(i.symbol)
      else next.add(i.symbol)
    }
    setValue([...next])
  }

  // Символы, которые были выбраны, но исчезли из вселенной MDS — не теряем
  const orphans = useMemo(() => {
    if (!items) return []
    const universe = new Set(items.map((i) => i.symbol))
    return [...selected].filter((s) => !universe.has(s))
  }, [items, selected])

  return (
    <div style={{ marginBottom: 'var(--base, 20px)' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>
        Инструменты сайта (доступ из вселенной MDS)
      </label>
      <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        Сайт получает котировки и может ставить на страницы только отмеченное здесь.
        Выбрано: {selected.size}
      </p>

      {failed && (
        <p style={{ fontSize: '12px', color: 'var(--theme-error-500, #d93025)' }}>
          MDS недоступен — список показать нельзя, сохранённый выбор не изменится.
        </p>
      )}
      {!items && !failed && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-400)' }}>Загрузка вселенной…</p>
      )}

      {groups.map(([group, groupItems]) => {
        const checkedCount = groupItems.filter((i) => selected.has(i.symbol)).length
        return (
          <fieldset
            key={group}
            style={{
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '10px',
            }}
          >
            <legend style={{ padding: '0 6px', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checkedCount === groupItems.length}
                  ref={(el) => {
                    if (el) el.indeterminate = checkedCount > 0 && checkedCount < groupItems.length
                  }}
                  onChange={() => toggleGroup(groupItems)}
                />
                <strong>{group}</strong>
                <span style={{ color: 'var(--theme-elevation-400)' }}>
                  {checkedCount}/{groupItems.length}
                </span>
              </label>
            </legend>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: '4px 12px',
              }}
            >
              {groupItems.map((i) => (
                <label
                  key={i.symbol}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(i.symbol)}
                    onChange={() => toggle(i.symbol)}
                  />
                  {i.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/admin-mds/icons/${i.symbol}.svg`}
                      alt=""
                      width={18}
                      height={18}
                      style={{ borderRadius: '50%' }}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                  <span>
                    {i.symbol}
                    <span style={{ color: 'var(--theme-elevation-400)' }}> — {i.name}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )
      })}

      {orphans.length > 0 && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
          Больше нет в MDS (останутся в доступе, снять — кликом):{' '}
          {orphans.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              style={{
                marginRight: '6px',
                border: '1px solid var(--theme-elevation-200)',
                borderRadius: '4px',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '1px 6px',
              }}
            >
              {s} ✕
            </button>
          ))}
        </p>
      )}
    </div>
  )
}
