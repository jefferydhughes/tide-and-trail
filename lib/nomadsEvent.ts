export const NOMADS_EVENT_ID = '57a628a5-b567-456e-9508-9324f99b387d'
export const NOMADS_STARTS_AT = '2026-10-24T09:00:00-03:00'
export const NOMADS_CAPACITY = 40
export const NOMADS_REGISTRATION_CLOSES_AT = '2026-10-23T20:00:00-03:00'

export function nomadsRegistrationOpen(now = new Date()) {
  return now.getTime() < Date.parse(NOMADS_REGISTRATION_CLOSES_AT)
}
