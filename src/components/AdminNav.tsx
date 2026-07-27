import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import { activeSiteSlug } from '../lib/active-site'
import { ensureSiteSkeleton } from '../lib/site-skeleton'

/**
 * Навигация админки (замена стандартной, задание пользователя):
 * — рабочий сайт не выбран → только Дашборд и «Сайты» (разделы контента
 *   появляются ПОСЛЕ выбора: структура сайтов может различаться);
 * — сайт выбран → разделы ведут НАПРЯМУЮ в документ рабочего сайта
 *   (как раньше глобалы, без промежуточного списка); документа нет →
 *   создаётся черновик-каркас, ссылка всегда рабочая;
 * — «Новости» — единственный список (у статей документов много).
 */

const CONTENT_LINKS: { collection: string; label: string }[] = [
  { collection: 'site-navigation', label: 'Навигация' },
  { collection: 'site-instruments', label: 'Инструменты' },
  { collection: 'site-accounts', label: 'Типы счетов' },
  { collection: 'site-faq', label: 'FAQ' },
  { collection: 'site-promotions', label: 'Акции' },
  { collection: 'site-partners', label: 'Партнёрам' },
  { collection: 'site-academy', label: 'Обучение' },
  { collection: 'site-streams', label: 'Эфиры' },
  { collection: 'site-contacts', label: 'Контакты' },
  { collection: 'site-careers', label: 'Карьера' },
  { collection: 'site-legal', label: 'Правовые документы' },
  { collection: 'site-system-status', label: 'Статус сервисов' },
]

const groupTitle: React.CSSProperties = {
  margin: '16px 0 6px',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--theme-elevation-400)',
}

const link: React.CSSProperties = {
  display: 'block',
  padding: '6px 8px',
  borderRadius: '4px',
  fontSize: '13px',
  color: 'var(--theme-elevation-800)',
  textDecoration: 'none',
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={link}>
      {children}
    </a>
  )
}

export async function AdminNav() {
  const requestHeaders = await headers()
  const active = activeSiteSlug(requestHeaders as unknown as Headers)
  const payload = await getPayload({ config })

  let docIds: Record<string, string | number> = {}
  let siteName: string | null = null

  if (active) {
    const site = await payload.find({
      collection: 'sites',
      where: { slug: { equals: active } },
      limit: 1,
      depth: 0,
    })
    const siteDoc = site.docs[0] as { id: string | number; name?: string } | undefined
    if (siteDoc) {
      siteName = siteDoc.name ?? active
      // Каркас гарантирует, что каждая ссылка ведёт в существующий документ
      docIds = await ensureSiteSkeleton(payload, siteDoc.id)
    }
  }

  return (
    <nav style={{ padding: '12px' }}>
      <a
        href="/admin"
        style={{
          display: 'block',
          marginBottom: '8px',
          padding: '10px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          textDecoration: 'none',
          background: active ? 'var(--theme-success-100)' : 'var(--theme-warning-100)',
          color: 'var(--theme-elevation-800)',
          border: '1px solid var(--theme-elevation-150)',
        }}
      >
        {active ? (
          <>
            Сайт: <strong>{siteName ?? active}</strong>
            <br />
            <span style={{ fontSize: '11px', color: 'var(--theme-elevation-500)' }}>сменить на дашборде</span>
          </>
        ) : (
          <strong>Выберите сайт →</strong>
        )}
      </a>

      <NavLink href="/admin">Дашборд (сайты)</NavLink>
      <NavLink href="/admin/collections/sites">Настройки сайтов</NavLink>

      {active && (
        <>
          <p style={groupTitle}>Контент — {active}</p>
          {CONTENT_LINKS.map((item) =>
            docIds[item.collection] ? (
              <NavLink key={item.collection} href={`/admin/collections/${item.collection}/${docIds[item.collection]}`}>
                {item.label}
              </NavLink>
            ) : null,
          )}
          <NavLink href="/admin/collections/articles">Новости</NavLink>

          <p style={groupTitle}>Кабинет — {active}</p>
          {docIds['site-cabinet-home'] && (
            <NavLink href={`/admin/collections/site-cabinet-home/${docIds['site-cabinet-home']}`}>
              Главная кабинета
            </NavLink>
          )}
        </>
      )}

      <p style={groupTitle}>Система</p>
      <NavLink href="/admin/collections/media">Медиа</NavLink>
      <NavLink href="/admin/collections/users">Пользователи</NavLink>
      <NavLink href="/admin/logout">Выйти</NavLink>
    </nav>
  )
}
