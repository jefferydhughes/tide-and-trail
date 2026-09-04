'use client';
import {Menu, Search, X} from 'lucide-react';
import Link from 'next/link';
import {useState} from 'react';
import {Logo} from './Logo';

const links=[['Shop Gear','/shop'],['Rent','/rent'],['Sell Gear','/sell'],['Events','/events'],['Nomads Café','/nomads'],['Community','/community'],['Fresh Drop','/drop']];
export function Header(){
 const [open,setOpen]=useState(false);
 return <header className="sticky top-0 z-50 border-b border-forest/10 bg-fog/95 backdrop-blur">
  <div className="container-x flex h-[74px] items-center justify-between gap-6"><Logo/>
   <nav className="hidden items-center gap-5 xl:flex">{links.map(([label,href])=><Link key={href} href={href} className="text-sm font-bold text-forest/75 hover:text-forest">{label}</Link>)}</nav>
   <div className="hidden items-center gap-2 xl:flex"><Link href="/shop" className="btn-ghost"><Search size={16}/> Find gear</Link></div>
   <button onClick={()=>setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-full border border-forest/15 bg-white xl:hidden" aria-expanded={open} aria-label="Menu">{open?<X/>:<Menu/>}</button>
  </div>
  {open && <div className="border-t border-forest/10 bg-fog xl:hidden"><div className="container-x flex flex-col gap-1 py-4">{links.map(([label,href])=><Link onClick={()=>setOpen(false)} key={href} href={href} className="rounded-2xl px-4 py-3 font-bold text-forest hover:bg-white">{label}</Link>)}<Link onClick={()=>setOpen(false)} href="/membership" className="btn-primary mt-2">Join the community</Link></div></div>}
 </header>
}
