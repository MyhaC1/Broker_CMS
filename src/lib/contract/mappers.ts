/**
 * Мапперы Payload-документов в контрактные DTO.
 * Схемы контракта объявлены с additionalProperties: false,
 * поэтому каждый маппер собирает объект явно — служебные поля Payload
 * (id строк массивов, _status, updatedAt…) в ответ не протекают.
 */

type PayloadDoc = Record<string, any>

interface ContractImage {
  url: string
  width: number
  height: number
  alt: string
  mimeType: string
}

function mapMedia(media: unknown): ContractImage | null {
  if (!media || typeof media !== 'object') return null
  const doc = media as PayloadDoc
  if (!doc.url || !doc.width || !doc.height || !doc.mimeType) return null
  const origin = (process.env.CMS_PUBLIC_URL ?? 'http://localhost:3001').replace(/\/$/, '')
  const url = String(doc.url).startsWith('http') ? String(doc.url) : `${origin}${doc.url}`
  return {
    url,
    width: Number(doc.width),
    height: Number(doc.height),
    alt: String(doc.alt ?? ''),
    mimeType: String(doc.mimeType),
  }
}

export function mapBrand(doc: PayloadDoc) {
  return {
    name: String(doc.name ?? ''),
    logo: mapMedia(doc.logo),
    favicon: mapMedia(doc.favicon),
    primaryColor: String(doc.primaryColor ?? '#d4a437'),
    socials: (doc.socials ?? []).map((s: PayloadDoc) => ({
      name: String(s.name ?? ''),
      url: String(s.url ?? ''),
    })),
  }
}

export function mapNavigation(doc: PayloadDoc) {
  return {
    header: (doc.header ?? []).map((item: PayloadDoc) => ({
      label: String(item.label ?? ''),
      href: String(item.href ?? ''),
    })),
    footer: {
      columns: (doc.footerColumns ?? []).map((column: PayloadDoc) => ({
        title: String(column.title ?? ''),
        links: (column.links ?? []).map((link: PayloadDoc) => ({
          label: String(link.label ?? ''),
          href: String(link.href ?? ''),
        })),
      })),
      riskWarning: String(doc.riskWarning ?? ''),
    },
  }
}

export function mapFaq(doc: PayloadDoc) {
  return {
    sections: (doc.sections ?? []).map((section: PayloadDoc) => ({
      title: String(section.title ?? ''),
      items: (section.items ?? []).map((item: PayloadDoc) => ({
        question: String(item.question ?? ''),
        answer: String(item.answer ?? ''),
      })),
    })),
  }
}
