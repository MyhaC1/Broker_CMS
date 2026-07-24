import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'
import { sitePreviewUrl } from '../lib/preview-url'

/** Контракт: cms.partners — партнёрская программа (модели, уровни, шаги). */
export const Partners: GlobalConfig = {
  slug: 'partners',
  label: 'Партнёрам',
  versions: { drafts: true },
  admin: {
    preview: sitePreviewUrl('/partners'),
  },
  hooks: {
    afterChange: [notifyAfterChange(['cms:partners'])],
  },
  fields: [
    {
      name: 'models',
      type: 'array',
      localized: true,
      label: 'Модели сотрудничества',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Название' },
        { name: 'description', type: 'textarea', required: true, label: 'Описание' },
        {
          name: 'features',
          type: 'array',
          label: 'Преимущества',
          fields: [{ name: 'text', type: 'text', required: true, label: 'Текст' }],
        },
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      localized: true,
      label: 'Уровни вознаграждения',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Уровень' },
        { name: 'clients', type: 'text', required: true, label: 'Клиенты' },
        { name: 'share', type: 'text', required: true, label: 'Доля' },
        { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Выделенный' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      localized: true,
      label: 'Шаги подключения',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Заголовок' },
        { name: 'text', type: 'text', required: true, label: 'Текст' },
      ],
    },
  ],
}
