import type { Field } from 'payload'

/** Поля раздела «SystemStatus» (per-site коллекция, бывший глобал). */
export const systemStatusFields: Field[] = [
    {
      name: 'services',
      type: 'array',
      localized: true,
      label: 'Сервисы',
      labels: { singular: 'Сервис', plural: 'Сервисы' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'serviceId', type: 'text', required: true, label: 'ID (svc-1, quotes-ws…)' },
        { name: 'name', type: 'text', required: true, label: 'Название' },
        { name: 'description', type: 'text', required: true, label: 'Описание' },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: ['operational', 'degraded', 'outage', 'maintenance'],
          defaultValue: 'operational',
          label: 'Статус',
        },
        { name: 'uptime90d', type: 'text', required: true, label: 'Uptime 90 дней' },
      ],
    },
    {
      name: 'incidents',
      type: 'array',
      localized: true,
      label: 'Инциденты',
      labels: { singular: 'Инцидент', plural: 'Инциденты' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
      fields: [
        { name: 'date', type: 'text', required: true, label: 'Дата (YYYY-MM-DD)' },
        { name: 'title', type: 'text', required: true, label: 'Заголовок' },
        { name: 'status', type: 'text', required: true, label: 'Статус (Решено…)' },
        { name: 'text', type: 'textarea', required: true, label: 'Описание' },
      ],
    },
  ]
