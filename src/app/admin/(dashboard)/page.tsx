import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

export default async function AdminHomePage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const isSuperAdmin = profile.role === "super_admin";

  let membersQuery = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "member");
  let tasksQuery = supabase.from("tasks").select("id", { count: "exact", head: true });
  const pendingQuery = supabase
    .from("task_assignments")
    .select("id", { count: "exact", head: true })
    .eq("status", "submitted");

  if (!isSuperAdmin && profile.category_id) {
    membersQuery = membersQuery.eq("category_id", profile.category_id);
    tasksQuery = tasksQuery.eq("category_id", profile.category_id);
  }

  const [{ count: memberCount }, { count: taskCount }, { count: pendingCount }] =
    await Promise.all([membersQuery, tasksQuery, pendingQuery]);

  const stats = [
    { label: "Members", value: memberCount ?? 0 },
    { label: "Tasks", value: taskCount ?? 0 },
    { label: "Pending review", value: pendingCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Welcome, {profile.full_name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {isSuperAdmin
          ? "Here's an overview across all categories."
          : "Here's an overview of your category."}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
