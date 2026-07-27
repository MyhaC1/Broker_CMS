import type { Field } from 'payload'

/** Поля раздела «Accounts» (per-site коллекция, бывший глобал). */
export const accountsFields: Field[] = [
    {
      name: 'items',
      type: 'array',
      localized: true,
      label: 'Тарифные планы',
      labels: { singular: 'Тарифный план', plural: 'Тарифные планы' },
      admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
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
          labels: { singular: 'Характеристика', plural: 'Характеристики' },
          admin: { components: { RowLabel: '/components/RowLabel#ArrayRowLabel' } },
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
  ]
