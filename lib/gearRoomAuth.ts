import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE = 'gear_room_session'
const MAX_AGE = 60 * 60 * 8

function secret() {
  return process.env.GEAR_ROOM_SESSION_SECRET || process.env.GEAR_ROOM_PASSWORD || ''
}

function signature(expires: string) {
  return createHmac('sha256', secret()).update(expires).digest('hex')
}

export function createGearRoomSession() {
  const expires = String(Math.floor(Date.now() / 1000) + MAX_AGE)
  return { name: COOKIE, value: `${expires}.${signature(expires)}`, maxAge: MAX_AGE }
}

export async function gearRoomAuthorized() {
  const value = (await cookies()).get(COOKIE)?.value || ''
  const [expires, supplied] = value.split('.')
  if (!expires || !supplied || !secret() || Number(expires) <= Date.now() / 1000) return false
  const expected = signature(expires)
  const a = Buffer.from(supplied)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export const gearRoomCookieName = COOKIE
