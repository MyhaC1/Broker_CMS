import { mapBrand, mapFaq, mapNavigation } from './mappers'

/**
 * Реестр контрактных ресурсов: resource из URL → глобал Payload + маппер.
 * Новый ресурс = глобал/коллекция + маппер + строка здесь
 * (схема контракта уже лежит в contract/json-schema).
 */
export interface ResourceEntry {
  kind: 'global'
  slug: string
  map: (doc: Record<string, any>) => unknown
}

export const RESOURCES: Record<string, ResourceEntry> = {
  brand: { kind: 'global', slug: 'brand', map: mapBrand },
  navigation: { kind: 'global', slug: 'navigation', map: mapNavigation },
  faq: { kind: 'global', slug: 'faq', map: mapFaq },
}
