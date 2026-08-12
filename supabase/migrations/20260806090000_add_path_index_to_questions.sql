alter table public.plan_questions
  add column if not exists path_index integer;

comment on column public.plan_questions.path_index is
  'Index into the plan''s paths array. Null for questions asked before plans offered more than one path.';
