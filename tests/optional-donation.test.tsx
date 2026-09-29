import { useEffect } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import OptionalDonation from '@/components/OptionalDonation'
vi.mock('next/script', () => ({ default: function Script({ onReady }: { onReady: () => void }) {
  useEffect(() => { onReady() }, [onReady])
  return null
} }))
const tokenize = vi.fn()
const destroy = vi.fn().mockResolvedValue(undefined)
const attach = vi.fn().mockResolvedValue(undefined)
const createCard = vi.fn().mockResolvedValue({ tokenize, destroy, attach })
beforeEach(() => {
  vi.stubGlobal('Square', { payments: () => ({ card: createCard }) })
  tokenize.mockResolvedValue({ status: 'OK', token: 'sandbox-test-token' })
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: true })))
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.clearAllMocks() })
function form() { render(<OptionalDonation applicationId="sandbox-app" locationId="location" environment="sandbox" />) }
async function choose() {
  fireEvent.click(screen.getByRole('button', { name: '$5' }))
  await waitFor(() => expect((screen.getByRole('button', { name: 'Contribute $5.00 CAD' }) as HTMLButtonElement).disabled).toBe(false))
}
it('accepts a custom $1 contribution and submits the correct amount', async () => {
  form()
  fireEvent.click(screen.getByRole('button', { name: 'Other amount' }))
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '1' } })
  const submit = await screen.findByRole('button', { name: 'Contribute $1.00 CAD' })
  await waitFor(() => expect((submit as HTMLButtonElement).disabled).toBe(false))
  fireEvent.click(submit)
  await screen.findByRole('status')
  expect(JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body)).amountCents).toBe(100)
})
it.each(['0', '501', '1.001', 'abc'])('rejects invalid custom amount %s', async value => {
  form()
  fireEvent.click(screen.getByRole('button', { name: 'Other amount' }))
  fireEvent.change(screen.getByRole('textbox'), { target: { value } })
  await waitFor(() => expect((screen.getByRole('button', { name: 'Enter an amount' }) as HTMLButtonElement).disabled).toBe(true))
})
it('recreates the card after choosing No thanks and returning', async () => {
  form(); await choose()
  fireEvent.click(screen.getByRole('button', { name: 'No thanks' }))
  expect(destroy).toHaveBeenCalled()
  await choose()
  expect(createCard).toHaveBeenCalledTimes(2)
})
it('identifies invalid card fields and never submits a payment', async () => {
  tokenize.mockResolvedValue({ status: 'INVALID', errors: [{ field: 'Postal Code', type: 'VALIDATION_ERROR' }] })
  form(); await choose()
  fireEvent.click(screen.getByRole('button', { name: 'Contribute $5.00 CAD' }))
  expect((await screen.findByRole('alert')).textContent).toContain('postal code')
  expect(fetch).not.toHaveBeenCalled()
})
it('shows a diagnostic code for non-field tokenization failures', async () => {
  tokenize.mockResolvedValue({ status: 'ERROR', errors: [{ type: 'TOKENIZATION_ERROR' }] })
  form(); await choose()
  fireEvent.click(screen.getByRole('button', { name: 'Contribute $5.00 CAD' }))
  expect((await screen.findByRole('alert')).textContent).toContain('TOKENIZATION_ERROR')
  expect(fetch).not.toHaveBeenCalled()
})
it('verifies a new token after changing the amount following an API failure', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Try again.' }), { status: 502 }))
  form(); await choose()
  fireEvent.click(screen.getByRole('button', { name: 'Contribute $5.00 CAD' }))
  await screen.findByRole('alert')
  fireEvent.click(screen.getByRole('button', { name: 'Other amount' }))
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '7.50' } })
  fireEvent.click(screen.getByRole('button', { name: 'Contribute $7.50 CAD' }))
  await screen.findByRole('status')
  expect(tokenize).toHaveBeenCalledTimes(2)
  expect(tokenize.mock.calls[1][0].amount).toBe('7.50')
})
