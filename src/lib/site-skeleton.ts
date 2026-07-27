import { RESOURCE_TO_COLLECTION } from '../collections/content/index'

/**
 * Каркас контента сайта: у КАЖДОГО сайта должен существовать документ
 * каждого раздела (как раньше глобал). Создаём ЧЕРНОВИКИ (draft: true —
 * required-поля не валидируются): редактор заполняет и публикует.
 * Вызывается хуком при создании сайта и идемпотентно из навигации.
 */

const SKELETON_COLLECTIONS = [...Object.values(RESOURCE_TO_COLLECTION)]

interface PayloadLike {
  find: (a: { collection: never; where: unknown; limit: number; depth: number }) => Promise<{ docs: { id: string | number }[] }>
  create: (a: { collection: never; data: unknown; draft?: boolean }) => Promise<{ id: string | number }>
}

/** Создаёт недостающие документы разделов для сайта. Возвращает slug→docId. */
export async function ensureSiteSkeleton(
  payload: unknown,
  siteId: string | number,
): Promise<Record<string, string | number>> {
  const api = payload as PayloadLike
  const ids: Record<string, string | number> = {}

  for (const collection of SKELETON_COLLECTIONS) {
    const existing = await api.find({
      collection: collection as never,
      where: { site: { equals: siteId } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      ids[collection] = existing.docs[0].id
      continue
    }
    try {
      const created = await api.create({
        collection: collection as never,
        data: { site: siteId },
        draft: true,
      })
      ids[collection] = created.id
    } catch (error) {
      console.warn(`[site-skeleton] ${collection} for site ${siteId} failed:`, (error as Error).message)
    }
  }
  return ids
}
