import type { CollectionConfig } from 'payload'

import { defaultSiteSlug, notifySiteFor } from '../lib/notify-site'

/**
 * Реестр сайтов платформы (мульти-тенантность, ADR-023/024 сайта):
 * slug — канонический идентификатор тенанта (`?site=`) для терминала,
 * кабинетов и будущих страновых сайтов. Бренд per-site отдаётся
 * контрактом `GET /v1/cms/brand?site=<slug>` (форма — та же cms.brand).
 */
export const Sites: CollectionConfig = {
  slug: 'sites',
  labels: { singular: 'Сайт', plural: 'Сайты' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['slug', 'name', 'primaryColor'],
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        // Бренд сайта — поля этой карточки; вебхук самому сайту
        const site = doc as { slug?: string; webhookUrl?: string | null; webhookSecret?: string | null }
        const slug = site.slug ?? 'unknown'
        const tags = [`cms:brand:${slug}`]
        if (slug === defaultSiteSlug()) tags.unshift('cms:brand')
        void notifySiteFor(site, tags)
        return doc
      },
      async ({ doc, operation, req }) => {
        // Новый сайт сразу получает каркас всех разделов (черновики)
        if (operation === 'create') {
          const { ensureSiteSkeleton } = await import('../lib/site-skeleton')
          await ensureSiteSkeleton(req.payload, (doc as { id: string | number }).id)
          console.info(`[sites] skeleton created for ${(doc as { slug?: string }).slug}`)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug (идентификатор тенанта)',
      validate: (value: unknown) =>
        typeof value === 'string' && /^[a-z0-9-]{2,32}$/.test(value)
          ? true
          : 'Ожидается slug вида apex-ru: строчные латинские, цифры, дефис (2–32)',
    },
    { name: 'name', type: 'text', required: true, label: 'Название бренда' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Логотип' },
    { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon' },
    {
      name: 'primaryColor',
      type: 'text',
      required: true,
      defaultValue: '#d4a437',
      label: 'Акцентный цвет (hex)',
      validate: (value: unknown) =>
        typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
          ? true
          : 'Ожидается hex-цвет вида #d4a437',
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Социальные сети',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Название' },
        { name: 'url', type: 'text', required: true, label: 'Ссылка' },
      ],
    },
    {
      name: 'demoStartBalanceCents',
      type: 'number',
      required: true,
      defaultValue: 1000000,
      min: 0,
      label: 'Стартовый демо-баланс, центы',
    },
    {
      name: 'webhookUrl',
      type: 'text',
      label: 'Вебхук сайта (/api/revalidate)',
      admin: { description: 'Пусто — используется SITE_WEBHOOK_URL из окружения' },
    },
    {
      name: 'webhookSecret',
      type: 'text',
      label: 'Секрет вебхука',
      admin: { description: 'Пусто — используется SITE_WEBHOOK_SECRET из окружения' },
    },
  ],
}
