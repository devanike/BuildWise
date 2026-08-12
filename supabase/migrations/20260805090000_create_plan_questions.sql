create table if not exists public.plan_questions (
  id uuid primary key default gen_random_uuid(),

  plan_id uuid not null references public.plans (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  question text not null,
  answer text not null,

  related_section text,

  suggested_follow_ups jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists plan_questions_plan_id_created_at_idx
  on public.plan_questions (plan_id, created_at);

alter table public.plan_questions enable row level security;

drop policy if exists "Users can read their own questions" on public.plan_questions;
drop policy if exists "Users can ask questions on their own plans" on public.plan_questions;
drop policy if exists "Users can delete their own questions" on public.plan_questions;

create policy "Users can read their own questions"
  on public.plan_questions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can ask questions on their own plans"
  on public.plan_questions
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.plans p
      where p.id = plan_id
        and p.user_id = auth.uid()
    )
  );

create policy "Users can delete their own questions"
  on public.plan_questions
  for delete
  to authenticated
  using (auth.uid() = user_id);
