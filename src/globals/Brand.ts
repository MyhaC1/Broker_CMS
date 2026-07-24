import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'

/** Контракт: cms.brand — имя, логотип, favicon, акцентный цвет, соцсети. */
export const Brand: GlobalConfig = {
  slug: 'brand',
  label: 'Бренд',
  versions: { drafts: true },
  hooks: {
    afterChange: [notifyAfterChange(['cms:brand'])],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название бренда',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'primaryColor',
      type: 'text',
      required: true,
      defaultValue: '#d4a437',
      label: 'Акцентный цвет (hex)',
      validate: (value: unknown) =>
        typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
          ? true
          : 'Ожидается hex-цвет вида #d4a437',
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Социальные сети',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Название (telegram, youtube…)' },
        { name: 'url', type: 'text', required: true, label: 'Ссылка' },
      ],
    },
  ],
}
