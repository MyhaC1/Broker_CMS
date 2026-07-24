import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

/** Здоровье сервиса: доступность процесса + БД (паритет с /api/health сайта). */

export const dynamic = 'force-dynamic'

export async function GET() {
  let db: 'ok' | 'error' = 'error'
  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: 'users' })
    db = 'ok'
  } catch {
    db = 'error'
  }
  return NextResponse.json(
    { status: db === 'ok' ? 'ok' : 'degraded', db, time: new Date().toISOString() },
    { status: db === 'ok' ? 200 : 503 },
  )
}
