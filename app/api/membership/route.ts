import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const name = String(body.name || '').trim()
    const tier = String(body.tier || 'community')
    if (!email || !tier) return NextResponse.json({ error: 'Email and membership are required.' }, { status: 400 })
    const { error } = await supabaseAdmin().from('memberships').upsert({ email, name: name || null, membership_tier: tier, marketing_opt_in: !!body.marketingOptIn }, { onConflict: 'email' })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Unable to save your membership right now.' }, { status: 500 }) }
}
