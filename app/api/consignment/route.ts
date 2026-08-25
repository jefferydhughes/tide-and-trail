import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const name = String(form.get('name') || '').trim()
    const email = String(form.get('email') || '').trim().toLowerCase()
    const itemName = String(form.get('itemName') || '').trim()
    if (!name || !email || !itemName) return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 })

    const supabase = supabaseAdmin()
    const submissionId = crypto.randomUUID()
    const files = form.getAll('photos').filter((v): v is File => v instanceof File && v.size > 0).slice(0, 6)
    const photoPaths: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) continue
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${submissionId}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('consignment-photos').upload(path, file, { contentType: file.type, upsert: false })
      if (!error) photoPaths.push(path)
    }

    const { error } = await supabase.from('consignment_submissions').insert({
      id: submissionId,
      name,
      email,
      phone: String(form.get('phone') || '').trim() || null,
      item_name: itemName,
      brand: String(form.get('brand') || '').trim() || null,
      category: String(form.get('category') || '').trim() || null,
      condition: String(form.get('condition') || '').trim() || null,
      adventure_story: String(form.get('adventureStory') || '').trim() || null,
      description: String(form.get('description') || '').trim() || null,
      estimated_purchase_price: Number(form.get('purchasePrice')) || null,
      preferred_payout: String(form.get('payout') || 'cash'),
      pickup_postal_code: String(form.get('postalCode') || '').trim() || null,
      photo_paths: photoPaths,
    })
    if (error) throw error
    return NextResponse.json({ ok: true, id: submissionId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'We could not submit your gear. Please try again.' }, { status: 500 })
  }
}
