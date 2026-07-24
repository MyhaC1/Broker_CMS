import type { GlobalConfig } from 'payload'

import { notifyAfterChange } from '../lib/notify-site'

/** Контракт: cms.accounts — типы счетов с тарифами (питает и калькулятор комиссий). */
export const Accounts: GlobalConfig = {
  slug: 'accounts',
  label: 'Типы счетов',
  versions: { drafts: true },
  hooks: {
    afterChange: [notifyAfterChange(['cms:accounts'])],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Тарифные планы',
      fields: [
        // 'id' зарезервирован Payload для строк массива — контрактный id хранится как planId
        { name: 'planId', type: 'text', required: true, label: 'ID плана (standard, pro…)' },
        { name: 'name', type: 'text', required: true, label: 'Название' },
        { name: 'description', type: 'text', required: true, label: 'Описание' },
        { name: 'minDeposit', type: 'text', required: true, label: 'Мин. депозит' },
        { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Выделенный план' },
        {
          name: 'features',
          type: 'array',
          label: 'Характеристики',
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Параметр' },
            { name: 'value', type: 'text', required: true, label: 'Значение' },
          ],
        },
        {
          name: 'pricing',
          type: 'group',
          label: 'Тариф (для калькулятора)',
          fields: [
            { name: 'spreadPips', type: 'number', required: true, min: 0, label: 'Спред, пунктов' },
            { name: 'commissionPerLotRT', type: 'number', required: true, min: 0, label: 'Комиссия $/лот (round-trip)' },
          ],
        },
      ],
    },
  ],
}
