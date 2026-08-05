-- Fix: privilege-escalation via profiles.role / profiles.category_id
-- ---------------------------------------------------------------------------
-- Run this once in the Supabase SQL Editor on your existing project.
-- (schema.sql has also been updated so fresh installs get this by default —
-- this file is only needed to patch a database that already exists.)
--
-- The bug: the "profiles_update" RLS policy only has a USING clause
-- ("id = auth.uid()", so users can edit their own profile), no WITH CHECK.
-- Postgres then reuses USING as the check on the new row too — and since a
-- user's own id never changes, that check still passes no matter what else
-- they change in the same UPDATE. Because the Supabase anon key is public
-- (it ships in the browser bundle) and any signed-in member/Head already
-- holds a valid session, this means anyone could open devtools and run:
--
--   supabase.from('profiles').update({ role: 'super_admin' }).eq('id', myId)
--
-- ...and grant themselves full admin access, completely bypassing the app's
-- own role checks (which only run in the Next.js server actions/UI, not at
-- the database level). Fixed with a trigger that blocks any non-top-admin,
-- non-service-role request from changing role/category_id at all.
-- ---------------------------------------------------------------------------

create or replace function prevent_profile_role_escalation() returns trigger
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
