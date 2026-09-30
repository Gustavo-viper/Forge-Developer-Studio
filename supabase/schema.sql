-- Forge Developer Studio initial schema
-- Execute in Supabase SQL Editor after reviewing RLS policies.

create table if not exists public.forge_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.forge_projects enable row level security;

create policy "forge_projects_owner_select"
on public.forge_projects for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy "forge_projects_owner_insert"
on public.forge_projects for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "forge_projects_owner_update"
on public.forge_projects for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "forge_projects_owner_delete"
on public.forge_projects for delete
to authenticated
using ((select auth.uid()) = owner_id);
