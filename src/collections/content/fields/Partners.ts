import type { Field } from 'payload'

/** Поля раздела «Partners» (per-site коллекция, бывший глобал). */
export const partnersFields: Field[] = [
    {
      name: 'models',
      type: 'array',
      localized: true,
      label: 'Модели сотрудничества',
      labels: { singular: 'Модель', plural: 'Модели' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Название' },
        { name: 'description', type: 'textarea', required: true, label: 'Описание' },
        {
          name: 'features',
          type: 'array',
          label: 'Преимущества',
          labels: { singular: 'Преимущество', plural: 'Преимущества' },
          admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
          fields: [{ name: 'text', type: 'text', required: true, label: 'Текст' }],
        },
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      localized: true,
      label: 'Уровни вознаграждения',
      labels: { singular: 'Уровень', plural: 'Уровни' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Уровень' },
        { name: 'clients', type: 'text', required: true, label: 'Клиенты' },
        { name: 'share', type: 'text', required: true, label: 'Доля' },
        { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Выделенный' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      localized: true,
      label: 'Шаги подключения',
      labels: { singular: 'Шаг', plural: 'Шаги' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Заголовок' },
        { name: 'text', type: 'text', required: true, label: 'Текст' },
      ],
    },
  ]
