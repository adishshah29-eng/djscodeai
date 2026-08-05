-- DJS CodeAI Admin Panel schema — v2
-- Run this in the Supabase SQL editor on a fresh project (or after DROP ALL).
-- This version:
--   • adds vice_chair to user_role enum
--   • adds member_categories join table (members can belong to many categories)
--   • fixes infinite RLS recursion with SECURITY DEFINER helper functions

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role as enum ('super_admin', 'vice_chair', 'category_admin', 'member');
create type task_type as enum ('coding', 'general');
create type assignment_status as enum ('pending', 'submitted', 'approved', 'rejected');

-- ---------------------------------------------------------------------------
-- Categories (Marketing, Events, Publicity, Creatives, Tech, Projects …)
-- ---------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users) — holds role + personal details
-- category_id is used ONLY for heads (category_admin); members use member_categories
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role user_role not null default 'member',
  category_id uuid references categories (id) on delete set null, -- for heads only
  academic_year text,
  college_id text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index profiles_category_idx on profiles (category_id);
create index profiles_role_idx on profiles (role);

-- ---------------------------------------------------------------------------
-- Member-Categories — many-to-many: a member can belong to many categories
-- ---------------------------------------------------------------------------
create table member_categories (
  member_id uuid not null references profiles (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  primary key (member_id, category_id)
);

create index member_categories_category_idx on member_categories (category_id);

-- ---------------------------------------------------------------------------
-- Tasks — created by super_admin, vice_chair, or category_admin
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
-- Security-definer helpers — bypass RLS to avoid infinite recursion.
-- These are safe because they only expose very narrow facts, not raw rows.
-- ---------------------------------------------------------------------------

-- Returns the current user's role (used in RLS policies on other tables).
create function auth_role() returns user_role
language sql security definer stable
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

-- Returns the category_id assigned to the current head (category_admin).
create function auth_category_id() returns uuid
language sql security definer stable
set search_path = public
as $$
  select category_id from profiles where id = auth.uid();
$$;

-- True when a given member belongs to the current head's category (via member_categories).
create function member_in_auth_category(p_member_id uuid) returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from member_categories mc
    where mc.member_id = p_member_id
      and mc.category_id = auth_category_id()
  );
$$;

-- True when the current member has a task assignment for the given task.
create function member_has_task(p_task_id uuid) returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from task_assignments ta
    where ta.task_id = p_task_id and ta.member_id = auth.uid()
  );
$$;

-- True when a given task belongs to the current head's category (no RLS on tasks here).
create function task_in_auth_category(p_task_id uuid) returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (
    select 1 from tasks t
    where t.id = p_task_id and t.category_id = auth_category_id()
  );
$$;

-- True if current user is a top-level admin (chair or vice chair).
create function is_top_admin() returns boolean
language sql security definer stable
set search_path = public
as $$
  select auth_role() in ('super_admin', 'vice_chair');
$$;

-- ---------------------------------------------------------------------------
-- Privilege-escalation guard for profiles.role / profiles.category_id
-- ---------------------------------------------------------------------------
-- Postgres RLS policies can only see the NEW row in a WITH CHECK clause, not
-- compare it against OLD — so an UPDATE policy like "id = auth.uid()" (used
-- below so users can edit their own profile) can't by itself stop a user from
-- also changing their own `role` in the same statement. Enforce that here
-- instead, in a trigger that runs regardless of which RLS policy let the
-- INSERT/UPDATE through.
--
-- Requests made with the service-role key (server actions in this app —
-- already gated by requireAdmin()/requireSuperAdmin()) have no auth.uid()
-- and are trusted as-is.
create function prevent_profile_role_escalation() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if auth.uid() is null or is_top_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.role <> 'member' then
      raise exception 'Only a top admin can create a profile with role %', new.role;
    end if;
    return new;
  end if;

  -- tg_op = 'UPDATE'
  if new.role is distinct from old.role then
    raise exception 'Only a top admin can change a profile''s role';
  end if;
  if new.category_id is distinct from old.category_id then
    raise exception 'Only a top admin can change a profile''s category';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on profiles;
create trigger profiles_prevent_role_escalation
  before insert or update on profiles
  for each row execute function prevent_profile_role_escalation();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table profiles enable row level security;
alter table member_categories enable row level security;
alter table tasks enable row level security;
alter table task_assignments enable row level security;
alter table submissions enable row level security;

-- ── Categories ──────────────────────────────────────────────────────────────
-- Any signed-in user can read categories (needed for forms).
create policy "categories_select" on categories
  for select using (auth.uid() is not null);

-- Only Chair / Vice Chair can create / edit / delete categories.
create policy "categories_write" on categories
  for all using (is_top_admin())
  with check (is_top_admin());

-- ── Profiles ────────────────────────────────────────────────────────────────
-- Top admins see all profiles.
-- Heads see profiles of members in their category (via member_categories) + themselves.
-- Members see only themselves.
create policy "profiles_select" on profiles
  for select using (
    is_top_admin()
    or id = auth.uid()
    or (
      auth_role() = 'category_admin'
      and (
        id = auth.uid()
        or member_in_auth_category(id)
      )
    )
  );

create policy "profiles_insert" on profiles
  for insert with check (
    is_top_admin()
    or auth_role() = 'category_admin'  -- heads can create members; scope checked in app layer
  );

create policy "profiles_update" on profiles
  for update using (
    is_top_admin()
    or id = auth.uid()
    or (auth_role() = 'category_admin' and member_in_auth_category(id) and role = 'member')
  );

create policy "profiles_delete" on profiles
  for delete using (
    is_top_admin()
    or (auth_role() = 'category_admin' and member_in_auth_category(id) and role = 'member')
  );

-- ── Member Categories ────────────────────────────────────────────────────────
-- Top admins see all. Heads see rows for their category. Members see their own.
create policy "member_categories_select" on member_categories
  for select using (
    is_top_admin()
    or member_id = auth.uid()
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
  );

create policy "member_categories_write" on member_categories
  for all using (
    is_top_admin()
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
  )
  with check (
    is_top_admin()
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
  );

-- ── Tasks ───────────────────────────────────────────────────────────────────
-- Uses security-definer helper member_has_task() to avoid the tasks↔task_assignments
-- RLS infinite recursion.
create policy "tasks_select" on tasks
  for select using (
    is_top_admin()
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
    or member_has_task(id)
  );

create policy "tasks_write" on tasks
  for all using (
    is_top_admin()
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
  )
  with check (
    is_top_admin()
    or (auth_role() = 'category_admin' and category_id = auth_category_id())
  );

-- ── Task Assignments ─────────────────────────────────────────────────────────
-- Uses security-definer helper task_in_auth_category() to avoid the circular loop.
create policy "assignments_select" on task_assignments
  for select using (
    is_top_admin()
    or member_id = auth.uid()
    or (auth_role() = 'category_admin' and task_in_auth_category(task_id))
  );

create policy "assignments_write" on task_assignments
  for all using (
    is_top_admin()
    or (auth_role() = 'category_admin' and task_in_auth_category(task_id))
  )
  with check (
    is_top_admin()
    or (auth_role() = 'category_admin' and task_in_auth_category(task_id))
  );

-- Members can update their own assignment status (pending → submitted).
create policy "assignments_member_update" on task_assignments
  for update using (member_id = auth.uid())
  with check (member_id = auth.uid());

-- ── Submissions ──────────────────────────────────────────────────────────────
create policy "submissions_select" on submissions
  for select using (
    is_top_admin()
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
    is_top_admin()
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

drop policy if exists "submissions_bucket_read" on storage.objects;
create policy "submissions_bucket_read" on storage.objects
  for select using (
    bucket_id = 'submissions' and auth.uid() is not null
  );

drop policy if exists "submissions_bucket_write" on storage.objects;
create policy "submissions_bucket_write" on storage.objects
  for insert with check (
    bucket_id = 'submissions' and auth.uid() is not null
  );

-- ---------------------------------------------------------------------------
-- Seed: first super admin (Chair Person).
-- Use `npm run seed:admin` instead of this block — see SETUP.md.
-- ---------------------------------------------------------------------------
-- insert into profiles (id, full_name, email, role)
-- values ('00000000-0000-0000-0000-000000000000', 'Chair Person', 'admin@djscodeai.in', 'super_admin');
