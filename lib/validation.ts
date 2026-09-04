export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function cleanString(value: unknown, max = 500) {
  return String(value ?? '').trim().slice(0, max)
}

export function validEmail(value: unknown) {
  const email = cleanString(value, 254).toLowerCase()
  return EMAIL_RE.test(email) ? email : null
}

export function isUuid(value: unknown) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value ?? ''))
}
