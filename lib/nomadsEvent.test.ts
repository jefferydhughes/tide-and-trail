import { describe, expect, it } from 'vitest'
import { NOMADS_REGISTRATION_CLOSES_AT, NOMADS_STARTS_AT, nomadsRegistrationOpen } from './nomadsEvent'

describe('Nomads Café registration window', () => {
  it('closes exactly 12 hours before the hike in Atlantic daylight time', () => {
    expect(Date.parse(NOMADS_STARTS_AT) - Date.parse(NOMADS_REGISTRATION_CLOSES_AT)).toBe(12 * 60 * 60 * 1000)
    expect(nomadsRegistrationOpen(new Date('2026-10-23T19:59:59-03:00'))).toBe(true)
    expect(nomadsRegistrationOpen(new Date('2026-10-23T20:00:00-03:00'))).toBe(false)
  })
})
