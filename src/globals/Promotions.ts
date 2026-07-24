import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'

/** Контракт: cms.promotions — акции и бонусы. */
export const Promotions: GlobalConfig = {
  slug: 'promotions',
  label: 'Акции',
  versions: { drafts: true },
  hooks: {
    afterChange: [notifyAfterChange(['cms:promotions'])],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Акции',
      fields: [
        { name: 'promoId', type: 'text', required: true, label: 'ID акции (promo-1…)' },
        { name: 'badge', type: 'text', required: true, label: 'Бейдж' },
        { name: 'title', type: 'text', required: true, label: 'Заголовок' },
        { name: 'description', type: 'textarea', required: true, label: 'Описание' },
        { name: 'terms', type: 'textarea', required: true, label: 'Условия' },
        { name: 'ctaLabel', type: 'text', required: true, label: 'Кнопка: текст' },
        { name: 'ctaHref', type: 'text', required: true, label: 'Кнопка: ссылка' },
        { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Главная акция' },
        { name: 'activeFrom', type: 'date', label: 'Активна с' },
        { name: 'activeTo', type: 'date', label: 'Активна до' },
      ],
    },
  ],
}
