import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import { activeSiteSlug } from '../lib/active-site'

/**
 * Дашборд админки = экран выбора рабочего сайта (задание пользователя):
 * карточка на сайт — название, slug, дата создания, «интерфейс обновлён»,
 * «последняя новость» — и кнопка выбора. После выбора все списки контента
 * фильтруются по рабочему сайту (baseListFilter).
 */

function fmt(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })
}

const card: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '8px',
  padding: '20px',
  background: 'var(--theme-elevation-50)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: '280px',
  maxWidth: '360px',
}

export async function SiteDashboard() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const active = activeSiteSlug(requestHeaders as unknown as Headers)

  const sites = await payload.find({ collection: 'sites', limit: 50, depth: 0, sort: 'createdAt' })

  const cards = await Promise.all(
    sites.docs.map(async (site) => {
      const s = site as Record<string, any>
      // «Интерфейс обновлён» = свежайший из конфигов внешнего вида сайта
      const [home, nav, article] = await Promise.all([
        payload.find({
          collection: 'site-cabinet-home',
          where: { site: { equals: s.id } },
          limit: 1,
          depth: 0,
          sort: '-updatedAt',
        }),
        payload.find({
          collection: 'site-navigation',
          where: { site: { equals: s.id } },
          limit: 1,
          depth: 0,
          sort: '-updatedAt',
        }),
        payload.find({
          collection: 'articles',
          where: { site: { equals: s.id } },
          limit: 1,
          depth: 0,
          sort: '-createdAt',
        }),
      ])
      const interfaceUpdated = [s.updatedAt, home.docs[0]?.updatedAt, nav.docs[0]?.updatedAt]
        .filter(Boolean)
        .map((d) => new Date(d as string).getTime())
        .sort((a, b) => b - a)[0]

      return {
        slug: String(s.slug),
        name: String(s.name ?? s.slug),
        createdAt: s.createdAt as string,
        interfaceUpdated: interfaceUpdated ? new Date(interfaceUpdated) : null,
        lastArticle: (article.docs[0] as Record<string, any> | undefined)?.createdAt ?? null,
      }
    }),
  )

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ marginBottom: '4px' }}>Сайты платформы</h1>
      <p style={{ color: 'var(--theme-elevation-500)', marginBottom: '24px' }}>
        Выберите сайт — все разделы контента будут показывать только его.
        {active ? ` Сейчас редактируется: ${active}.` : ' Рабочий сайт не выбран.'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {cards.map((site) => (
          <div key={site.slug} style={{ ...card, ...(site.slug === active ? { borderColor: 'var(--theme-success-500)' } : {}) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '18px' }}>{site.name}</strong>
              <code style={{ fontSize: '12px', color: 'var(--theme-elevation-500)' }}>{site.slug}</code>
            </div>
            <span style={{ fontSize: '13px' }}>Создан: {fmt(site.createdAt)}</span>
            <span style={{ fontSize: '13px' }}>Интерфейс обновлён: {fmt(site.interfaceUpdated)}</span>
            <span style={{ fontSize: '13px' }}>Последняя новость: {fmt(site.lastArticle)}</span>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              {site.slug === active ? (
                <span style={{ color: 'var(--theme-success-500)', fontWeight: 600 }}>✓ редактируется</span>
              ) : (
                <a
                  href={`/admin-active-site?site=${site.slug}`}
                  style={{
                    background: 'var(--theme-elevation-800)',
                    color: 'var(--theme-elevation-0)',
                    padding: '8px 14px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '13px',
                  }}
                >
                  Редактировать этот сайт
                </a>
              )}
              <a href={`/admin/collections/sites?where[slug][equals]=${site.slug}`} style={{ fontSize: '13px' }}>
                настройки
              </a>
            </div>
          </div>
        ))}
      </div>
      {active && (
        <p style={{ marginTop: '20px', fontSize: '13px' }}>
          <a href="/admin-active-site">Сбросить выбор (показывать все сайты)</a>
        </p>
      )}
    </div>
  )
}
