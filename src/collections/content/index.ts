import { Academy } from '../../globals/Academy'
import { Accounts } from '../../globals/Accounts'
import { Careers } from '../../globals/Careers'
import { Contacts } from '../../globals/Contacts'
import { Faq } from '../../globals/Faq'
import { Instruments } from '../../globals/Instruments'
import { Legal } from '../../globals/Legal'
import { Navigation } from '../../globals/Navigation'
import { Partners } from '../../globals/Partners'
import { Promotions } from '../../globals/Promotions'
import { Streams } from '../../globals/Streams'
import { SystemStatus } from '../../globals/SystemStatus'
import { makeSiteContentCollection } from './factory'

/**
 * Per-site контентные коллекции. Определения ПОЛЕЙ переиспользуются из
 * бывших глобалов (src/globals/* остаются как источник полей — сами глобалы
 * из конфига убраны; их hooks/admin фабрика игнорирует).
 * brand НЕ здесь: бренд — поля карточки сайта (коллекция sites).
 * articles НЕ здесь: у статей своя коллекция (site-поле добавлено ей самой).
 */
export const CONTENT_COLLECTIONS = [
  makeSiteContentCollection({
    collectionSlug: 'site-navigation',
    resource: 'navigation',
    label: 'Навигация',
    fields: Navigation.fields,
    previewPath: '/',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-faq',
    resource: 'faq',
    label: 'FAQ',
    fields: Faq.fields,
    previewPath: '/education/faq',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-instruments',
    resource: 'instruments',
    label: 'Инструменты',
    fields: Instruments.fields,
    previewPath: '/instruments',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-accounts',
    resource: 'accounts',
    label: 'Типы счетов',
    fields: Accounts.fields,
    previewPath: '/accounts',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-promotions',
    resource: 'promotions',
    label: 'Акции',
    fields: Promotions.fields,
    previewPath: '/promotions',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-partners',
    resource: 'partners',
    label: 'Партнёрам',
    fields: Partners.fields,
    previewPath: '/partners',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-academy',
    resource: 'academy',
    label: 'Обучение',
    fields: Academy.fields,
    previewPath: '/education',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-streams',
    resource: 'streams',
    label: 'Эфиры',
    fields: Streams.fields,
    previewPath: '/education/webinars',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-contacts',
    resource: 'contacts',
    label: 'Контакты',
    fields: Contacts.fields,
    previewPath: '/company/contacts',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-careers',
    resource: 'careers',
    label: 'Карьера',
    fields: Careers.fields,
    previewPath: '/company/careers',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-legal',
    resource: 'legal',
    label: 'Правовые документы',
    fields: Legal.fields,
    previewPath: '/legal/privacy',
  }),
  makeSiteContentCollection({
    collectionSlug: 'site-system-status',
    resource: 'system-status',
    label: 'Статус сервисов',
    fields: SystemStatus.fields,
    previewPath: '/status',
  }),
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
}
