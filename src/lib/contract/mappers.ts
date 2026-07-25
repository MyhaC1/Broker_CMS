/**
 * Мапперы Payload-документов в контрактные DTO.
 * Схемы контракта объявлены с additionalProperties: false,
 * поэтому каждый маппер собирает объект явно — служебные поля Payload
 * (id строк массивов, _status, updatedAt…) в ответ не протекают.
 * Контрактные id, конфликтующие с зарезервированным полем строк массива,
 * хранятся как planId/promoId/webinarId/serviceId и маппятся обратно в id.
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

/** Дата из Payload → каноничный ISO-8601 (UTC, с миллисекундами). */
const iso = (value: unknown): string => new Date(String(value)).toISOString()
const isoOrNull = (value: unknown): string | null => (value ? iso(value) : null)

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

export function mapInstruments(doc: PayloadDoc) {
  return {
    items: (doc.items ?? []).map((i: PayloadDoc) => ({
      symbol: String(i.symbol ?? ''),
      name: String(i.name ?? ''),
      category: String(i.category ?? 'forex'),
      digits: Number(i.digits ?? 0),
      leverageMax: String(i.leverageMax ?? ''),
      spreadFrom: String(i.spreadFrom ?? ''),
      swapFree: Boolean(i.swapFree),
      icon: mapMedia(i.icon),
    })),
  }
}

export function mapAccounts(doc: PayloadDoc) {
  return {
    items: (doc.items ?? []).map((p: PayloadDoc) => ({
      id: String(p.planId ?? ''),
      name: String(p.name ?? ''),
      description: String(p.description ?? ''),
      minDeposit: String(p.minDeposit ?? ''),
      featured: Boolean(p.featured),
      features: (p.features ?? []).map((f: PayloadDoc) => ({
        label: String(f.label ?? ''),
        value: String(f.value ?? ''),
      })),
      pricing: {
        spreadPips: Number(p.pricing?.spreadPips ?? 0),
        commissionPerLotRT: Number(p.pricing?.commissionPerLotRT ?? 0),
      },
    })),
  }
}

export function mapPromotions(doc: PayloadDoc) {
  return {
    items: (doc.items ?? []).map((p: PayloadDoc) => ({
      id: String(p.promoId ?? ''),
      badge: String(p.badge ?? ''),
      title: String(p.title ?? ''),
      description: String(p.description ?? ''),
      terms: String(p.terms ?? ''),
      ctaLabel: String(p.ctaLabel ?? ''),
      ctaHref: String(p.ctaHref ?? ''),
      featured: Boolean(p.featured),
      activeFrom: isoOrNull(p.activeFrom),
      activeTo: isoOrNull(p.activeTo),
    })),
  }
}

export function mapPartners(doc: PayloadDoc) {
  return {
    models: (doc.models ?? []).map((m: PayloadDoc) => ({
      name: String(m.name ?? ''),
      description: String(m.description ?? ''),
      features: (m.features ?? []).map((f: PayloadDoc) => String(f.text ?? '')),
    })),
    tiers: (doc.tiers ?? []).map((t: PayloadDoc) => ({
      name: String(t.name ?? ''),
      clients: String(t.clients ?? ''),
      share: String(t.share ?? ''),
      // featured в контракте опционален — не эмитим false, сохраняя паритет с фикстурами
      ...(t.featured ? { featured: true } : {}),
    })),
    steps: (doc.steps ?? []).map((s: PayloadDoc) => ({
      title: String(s.title ?? ''),
      text: String(s.text ?? ''),
    })),
  }
}

export function mapAcademy(doc: PayloadDoc) {
  return {
    articles: (doc.articles ?? []).map((a: PayloadDoc) => ({
      slug: String(a.slug ?? ''),
      title: String(a.title ?? ''),
      excerpt: String(a.excerpt ?? ''),
      level: String(a.level ?? 'beginner'),
      readingMinutes: Number(a.readingMinutes ?? 1),
      bodyMarkdown: String(a.bodyMarkdown ?? ''),
    })),
    webinars: (doc.webinars ?? []).map((w: PayloadDoc) => ({
      id: String(w.webinarId ?? ''),
      title: String(w.title ?? ''),
      speaker: String(w.speaker ?? ''),
      speakerRole: String(w.speakerRole ?? ''),
      startsAt: iso(w.startsAt),
      durationMinutes: Number(w.durationMinutes ?? 60),
      level: String(w.level ?? ''),
      description: String(w.description ?? ''),
    })),
    glossary: (doc.glossary ?? []).map((g: PayloadDoc) => ({
      term: String(g.term ?? ''),
      definition: String(g.definition ?? ''),
    })),
  }
}

export function mapStreams(doc: PayloadDoc) {
  return {
    items: (doc.items ?? []).map((s: PayloadDoc) => ({
      provider: String(s.provider ?? 'youtube'),
      videoId: String(s.videoId ?? ''),
      title: String(s.title ?? ''),
      poster: mapMedia(s.poster),
      startsAt: iso(s.startsAt),
      status: String(s.status ?? 'upcoming'),
    })),
  }
}

export function mapContacts(doc: PayloadDoc) {
  return {
    channels: (doc.channels ?? []).map((c: PayloadDoc) => ({
      title: String(c.title ?? ''),
      value: String(c.value ?? ''),
      detail: String(c.detail ?? ''),
    })),
    offices: (doc.offices ?? []).map((o: PayloadDoc) => ({
      city: String(o.city ?? ''),
      country: String(o.country ?? ''),
      address: String(o.address ?? ''),
    })),
  }
}

export function mapCareers(doc: PayloadDoc) {
  return {
    benefits: (doc.benefits ?? []).map((b: PayloadDoc) => ({
      title: String(b.title ?? ''),
      text: String(b.text ?? ''),
    })),
    vacancies: (doc.vacancies ?? []).map((v: PayloadDoc) => ({
      title: String(v.title ?? ''),
      department: String(v.department ?? ''),
      location: String(v.location ?? ''),
      type: String(v.type ?? ''),
      applyEmail: String(v.applyEmail ?? ''),
    })),
  }
}

export function mapLegal(doc: PayloadDoc) {
  return {
    items: (doc.items ?? []).map((d: PayloadDoc) => ({
      slug: String(d.slug ?? ''),
      title: String(d.title ?? ''),
      updatedAt: String(d.updatedAt ?? ''),
      intro: String(d.intro ?? ''),
      sections: (d.sections ?? []).map((s: PayloadDoc) => ({
        heading: String(s.heading ?? ''),
        paragraphsMarkdown: (s.paragraphsMarkdown ?? []).map((p: PayloadDoc) => String(p.text ?? '')),
      })),
    })),
  }
}

export function mapSystemStatus(doc: PayloadDoc) {
  return {
    services: (doc.services ?? []).map((s: PayloadDoc) => ({
      id: String(s.serviceId ?? ''),
      name: String(s.name ?? ''),
      description: String(s.description ?? ''),
      status: String(s.status ?? 'operational'),
      uptime90d: String(s.uptime90d ?? ''),
    })),
    incidents: (doc.incidents ?? []).map((i: PayloadDoc) => ({
      date: String(i.date ?? ''),
      title: String(i.title ?? ''),
      status: String(i.status ?? ''),
      text: String(i.text ?? ''),
    })),
  }
}

/** Конфиг главной кабинета: строки массива → строгие модули контракта. */
export function mapCabinetHome(doc: PayloadDoc) {
  const modules: unknown[] = []
  for (const row of doc.modules ?? []) {
    const enabled = Boolean(row.enabled)
    switch (row.type) {
      case 'profile':
      case 'promotions':
        modules.push({ type: row.type, enabled })
        break
      case 'onboarding':
        modules.push({
          type: 'onboarding',
          enabled,
          steps: {
            verification: Boolean(row.steps?.verification ?? true),
            deposit: Boolean(row.steps?.deposit ?? true),
            firstTrade: Boolean(row.steps?.firstTrade ?? true),
          },
        })
        break
      case 'balance':
        modules.push({
          type: 'balance',
          enabled,
          buttons: {
            deposit: Boolean(row.buttons?.deposit ?? true),
            withdraw: Boolean(row.buttons?.withdraw ?? true),
            buyFiat: Boolean(row.buttons?.buyFiat ?? true),
          },
        })
        break
      case 'markets':
        modules.push({
          type: 'markets',
          enabled,
          tabs: {
            assets: Boolean(row.tabs?.assets ?? true),
            popular: Boolean(row.tabs?.popular ?? true),
            newListing: Boolean(row.tabs?.newListing ?? true),
            favorites: Boolean(row.tabs?.favorites ?? false),
            gainers: Boolean(row.tabs?.gainers ?? true),
            volume: Boolean(row.tabs?.volume ?? true),
          },
          newListingSymbols: (row.newListingSymbols ?? []).map((s: PayloadDoc) => String(s.symbol ?? '')),
        })
        break
      default:
        // неизвестный тип не отдаём — контракт строгий
        break
    }
  }
  return { modules }
}

/** Одна статья коллекции articles → контрактный cms.article. */
export function mapArticle(doc: PayloadDoc) {
  return {
    slug: String(doc.slug ?? ''),
    title: String(doc.title ?? ''),
    excerpt: String(doc.excerpt ?? ''),
    category: String(doc.category ?? ''),
    source: String(doc.source ?? ''),
    publishedAt: iso(doc.publishedAt),
    readingMinutes: Number(doc.readingMinutes ?? 1),
    bodyMarkdown: String(doc.bodyMarkdown ?? ''),
  }
}
