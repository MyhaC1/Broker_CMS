import type { CollectionConfig } from 'payload'

import { siteListFilter } from '../lib/active-site'
import { notifyAfterChange } from '../lib/notify-site'
import { sitePreviewUrlFor } from '../lib/preview-url'

/**
 * Контракт: cms.articles (список с пагинацией) + cms.article (деталка по slug).
 * Единственная коллекция контента: у статей есть жизненный цикл и адресуемость
 * по slug — глобалом их моделировать нельзя.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Статья', plural: 'Статьи' },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    baseListFilter: siteListFilter,
    preview: sitePreviewUrlFor((doc) => `/blog/${doc.slug ?? ''}`),
  },
  versions: { drafts: { autosave: { interval: 1000 } } },
  hooks: {
    afterChange: [notifyAfterChange(['cms:articles'])],
  },
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      index: true,
      label: 'Сайт',
    },
    // slug уникален В ПРЕДЕЛАХ сайта (поиск деталки фильтрует site+slug);
    // глобальный unique снят — одинаковые статьи на разных сайтах легальны
    { name: 'slug', type: 'text', required: true, index: true, label: 'Slug' },
    { name: 'title', type: 'text', required: true, localized: true, label: 'Заголовок' },
    { name: 'excerpt', type: 'textarea', required: true, localized: true, label: 'Анонс' },
    { name: 'category', type: 'text', required: true, label: 'Категория (economy, forex…)' },
    { name: 'source', type: 'text', required: true, localized: true, label: 'Источник' },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      label: 'Дата публикации',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'readingMinutes', type: 'number', required: true, min: 1, label: 'Минут чтения' },
    { name: 'bodyMarkdown', type: 'textarea', required: true, localized: true, label: 'Текст (Markdown)' },
  ],
}
