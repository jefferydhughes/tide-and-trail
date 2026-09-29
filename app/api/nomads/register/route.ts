import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { rateLimited } from '@/lib/rateLimit'
import { validEmail, isUuid } from '@/lib/validation'
import { NOMADS_EVENT_ID, NOMADS_STARTS_AT, nomadsRegistrationOpen } from '@/lib/nomadsEvent'
import { squareConfig, squareAccessToken, nomadsSquareReady } from '@/lib/squareConfig'

export const runtime = 'nodejs'
const keyFor = (value: string) => createHash('sha256').update(value).digest('hex').slice(0, 40)
const title = 'Nomads Café — October 24, 2026'
class SquareError extends Error {
  constructor(public codes: string[], public cardDeclined = false) { super('Square request failed') }
}
const declinedCodes = new Set(['CARD_DECLINED', 'CVV_FAILURE', 'ADDRESS_VERIFICATION_FAILURE', 'INVALID_EXPIRATION', 'CARD_EXPIRED', 'GENERIC_DECLINE', 'INSUFFICIENT_FUNDS'])

export async function POST(request: Request) {
  if (rateLimited(request, 'nomads-registration', 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }
  if (!nomadsRegistrationOpen()) return NextResponse.json({ error: 'Registration for this hike has closed.' }, { status: 409 })
  if (!nomadsSquareReady()) return NextResponse.json({ error: 'Registration is temporarily unavailable. Please try again later.' }, { status: 503 })
  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  const { name, email, phone = '', notes = '', guests, amountCents, sourceId, idempotencyKey, marketingOptIn = false } = body
  if (typeof name !== 'string' || !name.trim() || name.length > 120 || typeof email !== 'string' || email.length > 254 || !validEmail(email) ||
      typeof phone !== 'string' || phone.length > 40 || typeof notes !== 'string' || notes.length > 1500 || typeof marketingOptIn !== 'boolean' ||
      !Number.isInteger(guests) || guests < 1 || guests > 4 || !isUuid(idempotencyKey) ||
      !Number.isInteger(amountCents) || (amountCents !== 0 && (amountCents < 100 || amountCents > 50000)) ||
      (amountCents > 0 && (typeof sourceId !== 'string' || sourceId.length < 10 || sourceId.length > 300))) {
    return NextResponse.json({ error: 'Enter your name, valid email, 1–4 guests, and a contribution of $0 or $1–$500 CAD.' }, { status: 400 })
  }
  const square = squareConfig()
  async function call(path: string, payload: unknown) {
    const response = await fetch(`${square.apiUrl}/v2${path}`, {
      method: 'POST', headers: { Authorization: `Bearer ${squareAccessToken()}`, 'Square-Version': '2026-09-16', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), cache: 'no-store',
    })
    const result = await response.json()
    if (!response.ok || result.errors?.length) {
      const codes: string[] = (result.errors || []).map((error: { code?: string }) => error.code || 'UNKNOWN')
      throw new SquareError(codes, path === '/payments' && codes.some(code => declinedCodes.has(code)))
    }
    return result
  }
  let settlementStarted = false
  try {
    // Search first so repeat visitors share a customer profile. Never overwrite an existing profile.
    const normalizedEmail = validEmail(email)!
    const customers = await call('/customers/search', { query: { filter: { email_address: { exact: normalizedEmail } } }, limit: 1 })
    let customerId = customers.customers?.[0]?.id
    if (!customerId) {
      const result = await call('/customers', { idempotency_key: keyFor(`customer:${idempotencyKey}`), given_name: name.trim(), email_address: normalizedEmail })
      customerId = result.customer?.id
    }
    if (!customerId) throw new SquareError(['MISSING_CUSTOMER'])
    const registrationType = amountCents === 0 ? 'Not Now — free registration' : 'Registration with contribution'
    const note = `Guests: ${guests}. Contribution: ${registrationType}. Marketing opt-in: ${marketingOptIn ? 'yes' : 'no'}. ${notes}`
    const result = await call('/orders', {
      idempotency_key: keyFor(`order:${idempotencyKey}`),
      order: {
        location_id: square.locationId, customer_id: customerId, reference_id: idempotencyKey,
        metadata: { event_id: NOMADS_EVENT_ID, guests: String(guests), registration_type: amountCents === 0 ? 'free' : 'contribution', marketing_opt_in: String(marketingOptIn) },
        line_items: [
          { name: `${title} — ${amountCents === 0 ? 'Not Now / Free registration' : 'Free registration'}`, quantity: String(guests), base_price_money: { amount: 0, currency: 'CAD' }, note },
          ...(amountCents > 0 ? [{ name: 'Nomads Café — optional contribution', quantity: '1', base_price_money: { amount: amountCents, currency: 'CAD' } }] : []),
        ],
        fulfillments: [{ type: 'PICKUP', state: 'PROPOSED', pickup_details: {
          schedule_type: 'SCHEDULED', pickup_at: NOMADS_STARTS_AT,
          recipient: { customer_id: customerId, display_name: name.trim(), email_address: normalizedEmail, ...(phone.trim() ? { phone_number: phone.trim() } : {}) },
          note: `Hike registration / trailhead check-in, not store pickup. Location sent separately. ${note}`.slice(0, 500),
        } }],
      },
    })
    const order = result.order
    if (!order?.id || Number(order.total_money?.amount) !== amountCents || order.total_money?.currency !== 'CAD') throw new SquareError(['ORDER_TOTAL_MISMATCH'])
    settlementStarted = true
    if (amountCents === 0) {
      const paid = await call(`/orders/${encodeURIComponent(order.id)}/pay`, { idempotency_key: keyFor(`free:${idempotencyKey}`), payment_ids: [] })
      if (paid.order?.id !== order.id) throw new SquareError(['ORDER_NOT_CONFIRMED'])
      return NextResponse.json({ ok: true, orderId: order.id })
    }
    const paid = await call('/payments', {
      idempotency_key: keyFor(`payment:${idempotencyKey}:${sourceId}`), source_id: sourceId,
      amount_money: { amount: amountCents, currency: 'CAD' }, order_id: order.id, customer_id: customerId,
      location_id: square.locationId, autocomplete: true, buyer_email_address: normalizedEmail, note: title,
    })
    if (paid.payment?.status !== 'COMPLETED') throw new SquareError(['PAYMENT_NOT_COMPLETED'])
    return NextResponse.json({ ok: true, orderId: order.id, paymentId: paid.payment.id })
  } catch (error) {
    // Do not log contact details, card tokens, or full Square payloads.
    console.error('Nomads Square registration failed', error instanceof SquareError ? error.codes : ['NETWORK_OR_RESPONSE_ERROR'])
    const cardDeclined = error instanceof SquareError && error.cardDeclined
    const canEdit = error instanceof SquareError && !settlementStarted
    return NextResponse.json({ error: cardDeclined
      ? 'Your card was declined. Check the card details and retry to complete your registration.'
      : canEdit ? 'We could not prepare your registration. Check your details and try again later.'
      : 'We could not confirm your registration. Retry here with the same details; do not start another checkout.', cardDeclined, canEdit }, { status: 502 })
  }
}
