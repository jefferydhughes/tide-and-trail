import { useEffect } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import NomadsRegistrationForm from '@/components/NomadsRegistrationForm'
vi.mock('next/script', () => ({ default: function Script({ onReady }: { onReady: () => void }) {
  useEffect(() => { onReady() }, [onReady]); return null
} }))
const tokenize = vi.fn(), destroy = vi.fn().mockResolvedValue(undefined)
const card = vi.fn().mockResolvedValue({ tokenize, destroy, attach: vi.fn().mockResolvedValue(undefined) })
beforeEach(() => {
  vi.stubGlobal('Square', { payments: () => ({ card }) })
  tokenize.mockResolvedValue({ status: 'OK', token: 'sandbox-test-token' })
  vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(JSON.stringify({ ok: true, orderId: 'registration-123' })))
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.clearAllMocks() })
function form(configured = true) {
  render(<NomadsRegistrationForm applicationId={configured ? 'sandbox-app' : undefined} locationId="location" environment="sandbox" />)
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alex Hiker' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alex@example.ca' } })
}
async function pay() {
  await waitFor(() => expect((screen.getByRole('button', { name: /Register & contribute/ }) as HTMLButtonElement).disabled).toBe(false))
  fireEvent.submit(screen.getByRole('form'))
}
it('submits free registration with details and no tokenization', async () => {
  form(); fireEvent.click(screen.getByRole('button', { name: 'Not Now' }))
  expect(screen.queryByLabelText('Secure card details')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Complete free registration' }))
  expect((await screen.findByRole('status')).textContent).toContain('registration-123')
  expect(tokenize).not.toHaveBeenCalled()
  expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body))).toMatchObject({ name: 'Alex Hiker', email: 'alex@example.ca', amountCents: 0, guests: 1, marketingOptIn: false })
})
it('registers and contributes in the same request', async () => {
  form(); await pay()
  expect((await screen.findByRole('status')).textContent).toContain('$5.00 CAD')
  expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/api/nomads/register')
  expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body))).toMatchObject({ name: 'Alex Hiker', amountCents: 500, sourceId: 'sandbox-test-token' })
})
it('accepts a custom $1 contribution', async () => {
  form(); fireEvent.click(screen.getByRole('button', { name: 'Other amount' }))
  fireEvent.change(screen.getByLabelText(/Your amount/), { target: { value: '1' } })
  await pay(); await screen.findByRole('status')
  expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body)).amountCents).toBe(100)
})
it('retains the exact request on an ambiguous failure and locks the details', async () => {
  vi.mocked(fetch).mockRejectedValueOnce(new Error('Connection lost.'))
  form(); await pay(); await screen.findByRole('alert')
  expect((screen.getByLabelText('Name').closest('fieldset') as HTMLFieldSetElement).disabled).toBe(true)
  expect((screen.getByRole('button', { name: 'Not Now' }) as HTMLButtonElement).disabled).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Retry registration' }))
  await screen.findByRole('status')
  expect(vi.mocked(fetch).mock.calls[0][1]?.body).toBe(vi.mocked(fetch).mock.calls[1][1]?.body)
  expect(tokenize).toHaveBeenCalledTimes(1)
})
it('retokenizes after a confirmed decline but preserves the registration key', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Declined', cardDeclined: true }), { status: 502 }))
  form(); await pay(); await screen.findByRole('alert')
  tokenize.mockResolvedValueOnce({ status: 'OK', token: 'replacement-token' })
  fireEvent.click(screen.getByRole('button', { name: 'Retry registration' }))
  await screen.findByRole('status')
  const requests = vi.mocked(fetch).mock.calls.map(call => JSON.parse(String(call[1]?.body)))
  expect(requests[0].idempotencyKey).toBe(requests[1].idempotencyKey)
  expect(requests[1].sourceId).toBe('replacement-token')
})
it('does not submit registration on card validation failure', async () => {
  tokenize.mockResolvedValueOnce({ status: 'Invalid', errors: [{ field: 'Postal Code', type: 'VALIDATION_ERROR' }] })
  form(); await pay()
  expect((await screen.findByRole('alert')).textContent).toContain('postal code')
  expect(fetch).not.toHaveBeenCalled()
  expect((screen.getByRole('button', { name: 'Not Now' }) as HTMLButtonElement).disabled).toBe(false)
})
it('remounts the card when switching back from Not Now', async () => {
  form(); await waitFor(() => expect(card).toHaveBeenCalledTimes(1))
  fireEvent.click(screen.getByRole('button', { name: 'Not Now' }))
  fireEvent.click(screen.getByRole('button', { name: '$10' }))
  await waitFor(() => expect(card).toHaveBeenCalledTimes(2))
})
it('disables checkout when Square is unavailable', () => {
  form(false); fireEvent.click(screen.getByRole('button', { name: 'Not Now' }))
  expect((screen.getByRole('button', { name: 'Complete free registration' }) as HTMLButtonElement).disabled).toBe(true)
})
it.each(['0', '501', '1.001', 'abc'])('rejects invalid custom contribution %s', async value => {
  form(); fireEvent.click(screen.getByRole('button', { name: 'Other amount' }))
  fireEvent.change(screen.getByLabelText(/Your amount/), { target: { value } })
  expect((screen.getByRole('button', { name: 'Enter an amount' }) as HTMLButtonElement).disabled).toBe(true)
})
it('allows correcting details when the server confirms checkout never reached settlement', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Check your details', canEdit: true }), { status: 502 }))
  form(); await pay(); await screen.findByRole('alert')
  expect((screen.getByLabelText('Name').closest('fieldset') as HTMLFieldSetElement).disabled).toBe(false)
  expect((screen.getByRole('button', { name: 'Not Now' }) as HTMLButtonElement).disabled).toBe(false)
})
