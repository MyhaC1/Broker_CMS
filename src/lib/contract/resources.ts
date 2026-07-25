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
 * Мапперы по ресурсам контракта. Источник данных (per-site коллекция /
 * карточка сайта / коллекция статей) выбирает ручка; формы ответов
 * НЕ ИЗМЕНИЛИСЬ с мульти-тенантностью — те же схемы, те же мапперы.
 */
export const RESOURCE_MAPPERS: Record<string, (doc: Record<string, any>) => unknown> = {
  brand: mapBrand,
  navigation: mapNavigation,
  faq: mapFaq,
  instruments: mapInstruments,
  accounts: mapAccounts,
  promotions: mapPromotions,
  partners: mapPartners,
  academy: mapAcademy,
  streams: mapStreams,
  contacts: mapContacts,
  careers: mapCareers,
  legal: mapLegal,
  'system-status': mapSystemStatus,
}
