-- DJS CodeAI Admin Panel schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role as enum ('super_admin', 'category_admin', 'member');
create type task_type as enum ('coding', 'general');
create type assignment_status as enum ('pending', 'submitted', 'approved', 'rejected');

-- ---------------------------------------------------------------------------
-- Categories (Marketing, Events, Publicity, Creatives, Tech ... configurable)
-- ---------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users) — holds role + personal details
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role user_role not null default 'member',
  category_id uuid references categories (id) on delete set null,
  academic_year text,
  college_id text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index profiles_category_idx on profiles (category_id);
create index profiles_role_idx on profiles (role);

-- ---------------------------------------------------------------------------
-- Tasks — created by super_admin or category_admin
-- ---------------------------------------------------------------------------
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type task_type not null default 'general',
  category_id uuid references categories (id) on delete set null,
  created_by uuid not null references profiles (id) on delete cascade,
  due_date timestamptz,
  created_at timestamptz not null default now()
);

create index tasks_category_idx on tasks (category_id);
create index tasks_created_by_idx on tasks (created_by);

-- ---------------------------------------------------------------------------
-- Task assignments — join table between tasks and member profiles
-- ---------------------------------------------------------------------------
create table task_assignments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks (id) on delete cascade,
  member_id uuid not null references profiles (id) on delete cascade,
  status assignment_status not null default 'pending',
  assigned_at timestamptz not null default now(),
  unique (task_id, member_id)
);

create index task_assignments_member_idx on task_assignments (member_id);
create index task_assignments_task_idx on task_assignments (task_id);

-- ---------------------------------------------------------------------------
-- Submissions — a member's response to an assignment (text, files, link)
-- ---------------------------------------------------------------------------
create table submissions (
  id uuid primary key default gen_random_uuid(),
  task_assignment_id uuid not null references task_assignments (id) on delete cascade,
  text_response text,
  link_url text,
  file_paths text[] not null default '{}',
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references profiles (id) on delete set null,
  review_note text,
  reviewed_at timestamptz
);

create index submissions_assignment_idx on submissions (task_assignment_id);

-- ---------------------------------------------------------------------------
-- Helper functions (security definer — used inside RLS policies to avoid
-- recursive lookups against `profiles` triggering RLS on itself)
-- ---------------------------------------------------------------------------
create function auth_role() returns user_role
language sql security definer stable
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create function auth_category_id() returns uuid
language sql security definer stable
set search_path = public
as $$
  select category_id from profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table task_assignments enable row level security;
alter table submissions enable row level security;

-- Categories: everyone signed in can read; only super_admin can write.
create policy "categories_select" on categories
  for select using (auth.uid() is not null);

create policy "categories_write" on categories
  for all using (auth_role() = 'super_admin')
  with check (auth_role() = 'super_admin');

-- Profiles: super_admin sees all; category_admin sees own category + self;
-- member sees only self.
create policy "profiles_select" on profiles
  for select using (
    auth_role() = 'super_admin'
    or id = auth.uid()
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
  );

create policy "profiles_insert" on profiles
  for insert with check (
    auth_role() = 'super_admin'
    or (auth_role() = 'category_admin' and role = 'member' and category_id = auth_category_id())
  );

create policy "profiles_update" on profiles
  for update using (
    auth_role() = 'super_admin'
    or id = auth.uid()
    or (auth_role() = 'category_admin' and category_id = auth_category_id() and role = 'member')
  );

create policy "profiles_delete" on profiles
  for delete using (
    auth_role() = 'super_admin'
    or (auth_role() = 'category_admin' and category_id = auth_category_id() and role = 'member')
  );

-- Tasks: super_admin all; category_admin scoped to own category; member can
-- read tasks assigned to them.
create policy "tasks_select" on tasks
  for select using (
    auth_role() = 'super_admin'
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
    or exists (
      select 1 from task_assignments ta
      where ta.task_id = tasks.id and ta.member_id = auth.uid()
    )
  );

create policy "tasks_write" on tasks
  for all using (
    auth_role() = 'super_admin'
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
  )
  with check (
    auth_role() = 'super_admin'
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
  );

-- Task assignments: super_admin all; category_admin scoped via task's
-- category; member sees only their own assignment rows.
create policy "assignments_select" on task_assignments
  for select using (
    auth_role() = 'super_admin'
    or member_id = auth.uid()
    or exists (
      select 1 from tasks t
      where t.id = task_assignments.task_id
        and auth_role() = 'category_admin'
        and t.category_id = auth_category_id()
    )
  );

create policy "assignments_write" on task_assignments
  for all using (
    auth_role() = 'super_admin'
    or exists (
      select 1 from tasks t
      where t.id = task_assignments.task_id
        and auth_role() = 'category_admin'
        and t.category_id = auth_category_id()
    )
  )
  with check (
    auth_role() = 'super_admin'
    or exists (
      select 1 from tasks t
      where t.id = task_assignments.task_id
        and auth_role() = 'category_admin'
        and t.category_id = auth_category_id()
    )
  );

-- Member can flip status only pending -> submitted (enforced in app layer too)
create policy "assignments_member_update" on task_assignments
  for update using (member_id = auth.uid())
  with check (member_id = auth.uid());

-- Submissions: member can insert/select their own; admins can select/review
-- within scope.
create policy "submissions_select" on submissions
  for select using (
    auth_role() = 'super_admin'
    or exists (
      select 1 from task_assignments ta
      where ta.id = submissions.task_assignment_id and ta.member_id = auth.uid()
    )
    or exists (
      select 1 from task_assignments ta
      join tasks t on t.id = ta.task_id
      where ta.id = submissions.task_assignment_id
        and auth_role() = 'category_admin'
        and t.category_id = auth_category_id()
    )
  );

create policy "submissions_insert" on submissions
  for insert with check (
    exists (
      select 1 from task_assignments ta
      where ta.id = submissions.task_assignment_id and ta.member_id = auth.uid()
    )
  );

create policy "submissions_review_update" on submissions
  for update using (
    auth_role() = 'super_admin'
    or exists (
      select 1 from task_assignments ta
      join tasks t on t.id = ta.task_id
      where ta.id = submissions.task_assignment_id
        and auth_role() = 'category_admin'
        and t.category_id = auth_category_id()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage bucket for submission attachments (private; access via signed URLs)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

create policy "submissions_bucket_read" on storage.objects
  for select using (
    bucket_id = 'submissions' and auth.uid() is not null
  );

create policy "submissions_bucket_write" on storage.objects
  for insert with check (
    bucket_id = 'submissions' and auth.uid() is not null
  );

-- ---------------------------------------------------------------------------
-- Seed: first super admin. Replace the UUID below with the auth.users id you
-- get back after creating the account (see README / setup instructions), or
-- run the bootstrap script `npm run seed:admin` instead of this block.
-- ---------------------------------------------------------------------------
-- insert into profiles (id, full_name, email, role)
-- values ('00000000-0000-0000-0000-000000000000', 'Super Admin', 'admin@djscodeai.in', 'super_admin');
