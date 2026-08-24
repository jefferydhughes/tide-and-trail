import Image from 'next/image';
import Link from 'next/link';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center"
      aria-label="Tide & Trail home"
    >
      <span
        className={[
          'relative flex items-center overflow-hidden rounded-xl',
          light ? 'bg-white px-3 py-2' : 'bg-transparent',
        ].join(' ')}
      >
        <Image
          src="/assets/logos/tide-trail-horizontal.png"
          alt="Tide & Trail — Good Gear. Another Adventure."
          width={264}
          height={92}
          priority
          className="h-auto w-[170px] sm:w-[205px]"
        />
      </span>
    </Link>
  );
}
