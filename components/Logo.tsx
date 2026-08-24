import Link from 'next/link';

export function Logo({light=false}:{light?:boolean}){
  return <Link href="/" className="flex items-center gap-3" aria-label="Tide & Trail home">
    <span className={`grid h-11 w-11 place-items-center rounded-full border ${light?'border-sand/50 bg-white/10':'border-forest/20 bg-white'} text-forest`}>
      <svg viewBox="0 0 48 48" className={`h-8 w-8 ${light?'text-sand':'text-forest'}`} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 29c7-8 11 8 18 0s11 8 20-1" strokeLinecap="round"/>
        <path d="M7 36c7-8 11 7 18 0s11 7 18-1" strokeLinecap="round" opacity=".7"/>
        <path d="M26 8c-7 5-9 10-9 16 5-4 10-4 15-1 1-6-1-11-6-15Z" opacity=".55"/>
      </svg>
    </span>
    <span className={`font-black uppercase tracking-[.18em] ${light?'text-white':'text-forest'}`}>Tide <span className="text-rust">&</span> Trail</span>
  </Link>
}
