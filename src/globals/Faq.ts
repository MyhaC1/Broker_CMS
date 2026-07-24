import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'
import { sitePreviewUrl } from '../lib/preview-url'

/** Контракт: cms.faq — секции вопросов-ответов страницы /education/faq. */
export const Faq: GlobalConfig = {
  slug: 'faq',
  label: 'FAQ',
  versions: { drafts: true },
  admin: {
    preview: sitePreviewUrl('/education/faq'),
  },
  hooks: {
    afterChange: [notifyAfterChange(['cms:faq'])],
  },
  fields: [
    {
      name: 'sections',
      type: 'array',
      localized: true,
      label: 'Секции',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Заголовок секции' },
        {
          name: 'items',
          type: 'array',
          label: 'Вопросы',
          fields: [
            { name: 'question', type: 'text', required: true, label: 'Вопрос' },
            { name: 'answer', type: 'textarea', required: true, label: 'Ответ' },
          ],
        },
      ],
    },
  ],
}
