-- Correct the existing October hike without changing signups or other event details.
-- Apply in Supabase SQL Editor even if the earlier October migration was already applied.
update public.events
set starts_at = '2026-10-24 09:00:00-03'::timestamptz
where id = '57a628a5-b567-456e-9508-9324f99b387d'::uuid;

-- Keep registration closing at the advertised October 23, 8 PM Atlantic deadline.
create or replace function public.register_for_event(p_event_id uuid,p_name text,p_email text,p_phone text,p_guests integer,p_notes text,p_marketing_opt_in boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_event events%rowtype; v_taken integer; v_id uuid;
begin
  select * into v_event from events where id=p_event_id and status='published'
    and starts_at>now()
    and (id <> '57a628a5-b567-456e-9508-9324f99b387d'::uuid or now() < '2026-10-23 20:00:00-03'::timestamptz) for update;
  if not found then raise exception 'EVENT_UNAVAILABLE'; end if;
  select coalesce(sum(guests),0) into v_taken from event_signups where event_id=p_event_id;
  if v_event.capacity is not null and v_taken+p_guests>v_event.capacity then raise exception 'EVENT_FULL'; end if;
  insert into event_signups(event_id,name,email,phone,guests,notes,marketing_opt_in)
  values(p_event_id,p_name,p_email,p_phone,p_guests,p_notes,p_marketing_opt_in) returning id into v_id;
  return v_id;
end $$;

revoke execute on function public.register_for_event(uuid,text,text,text,integer,text,boolean) from public,anon,authenticated;
grant execute on function public.register_for_event(uuid,text,text,text,integer,text,boolean) to service_role;
