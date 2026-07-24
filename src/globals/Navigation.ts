import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'

/** Контракт: cms.navigation — меню шапки и колонки футера с дисклеймером. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Навигация',
  versions: { drafts: true },
  hooks: {
    afterChange: [notifyAfterChange(['cms:navigation'])],
  },
  fields: [
    {
      name: 'header',
      type: 'array',
      localized: true,
      label: 'Меню шапки',
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
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Заголовок колонки' },
        {
          name: 'links',
          type: 'array',
          label: 'Ссылки',
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
