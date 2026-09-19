import Link from 'next/link'
import { MapPin, CalendarDays, Users } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

type Adventure = { id:string; name:string; title:string; adventure_type:string; location:string; starts_at:string|null; description:string }

export default async function AdventureBoard(){
  const { data } = await supabaseAdmin().from('adventure_posts').select('id,name,title,adventure_type,location,starts_at,description').eq('status','published').order('starts_at',{ascending:true,nullsFirst:false}).limit(100)
  const adventures=(data||[]) as Adventure[]
  return <main className="container-x py-14 sm:py-20">
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl"><span className="pill">Community</span><h1 className="display mt-5 text-5xl text-forest sm:text-6xl">Adventure Board</h1><p className="mt-4 text-lg leading-8 text-forest/65">Find a hike, paddle, camp or trail run—and meet people who would rather be outside.</p></div>
      <Link href="/adventure-board/new" className="btn-primary shrink-0">Post an adventure</Link>
    </div>
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {adventures.map(a=><article key={a.id} className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-forest/5">
        <div className="flex items-center justify-between gap-3"><span className="pill">{a.adventure_type}</span>{a.starts_at&&<span className="text-xs font-bold text-rust">{new Date(a.starts_at).toLocaleDateString('en-CA',{month:'short',day:'numeric'})}</span>}</div>
        <h2 className="display mt-5 text-3xl text-forest">{a.title}</h2>
        <div className="mt-4 grid gap-2 text-sm text-forest/60">
          <p className="flex items-center gap-2"><MapPin size={16}/>{a.location}</p>
          {a.starts_at&&<p className="flex items-center gap-2"><CalendarDays size={16}/>{new Date(a.starts_at).toLocaleString('en-CA',{dateStyle:'medium',timeStyle:'short'})}</p>}
          <p className="flex items-center gap-2"><Users size={16}/>Posted by {a.name}</p>
        </div>
        <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-forest/70">{a.description}</p>
      </article>)}
      {!adventures.length&&<div className="rounded-3xl bg-white p-8 text-forest/60 md:col-span-2"><h2 className="display text-3xl text-forest">The board is waiting.</h2><p className="mt-2">Be the first to post an adventure and find your people.</p><Link href="/adventure-board/new" className="btn-primary mt-5 inline-flex">Post an adventure</Link></div>}
    </div>
    <p className="mt-8 text-sm text-forest/50">For safety, the board only shows the general meeting area. Contact details submitted for review are never published.</p>
  </main>
}