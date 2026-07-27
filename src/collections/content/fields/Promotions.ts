import type { Field } from 'payload'

/** Поля раздела «Promotions» (per-site коллекция, бывший глобал). */
export const promotionsFields: Field[] = [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Акции',
      labels: { singular: 'Акция', plural: 'Акции' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
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
  ]
