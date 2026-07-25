import type { CollectionConfig } from 'payload'

import { notifySite } from '../lib/notify-site'

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
        // Инвалидация бренда конкретного сайта (тег cms:brand:<slug>)
        void notifySite([`cms:brand:${(doc as { slug?: string }).slug ?? 'unknown'}`])
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
  ],
}
