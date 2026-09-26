Before doing ANYTHING, read /brain/log.md to see what's already been done.

# Project: codeAI website

College club (DJS CodeAI) marketing + admin website. Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind v4, Supabase (auth/db) backend, Three.js/react-three-fiber for the 3D hero scene.

## Stack
- Next.js 16.2.12, React 19.2.4, TypeScript (strict)
- Tailwind CSS v4 (`@theme inline` tokens in `src/app/globals.css`, no `tailwind.config`)
- Supabase (`@supabase/ssr`) for auth — client/server/admin/middleware split in `src/lib/supabase/`
- GSAP + Lenis for scroll/animation, react-three-fiber/drei/postprocessing for the hero 3D scene
- NOTE: `AGENTS.md` at repo root warns this Next.js version has breaking changes from training-data assumptions — check `node_modules/next/dist/docs/` before relying on API memory.

## Repo structure
- `src/app/` — routes. Public site is `page.tsx` (single-page sections). `admin/(dashboard)` + `admin/login` and `member/(portal)` + `member/login` are gated areas.
- `src/components/` — public site sections as one component per section: `Hero`, `About`, `Events`, `Projects`, `Team`, `Contact`, `Footer`, `Navbar`, plus shared bits (`Reveal`, `SplitReveal`, `SmoothScroll`, `Preloader`, `HeroScene`, `Chatbot`).
- `src/components/admin/` — admin CRUD forms (`MemberForm`, `TaskForm`, `CategoryForm`, `HeadForm`, `ReviewForm`, `ImportForm`, `DeleteButton`).
- `src/components/member/` — member portal (`SubmitForm`).
- `src/components/ui/` — generic primitives (`Button`, `Card`, `Input`).
- `src/lib/` — `supabase/` (client/server/admin/middleware), `actions/` (server actions per domain: heads, submissions, categories, members, tasks, import, auth), `types.ts`, `auth.ts`, `password.ts`, `slugify.ts`.

## Conventions observed in code
- Section components are self-contained: local data arrays (see `Events.tsx`'s `EVENTS_2026`/`EVENTS_2025`) + the render logic in the same file, no separate data layer for static content.
- Design tokens live in `globals.css` as CSS vars (`--obsidian`, `--chrome-hi/mid/lo`, `--accent-cyan`, `--glass-border`, etc.) mapped into Tailwind via `@theme inline`. Use existing `bg-obsidian-*`, `text-chrome-*`, `border-glass-border` classes — don't hardcode colors.
- Admin panel has its own separate token set (`--panel-*`) distinct from the public site's dark theme.
- Monospace font (`var(--font-mono)`) used for dates/status/labels; `display-heading` class for large section/event titles.
- Status/badge patterns use small dedicated render functions (e.g. `StatusBadge` in `Events.tsx`) with a switch over a union type — copy this pattern rather than inlining conditional classNames.
- Expand/collapse accordions use CSS grid-rows trick (`grid-rows-[0fr]` / `grid-rows-[1fr]`) with `overflow-hidden`, not height animation libs.
- "use client" only on components that need interactivity/state; data/layout files stay server components.

## Current known state (check log.md for details/dates)
- `src/components/Navbar.tsx`: Admin and Member nav buttons (desktop + mobile) are temporarily commented out, not deleted. Restore by uncommenting.
- `src/components/Navbar.tsx`: logo (`public/7.png`) rendered with `brightness(0) invert(1)` filter to force pure white — the source PNG's own artwork is naturally low-contrast/faint, not pure white, so this filter is load-bearing. Removing it will bring back the washed-out look. Source is 1080x1080, high-res, safe to enlarge further if needed.

## Working agreement
- Update this file and `log.md` after every committed change in a session by default — don't wait to be asked.

## Branch & commit policy (always follow, every session)
- Work only on the current working branch. **Never** checkout, merge into, or push to `main`/`master` unless explicitly told to in that session.
- All commits authored by the user only — no `Co-Authored-By: Claude` or Anthropic attribution in any commit message.
- Always show the diff and exact commit message, and wait for explicit confirmation before committing.
- Never push automatically — only when explicitly asked.
