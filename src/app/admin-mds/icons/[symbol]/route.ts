import { NextResponse } from 'next/server'

/**
 * Прокси иконок монет из MDS для админки: браузер редактора ходит
 * только на origin CMS (MDS может быть недоступен ему напрямую).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params
  const base = process.env.MDS_HTTP_URL
  const clean = symbol.replace(/\.svg$/, '')
  if (!base || !/^[A-Z0-9]{1,20}$/.test(clean)) {
    return new NextResponse(null, { status: 404 })
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/icons/${clean}.svg`, {
      signal: AbortSignal.timeout(3_000),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return new NextResponse(null, { status: 404 })
    return new NextResponse(await res.arrayBuffer(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
