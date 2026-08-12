create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  title text not null,

  draft jsonb not null,
  plan jsonb not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plans_user_id_created_at_idx
  on public.plans (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists plans_set_updated_at on public.plans;

create trigger plans_set_updated_at
  before update on public.plans
  for each row
  execute function public.set_updated_at();


alter table public.plans enable row level security;

drop policy if exists "Users can read their own plans" on public.plans;
drop policy if exists "Users can create their own plans" on public.plans;
drop policy if exists "Users can update their own plans" on public.plans;
drop policy if exists "Users can delete their own plans" on public.plans;

create policy "Users can read their own plans"
  on public.plans
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own plans"
  on public.plans
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own plans"
  on public.plans
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own plans"
  on public.plans
  for delete
  to authenticated
  using (auth.uid() = user_id);