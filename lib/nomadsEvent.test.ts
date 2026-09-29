import { describe, expect, it } from 'vitest'
import { NOMADS_REGISTRATION_CLOSES_AT, NOMADS_STARTS_AT, nomadsRegistrationOpen } from './nomadsEvent'

describe('Nomads Café registration window', () => {
  it('keeps the 8 PM Atlantic cutoff when the hike starts at 9 AM', () => {
    expect(NOMADS_STARTS_AT).toBe('2026-10-24T09:00:00-03:00')
    expect(Date.parse(NOMADS_STARTS_AT) - Date.parse(NOMADS_REGISTRATION_CLOSES_AT)).toBe(13 * 60 * 60 * 1000)
    expect(nomadsRegistrationOpen(new Date('2026-10-23T19:59:59-03:00'))).toBe(true)
    expect(nomadsRegistrationOpen(new Date('2026-10-23T20:00:00-03:00'))).toBe(false)
  })
})
