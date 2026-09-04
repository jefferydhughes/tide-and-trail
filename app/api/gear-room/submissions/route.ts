import { NextResponse } from 'next/server'
import { gearRoomAuthorized } from '@/lib/gearRoomAuth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { cleanString, isUuid } from '@/lib/validation'

export const runtime = 'nodejs'
const statuses = ['new','reviewing','accepted','drop_off','photography','graded','priced','ready_for_tuesday','live','sold','paid','declined']
const conditions = ['Pristine','Excellent','Good','Worn & Ready','Repair / Project']

export async function GET() {
  if (!await gearRoomAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = supabaseAdmin()
  const { data, error } = await supabase.from('consignment_submissions').select('*').order('created_at', { ascending: false }).limit(250)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const submissions = await Promise.all((data || []).map(async submission => {
    const photos = await Promise.all((submission.photo_paths || []).map(async (path: string) => {
      const { data: signed } = await supabase.storage.from('consignment-photos').createSignedUrl(path, 900)
      return signed?.signedUrl || null
    }))
    return { ...submission, photo_urls: photos.filter(Boolean) }
  }))
  return NextResponse.json({ submissions })
}

export async function PATCH(request: Request) {
  if (!await gearRoomAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  if (!isUuid(body.id)) return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.status !== undefined) {
    if (!statuses.includes(body.status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    update.status = body.status
  }
  if (body.condition !== undefined) {
    if (!conditions.includes(body.condition)) return NextResponse.json({ error: 'Invalid condition.' }, { status: 400 })
    update.condition = body.condition
  }
  if (body.staffNotes !== undefined) update.staff_notes = cleanString(body.staffNotes, 5000) || null
  if (body.listPrice !== undefined) {
    const price = Number(body.listPrice)
    if (!Number.isFinite(price) || price < 0 || price > 100000) return NextResponse.json({ error: 'Invalid price.' }, { status: 400 })
    update.list_price = price
  }
  const { data, error } = await supabaseAdmin().from('consignment_submissions').update(update).eq('id', body.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (body.status === 'live') {
    if (!data.list_price || !data.condition) { await supabaseAdmin().from('consignment_submissions').update({status:'priced'}).eq('id',data.id); return NextResponse.json({ error: 'Set a condition and listing price before publishing.' }, { status: 400 }) }
    const slugBase = `${data.brand||''}-${data.item_name}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)
    const { error: productError } = await supabaseAdmin().from('products').upsert({ submission_id:data.id, slug:`${slugBase||'gear'}-${data.id.slice(0,8)}`, name:data.item_name, brand:data.brand, category:data.category, condition:data.condition, description:data.description, adventure_story:data.adventure_story, price:data.list_price, location:'Moncton', image_paths:data.photo_paths||[], status:'live' },{onConflict:'submission_id'})
    if (productError) return NextResponse.json({ error: productError.message }, { status: 500 })
  }
  return NextResponse.json({ submission: data })
}
