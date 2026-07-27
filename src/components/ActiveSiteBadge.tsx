import { headers } from 'next/headers'
import React from 'react'

import { activeSiteSlug } from '../lib/active-site'

/** Бейдж рабочего сайта над навигацией админки: всегда видно, что правим. */
export async function ActiveSiteBadge() {
  const requestHeaders = await headers()
  const active = activeSiteSlug(requestHeaders as unknown as Headers)

  return (
    <a
      href="/admin"
      style={{
        display: 'block',
        margin: '0 0 12px',
        padding: '8px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        textDecoration: 'none',
        background: active ? 'var(--theme-success-100)' : 'var(--theme-warning-100)',
        color: 'var(--theme-elevation-800)',
        border: '1px solid var(--theme-elevation-150)',
      }}
      title="Сменить рабочий сайт"
    >
      {active ? (
        <>
          Сайт: <strong>{active}</strong> · сменить
        </>
      ) : (
        <>Рабочий сайт не выбран — выбрать</>
      )}
    </a>
  )
}
