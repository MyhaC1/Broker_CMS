import 'dotenv/config'

import { readFileSync } from 'node:fs'
import path from 'node:path'

import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Одноразовый seed из эталонных фикстур контракта (contract/fixtures) —
 * это тот же контент, что сайт отдаёт из mock-CMS, поэтому после seed
 * ответы /v1/cms/* совпадают с фикстурами байт-в-байт (контрактный паритет).
 * Запуск: pnpm seed. Повторный запуск безопасен (upsert).
 */

type Locale = 'ru' | 'en'
const LOCALES: Locale[] = ['ru', 'en']

function fixture(resource: string, locale: Locale): any {
  const file = path.join(process.cwd(), 'contract', 'fixtures', `cms.${resource}.${locale}.json`)
  return JSON.parse(readFileSync(file, 'utf8'))
}

const payload = await getPayload({ config })

// 1. Первичный администратор
const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin1234'
const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: adminEmail } },
  limit: 1,
})
if (existing.totalDocs === 0) {
  await payload.create({
    collection: 'users',
    data: { email: adminEmail, password: adminPassword },
  })
  console.info(`[seed] admin user created: ${adminEmail}`)
} else {
  console.info(`[seed] admin user already exists: ${adminEmail}`)
}

// 2. Глобалы из фикстур, отдельно на каждую локаль
for (const locale of LOCALES) {
  const brand = fixture('brand', locale)
  await payload.updateGlobal({
    slug: 'brand',
    locale,
    data: {
      name: brand.name,
      primaryColor: brand.primaryColor,
      socials: brand.socials,
      _status: 'published',
    },
  })

  const navigation = fixture('navigation', locale)
  await payload.updateGlobal({
    slug: 'navigation',
    locale,
    data: {
      header: navigation.header,
      footerColumns: navigation.footer.columns,
      riskWarning: navigation.footer.riskWarning,
      _status: 'published',
    },
  })

  const faq = fixture('faq', locale)
  await payload.updateGlobal({
    slug: 'faq',
    locale,
    data: {
      sections: faq.sections,
      _status: 'published',
    },
  })

  console.info(`[seed] globals seeded for locale=${locale}: brand, navigation, faq`)
}

console.info('[seed] done')
process.exit(0)
