import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'

/** Контракт: cms.contacts — каналы связи и офисы. */
export const Contacts: GlobalConfig = {
  slug: 'contacts',
  label: 'Контакты',
  versions: { drafts: true },
  hooks: {
    afterChange: [notifyAfterChange(['cms:contacts'])],
  },
  fields: [
    {
      name: 'channels',
      type: 'array',
      localized: true,
      label: 'Каналы связи',
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
      fields: [
        { name: 'city', type: 'text', required: true, label: 'Город' },
        { name: 'country', type: 'text', required: true, label: 'Страна' },
        { name: 'address', type: 'text', required: true, label: 'Адрес' },
      ],
    },
  ],
}
