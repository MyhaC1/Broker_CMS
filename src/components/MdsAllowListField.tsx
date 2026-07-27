'use client'

import { useField } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

/**
 * Доступ сайта к инструментам (карточка сайта) — двухпанельный выбор,
 * рассчитанный на вселенную 2000+:
 *   слева  — доступные инструменты MDS: поиск + фильтр по типу, «+» / добавить все найденные;
 *   справа — выбранные: свой поиск + фильтр, «✕» / убрать все найденные.
 * Хранится массивом канонических символов (json-поле instruments).
 * Длинные списки рендерятся порциями (первые MAX_RENDER строк + подсказка
 * уточнить поиск) — DOM не пухнет даже на тысячах инструментов.
 */

interface MdsInstrument {
  symbol: string
  name: string
  group?: string
  icon?: string | null
}

const MAX_RENDER = 300

const panelStyle: React.CSSProperties = {
  flex: '1 1 320px',
  minWidth: 0,
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '8px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-input-bg, var(--theme-elevation-0))',
  color: 'var(--theme-elevation-800)',
  fontSize: '13px',
}

const listStyle: React.CSSProperties = {
  height: '300px',
  overflowY: 'auto',
  border: '1px solid var(--theme-elevation-100)',
  borderRadius: '6px',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 8px',
  fontSize: '13px',
  borderBottom: '1px solid var(--theme-elevation-50)',
}

const rowButtonStyle: React.CSSProperties = {
  marginLeft: 'auto',
  border: '1px solid var(--theme-elevation-200)',
  borderRadius: '4px',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '12px',
  lineHeight: '18px',
  width: '22px',
  flexShrink: 0,
}

const bulkButtonStyle: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-200)',
  borderRadius: '4px',
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '12px',
  padding: '4px 8px',
}

function Icon({ symbol, hasIcon }: { symbol: string; hasIcon: boolean }) {
  if (!hasIcon) {
    return <span style={{ width: '18px', flexShrink: 0 }} aria-hidden />
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/admin-mds/icons/${symbol}.svg`}
      alt=""
      width={18}
      height={18}
      style={{ borderRadius: '50%', flexShrink: 0 }}
      onError={(e) => {
        ;(e.target as HTMLImageElement).style.visibility = 'hidden'
      }}
    />
  )
}

/** Панель со списком: поиск + фильтр по типу + порционный рендер. */
function InstrumentPanel({
  title,
  items,
  groups,
  emptyText,
  actionLabel,
  onAction,
  bulkLabel,
  onBulk,
  extraBadge,
}: {
  title: string
  items: MdsInstrument[]
  groups: string[]
  emptyText: string
  actionLabel: string
  onAction: (symbol: string) => void
  bulkLabel: string
  onBulk: (symbols: string[]) => void
  extraBadge?: (i: MdsInstrument) => string | null
}) {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((i) => {
      if (group && (i.group ?? 'Прочее') !== group) return false
      if (!q) return true
      return i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
    })
  }, [items, query, group])

  const visible = filtered.slice(0, MAX_RENDER)

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
        <strong>{title}</strong>
        <span style={{ color: 'var(--theme-elevation-400)' }}>
          {filtered.length === items.length ? items.length : `${filtered.length} из ${items.length}`}
        </span>
        {filtered.length > 0 && (
          <button
            type="button"
            style={{ ...bulkButtonStyle, marginLeft: 'auto' }}
            onClick={() => onBulk(filtered.map((i) => i.symbol))}
          >
            {bulkLabel} ({filtered.length})
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          type="search"
          placeholder="Поиск: символ или название…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ ...inputStyle, flex: 2 }}
        />
        <select value={group} onChange={(e) => setGroup(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
          <option value="">Все типы</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div style={listStyle}>
        {visible.map((i) => {
          const badge = extraBadge?.(i)
          return (
            <div key={i.symbol} style={rowStyle}>
              <Icon symbol={i.symbol} hasIcon={Boolean(i.icon)} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {i.symbol}
                <span style={{ color: 'var(--theme-elevation-400)' }}> — {i.name}</span>
                {badge && (
                  <span style={{ color: 'var(--theme-error-500, #d93025)', fontSize: '11px' }}>
                    {' '}
                    {badge}
                  </span>
                )}
              </span>
              <button
                type="button"
                title={actionLabel}
                aria-label={`${actionLabel} ${i.symbol}`}
                style={rowButtonStyle}
                onClick={() => onAction(i.symbol)}
              >
                {actionLabel}
              </button>
            </div>
          )
        })}
        {filtered.length > MAX_RENDER && (
          <p style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-400)' }}>
            Показаны первые {MAX_RENDER} из {filtered.length} — уточните поиск или тип
          </p>
        )}
        {filtered.length === 0 && (
          <p style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-400)' }}>
            {emptyText}
          </p>
        )}
      </div>
    </div>
  )
}

export function MdsAllowListField({ path }: { path: string }) {
  const { value, setValue } = useField<string[]>({ path })
  const selected = useMemo(() => new Set(Array.isArray(value) ? value : []), [value])
  const [universe, setUniverse] = useState<MdsInstrument[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/admin-mds/instruments?all=1')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { items?: MdsInstrument[] }) => {
        if (!alive) return
        if (Array.isArray(data.items) && data.items.length > 0) setUniverse(data.items)
        else setFailed(true)
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const bySymbol = useMemo(
    () => new Map((universe ?? []).map((i) => [i.symbol, i])),
    [universe],
  )

  // Доступные = вселенная минус выбранное; выбранные — в порядке вселенной,
  // «осиротевшие» (исчезли из MDS) — в конце с пометкой, их можно убрать
  const available = useMemo(
    () => (universe ?? []).filter((i) => !selected.has(i.symbol)),
    [universe, selected],
  )
  const chosen = useMemo(() => {
    const inUniverse = (universe ?? []).filter((i) => selected.has(i.symbol))
    const orphanSymbols = [...selected].filter((s) => !bySymbol.has(s))
    const orphans: MdsInstrument[] = orphanSymbols.map((s) => ({
      symbol: s,
      name: '?',
      group: 'Нет в MDS',
      icon: null,
    }))
    return [...inUniverse, ...orphans]
  }, [universe, selected, bySymbol])

  const groupsOf = (items: MdsInstrument[]) => [
    ...new Set(items.map((i) => i.group ?? 'Прочее')),
  ]

  const add = (symbols: string[]) => setValue([...new Set([...selected, ...symbols])])
  const remove = (symbols: string[]) => {
    const drop = new Set(symbols)
    setValue([...selected].filter((s) => !drop.has(s)))
  }

  return (
    <div style={{ marginBottom: 'var(--base, 20px)' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>
        Инструменты сайта (доступ из вселенной MDS)
      </label>
      <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        Сайт получает котировки и может ставить на страницы только выбранное здесь.
      </p>

      {failed && (
        <p style={{ fontSize: '12px', color: 'var(--theme-error-500, #d93025)' }}>
          MDS недоступен — список показать нельзя, сохранённый выбор не изменится.
        </p>
      )}
      {!universe && !failed && (
        <p style={{ fontSize: '12px', color: 'var(--theme-elevation-400)' }}>Загрузка вселенной…</p>
      )}

      {universe && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'stretch' }}>
          <InstrumentPanel
            title="Доступные"
            items={available}
            groups={groupsOf(available)}
            emptyText={available.length === 0 ? 'Вся вселенная уже выбрана' : 'Ничего не найдено'}
            actionLabel="+"
            onAction={(s) => add([s])}
            bulkLabel="Добавить все"
            onBulk={add}
          />
          <InstrumentPanel
            title="Выбранные"
            items={chosen}
            groups={groupsOf(chosen)}
            emptyText={
              chosen.length === 0
                ? 'Пока ничего не выбрано — сайт без инструментов'
                : 'Ничего не найдено'
            }
            actionLabel="✕"
            onAction={(s) => remove([s])}
            bulkLabel="Убрать все"
            onBulk={remove}
            extraBadge={(i) => (i.group === 'Нет в MDS' ? '(нет в MDS)' : null)}
          />
        </div>
      )}
    </div>
  )
}
