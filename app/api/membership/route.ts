import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { cleanString, validEmail } from '@/lib/validation'
import { rateLimited } from '@/lib/rateLimit'
export async function POST(request: Request) {
  if(rateLimited(request,'membership',5,60*60*1000))return NextResponse.json({error:'Too many requests. Please try again later.'},{status:429})
  try {
    const body = await request.json()
    const email = validEmail(body.email), name = cleanString(body.name, 120), tier = cleanString(body.tier || 'community', 30)
    if (!email || !['community','trail','founding'].includes(tier)) return NextResponse.json({ error: 'Valid email and membership are required.' }, { status: 400 })
    const { error } = await supabaseAdmin().from('memberships').upsert({ email, name: name || null, membership_tier: tier, marketing_opt_in: !!body.marketingOptIn, status: tier==='community'?'active':'pending' }, { onConflict: 'email' })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Unable to save your membership right now.' }, { status: 500 }) }
}
