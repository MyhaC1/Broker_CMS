import type { Field } from 'payload'

/** Поля раздела «Streams» (per-site коллекция, бывший глобал). */
export const streamsFields: Field[] = [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Эфиры',
      labels: { singular: 'Эфир', plural: 'Эфиры' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        {
          name: 'provider',
          type: 'select',
          required: true,
          options: ['youtube', 'vimeo'],
          defaultValue: 'youtube',
          label: 'Платформа',
        },
        { name: 'videoId', type: 'text', required: true, label: 'ID видео' },
        { name: 'title', type: 'text', required: true, label: 'Название' },
        { name: 'poster', type: 'upload', relationTo: 'media', label: 'Постер' },
        { name: 'startsAt', type: 'date', required: true, label: 'Дата и время', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: ['live', 'upcoming', 'past'],
          label: 'Статус',
        },
      ],
    },
  ]
