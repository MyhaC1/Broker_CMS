import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'
import { sitePreviewUrl } from '../lib/preview-url'

/** Контракт: cms.instruments — торговые инструменты (allow-list для WS-подписок сайта). */
export const Instruments: GlobalConfig = {
  slug: 'instruments',
  label: 'Инструменты',
  versions: { drafts: { autosave: { interval: 1000 } } },
  admin: {
    preview: sitePreviewUrl('/instruments'),
  },
  hooks: {
    afterChange: [notifyAfterChange(['cms:instruments'])],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Инструменты',
      labels: { singular: 'Инструмент', plural: 'Инструменты' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'symbol', type: 'text', required: true, label: 'Символ (EURUSD…)' },
        { name: 'name', type: 'text', required: true, label: 'Название' },
        {
          name: 'category',
          type: 'select',
          required: true,
          label: 'Категория',
          options: ['forex', 'metals', 'crypto', 'indices', 'stocks', 'energy'],
        },
        { name: 'digits', type: 'number', required: true, min: 0, max: 8, label: 'Знаков после запятой' },
        { name: 'leverageMax', type: 'text', required: true, label: 'Макс. плечо (1:500)' },
        { name: 'spreadFrom', type: 'text', required: true, label: 'Спред от' },
        { name: 'swapFree', type: 'checkbox', defaultValue: true, label: 'Своп-фри' },
        { name: 'icon', type: 'upload', relationTo: 'media', label: 'Иконка' },
      ],
    },
  ],
}
