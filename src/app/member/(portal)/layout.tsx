import { requireMember } from "@/lib/auth";
import { NavLink } from "@/components/NavLink";
import { LogoutButton } from "@/components/LogoutButton";

export default async function MemberPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireMember();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 px-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">DJS CodeAI</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Member Portal</p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink href="/member" exact>
            My Tasks
          </NavLink>
        </nav>

        <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="px-3 text-xs text-slate-500 dark:text-slate-400">
            <p className="truncate font-medium text-slate-700 dark:text-slate-300">
              {profile.full_name}
            </p>
            <p className="truncate">{profile.email}</p>
          </div>
          <LogoutButton redirectTo="/member/login" />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
