import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'

/** Контракт: cms.system-status — статусы сервисов и журнал инцидентов. */
export const SystemStatus: GlobalConfig = {
  slug: 'system-status',
  label: 'Статус сервисов',
  versions: { drafts: true },
  hooks: {
    afterChange: [notifyAfterChange(['cms:system-status'])],
  },
  fields: [
    {
      name: 'services',
      type: 'array',
      localized: true,
      label: 'Сервисы',
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
      fields: [
        { name: 'date', type: 'text', required: true, label: 'Дата (YYYY-MM-DD)' },
        { name: 'title', type: 'text', required: true, label: 'Заголовок' },
        { name: 'status', type: 'text', required: true, label: 'Статус (Решено…)' },
        { name: 'text', type: 'textarea', required: true, label: 'Описание' },
      ],
    },
  ],
}
