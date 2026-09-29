import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { cleanString, isUuid, validEmail } from '@/lib/validation'
import { rateLimited } from '@/lib/rateLimit'
import { NOMADS_EVENT_ID, NOMADS_STARTS_AT, NOMADS_CAPACITY, nomadsRegistrationOpen } from '@/lib/nomadsEvent'
export async function POST(request: Request) {
  if(rateLimited(request,'event',10,60*60*1000))return NextResponse.json({error:'Too many requests. Please try again later.'},{status:429})
  try {
    const body = await request.json()
    const email = validEmail(body.email), name = cleanString(body.name, 120), guestCount = Math.min(4, Math.max(1, Math.floor(Number(body.guests) || 1)))
    if (!isUuid(body.eventId) || !name || !email) return NextResponse.json({ error: 'Valid event, name and email are required.' }, { status: 400 })
    if (body.eventId === NOMADS_EVENT_ID) {
      if (!nomadsRegistrationOpen()) return NextResponse.json({ error: 'Registration for this hike has closed.' }, { status: 409 })
      const { data: event, error: eventError } = await supabaseAdmin().from('events')
        .select('starts_at,capacity,price,status').eq('id', NOMADS_EVENT_ID).single()
      if (eventError || !event || event.status !== 'published' || Date.parse(event.starts_at) !== Date.parse(NOMADS_STARTS_AT) || event.capacity !== NOMADS_CAPACITY || Number(event.price) !== 0) {
        return NextResponse.json({ error: 'Registration is not available yet.' }, { status: 503 })
      }
    }
    const { error } = await supabaseAdmin().rpc('register_for_event', { p_event_id: body.eventId, p_name: name, p_email: email, p_phone: cleanString(body.phone, 40)||null, p_guests: guestCount, p_notes: cleanString(body.notes, 1500)||null, p_marketing_opt_in: !!body.marketingOptIn })
    if (error?.message.includes('EVENT_FULL')) return NextResponse.json({ error: 'That event is full.' }, { status: 409 })
    if (error?.message.includes('EVENT_UNAVAILABLE')) return NextResponse.json({ error: 'That event is not available.' }, { status: 404 })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Unable to register right now.' }, { status: 500 }) }
}
