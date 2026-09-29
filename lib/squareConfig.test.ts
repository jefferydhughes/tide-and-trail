import { afterEach, describe, expect, it } from 'vitest'
import { squareConfig } from './squareConfig'

const original = process.env.VERCEL_ENV
afterEach(() => {
  if (original === undefined) delete process.env.VERCEL_ENV
  else process.env.VERCEL_ENV = original
})

describe('Square environment selection', () => {
  it('uses only sandbox IDs and endpoint in a preview', () => {
    process.env.VERCEL_ENV = 'preview'
    expect(squareConfig().environment).toBe('sandbox')
    expect(squareConfig().locationId).toBe('LJET0JS7QNG1G7299')
    expect(squareConfig().apiUrl).toContain('squareupsandbox.com')
  })

  it('uses only production IDs and endpoint in production', () => {
    process.env.VERCEL_ENV = 'production'
    expect(squareConfig().environment).toBe('production')
    expect(squareConfig().locationId).toBe('LCR57XM7BE5N1')
    expect(squareConfig().apiUrl).toBe('https://connect.squareup.com/v2/payments')
  })
})
