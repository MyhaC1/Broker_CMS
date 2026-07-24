import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'
import { sitePreviewUrl } from '../lib/preview-url'

/** Контракт: cms.streams — прямые эфиры и записи (YouTube/Vimeo). */
export const Streams: GlobalConfig = {
  slug: 'streams',
  label: 'Эфиры',
  versions: { drafts: true },
  admin: {
    preview: sitePreviewUrl('/education/webinars'),
  },
  hooks: {
    afterChange: [notifyAfterChange(['cms:streams'])],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Эфиры',
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
  ],
}
