import type { Field } from 'payload'

/** Поля раздела «Careers» (per-site коллекция, бывший глобал). */
export const careersFields: Field[] = [
    {
      name: 'benefits',
      type: 'array',
      localized: true,
      label: 'Преимущества',
      labels: { singular: 'Преимущество', plural: 'Преимущества' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
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
      labels: { singular: 'Вакансия', plural: 'Вакансии' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Должность' },
        { name: 'department', type: 'text', required: true, label: 'Отдел' },
        { name: 'location', type: 'text', required: true, label: 'Локация' },
        { name: 'type', type: 'text', required: true, label: 'Формат занятости' },
        { name: 'applyEmail', type: 'email', required: true, label: 'Email для откликов' },
      ],
    },
  ]
