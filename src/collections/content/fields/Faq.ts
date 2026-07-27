import type { Field } from 'payload'

/** Поля раздела «Faq» (per-site коллекция, бывший глобал). */
export const faqFields: Field[] = [
    {
      name: 'sections',
      type: 'array',
      localized: true,
      label: 'Секции',
      labels: { singular: 'Секция', plural: 'Секции' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Заголовок секции' },
        {
          name: 'items',
          type: 'array',
          label: 'Вопросы',
          labels: { singular: 'Вопрос', plural: 'Вопросы' },
          admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
          fields: [
            { name: 'question', type: 'text', required: true, label: 'Вопрос' },
            { name: 'answer', type: 'textarea', required: true, label: 'Ответ' },
          ],
        },
      ],
    },
  ]
