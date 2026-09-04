import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { cleanString, validEmail } from '@/lib/validation'
import { rateLimited } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if(rateLimited(request,'consignment',5,60*60*1000))return NextResponse.json({error:'Too many submissions. Please try again later.'},{status:429})
  try {
    const form = await request.formData()
    const name = cleanString(form.get('name'), 120)
    const email = validEmail(form.get('email'))
    const itemName = cleanString(form.get('itemName'), 180)
    const allowedConditions = ['Pristine','Excellent','Good','Worn & Ready','Repair / Project']
    const condition = cleanString(form.get('condition'), 40)
    if (!name || !email || !itemName || !allowedConditions.includes(condition)) return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 })

    const supabase = supabaseAdmin()
    const submissionId = crypto.randomUUID()
    const incoming = form.getAll('photos').filter((v): v is File => v instanceof File && v.size > 0)
    if (!incoming.length || incoming.length > 6) return NextResponse.json({ error: 'Please add 1–6 gear photos.' }, { status: 400 })
    const files = incoming.filter(file => ['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(file.type) && file.size <= 8 * 1024 * 1024)
    if (files.length !== incoming.length) return NextResponse.json({ error: 'Each photo must be JPG, PNG, WebP, or HEIC and no larger than 8MB.' }, { status: 400 })
    const photoPaths: string[] = []

    for (const file of files) {
      const ext = ({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/heic':'heic','image/heif':'heif'} as Record<string,string>)[file.type]
      const path = `${submissionId}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('consignment-photos').upload(path, file, { contentType: file.type, upsert: false })
      if (error) { if (photoPaths.length) await supabase.storage.from('consignment-photos').remove(photoPaths); throw error }
      photoPaths.push(path)
    }

    const { error } = await supabase.from('consignment_submissions').insert({
      id: submissionId,
      name,
      email,
      phone: cleanString(form.get('phone'), 40) || null,
      item_name: itemName,
      brand: cleanString(form.get('brand'), 100) || null,
      category: cleanString(form.get('category'), 80) || null,
      condition,
      adventure_story: cleanString(form.get('adventureStory'), 3000) || null,
      description: cleanString(form.get('description'), 3000) || null,
      estimated_purchase_price: Number(form.get('purchasePrice')) || null,
      preferred_payout: form.get('payout') === 'credit' ? 'credit' : 'cash',
      pickup_postal_code: cleanString(form.get('postalCode'), 12) || null,
      photo_paths: photoPaths,
    })
    if (error) { await supabase.storage.from('consignment-photos').remove(photoPaths); throw error }
    return NextResponse.json({ ok: true, id: submissionId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'We could not submit your gear. Please try again.' }, { status: 500 })
  }
}
