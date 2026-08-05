import { requireAdmin, getRoleLabel, isTopAdmin } from "@/lib/auth";
import { NavLink } from "@/components/NavLink";
import { LogoutButton } from "@/components/LogoutButton";
import { Badge } from "@/components/ui/Card";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();
  const topAdmin = isTopAdmin(profile);

  return (
    <div className="flex min-h-screen bg-panel-bg">
      <aside className="flex w-60 shrink-0 flex-col border-r border-panel-border bg-panel-surface p-4">
        <div className="mb-6 px-3">
          <p className="text-sm font-semibold text-panel-text">DJS CodeAI</p>
          <p className="text-xs text-panel-muted">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink href="/admin" exact>
            Dashboard
          </NavLink>
          <NavLink href="/admin/members">Members</NavLink>
          <NavLink href="/admin/tasks">Tasks</NavLink>
          <NavLink href="/admin/submissions">Submissions</NavLink>
          {topAdmin && <NavLink href="/admin/heads">Heads</NavLink>}
          {topAdmin && <NavLink href="/admin/categories">Categories</NavLink>}
        </nav>

        <div className="mt-6 space-y-2 border-t border-panel-border pt-4">
          <div className="px-3 text-xs text-panel-muted">
            <p className="truncate font-medium text-panel-text mb-1">
              {profile.full_name}
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              <Badge variant={profile.role === "super_admin" ? "chair" : profile.role === "vice_chair" ? "vice_chair" : profile.role === "category_admin" ? "head" : "member"}>
                {getRoleLabel(profile.role)}
              </Badge>
              {profile.role === "category_admin" && profile.category_id && (
                <HeadCategoryLabel categoryId={profile.category_id} />
              )}
            </div>
          </div>
          <LogoutButton redirectTo="/admin/login" />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

// Inline server component to fetch and show category name for heads
async function HeadCategoryLabel({ categoryId }: { categoryId: string }) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("name")
    .eq("id", categoryId)
    .single();
  if (!data) return null;
  return <span className="text-panel-muted"> — {data.name}</span>;
}
