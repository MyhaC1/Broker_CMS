import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'
import { sitePreviewUrl } from '../lib/preview-url'

/** Контракт: cms.legal — правовые документы (privacy, terms, risk-disclosure…). */
export const Legal: GlobalConfig = {
  slug: 'legal',
  label: 'Правовые документы',
  versions: { drafts: true },
  admin: {
    preview: sitePreviewUrl('/legal/privacy'),
  },
  hooks: {
    afterChange: [notifyAfterChange(['cms:legal'])],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Документы',
      fields: [
        { name: 'slug', type: 'text', required: true, label: 'Slug (privacy, terms…)' },
        { name: 'title', type: 'text', required: true, label: 'Название' },
        // Дата «обновлено» — контрактная строка YYYY-MM-DD, без таймзонных сюрпризов
        { name: 'updatedAt', type: 'text', required: true, label: 'Обновлено (YYYY-MM-DD)' },
        { name: 'intro', type: 'textarea', required: true, label: 'Вступление' },
        {
          name: 'sections',
          type: 'array',
          label: 'Разделы',
          fields: [
            { name: 'heading', type: 'text', required: true, label: 'Заголовок' },
            {
              name: 'paragraphsMarkdown',
              type: 'array',
              label: 'Абзацы (Markdown)',
              fields: [{ name: 'text', type: 'textarea', required: true, label: 'Абзац' }],
            },
          ],
        },
      ],
    },
  ],
}
