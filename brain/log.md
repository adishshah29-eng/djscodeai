# Session Log

Most recent entry on top.

---

## 2026-09-22

**Done:**
- Updated `src/components/Events.tsx` `EVENTS_2026` list:
  - Neurovate 2.0: removed "Coming Soon"/"Registrations Open" state, event has happened. Set `status: "closed"`, `date: "AUG 12, 2026"`, `time: "12:30 PM"`, location unchanged (DJSCE Campus), description unchanged. Removed the Google Forms `link` field (register button auto-hides for non-"open" status, no template change needed).
  - Added new event "Prompt to Prototype": `date: "SEP 09, 2026"`, `time: "11:00 AM"`, location DJSCE Campus, `status: "closed"`.
  - Ordered newest-first (Sept 9 before Aug 12) to match the existing sort convention used in `EVENTS_2025`.
- Set up `/brain/` folder (this file + `CLAUDE.md`) for cross-session context.

**Decisions:**
- The "tag/subtitle" requested for Prompt to Prototype ("AI/ML Hackathon — Exclusively for Second Years") has no existing field/UI slot in `EventItem` or the render template. Decided to prepend it as the first sentence of the `description` field rather than add a new field + new UI to the shared `Events.tsx` template — avoids touching the component's rendering logic/layout for a one-off, keeps all event rows structurally identical. If more events need a real subtitle/tag going forward, revisit adding a proper `tag?: string` field + row UI at that point.
- No other files needed changes — `StatusBadge` and the register-button conditional (`status === "open" && event.link`) already handled the closed state correctly with zero component edits.

**Pending / not started:**
- Nothing else queued for the Events section as of this entry.
- Dev server: repeatedly observed being killed shortly after starting via background task tooling (not a code/app crash — logs show clean startup and successful requests before each kill). Root cause not identified; suspected external process/session teardown, not the app itself. `.env.local` also does not exist yet, so any Supabase-dependent route (`/admin/login`, etc.) will 500 in local dev until real Supabase URL/anon key are added.
