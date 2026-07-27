import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { CONTENT_COLLECTIONS } from './collections/content/index'
import { Media } from './collections/Media'
import { Sites } from './collections/Sites'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Дашборд = экран выбора рабочего сайта (карточки с метаданными)
      views: {
        dashboard: {
          Component: '/components/SiteDashboard#SiteDashboard',
        },
      },
      // Бейдж рабочего сайта над навигацией
      beforeNavLinks: ['/components/ActiveSiteBadge#ActiveSiteBadge'],
    },
  },
  // Мульти-тенантность: бывшие глобалы — per-site коллекции (один док на сайт);
  // бренд — поля карточки sites; глобалов в конфиге больше нет
  collections: [Users, Media, Sites, Articles, ...CONTENT_COLLECTIONS],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Прод накатывает миграции (payload migrate); dev-push — только локально
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  // Локали контента совпадают с локалями сайтов (next-intl): ru — основная, en — fallback на ru
  localization: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    fallback: true,
  },
})
