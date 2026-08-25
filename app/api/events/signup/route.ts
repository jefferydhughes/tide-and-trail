import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId, name, email, phone, guests, notes, marketingOptIn } = body
    if (!eventId || !name || !email) return NextResponse.json({ error: 'Event, name and email are required.' }, { status: 400 })
    const supabase = supabaseAdmin()
    const { data: event } = await supabase.from('events').select('id,capacity').eq('id', eventId).single()
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    const { count } = await supabase.from('event_signups').select('*', { count: 'exact', head: true }).eq('event_id', eventId)
    const guestCount = Math.max(1, Number(guests) || 1)
    if (event.capacity && (count || 0) + guestCount > event.capacity) return NextResponse.json({ error: 'That event is full.' }, { status: 409 })
    const { error } = await supabase.from('event_signups').insert({ event_id: eventId, name, email: String(email).toLowerCase(), phone: phone || null, guests: guestCount, notes: notes || null, marketing_opt_in: !!marketingOptIn })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Unable to register right now.' }, { status: 500 }) }
}
