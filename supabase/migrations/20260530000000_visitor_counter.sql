-- Visitor counter schema for hardeep.cv
-- Applied to project zevgzzvsclcbwdqxftht (ap-south-1) via MCP; captured here so
-- the database is reproducible from source control.

-- Atomic visitor numbering. Sequence starts at 1205 so the first registered
-- visitor is #1205 (matching the design's seed of 1204 + 1).
create sequence if not exists public.visitor_number_seq start with 1205;

-- One row per unique visitor (dedup is done client-side via localStorage; this
-- table is the source of truth for the global count and an audit trail).
create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  number bigint not null,
  created_at timestamptz not null default now()
);

-- RLS on, no policies => deny-all to anon/authenticated. All access goes through
-- the SECURITY DEFINER functions below, which are granted only to service_role.
alter table public.visitors enable row level security;

-- Atomically claim the next number, persist the visitor, and return both.
create or replace function public.register_visitor()
returns table (id uuid, number bigint)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_number bigint;
begin
  v_number := nextval('public.visitor_number_seq');
  insert into public.visitors (number) values (v_number)
  returning visitors.id into v_id;
  return query select v_id, v_number;
end;
$$;

-- Look up a previously-registered visitor's number (returns no rows if unknown).
create or replace function public.lookup_visitor(p_id uuid)
returns table (id uuid, number bigint)
language sql
security definer
set search_path = ''
as $$
  select v.id, v.number from public.visitors v where v.id = p_id;
$$;

-- Least privilege: only the server-side service_role may call these. Revoke the
-- default PUBLIC execute grant so anon/authenticated cannot inflate the count.
revoke all on function public.register_visitor() from public, anon, authenticated;
revoke all on function public.lookup_visitor(uuid) from public, anon, authenticated;
grant execute on function public.register_visitor() to service_role;
grant execute on function public.lookup_visitor(uuid) to service_role;
