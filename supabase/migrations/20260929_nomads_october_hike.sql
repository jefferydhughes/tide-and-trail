-- Apply in Supabase SQL Editor before opening October Nomads registration.
-- The event UUID must already exist. Preserve existing signups; verify them against capacity.
update public.events
set starts_at = '2026-10-24 08:00:00-03'::timestamptz,
    capacity = 40,
    price = 0,
    status = 'published'
where id = '57a628a5-b567-456e-9508-9324f99b387d'::uuid;

create or replace function public.register_for_event(p_event_id uuid,p_name text,p_email text,p_phone text,p_guests integer,p_notes text,p_marketing_opt_in boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_event events%rowtype; v_taken integer; v_id uuid;
begin
  select * into v_event from events where id=p_event_id and status='published'
    and starts_at>now()
    and (id <> '57a628a5-b567-456e-9508-9324f99b387d'::uuid or starts_at>now() + interval '12 hours') for update;
  if not found then raise exception 'EVENT_UNAVAILABLE'; end if;
  select coalesce(sum(guests),0) into v_taken from event_signups where event_id=p_event_id;
  if v_event.capacity is not null and v_taken+p_guests>v_event.capacity then raise exception 'EVENT_FULL'; end if;
  insert into event_signups(event_id,name,email,phone,guests,notes,marketing_opt_in)
  values(p_event_id,p_name,p_email,p_phone,p_guests,p_notes,p_marketing_opt_in) returning id into v_id;
  return v_id;
end $$;

revoke execute on function public.register_for_event(uuid,text,text,text,integer,text,boolean) from public,anon,authenticated;
grant execute on function public.register_for_event(uuid,text,text,text,integer,text,boolean) to service_role;
