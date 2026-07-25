import 'dotenv/config'

import { readFileSync } from 'node:fs'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Одноразовый seed из эталонных фикстур контракта (contract/fixtures) —
 * это тот же контент, что сайт отдаёт из mock-CMS, поэтому после seed
 * ответы /v1/cms/* семантически совпадают с фикстурами (контрактный паритет;
 * datetime-поля нормализуются к ISO с миллисекундами).
 * Запуск: pnpm seed. Повторный запуск безопасен (upsert).
 */

type Locale = 'ru' | 'en'
const LOCALES: Locale[] = ['ru', 'en']

function fixture(resource: string, locale: Locale): any {
  const file = path.join(process.cwd(), 'contract', 'fixtures', `cms.${resource}.${locale}.json`)
  return JSON.parse(readFileSync(file, 'utf8'))
}

const payload = await getPayload({ config })

/* ---------------------------------------------------------------- */
/* 1. Первичный администратор                                        */
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
// Демонстрационный редактор: контент — да, управление учётками — нет
await ensureUser(
  process.env.SEED_EDITOR_EMAIL ?? 'editor@example.com',
  process.env.SEED_EDITOR_PASSWORD ?? 'editor1234',
  'editor',
)

/* ---------------------------------------------------------------- */
/* 2. Глобалы: фикстура → данные Payload (обратно мапперам ручек)     */
/* ---------------------------------------------------------------- */
const GLOBAL_BUILDERS: Record<string, (f: any) => Record<string, unknown>> = {
  brand: (f) => ({ name: f.name, primaryColor: f.primaryColor, socials: f.socials }),
  navigation: (f) => ({
    header: f.header,
    footerColumns: f.footer.columns,
    riskWarning: f.footer.riskWarning,
  }),
  faq: (f) => ({ sections: f.sections }),
  instruments: (f) => ({
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
  accounts: (f) => ({
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
  promotions: (f) => ({
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
  partners: (f) => ({
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
  academy: (f) => ({
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
  streams: (f) => ({
    items: f.items.map((s: any) => ({
      provider: s.provider,
      videoId: s.videoId,
      title: s.title,
      startsAt: s.startsAt,
      status: s.status,
    })),
  }),
  contacts: (f) => ({ channels: f.channels, offices: f.offices }),
  careers: (f) => ({ benefits: f.benefits, vacancies: f.vacancies }),
  legal: (f) => ({
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
  'system-status': (f) => ({
    services: f.services.map((s: any) => ({
      serviceId: s.id,
      name: s.name,
      description: s.description,
      status: s.status,
      uptime90d: s.uptime90d,
    })),
    incidents: f.incidents,
  }),
}

for (const locale of LOCALES) {
  for (const [slug, build] of Object.entries(GLOBAL_BUILDERS)) {
    const data = build(fixture(slug, locale))
    await payload.updateGlobal({
      slug: slug as never,
      locale,
      data: { ...data, _status: 'published' } as never,
    })
  }
  console.info(`[seed] globals seeded for locale=${locale}: ${Object.keys(GLOBAL_BUILDERS).join(', ')}`)
}

/* ---------------------------------------------------------------- */
/* 3. Коллекция articles: upsert по slug, ru — базовая, en — перевод  */
/* ---------------------------------------------------------------- */
const articlesRu = fixture('articles', 'ru').items
const articlesEn = fixture('articles', 'en').items
for (const ru of articlesRu) {
  const en = articlesEn.find((a: any) => a.slug === ru.slug)
  const localizedRu = {
    title: ru.title,
    excerpt: ru.excerpt,
    source: ru.source,
    bodyMarkdown: ru.bodyMarkdown,
  }
  const shared = {
    slug: ru.slug,
    category: ru.category,
    publishedAt: ru.publishedAt,
    readingMinutes: ru.readingMinutes,
  }

  const found = await payload.find({
    collection: 'articles',
    where: { slug: { equals: ru.slug } },
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
console.info(`[seed] articles seeded: ${articlesRu.length} (ru+en)`)

/* ---------------------------------------------------------------- */
/* 4. Реестр сайтов: первый тенант apex-ru из бренд-фикстуры          */
/* ---------------------------------------------------------------- */
const brandRu = fixture('brand', 'ru')
const existingSite = await payload.find({
  collection: 'sites',
  where: { slug: { equals: 'apex-ru' } },
  limit: 1,
})
if (existingSite.totalDocs === 0) {
  await payload.create({
    collection: 'sites',
    data: {
      slug: 'apex-ru',
      name: brandRu.name,
      primaryColor: brandRu.primaryColor,
      socials: brandRu.socials,
      demoStartBalanceCents: 1000000,
    } as never,
  })
  console.info('[seed] site created: apex-ru')
} else {
  console.info('[seed] site already exists: apex-ru')
}

console.info('[seed] done')
process.exit(0)
