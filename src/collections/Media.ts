import path from 'node:path'

import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Альтернативный текст',
    },
  ],
  upload: {
    // Явный абсолютный путь: в standalone-образе конфиг бандлится,
    // относительные пути от файла конфига становятся непредсказуемыми
    staticDir: path.resolve(process.cwd(), 'media'),
  },
}
