import { afterEach, expect, it, vi } from 'vitest'
import { squareConfig, squareAccessToken } from '@/lib/squareConfig'
afterEach(() => vi.unstubAllEnvs())
it('selects sandbox in Preview and accepts the existing token alias', () => {
  vi.stubEnv('VERCEL_ENV', 'preview'); vi.stubEnv('SQUARE_ACCESS_TOKEN', ''); vi.stubEnv('Square_access_token', 'test')
  expect(squareConfig().environment).toBe('sandbox'); expect(squareAccessToken()).toBe('test')
})
it('does not use the legacy preview token in Production', () => {
  vi.stubEnv('VERCEL_ENV', 'production'); vi.stubEnv('SQUARE_ACCESS_TOKEN', ''); vi.stubEnv('Square_access_token', 'test')
  expect(squareConfig().environment).toBe('production'); expect(squareAccessToken()).toBeUndefined()
})
