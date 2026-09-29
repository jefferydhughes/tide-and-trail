import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import Events from '@/app/events/page'
import { NOMADS_EVENT_ID, NOMADS_STARTS_AT } from '@/lib/nomadsEvent'

vi.mock('@/lib/supabaseAdmin', () => ({
  supabaseAdmin: () => ({ from: () => ({ select: () => ({ eq: () => ({
    order: async () => ({ data: [{ id: NOMADS_EVENT_ID, slug: 'nomads', title: 'Nomads Café', starts_at: NOMADS_STARTS_AT, location: 'Fundy' }] }),
  }) }) }) }),
}))

it('shows the Nomads start in Atlantic time even when the server uses UTC', async () => {
  render(await Events())
  expect(screen.getByRole('link', { name: /Nomads Café/ }).textContent).toMatch(/9:00\s*a\.?m\.?/i)
})
