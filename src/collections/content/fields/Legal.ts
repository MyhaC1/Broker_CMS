import type { Field } from 'payload'

/** Поля раздела «Legal» (per-site коллекция, бывший глобал). */
export const legalFields: Field[] = [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Документы',
      labels: { singular: 'Документ', plural: 'Документы' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
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
          labels: { singular: 'Раздел', plural: 'Разделы' },
          admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
          fields: [
            { name: 'heading', type: 'text', required: true, label: 'Заголовок' },
            {
              name: 'paragraphsMarkdown',
              type: 'array',
              label: 'Абзацы (Markdown)',
              labels: { singular: 'Абзац', plural: 'Абзацы' },
              admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
              fields: [{ name: 'text', type: 'textarea', required: true, label: 'Абзац' }],
            },
          ],
        },
      ],
    },
  ]
