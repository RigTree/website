create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  username text not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username ~ '^[a-z0-9][a-z0-9_-]{1,31}$'
  )
);

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

create table if not exists public.setups (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  clerk_user_id text not null,
  slug text not null default 'main',
  title text not null default 'My RigTree setup',
  description text,
  visibility text not null default 'public',
  source_name text,
  source_repository text,
  source_commit text,
  source_license text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint setups_visibility_check check (visibility in ('public', 'private')),
  constraint setups_slug_format check (slug ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
  constraint setups_profile_slug_key unique (profile_id, slug)
);

create index if not exists setups_profile_visibility_idx
  on public.setups (profile_id, visibility);

create table if not exists public.setup_parts (
  id uuid primary key default gen_random_uuid(),
  setup_id uuid not null references public.setups(id) on delete cascade,
  buildcores_part_id text not null,
  category text not null,
  category_label text not null,
  name text not null,
  manufacturer text not null,
  series text,
  variant text,
  release_year integer,
  specs jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint setup_parts_setup_part_key unique (setup_id, buildcores_part_id)
);

create index if not exists setup_parts_setup_order_idx
  on public.setup_parts (setup_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists setups_set_updated_at on public.setups;
create trigger setups_set_updated_at
before update on public.setups
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.setups enable row level security;
alter table public.setup_parts enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Public setups are readable" on public.setups;
create policy "Public setups are readable"
on public.setups
for select
to anon, authenticated
using (visibility = 'public');

drop policy if exists "Public setup parts are readable" on public.setup_parts;
create policy "Public setup parts are readable"
on public.setup_parts
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.setups
    where setups.id = setup_parts.setup_id
      and setups.visibility = 'public'
  )
);

grant select on public.profiles to anon, authenticated;
grant select on public.setups to anon, authenticated;
grant select on public.setup_parts to anon, authenticated;

grant all on public.profiles to service_role;
grant all on public.setups to service_role;
grant all on public.setup_parts to service_role;
revoke execute on function public.set_updated_at() from public;
grant execute on function public.set_updated_at() to service_role;
