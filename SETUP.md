# Admin Panel Setup

This adds an admin panel + member portal on top of the marketing site:
Heads can add members (manually or via Excel import), assign coding or
general tasks scoped to a category, and members log in separately to submit
their work.

## 1. Create a Supabase project

Create a project at supabase.com, then go to **Settings → API** and copy:

- Project URL
- `anon` public key
- `service_role` secret key (never expose this to the browser)

Paste them into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 2. Apply the database schema

Open the Supabase SQL Editor and run `supabase/schema.sql`. This creates:

- `categories`, `profiles`, `tasks`, `task_assignments`, `submissions` tables
- Row Level Security policies scoped by role (`super_admin` sees everything,
  `category_admin` is scoped to their category, `member` sees only their own
  assignments/submissions)
- A private `submissions` storage bucket for file uploads

## 3. Create the first super admin

There's no signup form by design — accounts are always created by an admin.
Bootstrap the first one from the command line:

```
npm run seed:admin -- "Your Name" admin@djscodeai.in a-strong-password
```

Then sign in at `/admin/login`.

## 4. Roles

- **super_admin** (Chair Person) — manages categories, heads, all members, all tasks
- **vice_chair** (Vice Chair) — same top-level access as super_admin, minus
  the ability to manage categories; bootstrapped manually via SQL, no UI form
- **category_admin** (Head) — manages members and tasks within their
  assigned category only
- **member** (recruit) — logs in at `/member/login`, sees assigned tasks,
  submits text / links / files

Super admins create Heads from `/admin/heads`, and create/import
members from `/admin/members`.

## 5. Member import format

`/admin/members/import` accepts an `.xlsx` file with columns: `Full Name`,
`Email`, `Password` (optional — auto-generated if blank), `Phone`,
`Category`, `Academic Year`, `College ID`. Download a template from that page.
Generated passwords are shown once after import — save and share them
securely.

## Notes

- Auth is Supabase Auth (email + password), sessions handled via
  `@supabase/ssr` and refreshed in `proxy.ts` (Next.js 16 renamed
  `middleware.ts` → `proxy.ts`).
- Mutations use Server Actions (`src/lib/actions/*.ts`); every action
  re-verifies the caller's role server-side, and Postgres RLS is the second
  line of defense for anything not going through the service-role client.
