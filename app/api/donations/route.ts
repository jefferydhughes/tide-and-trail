import { NextResponse } from 'next/server'
import { rateLimited } from '@/lib/rateLimit'
import { squareAccessToken, squareConfig } from '@/lib/squareConfig'

export const runtime = 'nodejs'

const MIN_CENTS = 100
const MAX_CENTS = 50000

export async function POST(request: Request) {
  if (rateLimited(request, 'nomads-donation', 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  const token = squareAccessToken()
  const square = squareConfig()
  if (!token) {
    return NextResponse.json({ error: 'Donations are not available yet.' }, { status: 503 })
  }

  let body: { amountCents?: unknown; sourceId?: unknown; idempotencyKey?: unknown }
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { amountCents, sourceId, idempotencyKey } = body
  if (!Number.isInteger(amountCents) || (amountCents as number) < MIN_CENTS || (amountCents as number) > MAX_CENTS ||
      typeof sourceId !== 'string' || sourceId.length < 10 || sourceId.length > 300 ||
      typeof idempotencyKey !== 'string' || !/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(idempotencyKey)) {
    return NextResponse.json({ error: 'Enter a valid donation from $1 to $500 CAD.' }, { status: 400 })
  }

  try {
    const response = await fetch(
      square.apiUrl,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Square-Version': '2026-09-16',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_id: sourceId,
          idempotency_key: idempotencyKey,
          amount_money: { amount: amountCents, currency: 'CAD' },
          location_id: square.locationId,
          autocomplete: true,
          note: 'Nomads Café optional contribution',
        }),
        cache: 'no-store',
      }
    )
    const result = await response.json()
    if (!response.ok || result.payment?.status !== 'COMPLETED') {
      console.error('Square donation failed', { status: response.status, errors: result.errors })
      return NextResponse.json({ error: 'Payment could not be completed. Please check your details and try again.' }, { status: 502 })
    }
    return NextResponse.json({ ok: true, paymentId: result.payment.id })
  } catch (error) {
    console.error('Square donation unavailable', error)
    return NextResponse.json({ error: 'Payment is temporarily unavailable. Your free registration is unaffected.' }, { status: 503 })
  }
}
