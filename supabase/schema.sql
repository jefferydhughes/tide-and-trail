-- Tide & Trail MVP data model
create extension if not exists pgcrypto;

create table if not exists public.consignment_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  item_name text not null,
  brand text,
  category text,
  condition text,
  description text,
  estimated_purchase_price numeric,
  preferred_payout text not null default 'cash',
  pickup_postal_code text,
  photo_paths text[] not null default '{}',
  status text not null default 'new' check (status in ('new','reviewing','accepted','rejected','sold','paid'))
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  name text,
  membership_tier text not null,
  marketing_opt_in boolean not null default false,
  status text not null default 'active'
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  first_name text,
  source text default 'website',
  marketing_opt_in boolean not null default true
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  event_type text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  capacity integer,
  price numeric not null default 0,
  image_path text,
  status text not null default 'published'
);

create table if not exists public.event_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  guests integer not null default 1,
  notes text,
  marketing_opt_in boolean not null default false,
  unique(event_id,email)
);

-- Private storage bucket for submitted consignment photos.
insert into storage.buckets (id, name, public)
values ('consignment-photos','consignment-photos',false)
on conflict (id) do nothing;

-- The website uses the service role only from server routes, so no public table policies are required.
-- Keep the service role key server-side and never expose it as NEXT_PUBLIC_*.

insert into public.events (slug,title,event_type,description,starts_at,location,capacity,price,image_path)
values
('hush-hush-sunrise-coffee-hike','Sunrise Coffee Hike','Hush Hush','A little secret. A good walk. Coffee somewhere unexpected. The exact trailhead is revealed after you RSVP.',now() + interval '14 days','Greater Moncton / Fundy area',40,5,'/assets/photography/hush-hush-wide.jpg'),
('full-moon-paddle','Full Moon Paddle','Community','Calm water, headlamps and hot chocolate. Bring your own boat or ask about rental gear.',now() + interval '24 days','Bay of Fundy',14,5,'/assets/photography/fundy-paddle.jpg'),
('trail-steward-saturday','Trail Steward Saturday','Environment','Help care for a local trail, then share lunch. Tools and the good company are provided.',now() + interval '35 days','Fundy National Park area',30,0,'/assets/photography/fundy-forest.jpg')
on conflict (slug) do nothing;
