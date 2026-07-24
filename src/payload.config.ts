import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Academy } from './globals/Academy'
import { Accounts } from './globals/Accounts'
import { Brand } from './globals/Brand'
import { Careers } from './globals/Careers'
import { Contacts } from './globals/Contacts'
import { Faq } from './globals/Faq'
import { Instruments } from './globals/Instruments'
import { Legal } from './globals/Legal'
import { Navigation } from './globals/Navigation'
import { Partners } from './globals/Partners'
import { Promotions } from './globals/Promotions'
import { Streams } from './globals/Streams'
import { SystemStatus } from './globals/SystemStatus'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Articles],
  globals: [
    Brand,
    Navigation,
    Faq,
    Instruments,
    Accounts,
    Promotions,
    Partners,
    Academy,
    Streams,
    Contacts,
    Careers,
    Legal,
    SystemStatus,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  // Локали контента совпадают с локалями сайта (next-intl): ru — основная, en — fallback на ru
  localization: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    fallback: true,
  },
})
