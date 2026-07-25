import type { CollectionConfig, Field } from 'payload'

import { notifyContentChange } from '../../lib/notify-site'
import { sitePreviewUrl } from '../../lib/preview-url'

/**
 * Фабрика per-site контентных коллекций (мульти-тенантность):
 * бывшие глобалы становятся коллекциями «один документ на сайт».
 * Поле site — связь с реестром sites (unique: у сайта ровно один документ
 * каждого ресурса); контентные поля — те же, что были у глобалов,
 * поэтому мапперы и формы контракта не меняются ни на байт.
 */
export interface SiteContentDef {
  /** Slug коллекции в Payload (множественное/отличное от старого глобала имя) */
  collectionSlug: string
  /** Имя ресурса контракта (cms:<resource> в тегах и URL) */
  resource: string
  label: string
  fields: Field[]
  /** Путь страницы сайта для кнопки Preview */
  previewPath?: string
}

export function makeSiteContentCollection(def: SiteContentDef): CollectionConfig {
  return {
    slug: def.collectionSlug,
    labels: { singular: def.label, plural: def.label },
    admin: {
      useAsTitle: 'site',
      group: 'Контент',
      defaultColumns: ['site', 'updatedAt', '_status'],
      ...(def.previewPath ? { preview: sitePreviewUrl(def.previewPath) } : {}),
    },
    versions: { drafts: true },
    hooks: {
      afterChange: [notifyContentChange(def.resource)],
    },
    fields: [
      {
        name: 'site',
        type: 'relationship',
        relationTo: 'sites',
        required: true,
        // Один документ ресурса на сайт
        unique: true,
        index: true,
        label: 'Сайт',
      },
      ...def.fields,
    ],
  }
}
