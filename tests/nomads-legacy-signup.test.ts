import { expect, it, vi } from 'vitest'
import { POST } from '@/app/api/events/signup/route'
import { NOMADS_EVENT_ID } from '@/lib/nomadsEvent'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
vi.mock('@/lib/supabaseAdmin', () => ({ supabaseAdmin: vi.fn() }))
vi.mock('@/lib/rateLimit', () => ({ rateLimited: () => false }))
it('prevents the legacy form from storing new Nomads registrations in Supabase', async () => {
  const result = await POST(new Request('http://localhost/api/events/signup', {
    method: 'POST', body: JSON.stringify({ eventId: NOMADS_EVENT_ID, name: 'Alex', email: 'alex@example.ca', guests: 1 }),
  }))
  expect(result.status).toBe(409)
  expect((await result.json()).error).toContain('/nomads')
  expect(supabaseAdmin).not.toHaveBeenCalled()
})
