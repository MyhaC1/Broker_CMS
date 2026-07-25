import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'
import { sitePreviewUrl } from '../lib/preview-url'

/** Контракт: cms.navigation — меню шапки и колонки футера с дисклеймером. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Навигация',
  versions: { drafts: { autosave: { interval: 1000 } } },
  admin: {
    preview: sitePreviewUrl('/'),
  },
  hooks: {
    afterChange: [notifyAfterChange(['cms:navigation'])],
  },
  fields: [
    {
      name: 'header',
      type: 'array',
      localized: true,
      label: 'Меню шапки',
      labels: { singular: 'Пункт меню', plural: 'Пункты меню' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Текст' },
        { name: 'href', type: 'text', required: true, label: 'Ссылка (путь без локали)' },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      localized: true,
      label: 'Колонки футера',
      labels: { singular: 'Колонка', plural: 'Колонки' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Заголовок колонки' },
        {
          name: 'links',
          type: 'array',
          label: 'Ссылки',
          labels: { singular: 'Ссылка', plural: 'Ссылки' },
          admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Текст' },
            { name: 'href', type: 'text', required: true, label: 'Ссылка (путь без локали)' },
          ],
        },
      ],
    },
    {
      name: 'riskWarning',
      type: 'textarea',
      localized: true,
      required: true,
      label: 'Предупреждение о рисках (футер)',
    },
  ],
}
