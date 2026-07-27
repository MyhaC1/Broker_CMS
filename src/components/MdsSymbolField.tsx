'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

/**
 * Поле «Символ» раздела «Инструменты»: выбор из вселенной MDS
 * (что реально стримится) вместо ручного ввода. При выборе автоматически
 * заполняются name/category/digits соседних полей строки.
 * MDS недоступен → обычный текстовый ввод (деградация без блокировки).
 */

interface MdsInstrument {
  symbol: string
  name: string
  category: string
  digits: number
}

export function MdsSymbolField({ path }: { path: string }) {
  const { value, setValue } = useField<string>({ path })
  const dispatchFields = useFormFields(([, dispatch]) => dispatch)
  const [items, setItems] = useState<MdsInstrument[] | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/admin-mds/instruments')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { items?: MdsInstrument[] }) => {
        if (alive) setItems(Array.isArray(data.items) && data.items.length > 0 ? data.items : null)
      })
      .catch(() => {
        if (alive) setItems(null)
      })
    return () => {
      alive = false
    }
  }, [])

  const rowBase = useMemo(() => path.slice(0, path.lastIndexOf('.') + 1), [path])

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
      {items ? (
        <select value={value ?? ''} onChange={(e) => onSelect(e.target.value)} style={inputStyle}>
          <option value="" disabled>
            — выберите инструмент —
          </option>
          {/* текущее значение, которого больше нет в MDS, не теряем */}
          {value && !items.some((i) => i.symbol === value) && (
            <option value={value}>{value} (нет в MDS)</option>
          )}
          {items.map((i) => (
            <option key={i.symbol} value={i.symbol}>
              {i.symbol} — {i.name}
            </option>
          ))}
        </select>
      ) : (
        <>
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            placeholder="BTCUSD"
            style={inputStyle}
          />
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--theme-elevation-400)' }}>
            MDS недоступен — символ вводится вручную
          </p>
        </>
      )}
    </div>
  )
}
