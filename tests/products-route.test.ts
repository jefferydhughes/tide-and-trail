import { afterEach, describe, expect, it, vi } from 'vitest'

import { GET } from '@/app/api/products/route'

describe('GET /api/products', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('returns an empty, explicitly unavailable catalog without Supabase configuration', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')

    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ products: [], unavailable: true })
  })
})
