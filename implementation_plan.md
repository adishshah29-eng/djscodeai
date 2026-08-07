# Admin Panel Reskin + Full Data Visibility

## Context

The admin/member portal (everything under `/admin` and `/member`) currently uses a flat, generic gray "slate" palette (`Card.tsx`, `Button.tsx`, `Input.tsx`, the two portal layouts) that also silently follows the OS dark-mode preference — so on a dark-preference machine it renders as a drab, low-contrast dark-gray dashboard, disconnected from the site's actual brand look. The user wants this reskinned with a lighter, more colorful palette.

Separately, even though `super_admin`/`vice_chair` can already *query* all data (RLS's `is_top_admin()` bypasses category scoping), the UI never surfaces it that way — Members, Tasks, Heads, and Categories are four disconnected flat lists with no drill-down between them. A super admin has to already know which task belongs to which member to find anything. The goal is a connected view: pick a category → see its head + members + tasks; pick a member → see everything ever assigned to and submitted by them; pick a task → see every assignee and their submission (this last part already exists on the task detail page).

While auditing to plan this, I also found real gaps worth fixing in the same pass (explicitly invited by "add what you want is missing"): a duplicate/dead Recruiters feature nobody removed, no way to edit anything once created (only create+delete), submission files that never get cleaned up from storage, and no overdue-task indicator anywhere.

## Part 1 — Color System (admin + member portals only; marketing site untouched)

Add a new set of CSS custom properties to `src/app/globals.css` (same pattern the marketing site already uses: variables in `:root`, mapped via `@theme inline`), scoped to the portal UI:

- `--panel-bg: #F7F8FA` (page background, soft off-white)
- `--panel-surface: #FFFFFF` (cards)
- `--panel-border: #E4E8F0`
- `--panel-text: #1A1D29`
- `--panel-muted: #6B7080`
- `--panel-accent: #0EA5C4` (a darker, print-legible shade of the brand cyan `#4FE6FF` — the neon value fails contrast on white)
- `--panel-accent-soft: #E0F7FB` (accent tint for hover/active backgrounds)
- Role tint pairs (bg/fg) for badges and sidebar identity: Chair (`super_admin`) amber `#FEF3C7`/`#B45309`, Vice Chair (`vice_chair`) violet `#EDE9FE`/`#6D28D9`, Head (`category_admin`) teal `#CCFBF1`/`#0F766E`, Member `#DBEAFE`/`#1D4ED8`
- Status tints (pending/submitted/approved/rejected) re-tuned to sit on `--panel-surface` instead of the current slate versions

**Decision:** drop the `dark:` variants from the portal components entirely — one consistent light theme, matching "use some light colors" literally, instead of a light/dark pair. Easy to revisit if unwanted.

Files that get their hardcoded `slate-*`/`dark:*` classes replaced with the new tokens (pattern is identical across all of them — swap `bg-white dark:bg-slate-900` → `bg-panel-surface`, `text-slate-900 dark:text-white` → `text-panel-text`, etc.):
- `src/components/ui/Card.tsx`, `Button.tsx`, `Input.tsx` (adds Badge role-tint variants: `chair`, `vice_chair`, `head`, `member`)
- `src/components/NavLink.tsx`, `LoginForm.tsx`, `LogoutButton.tsx`
- `src/app/admin/(dashboard)/layout.tsx`, `src/app/member/(portal)/layout.tsx` (sidebars) — layout also gets a role-tinted badge next to the user's name using the new role variants
- `src/app/admin/login/page.tsx`, `src/app/member/login/page.tsx`
- Every page under `src/app/admin/(dashboard)/**` and `src/app/member/(portal)/**` (they only use the shared `Card`/`Button`/`Badge` components plus a handful of local `text-slate-*` headings — same swap)

## Part 2 — Full Data Visibility for Top Admins

New/expanded pages, all reusing `requireAdmin`/`requireSuperAdmin`/`isTopAdmin`/`canManageCategory` from `src/lib/auth.ts` for the same scoping every existing page already uses (heads still only see their own category on these new pages too — nothing here changes the RLS or permission model, only what's rendered):

1. **`/admin` dashboard overhaul** (`src/app/admin/(dashboard)/page.tsx`) — expand the 3 stat cards to include Categories, Heads, Approved, Rejected, Overdue counts, and add a per-category breakdown table (category → head → member count → task count → pending/approved/rejected counts), each row linking into its category detail page.

2. **`/admin/categories/[id]` (new)** — a category's head(s), every member in it (via `member_categories`), and every task assigned to it, all on one page. Links out to member and task detail pages.

3. **`/admin/members/[id]` (new)** — a member's profile, all categories they belong to, and their full assignment history (task title, status, submission content/files/review note) by joining `task_assignments` → `tasks`/`submissions`, the same join pattern already used in `src/app/admin/(dashboard)/tasks/[id]/page.tsx`. Members list rows (`src/app/admin/(dashboard)/members/page.tsx`) become links into this page.

4. **`/admin/submissions` (new)** — a cross-task inbox of every submission needing review (or all, filterable), so a top admin doesn't have to open each task individually to find the "N to review" ones. Scoped by category for heads, same as everywhere else.

No schema changes needed — every relation this requires (`member_categories`, `task_assignments`, `submissions`) already exists and is already reachable under RLS for top admins.

## Part 3 — Data Export

A "Export all data" button (top-admin only) on the new dashboard, hitting a new `GET /api/admin/export` route. Reuses the `xlsx` package already a dependency (see `src/lib/actions/import.ts` and `src/app/api/admin/import/template/route.ts` for the exact pattern) to produce a workbook with sheets: Categories, Heads, Members, Tasks, Assignments+Submissions — scoped to the requester the same way the dashboard queries are.

## Part 4 — Cleanup Found During Audit

- **Remove the duplicate Recruiters feature** — `src/app/admin/(dashboard)/recruiters/page.tsx`, `src/lib/actions/recruiters.ts`, `src/components/admin/RecruiterForm.tsx`. It's functionally identical to Heads (creates a `category_admin`), isn't linked from the sidebar nav, and only survives as a confusing, reachable-by-URL dead page.
- **Add Edit flows** for Members, Tasks, and Categories — today only create+delete exist anywhere in the app. New `updateMember`/`updateTask`/`updateCategory` actions alongside the existing `create*`/`delete*` ones in the same action files, with the existing form components (`MemberForm`, `TaskForm`, `CategoryForm`) taking an optional `initialValues` prop to double as edit forms.
- **Storage cleanup on delete** — `deleteTask` in `src/lib/actions/tasks.ts` cascades the DB rows but never removes the matching files from the `submissions` storage bucket; add a step that lists and deletes them first.
- **Overdue badge** — when `due_date` is past and status isn't `approved`, show an "Overdue" badge (new `Badge` variant) on task rows in `src/app/admin/(dashboard)/tasks/page.tsx`, the task detail page, and the member's task list.
- **Stop swallowing the DB error in `signIn()`** (`src/lib/actions/auth.ts`) — it currently treats "profile query failed" identically to "no profile found," which is exactly what made the recent permissions bug show up as a misleading "cannot access this portal." Log the real error server-side when `error` is set instead of only checking `!profile`.

## Phasing

1. Color system (Part 1) — fast, highly visible, zero data-layer risk.
2. Full data-visibility pages (Part 2).
3. Cleanup items (Part 4).
4. Excel export (Part 3).

## Verification

- `npm run lint` / `npm run build` after each phase.
- Browser smoke test via the dev server preview: sign in as `super_admin`, `vice_chair`, `category_admin` (Head), and a `member` account; walk every new/changed page for each; confirm a Head still cannot see another category's members/tasks (drill-down pages must 404 or redirect them the same way existing pages already do via `canManageCategory`); confirm the new color tokens render correctly and the marketing site (`/`) is untouched.