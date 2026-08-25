import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight, Coffee, Footprints, Users} from 'lucide-react';

const cards = [
  {tag:'Nomads Cafe', title:'Sunrise coffee hike', meta:'Saturday · 7–10 AM · 36 spots', text:'The trailhead stays secret until the coordinates drop. We bring the coffee. You bring a mug.', icon:Coffee, href:'/community', image:'/assets/photography/hush-hush-wide.jpg', alt:'Hush Hush community coffee hike poster'},
  {tag:'FOOTPATH', title:'The 4-day kit', meta:'Rent · 3–5 days · Moncton pickup', text:'A lightweight, trail-ready kit for people passing through to walk the Fundy Footpath.', icon:Footprints, href:'/rent', image:'/assets/photography/fundy-hiker.jpg', alt:'Hiker overlooking the Fundy coast'},
  {tag:'FIND YOUR PEOPLE', title:'Adventure board', meta:'Looking for company?', text:'Share a hike, find a paddle buddy, join a group or simply say hello.', icon:Users, href:'/community#board', image:'/assets/photography/fundy-forest.jpg', alt:'Forest trail in Atlantic Canada'}
];

export function AdventureCards(){
  return <div className="grid gap-5 lg:grid-cols-3">
    {cards.map(c=>{
      const I=c.icon;
      return <Link href={c.href} key={c.title} className="group card overflow-hidden p-0 transition hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={c.image} alt={c.alt} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/75 to-transparent" />
          <div className="absolute left-5 top-5"><span className="pill border-white/20 bg-white/90">{c.tag}</span></div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="display text-3xl text-forest">{c.title}</h3>
              <div className="mt-2 text-xs font-bold uppercase tracking-[.13em] text-rust">{c.meta}</div>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fog text-forest"><I size={19}/></span>
          </div>
          <p className="mt-4 text-sm leading-6 text-forest/65">{c.text}</p>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-forest">Explore <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1"/></div>
        </div>
      </Link>
    })}
  </div>
}
