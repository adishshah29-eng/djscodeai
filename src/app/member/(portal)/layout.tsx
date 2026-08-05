import { requireMember } from "@/lib/auth";
import { NavLink } from "@/components/NavLink";
import { LogoutButton } from "@/components/LogoutButton";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/Card";

export default async function MemberPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireMember();

  // Fetch this member's categories
  const adminClient = createAdminClient();
  const { data: mcRows } = await adminClient
    .from("member_categories")
    .select("categories(name)")
    .eq("member_id", profile.id) as unknown as {
    data: { categories: { name: string } | null }[] | null;
  };
  const categoryNames = (mcRows ?? [])
    .map((r) => r.categories?.name)
    .filter(Boolean) as string[];

  return (
    <div className="flex min-h-screen bg-panel-bg">
      <aside className="flex w-60 shrink-0 flex-col border-r border-panel-border bg-panel-surface p-4">
        <div className="mb-6 px-3">
          <p className="text-sm font-semibold text-panel-text">DJS CodeAI</p>
          <p className="text-xs text-panel-muted">Member Portal</p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink href="/member" exact>
            My Tasks
          </NavLink>
        </nav>

        <div className="mt-6 space-y-2 border-t border-panel-border pt-4">
          <div className="px-3 text-xs text-panel-muted">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-panel-text">
                {profile.full_name}
              </p>
              <Badge variant="member">Member</Badge>
            </div>
            <p className="truncate mt-1">{profile.email}</p>
            {categoryNames.length > 0 && (
              <p className="mt-1 truncate text-panel-muted">
                {categoryNames.join(" · ")}
              </p>
            )}
          </div>
          <LogoutButton redirectTo="/member/login" />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
