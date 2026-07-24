import {
  mapAcademy,
  mapAccounts,
  mapBrand,
  mapCareers,
  mapContacts,
  mapFaq,
  mapInstruments,
  mapLegal,
  mapNavigation,
  mapPartners,
  mapPromotions,
  mapStreams,
  mapSystemStatus,
} from './mappers'

/**
 * Реестр контрактных ресурсов: resource из URL → источник в Payload + маппер.
 * Все ресурсы — глобалы, кроме articles (коллекция — обрабатывается
 * ручкой отдельно: список с пагинацией + деталка по slug).
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
  instruments: { kind: 'global', slug: 'instruments', map: mapInstruments },
  accounts: { kind: 'global', slug: 'accounts', map: mapAccounts },
  promotions: { kind: 'global', slug: 'promotions', map: mapPromotions },
  partners: { kind: 'global', slug: 'partners', map: mapPartners },
  academy: { kind: 'global', slug: 'academy', map: mapAcademy },
  streams: { kind: 'global', slug: 'streams', map: mapStreams },
  contacts: { kind: 'global', slug: 'contacts', map: mapContacts },
  careers: { kind: 'global', slug: 'careers', map: mapCareers },
  legal: { kind: 'global', slug: 'legal', map: mapLegal },
  'system-status': { kind: 'global', slug: 'system-status', map: mapSystemStatus },
}
