import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
export const dynamic='force-dynamic'
export async function GET(){
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ products: [], unavailable: true })
  }

  try{const supabase=supabaseAdmin();const{data,error}=await supabase.from('products').select('id,slug,name,brand,category,condition,price,location,image_paths,drop_at').eq('status','live').order('created_at',{ascending:false}).limit(100);if(error)throw error;const products=await Promise.all((data||[]).map(async p=>{const path=p.image_paths?.[0];let image:string|undefined;if(path){const{data:signed}=await supabase.storage.from('consignment-photos').createSignedUrl(path,3600);image=signed?.signedUrl}return{...p,image}}));return NextResponse.json({products},{headers:{'Cache-Control':'public, s-maxage=60, stale-while-revalidate=300'}})}catch(e){console.error(e);return NextResponse.json({error:'Catalog unavailable.'},{status:500})}
}
