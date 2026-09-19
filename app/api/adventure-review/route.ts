import { NextResponse } from 'next/server'
import { gearRoomAuthorized } from '@/lib/gearRoomAuth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { cleanString, isUuid } from '@/lib/validation'

const statuses=['pending','published','closed','declined']
const types=['Hike','Paddle','Camp','Trail run','Other']

export async function GET(){
  if(!await gearRoomAuthorized())return NextResponse.json({error:'Unauthorized'},{status:401})
  const {data,error}=await supabaseAdmin().from('adventure_posts').select('*').order('created_at',{ascending:false}).limit(250)
  if(error)return NextResponse.json({error:error.message},{status:500})
  return NextResponse.json({adventures:data||[]})
}

export async function PATCH(request:Request){
  if(!await gearRoomAuthorized())return NextResponse.json({error:'Unauthorized'},{status:401})
  const b=await request.json().catch(()=>({}))
  if(!isUuid(b.id))return NextResponse.json({error:'Invalid adventure.'},{status:400})
  const update:Record<string,unknown>={}
  if(b.status!==undefined){if(!statuses.includes(b.status))return NextResponse.json({error:'Invalid status.'},{status:400});update.status=b.status}
  if(b.title!==undefined){const v=cleanString(b.title,180);if(!v)return NextResponse.json({error:'Title is required.'},{status:400});update.title=v}
  if(b.adventureType!==undefined){const v=cleanString(b.adventureType,60);if(!types.includes(v))return NextResponse.json({error:'Invalid adventure type.'},{status:400});update.adventure_type=v}
  if(b.location!==undefined){const v=cleanString(b.location,180);if(!v)return NextResponse.json({error:'Location is required.'},{status:400});update.location=v}
  if(b.description!==undefined){const v=cleanString(b.description,2000);if(!v)return NextResponse.json({error:'Description is required.'},{status:400});update.description=v}
  if(b.startsAt!==undefined){const v=cleanString(b.startsAt,40);if(v&&Number.isNaN(Date.parse(v)))return NextResponse.json({error:'Invalid date.'},{status:400});update.starts_at=v||null}
  const {data,error}=await supabaseAdmin().from('adventure_posts').update(update).eq('id',b.id).select().single()
  if(error)return NextResponse.json({error:error.message},{status:500})
  return NextResponse.json({adventure:data})
}