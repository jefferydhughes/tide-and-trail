import { timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { createGearRoomSession } from '@/lib/gearRoomAuth'
import { rateLimited } from '@/lib/rateLimit'

export const runtime = 'nodejs'

function same(a: string, b: string) {
  const aa = Buffer.from(a), bb = Buffer.from(b)
  return aa.length === bb.length && timingSafeEqual(aa, bb)
}

export async function POST(request: Request) {
  if(rateLimited(request,'gear-room-login',8,15*60*1000))return NextResponse.json({error:'Too many attempts. Try again later.'},{status:429})
  const { password } = await request.json().catch(() => ({ password: '' }))
  const expected = process.env.GEAR_ROOM_PASSWORD || ''
  if (!expected || !same(String(password || ''), expected)) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }
  const session = createGearRoomSession()
  const response = NextResponse.json({ ok: true })
  response.cookies.set(session.name, session.value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: session.maxAge })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('gear_room_session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 })
  return response
}
