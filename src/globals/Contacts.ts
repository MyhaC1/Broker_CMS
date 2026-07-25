import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'
import { sitePreviewUrl } from '../lib/preview-url'

/** Контракт: cms.contacts — каналы связи и офисы. */
export const Contacts: GlobalConfig = {
  slug: 'contacts',
  label: 'Контакты',
  versions: { drafts: { autosave: { interval: 1000 } } },
  admin: {
    preview: sitePreviewUrl('/company/contacts'),
  },
  hooks: {
    afterChange: [notifyAfterChange(['cms:contacts'])],
  },
  fields: [
    {
      name: 'channels',
      type: 'array',
      localized: true,
      label: 'Каналы связи',
      labels: { singular: 'Канал', plural: 'Каналы' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Канал' },
        { name: 'value', type: 'text', required: true, label: 'Значение (email, телефон…)' },
        { name: 'detail', type: 'text', required: true, label: 'Уточнение' },
      ],
    },
    {
      name: 'offices',
      type: 'array',
      localized: true,
      label: 'Офисы',
      labels: { singular: 'Офис', plural: 'Офисы' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'city', type: 'text', required: true, label: 'Город' },
        { name: 'country', type: 'text', required: true, label: 'Страна' },
        { name: 'address', type: 'text', required: true, label: 'Адрес' },
      ],
    },
  ],
}
