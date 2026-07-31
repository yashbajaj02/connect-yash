create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  thumbnail_url text not null,
  live_link text default '',
  github_link text default '',
  featured boolean not null default false,
  display_order integer not null default 0,
  category text not null default 'Web App',
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Anyone can read projects" on public.projects;
create policy "Anyone can read projects"
on public.projects for select
using (true);

drop policy if exists "Anyone can insert projects" on public.projects;
create policy "Anyone can insert projects"
on public.projects for insert
with check (true);

drop policy if exists "Anyone can update projects" on public.projects;
create policy "Anyone can update projects"
on public.projects for update
using (true)
with check (true);

drop policy if exists "Anyone can delete projects" on public.projects;
create policy "Anyone can delete projects"
on public.projects for delete
using (true);


