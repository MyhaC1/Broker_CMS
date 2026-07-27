import { CabinetHome } from './CabinetHome'
import { makeSiteContentCollection } from './factory'
import { academyFields } from './fields/Academy'
import { accountsFields } from './fields/Accounts'
import { careersFields } from './fields/Careers'
import { contactsFields } from './fields/Contacts'
import { faqFields } from './fields/Faq'
import { instrumentsFields } from './fields/Instruments'
import { legalFields } from './fields/Legal'
import { navigationFields } from './fields/Navigation'
import { partnersFields } from './fields/Partners'
import { promotionsFields } from './fields/Promotions'
import { streamsFields } from './fields/Streams'
import { systemStatusFields } from './fields/SystemStatus'

/**
 * Per-site контентные коллекции. Поля — в content/fields/* (чистые
 * field-модули; глобалов больше нет). brand — поля карточки sites;
 * articles — своя коллекция с site-полем.
 */
export const CONTENT_COLLECTIONS = [
  makeSiteContentCollection({
    collectionSlug: 'site-navigation',
    resource: 'navigation',
    label: 'Навигация',
    fields: navigationFields,
    previewPath: '/',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-faq',
    resource: 'faq',
    label: 'FAQ',
    fields: faqFields,
    previewPath: '/education/faq',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-instruments',
    resource: 'instruments',
    label: 'Инструменты',
    fields: instrumentsFields,
    previewPath: '/instruments',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-accounts',
    resource: 'accounts',
    label: 'Типы счетов',
    fields: accountsFields,
    previewPath: '/accounts',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-promotions',
    resource: 'promotions',
    label: 'Акции',
    fields: promotionsFields,
    previewPath: '/promotions',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-partners',
    resource: 'partners',
    label: 'Партнёрам',
    fields: partnersFields,
    previewPath: '/partners',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-academy',
    resource: 'academy',
    label: 'Обучение',
    fields: academyFields,
    previewPath: '/education',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-streams',
    resource: 'streams',
    label: 'Эфиры',
    fields: streamsFields,
    previewPath: '/education/webinars',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-contacts',
    resource: 'contacts',
    label: 'Контакты',
    fields: contactsFields,
    previewPath: '/company/contacts',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-careers',
    resource: 'careers',
    label: 'Карьера',
    fields: careersFields,
    previewPath: '/company/careers',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-legal',
    resource: 'legal',
    label: 'Правовые документы',
    fields: legalFields,
    previewPath: '/legal/privacy',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-system-status',
    resource: 'system-status',
    label: 'Статус сервисов',
    fields: systemStatusFields,
    previewPath: '/status',
  }),
  CabinetHome,
]

/** resource контракта → slug per-site коллекции */
export const RESOURCE_TO_COLLECTION: Record<string, string> = {
  navigation: 'site-navigation',
  faq: 'site-faq',
  instruments: 'site-instruments',
  accounts: 'site-accounts',
  promotions: 'site-promotions',
  partners: 'site-partners',
  academy: 'site-academy',
  streams: 'site-streams',
  contacts: 'site-contacts',
  careers: 'site-careers',
  legal: 'site-legal',
  'system-status': 'site-system-status',
  'cabinet-home': 'site-cabinet-home',
}
