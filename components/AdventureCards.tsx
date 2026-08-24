import Link from 'next/link';
import {ArrowUpRight, Coffee, Footprints, Users, Waves} from 'lucide-react';
const cards=[
 {tag:'HUSH HUSH',title:'Sunrise coffee hike',meta:'Saturday · 7–10 AM · 36 spots',text:'The trailhead stays secret until you RSVP. We bring the coffee. You bring a mug.',icon:Coffee,href:'/community'},
 {tag:'FOOTPATH',title:'The 4-day kit',meta:'Rent · 3–5 days · Moncton pickup',text:'A lightweight, trail-ready kit for people passing through to walk the Fundy Footpath.',icon:Footprints,href:'/rent'},
 {tag:'FIND YOUR PEOPLE',title:'Adventure board',meta:'Looking for company?',text:'Share a hike, find a paddle buddy, join a group or simply say hello.',icon:Users,href:'/community#board'}
];
export function AdventureCards(){return <div className="grid gap-5 lg:grid-cols-3">{cards.map(c=>{const I=c.icon;return <Link href={c.href} key={c.title} className="group card overflow-hidden p-6 transition hover:-translate-y-1"><div className="flex items-start justify-between"><span className="pill">{c.tag}</span><span className="grid h-10 w-10 place-items-center rounded-full bg-fog text-forest"><I size={19}/></span></div><h3 className="display mt-10 text-3xl text-forest">{c.title}</h3><div className="mt-2 text-xs font-bold uppercase tracking-[.13em] text-rust">{c.meta}</div><p className="mt-4 text-sm leading-6 text-forest/65">{c.text}</p><div className="mt-6 flex items-center gap-2 text-sm font-bold text-forest">Explore <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1"/></div></Link>})}</div>}
