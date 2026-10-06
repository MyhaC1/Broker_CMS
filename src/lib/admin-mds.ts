/**
 * Чтение прокси `/admin-mds/instruments` на стороне компонентов (Р-027).
 *
 * Одно место, потому что ошибка была именно в чтении: оба поля решали по
 * длине массива, и `items: []` от мёртвого MDS выглядел как «доступ пуст».
 * Здесь состояние разбирается один раз и отдаётся размеченным союзом —
 * ветку `failure` нельзя случайно прочитать как список.
 *
 * Пустой список при `state: 'ok'` — законное значение («разрешено ничего»,
 * Р-025), а не отказ. Отличает их прокси, а не длина массива.
 */

export type MdsLoad<T> =
  | { state: 'ok'; items: T[] }
  | { state: 'failure'; reason: MdsFailureReason }

export type MdsFailureReason =
  | 'mds_unavailable'
  | 'no_active_site'
  | 'allow_list_unavailable'
  /** Прокси не ответил или ответил не тем — причина неизвестна, но это отказ. */
  | 'unreachable'

const KNOWN: MdsFailureReason[] = ['mds_unavailable', 'no_active_site', 'allow_list_unavailable']

/** Человеку: что именно случилось и что с этим делать. */
export const MDS_FAILURE_TEXT: Record<MdsFailureReason, string> = {
  mds_unavailable: 'MDS недоступен — список инструментов показать нельзя.',
  no_active_site: 'Рабочий сайт не выбран — выберите его на дашборде.',
  allow_list_unavailable: 'Не удалось прочитать доступ сайта — список показать нельзя.',
  unreachable: 'Сервис инструментов не ответил — список показать нельзя.',
}

/**
 * Запрашивает прокси и разбирает ответ. Не бросает: любой отказ — это
 * `state: 'failure'` с причиной, а не исключение и не пустой список.
 *
 * Тело читается и при НЕуспешном коде: 503 здесь несёт причину, и терять её,
 * отбрасывая ответ по `res.ok`, значило бы снова свести все отказы к одному.
 */
export async function loadMdsInstruments<T>(url: string): Promise<MdsLoad<T>> {
  let body: unknown
  try {
    const res = await fetch(url)
    body = await res.json()
  } catch {
    return { state: 'failure', reason: 'unreachable' }
  }
  const data = body as { state?: unknown; items?: unknown } | null
  if (data?.state === 'ok' && Array.isArray(data.items)) {
    return { state: 'ok', items: data.items as T[] }
  }
  const reason = KNOWN.find((r) => r === data?.state) ?? 'unreachable'
  return { state: 'failure', reason }
}
