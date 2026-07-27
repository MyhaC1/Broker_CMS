import { NextResponse } from 'next/server'

/**
 * Прокси для админки: вселенная инструментов MDS (что реально стримится).
 * Используется полем выбора символа в разделе «Инструменты» —
 * редактор выбирает из списка, а не вписывает руками.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const base = process.env.MDS_HTTP_URL
  if (!base) {
    return NextResponse.json({ items: [], error: 'mds_not_configured' }, { status: 200 })
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/v1/instruments`, {
      signal: AbortSignal.timeout(3_000),
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return NextResponse.json(await res.json())
  } catch (error) {
    console.warn('[admin-mds] instruments unavailable:', (error as Error).message)
    return NextResponse.json({ items: [], error: 'mds_unavailable' }, { status: 200 })
  }
}
