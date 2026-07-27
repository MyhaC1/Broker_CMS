import type { Field } from 'payload'

/** Поля раздела «Academy» (per-site коллекция, бывший глобал). */
export const academyFields: Field[] = [
    {
      name: 'articles',
      type: 'array',
      localized: true,
      label: 'Обучающие статьи',
      labels: { singular: 'Статья', plural: 'Статьи' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'slug', type: 'text', required: true, label: 'Slug' },
        { name: 'title', type: 'text', required: true, label: 'Заголовок' },
        { name: 'excerpt', type: 'textarea', required: true, label: 'Анонс' },
        {
          name: 'level',
          type: 'select',
          required: true,
          options: ['beginner', 'intermediate'],
          label: 'Уровень',
        },
        { name: 'readingMinutes', type: 'number', required: true, min: 1, label: 'Минут чтения' },
        { name: 'bodyMarkdown', type: 'textarea', required: true, label: 'Текст (Markdown)' },
      ],
    },
    {
      name: 'webinars',
      type: 'array',
      localized: true,
      label: 'Вебинары',
      labels: { singular: 'Вебинар', plural: 'Вебинары' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'webinarId', type: 'text', required: true, label: 'ID (web-1…)' },
        { name: 'title', type: 'text', required: true, label: 'Тема' },
        { name: 'speaker', type: 'text', required: true, label: 'Спикер' },
        { name: 'speakerRole', type: 'text', required: true, label: 'Должность спикера' },
        { name: 'startsAt', type: 'date', required: true, label: 'Дата и время', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'durationMinutes', type: 'number', required: true, min: 1, label: 'Длительность, мин' },
        { name: 'level', type: 'text', required: true, label: 'Уровень (текстом)' },
        { name: 'description', type: 'textarea', required: true, label: 'Описание' },
      ],
    },
    {
      name: 'glossary',
      type: 'array',
      localized: true,
      label: 'Глоссарий',
      labels: { singular: 'Термин', plural: 'Термины' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'term', type: 'text', required: true, label: 'Термин' },
        { name: 'definition', type: 'textarea', required: true, label: 'Определение' },
      ],
    },
  ]
