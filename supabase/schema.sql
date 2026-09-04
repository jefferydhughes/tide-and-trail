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
  status text not null default 'new'
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  name text,
  membership_tier text not null,
  marketing_opt_in boolean not null default false,
  status text not null default 'pending'
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

-- Consignment story: the adventures this piece of gear has already been on.
alter table public.consignment_submissions
  add column if not exists adventure_story text;

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

create table if not exists public.consignment_messages (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  submission_id uuid not null references public.consignment_submissions(id) on delete cascade,
  type text not null, recipient_email text not null, subject text not null, body text not null,
  status text not null default 'queued' check (status in ('queued','sent','failed')), sent_at timestamptz
);
create index if not exists consignment_messages_submission_id_idx on public.consignment_messages(submission_id);
create index if not exists consignment_messages_status_idx on public.consignment_messages(status);

-- Operational workflow additions. These are additive and preserve existing submissions.
alter table public.consignment_submissions add column if not exists updated_at timestamptz not null default now();
alter table public.consignment_submissions add column if not exists staff_notes text;
alter table public.consignment_submissions add column if not exists list_price numeric;
alter table public.consignment_submissions drop constraint if exists consignment_submissions_status_check;
update public.consignment_submissions set status='declined' where status='rejected';
alter table public.consignment_submissions add constraint consignment_submissions_status_check check (status in ('new','reviewing','accepted','drop_off','photography','graded','priced','ready_for_tuesday','live','sold','paid','declined')) not valid;
alter table public.consignment_submissions validate constraint consignment_submissions_status_check;
create index if not exists consignment_submissions_status_created_idx on public.consignment_submissions(status,created_at desc);
alter table public.memberships alter column status set default 'pending';

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  submission_id uuid unique references public.consignment_submissions(id) on delete set null,
  slug text unique not null, name text not null, brand text, category text, condition text not null,
  description text, adventure_story text, price numeric not null check (price >= 0),
  location text default 'Moncton', image_paths text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','scheduled','live','reserved','sold')), drop_at timestamptz
);
create index if not exists products_status_drop_idx on public.products(status,drop_at desc);

create table if not exists public.product_reservations (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null, email text not null, phone text, notes text,
  expires_at timestamptz not null default (now()+interval '24 hours'),
  status text not null default 'active' check (status in ('active','confirmed','expired','cancelled'))
);
create index if not exists product_reservations_product_status_idx on public.product_reservations(product_id,status);

create or replace function public.reserve_product(p_product_id uuid,p_name text,p_email text,p_phone text,p_notes text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid;
begin
  perform 1 from products where id=p_product_id and status='live' for update;
  if not found then raise exception 'PRODUCT_UNAVAILABLE'; end if;
  update products set status='reserved' where id=p_product_id;
  insert into product_reservations(product_id,name,email,phone,notes) values(p_product_id,p_name,p_email,p_phone,p_notes) returning id into v_id;
  return v_id;
end $$;

create table if not exists public.rental_requests (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  name text not null, email text not null, phone text, package text not null,
  starts_on date not null, ends_on date not null, party_size integer not null default 1 check (party_size between 1 and 12),
  notes text, status text not null default 'new' check (status in ('new','contacted','confirmed','completed','declined')),
  check (ends_on >= starts_on)
);

create table if not exists public.adventure_posts (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  name text not null, email text not null, title text not null, adventure_type text not null,
  location text not null, starts_at timestamptz, description text not null,
  status text not null default 'pending' check (status in ('pending','published','closed','declined'))
);

create or replace function public.register_for_event(p_event_id uuid,p_name text,p_email text,p_phone text,p_guests integer,p_notes text,p_marketing_opt_in boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_event events%rowtype; v_taken integer; v_id uuid;
begin
  select * into v_event from events where id=p_event_id and status='published' and starts_at>now() for update;
  if not found then raise exception 'EVENT_UNAVAILABLE'; end if;
  select coalesce(sum(guests),0) into v_taken from event_signups where event_id=p_event_id;
  if v_event.capacity is not null and v_taken+p_guests>v_event.capacity then raise exception 'EVENT_FULL'; end if;
  insert into event_signups(event_id,name,email,phone,guests,notes,marketing_opt_in)
  values(p_event_id,p_name,p_email,p_phone,p_guests,p_notes,p_marketing_opt_in) returning id into v_id;
  return v_id;
end $$;

-- All browser traffic goes through validated server routes; service_role bypasses RLS.
alter table public.consignment_submissions enable row level security;
alter table public.consignment_messages enable row level security;
alter table public.memberships enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.events enable row level security;
alter table public.event_signups enable row level security;
alter table public.products enable row level security;
alter table public.product_reservations enable row level security;
alter table public.rental_requests enable row level security;
alter table public.adventure_posts enable row level security;
revoke execute on function public.register_for_event(uuid,text,text,text,integer,text,boolean) from public,anon,authenticated;
grant execute on function public.register_for_event(uuid,text,text,text,integer,text,boolean) to service_role;
revoke execute on function public.reserve_product(uuid,text,text,text,text) from public,anon,authenticated;
grant execute on function public.reserve_product(uuid,text,text,text,text) to service_role;
