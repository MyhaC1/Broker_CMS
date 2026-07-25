import 'dotenv/config'

import { readFileSync } from 'node:fs'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Seed мульти-тенантной CMS из эталонных фикстур контракта:
 * админ+редактор, сайт по умолчанию (apex-ru), per-site контентные
 * документы (12 ресурсов × ru/en) и статьи сайта.
 * Идемпотентен. На мигрируемой БД запускать с NODE_ENV=production (B-016).
 */

type Locale = 'ru' | 'en'
const LOCALES: Locale[] = ['ru', 'en']
const SITE_SLUG = process.env.DEFAULT_SITE ?? 'apex-ru'

function fixture(resource: string, locale: Locale): any {
  const file = path.join(process.cwd(), 'contract', 'fixtures', `cms.${resource}.${locale}.json`)
  return JSON.parse(readFileSync(file, 'utf8'))
}

const payload = await getPayload({ config })

/* ---------------------------------------------------------------- */
/* 1. Пользователи                                                    */
/* ---------------------------------------------------------------- */
async function ensureUser(email: string, password: string, role: 'admin' | 'editor') {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existing.totalDocs === 0) {
    await payload.create({ collection: 'users', data: { email, password, role } })
    console.info(`[seed] user created: ${email} (${role})`)
  } else {
    console.info(`[seed] user already exists: ${email}`)
  }
}

await ensureUser(
  process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com',
  process.env.SEED_ADMIN_PASSWORD ?? 'admin1234',
  'admin',
)
await ensureUser(
  process.env.SEED_EDITOR_EMAIL ?? 'editor@example.com',
  process.env.SEED_EDITOR_PASSWORD ?? 'editor1234',
  'editor',
)

/* ---------------------------------------------------------------- */
/* 2. Сайт по умолчанию (бренд — поля карточки)                       */
/* ---------------------------------------------------------------- */
const brandRu = fixture('brand', 'ru')
const existingSite = await payload.find({
  collection: 'sites',
  where: { slug: { equals: SITE_SLUG } },
  limit: 1,
})
let siteId = existingSite.docs[0]?.id
if (siteId === undefined) {
  const created = await payload.create({
    collection: 'sites',
    data: {
      slug: SITE_SLUG,
      name: brandRu.name,
      primaryColor: brandRu.primaryColor,
      socials: brandRu.socials,
      demoStartBalanceCents: 1000000,
    } as never,
  })
  siteId = created.id
  console.info(`[seed] site created: ${SITE_SLUG}`)
} else {
  console.info(`[seed] site already exists: ${SITE_SLUG}`)
}

/* ---------------------------------------------------------------- */
/* 3. Per-site контент: фикстура → данные документа                   */
/* ---------------------------------------------------------------- */
const CONTENT_BUILDERS: Record<string, { collection: string; build: (f: any) => Record<string, unknown> }> = {
  navigation: {
    collection: 'site-navigation',
    build: (f) => ({ header: f.header, footerColumns: f.footer.columns, riskWarning: f.footer.riskWarning }),
  },
  faq: { collection: 'site-faq', build: (f) => ({ sections: f.sections }) },
  instruments: {
    collection: 'site-instruments',
    build: (f) => ({
      items: f.items.map((i: any) => ({
        symbol: i.symbol,
        name: i.name,
        category: i.category,
        digits: i.digits,
        leverageMax: i.leverageMax,
        spreadFrom: i.spreadFrom,
        swapFree: i.swapFree,
      })),
    }),
  },
  accounts: {
    collection: 'site-accounts',
    build: (f) => ({
      items: f.items.map((p: any) => ({
        planId: p.id,
        name: p.name,
        description: p.description,
        minDeposit: p.minDeposit,
        featured: p.featured,
        features: p.features,
        pricing: p.pricing,
      })),
    }),
  },
  promotions: {
    collection: 'site-promotions',
    build: (f) => ({
      items: f.items.map((p: any) => ({
        promoId: p.id,
        badge: p.badge,
        title: p.title,
        description: p.description,
        terms: p.terms,
        ctaLabel: p.ctaLabel,
        ctaHref: p.ctaHref,
        featured: p.featured,
        ...(p.activeFrom ? { activeFrom: p.activeFrom } : {}),
        ...(p.activeTo ? { activeTo: p.activeTo } : {}),
      })),
    }),
  },
  partners: {
    collection: 'site-partners',
    build: (f) => ({
      models: f.models.map((m: any) => ({
        name: m.name,
        description: m.description,
        features: m.features.map((text: string) => ({ text })),
      })),
      tiers: f.tiers.map((t: any) => ({
        name: t.name,
        clients: t.clients,
        share: t.share,
        featured: t.featured ?? false,
      })),
      steps: f.steps,
    }),
  },
  academy: {
    collection: 'site-academy',
    build: (f) => ({
      articles: f.articles,
      webinars: f.webinars.map((w: any) => ({
        webinarId: w.id,
        title: w.title,
        speaker: w.speaker,
        speakerRole: w.speakerRole,
        startsAt: w.startsAt,
        durationMinutes: w.durationMinutes,
        level: w.level,
        description: w.description,
      })),
      glossary: f.glossary,
    }),
  },
  streams: {
    collection: 'site-streams',
    build: (f) => ({
      items: f.items.map((s: any) => ({
        provider: s.provider,
        videoId: s.videoId,
        title: s.title,
        startsAt: s.startsAt,
        status: s.status,
      })),
    }),
  },
  contacts: { collection: 'site-contacts', build: (f) => ({ channels: f.channels, offices: f.offices }) },
  careers: { collection: 'site-careers', build: (f) => ({ benefits: f.benefits, vacancies: f.vacancies }) },
  legal: {
    collection: 'site-legal',
    build: (f) => ({
      items: f.items.map((d: any) => ({
        slug: d.slug,
        title: d.title,
        updatedAt: d.updatedAt,
        intro: d.intro,
        sections: d.sections.map((s: any) => ({
          heading: s.heading,
          paragraphsMarkdown: s.paragraphsMarkdown.map((text: string) => ({ text })),
        })),
      })),
    }),
  },
  'system-status': {
    collection: 'site-system-status',
    build: (f) => ({
      services: f.services.map((s: any) => ({
        serviceId: s.id,
        name: s.name,
        description: s.description,
        status: s.status,
        uptime90d: s.uptime90d,
      })),
      incidents: f.incidents,
    }),
  },
  'cabinet-home': {
    collection: 'site-cabinet-home',
    build: (f) => ({
      modules: f.modules.map((m: any) => ({
        type: m.type,
        enabled: m.enabled,
        ...(m.steps ? { steps: m.steps } : {}),
        ...(m.buttons ? { buttons: m.buttons } : {}),
        ...(m.tabs ? { tabs: m.tabs } : {}),
        ...(m.newListingSymbols
          ? { newListingSymbols: m.newListingSymbols.map((symbol: string) => ({ symbol })) }
          : {}),
      })),
    }),
  },
}

for (const [resource, def] of Object.entries(CONTENT_BUILDERS)) {
  const existing = await payload.find({
    collection: def.collection as never,
    where: { site: { equals: siteId } },
    limit: 1,
  })
  let docId = (existing.docs[0] as { id?: string | number } | undefined)?.id

  for (const locale of LOCALES) {
    const data = { ...def.build(fixture(resource, locale)), site: siteId, _status: 'published' }
    if (docId === undefined) {
      const created = await payload.create({
        collection: def.collection as never,
        locale,
        data: data as never,
      })
      docId = (created as { id: string | number }).id
    } else {
      await payload.update({
        collection: def.collection as never,
        id: docId,
        locale,
        data: data as never,
      })
    }
  }
}
console.info(`[seed] per-site content seeded for ${SITE_SLUG}: ${Object.keys(CONTENT_BUILDERS).join(', ')}`)

/* ---------------------------------------------------------------- */
/* 4. Статьи сайта: upsert по (site, slug)                            */
/* ---------------------------------------------------------------- */
const articlesRu = fixture('articles', 'ru').items
const articlesEn = fixture('articles', 'en').items
for (const ru of articlesRu) {
  const en = articlesEn.find((a: any) => a.slug === ru.slug)
  const shared = {
    site: siteId,
    slug: ru.slug,
    category: ru.category,
    publishedAt: ru.publishedAt,
    readingMinutes: ru.readingMinutes,
  }
  const localizedRu = { title: ru.title, excerpt: ru.excerpt, source: ru.source, bodyMarkdown: ru.bodyMarkdown }

  const found = await payload.find({
    collection: 'articles',
    where: { and: [{ site: { equals: siteId } }, { slug: { equals: ru.slug } }] },
    limit: 1,
  })
  let id = found.docs[0]?.id
  if (id === undefined) {
    const created = await payload.create({
      collection: 'articles',
      locale: 'ru',
      data: { ...shared, ...localizedRu, _status: 'published' } as never,
    })
    id = created.id
  } else {
    await payload.update({
      collection: 'articles',
      id,
      locale: 'ru',
      data: { ...shared, ...localizedRu, _status: 'published' } as never,
    })
  }
  if (en) {
    await payload.update({
      collection: 'articles',
      id,
      locale: 'en',
      data: {
        title: en.title,
        excerpt: en.excerpt,
        source: en.source,
        bodyMarkdown: en.bodyMarkdown,
        _status: 'published',
      } as never,
    })
  }
}
console.info(`[seed] articles seeded for ${SITE_SLUG}: ${articlesRu.length} (ru+en)`)

console.info('[seed] done')
process.exit(0)
