import Link from 'next/link'

const grades = [
  { name: 'Pristine', label: 'Like new', text: 'Little to no evidence of use. Clean, complete and ready to go.' },
  { name: 'Excellent', label: 'Gently used', text: 'Clean, fully functional and ready for many more adventures. Minor signs of use may be present.' },
  { name: 'Good', label: 'Used & ready', text: 'Clearly used, but fully functional. Expect cosmetic wear, marks or other honest signs of a life outdoors.' },
  { name: 'Worn & Ready', label: 'Well loved', text: 'This piece has stories. It may show substantial cosmetic wear, but it still has useful adventures left in it.' },
  { name: 'Repair / Project', label: 'Not ready yet', text: 'Not currently adventure-ready. We only list these when there is a realistic repair, reuse or restoration opportunity.' },
]

export default function GearConditions(){return <main>
  <section className="bg-forest px-5 py-20 text-white">
    <div className="container-x max-w-4xl">
      <div className="pill border-white/20 bg-white/10 text-sand">How we grade gear</div>
      <h1 className="display mt-6 text-6xl leading-[.92] sm:text-8xl">Every piece has a history.<br/><span className="text-rust">We tell you what it is.</span></h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">Used gear should not be a mystery. We inspect every item before it reaches the marketplace and describe its condition honestly, so you know exactly what you are buying.</p>
    </div>
  </section>
  <section className="container-x py-16">
    <div className="grid gap-5 md:grid-cols-2">{grades.map((g,i)=><article key={g.name} className={`rounded-[2rem] p-7 ${i===0?'bg-sand':i===1?'bg-sage':i===4?'bg-forest text-white':'bg-white border border-forest/10'}`}>
      <div className="flex items-start justify-between gap-4"><div><div className={`text-xs font-black uppercase tracking-[.18em] ${i===4?'text-rust':'text-rust'}`}>{g.label}</div><h2 className="display mt-2 text-4xl">{g.name}</h2></div><div className="text-3xl font-black opacity-20">0{i+1}</div></div>
      <p className={`mt-5 leading-7 ${i===4?'text-white/65':'text-forest/65'}`}>{g.text}</p>
    </article>)}</div>
  </section>
  <section className="bg-sage px-5 py-16">
    <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
      <div><div className="pill">The Tide & Trail difference</div><h2 className="display mt-5 text-5xl text-forest">We don't hide the miles.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-forest/65">A scratch can be evidence of a great trip. A little dirt can mean a tent has kept someone dry. We would rather tell you the truth about a piece of gear than pretend it has never been outside.</p></div>
      <div className="rounded-[2rem] bg-white p-8 shadow-soft"><div className="text-xs font-black uppercase tracking-[.18em] text-rust">Its story</div><h3 className="display mt-3 text-3xl text-forest">What adventures has this gear been on?</h3><p className="mt-4 leading-7 text-forest/60">When consignors tell us the story, we can pass it along with the gear.</p><div className="mt-6 rounded-2xl bg-sand p-5 text-sm font-bold leading-6 text-forest/75">“Completed the Dobson in a Day, climbed Mount Carleton, ran a marathon…”</div><p className="mt-5 text-sm text-forest/50">The next owner doesn't just get equipment. They get a piece of the story—and a chance to add to it.</p></div>
    </div>
  </section>
  <section className="container-x py-16 text-center"><h2 className="display text-5xl text-forest">Ready for its next adventure?</h2><p className="mx-auto mt-4 max-w-xl text-forest/60">Shop used gear with confidence, or tell us about the gear waiting in your garage.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/shop" className="rounded-full bg-forest px-6 py-3 font-black text-white">Shop gear →</Link><Link href="/sell" className="rounded-full bg-rust px-6 py-3 font-black text-white">Sell your gear →</Link></div></section>
</main>}