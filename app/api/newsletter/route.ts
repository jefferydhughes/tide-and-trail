import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { cleanString, validEmail } from '@/lib/validation'
import { rateLimited } from '@/lib/rateLimit'
export async function POST(request: Request) {
  if(rateLimited(request,'newsletter',5,60*60*1000))return NextResponse.json({error:'Too many requests. Please try again later.'},{status:429})
  try {
    const body = await request.json()
    const email = validEmail(body.email)
    if (!email || body.marketingOptIn !== true) return NextResponse.json({ error: 'A valid email and consent are required.' }, { status: 400 })
    const { error } = await supabaseAdmin().from('newsletter_subscribers').upsert({ email, first_name: cleanString(body.firstName,120)||null, source: cleanString(body.source||'website',60), marketing_opt_in: true }, { onConflict: 'email' })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Unable to subscribe right now.' }, { status: 500 }) }
}
