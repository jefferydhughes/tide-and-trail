import Image from 'next/image';

export function HeroArt() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-fundy shadow-soft">
      <Image
        src="/assets/photography/fundy-coast.jpg"
        alt="The Bay of Fundy coastline at golden hour"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/10 to-transparent" />
      <div className="absolute inset-0 opacity-25 topo" />
      <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white">
        <div>
          <div className="text-xs font-bold uppercase tracking-[.25em] text-sand">Bay of Fundy / NB</div>
          <div className="display mt-2 text-4xl sm:text-5xl">Go find<br />your people.</div>
        </div>
        <div className="hidden max-w-[210px] text-right sm:block">
          <div className="text-xs uppercase tracking-[.2em] text-white/70">Tide & Trail</div>
          <div className="mt-1 text-sm font-bold text-white">Good gear. Another adventure.</div>
        </div>
      </div>
    </div>
  );
}
