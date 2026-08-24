'use client';
import {Menu, Search, X} from 'lucide-react';
import Link from 'next/link';
import {useState} from 'react';
import {Logo} from './Logo';

const links=[['Shop Gear','/shop'],['Rent','/rent'],['Sell Gear','/sell'],['Community','/community'],['Repair','/repair']];
export function Header(){
 const [open,setOpen]=useState(false);
 return <header className="sticky top-0 z-50 border-b border-forest/10 bg-fog/95 backdrop-blur">
  <div className="container-x flex h-[74px] items-center justify-between gap-6"><Logo/>
   <nav className="hidden items-center gap-6 lg:flex">{links.map(([label,href])=><Link key={href} href={href} className="text-sm font-bold text-forest/75 hover:text-forest">{label}</Link>)}</nav>
   <div className="hidden items-center gap-2 sm:flex"><Link href="/shop" className="btn-ghost"><Search size={16}/> Find gear</Link><Link href="/community" className="btn-primary">Find your people</Link></div>
   <button onClick={()=>setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-full border border-forest/15 bg-white lg:hidden" aria-label="Menu">{open?<X/>:<Menu/>}</button>
  </div>
  {open && <div className="border-t border-forest/10 bg-fog lg:hidden"><div className="container-x flex flex-col gap-1 py-4">{links.map(([label,href])=><Link onClick={()=>setOpen(false)} key={href} href={href} className="rounded-2xl px-4 py-3 font-bold text-forest hover:bg-white">{label}</Link>)}<Link onClick={()=>setOpen(false)} href="/community" className="btn-primary mt-2">Find your people</Link></div></div>}
 </header>
}
