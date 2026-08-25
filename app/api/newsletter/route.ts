import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    const { error } = await supabaseAdmin().from('newsletter_subscribers').upsert({ email, first_name: body.firstName || null, source: body.source || 'website', marketing_opt_in: true }, { onConflict: 'email' })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Unable to subscribe right now.' }, { status: 500 }) }
}
