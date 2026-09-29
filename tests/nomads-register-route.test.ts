import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/nomads/register/route'
const mocks = vi.hoisted(() => ({ limited: vi.fn(() => false), open: vi.fn(() => true) }))
vi.mock('@/lib/rateLimit', () => ({ rateLimited: mocks.limited }))
vi.mock('@/lib/nomadsEvent', async importOriginal => ({ ...await importOriginal<typeof import('@/lib/nomadsEvent')>(), nomadsRegistrationOpen: mocks.open }))
const input = { name: 'Alex Hiker', email: 'alex@example.ca', phone: '', notes: 'First hike', guests: 2, marketingOptIn: false, amountCents: 0, idempotencyKey: 'ade45678-1234-4234-8234-123456789abc' }
let calls: { path: string; body: Record<string, any> }[]
function response(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status }) }
beforeEach(() => {
  vi.stubEnv('SQUARE_ACCESS_TOKEN', 'test-secret')
  vi.stubEnv('VERCEL_ENV', 'preview')
  vi.stubEnv('NOMADS_REGISTRATION_PAUSED', 'false')
  mocks.limited.mockReturnValue(false); mocks.open.mockReturnValue(true)
  calls = []
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options) => {
    const path = new URL(String(url)).pathname
    const body = JSON.parse(String(options?.body)); calls.push({ path, body })
    if (path === '/v2/customers/search') return response({ customers: [] })
    if (path === '/v2/customers') return response({ customer: { id: 'customer-1' } })
    if (path === '/v2/orders') return response({ order: { id: 'order-1', total_money: { amount: body.order.line_items[1]?.base_price_money.amount || 0, currency: 'CAD' } } })
    if (path === '/v2/orders/order-1/pay') return response({ order: { id: 'order-1' } })
    if (path === '/v2/payments') return response({ payment: { id: 'payment-1', status: 'COMPLETED' } })
    throw new Error(`Unexpected ${path}`)
  })
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs() })
const submit = (body: unknown = input) => POST(new Request('http://localhost/api/nomads/register', { method: 'POST', body: JSON.stringify(body) }))
it('records Not Now as a customer-linked $0 CAD order with guests and no card payment', async () => {
  expect((await submit()).status).toBe(200)
  const order = calls.find(c => c.path === '/v2/orders')!.body.order
  expect(order.customer_id).toBe('customer-1')
  expect(order.line_items[0]).toMatchObject({ quantity: '2', base_price_money: { amount: 0, currency: 'CAD' } })
  expect(order.line_items[0].name).toContain('Not Now')
  expect(order.metadata.marketing_opt_in).toBe('false')
  expect(order.fulfillments[0].pickup_details.recipient.email_address).toBe(input.email)
  expect(calls.at(-1)?.body.payment_ids).toEqual([])
  expect(calls.some(c => c.path === '/v2/payments')).toBe(false)
})
it('links the CAD contribution payment to the same customer and registration order', async () => {
  const result = await submit({ ...input, amountCents: 750, sourceId: 'sandbox-token' })
  expect(await result.json()).toMatchObject({ ok: true, orderId: 'order-1', paymentId: 'payment-1' })
  expect(calls.at(-1)?.body).toMatchObject({ order_id: 'order-1', customer_id: 'customer-1', amount_money: { amount: 750, currency: 'CAD' } })
  expect(calls.find(c => c.path === '/v2/orders')!.body.order.line_items).toHaveLength(2)
})
it('keeps order and payment idempotency keys stable across retries', async () => {
  const paid = { ...input, amountCents: 500, sourceId: 'sandbox-token' }
  await submit(paid); const first = calls.map(c => c.body.idempotency_key).filter(Boolean)
  calls = []; await submit(paid)
  expect(calls.map(c => c.body.idempotency_key).filter(Boolean)).toEqual(first)
  expect(new Set(first).size).toBe(first.length)
})
it('reuses an existing customer without overwriting their information', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(response({ customers: [{ id: 'existing-customer' }] }))
  await submit()
  expect(calls.some(c => c.path === '/v2/customers')).toBe(false)
  expect(calls.find(c => c.path === '/v2/orders')!.body.order.customer_id).toBe('existing-customer')
})
it.each([null, {}, { ...input, email: 'bad' }, { ...input, name: '' }, { ...input, guests: 5 }, { ...input, guests: 1.5 }, { ...input, amountCents: -1 }, { ...input, amountCents: 99 }, { ...input, amountCents: 50001 }, { ...input, amountCents: 100 }, { ...input, idempotencyKey: 'bad' }])('rejects invalid input without contacting Square: %j', async body => {
  expect((await submit(body)).status).toBe(400); expect(fetch).not.toHaveBeenCalled()
})
it('handles malformed JSON', async () => {
  expect((await POST(new Request('http://localhost', { method: 'POST', body: '{' }))).status).toBe(400)
})
it('closes at the registration deadline', async () => {
  mocks.open.mockReturnValue(false); expect((await submit()).status).toBe(409); expect(fetch).not.toHaveBeenCalled()
})
it('supports pausing registration when capacity is reached', async () => {
  vi.stubEnv('NOMADS_REGISTRATION_PAUSED', 'true'); expect((await submit()).status).toBe(503); expect(fetch).not.toHaveBeenCalled()
})
it('rate limits submissions', async () => {
  mocks.limited.mockReturnValue(true); expect((await submit()).status).toBe(429)
})
it('never claims confirmation if Square is unavailable', async () => {
  vi.mocked(fetch).mockRejectedValueOnce(new Error('offline'))
  const result = await submit(); expect(result.status).toBe(502)
  expect(await result.json()).not.toHaveProperty('ok')
})
it('rejects an unexpected order total before charging', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(response({ customers: [{ id: 'customer-1' }] }))
    .mockResolvedValueOnce(response({ order: { id: 'order-1', total_money: { amount: 999, currency: 'CAD' } } }))
  expect((await submit()).status).toBe(502)
  expect(calls.some(c => c.path === '/v2/payments')).toBe(false)
})
it('returns a safe, actionable response for a definite card decline', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(response({ customers: [{ id: 'customer-1' }] }))
    .mockResolvedValueOnce(response({ order: { id: 'order-1', total_money: { amount: 500, currency: 'CAD' } } }))
    .mockResolvedValueOnce(response({ errors: [{ code: 'CARD_DECLINED', detail: 'private information' }] }, 400))
  const result = await submit({ ...input, amountCents: 500, sourceId: 'sandbox-token' })
  expect(await result.json()).toMatchObject({ cardDeclined: true })
})
it('fails closed without a Square token', async () => {
  vi.stubEnv('SQUARE_ACCESS_TOKEN', ''); vi.stubEnv('Square_access_token', '')
  expect((await submit()).status).toBe(503); expect(fetch).not.toHaveBeenCalled()
})
it('requires a customer ID before creating an order', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(response({ customers: [] })).mockResolvedValueOnce(response({}))
  expect((await submit()).status).toBe(502)
  expect(calls.some(c => c.path === '/v2/orders')).toBe(false)
})
it('requires Square to acknowledge the free-order settlement', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(response({ customers: [{ id: 'customer-1' }] }))
    .mockResolvedValueOnce(response({ order: { id: 'order-1', total_money: { amount: 0, currency: 'CAD' } } }))
    .mockResolvedValueOnce(response({}))
  expect((await submit()).status).toBe(502)
})
it('never confirms an incomplete card payment', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(response({ customers: [{ id: 'customer-1' }] }))
    .mockResolvedValueOnce(response({ order: { id: 'order-1', total_money: { amount: 500, currency: 'CAD' } } }))
    .mockResolvedValueOnce(response({ payment: { status: 'PENDING' } }))
  expect((await submit({ ...input, amountCents: 500, sourceId: 'sandbox-token' })).status).toBe(502)
})

it.each([0, 500])('schedules trailhead check-in at 9 AM Atlantic for a %i-cent registration', async amountCents => {
  expect((await submit({ ...input, amountCents, ...(amountCents ? { sourceId: 'sandbox-token' } : {}) })).status).toBe(200)
  const order = calls.find(c => c.path === '/v2/orders')!.body.order
  expect(order.fulfillments[0].pickup_details.pickup_at).toBe('2026-10-24T09:00:00-03:00')
})
