import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'

/** Контракт: cms.careers — преимущества и вакансии. */
export const Careers: GlobalConfig = {
  slug: 'careers',
  label: 'Карьера',
  versions: { drafts: true },
  hooks: {
    afterChange: [notifyAfterChange(['cms:careers'])],
  },
  fields: [
    {
      name: 'benefits',
      type: 'array',
      localized: true,
      label: 'Преимущества',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Заголовок' },
        { name: 'text', type: 'text', required: true, label: 'Текст' },
      ],
    },
    {
      name: 'vacancies',
      type: 'array',
      localized: true,
      label: 'Вакансии',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Должность' },
        { name: 'department', type: 'text', required: true, label: 'Отдел' },
        { name: 'location', type: 'text', required: true, label: 'Локация' },
        { name: 'type', type: 'text', required: true, label: 'Формат занятости' },
        { name: 'applyEmail', type: 'email', required: true, label: 'Email для откликов' },
      ],
    },
  ],
}
