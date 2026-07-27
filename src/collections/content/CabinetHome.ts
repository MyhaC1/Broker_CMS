import type { CollectionConfig } from 'payload'

import { fillSiteFromActive, siteListFilter } from '../../lib/active-site'
import { notifyContentChange } from '../../lib/notify-site'

/**
 * Конфиг главной страницы кабинета (ADR-026 сайта): per-site НАБОР МОДУЛЕЙ.
 * Порядок = порядок строк массива (drag в админке); каждый модуль —
 * главный выключатель + группа настроек подпунктов (показывается только
 * для своего типа). Это реестр типизированных модулей, НЕ page-builder.
 * Конфиг не локализуется (тексты модулей живут в словарях кабинета).
 */

const onlyFor = (type: string) => ({
  condition: (_data: unknown, sibling: { type?: string } | undefined) => sibling?.type === type,
})

export const CabinetHome: CollectionConfig = {
  slug: 'site-cabinet-home',
  labels: { singular: 'Главная кабинета', plural: 'Главная кабинета' },
  admin: {
    useAsTitle: 'site',
    group: 'Кабинет',
    defaultColumns: ['site', 'updatedAt', '_status'],
    baseListFilter: siteListFilter,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [notifyContentChange('cabinet-home')],
    beforeValidate: [fillSiteFromActive],
  },
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      unique: true,
      index: true,
      label: 'Сайт',
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'modules',
      type: 'array',
      label: 'Модули (порядок = порядок на странице)',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Модуль',
          options: [
            { label: 'Профиль (аватар, имя, UID, VIP)', value: 'profile' },
            { label: 'Онбординг (шаги нового пользователя)', value: 'onboarding' },
            { label: 'Общая стоимость (баланс + кнопки)', value: 'balance' },
            { label: 'Рынки (котировки из MDS)', value: 'markets' },
            { label: 'Акции', value: 'promotions' },
          ],
        },
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: 'Модуль включён' },
        {
          name: 'steps',
          type: 'group',
          label: 'Шаги онбординга',
          admin: onlyFor('onboarding'),
          fields: [
            { name: 'verification', type: 'checkbox', defaultValue: true, label: 'Верификация' },
            { name: 'deposit', type: 'checkbox', defaultValue: true, label: 'Пополнение счёта' },
            { name: 'firstTrade', type: 'checkbox', defaultValue: true, label: 'Первая сделка' },
          ],
        },
        {
          name: 'buttons',
          type: 'group',
          label: 'Кнопки баланса',
          admin: onlyFor('balance'),
          fields: [
            { name: 'deposit', type: 'checkbox', defaultValue: true, label: 'Ввод' },
            { name: 'withdraw', type: 'checkbox', defaultValue: true, label: 'Вывод' },
            { name: 'buyFiat', type: 'checkbox', defaultValue: true, label: 'Покупка за фиат' },
          ],
        },
        {
          name: 'tabs',
          type: 'group',
          label: 'Табы рынков',
          admin: onlyFor('markets'),
          fields: [
            { name: 'assets', type: 'checkbox', defaultValue: true, label: 'Активы' },
            { name: 'popular', type: 'checkbox', defaultValue: true, label: 'Популярное' },
            { name: 'newListing', type: 'checkbox', defaultValue: true, label: 'Новый листинг' },
            { name: 'favorites', type: 'checkbox', defaultValue: false, label: 'Избранное' },
            { name: 'gainers', type: 'checkbox', defaultValue: true, label: 'Показывают рост' },
            { name: 'volume', type: 'checkbox', defaultValue: true, label: 'Объём за 24ч' },
          ],
        },
        {
          name: 'newListingSymbols',
          type: 'array',
          label: 'Символы «Нового листинга»',
          admin: onlyFor('markets'),
          fields: [{ name: 'symbol', type: 'text', required: true, label: 'Символ (BTCUSD…)' }],
        },
      ],
    },
  ],
}
