import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export default async function AdminHomePage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const topAdmin = isTopAdmin(profile);

  const membersQuery = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "member");
    
  let tasksQuery = supabase.from("tasks").select("id", { count: "exact", head: true });
  
  const pendingQuery = supabase
    .from("task_assignments")
    .select("id", { count: "exact", head: true })
    .eq("status", "submitted");

  const approvedQuery = supabase
    .from("task_assignments")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved");

  const rejectedQuery = supabase
    .from("task_assignments")
    .select("id", { count: "exact", head: true })
    .eq("status", "rejected");

  const overdueQuery = supabase
    .from("task_assignments")
    .select("id, tasks!inner(due_date)", { count: "exact", head: true })
    .eq("status", "pending")
    .lt("tasks.due_date", new Date().toISOString());

  const categoriesQuery = supabase.from("categories").select("id", { count: "exact", head: true });
  const headsQuery = supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "category_admin");

  if (!topAdmin && profile.category_id) {
    tasksQuery = tasksQuery.eq("category_id", profile.category_id);
    // Overdue implicitly filtered by RLS, pending implicitly filtered by RLS, etc.
  }

  const [
    { count: memberCount },
    { count: taskCount },
    { count: pendingCount },
    { count: approvedCount },
    { count: rejectedCount },
    { count: overdueCount },
    { count: categoryCount },
    { count: headCount },
  ] = await Promise.all([
    membersQuery,
    tasksQuery,
    pendingQuery,
    approvedQuery,
    rejectedQuery,
    overdueQuery,
    categoriesQuery,
    headsQuery,
  ]);

  const stats = [];
  if (topAdmin) {
    stats.push(
      { label: "Categories", value: categoryCount ?? 0 },
      { label: "Heads", value: headCount ?? 0 }
    );
  }
  stats.push(
    { label: "Members", value: memberCount ?? 0 },
    { label: "Tasks", value: taskCount ?? 0 },
    { label: "Pending", value: pendingCount ?? 0 },
    { label: "Approved", value: approvedCount ?? 0 },
    { label: "Rejected", value: rejectedCount ?? 0 },
    { label: "Overdue", value: overdueCount ?? 0 }
  );

  // For Top Admins: fetch category breakdown
  let breakdown: Array<{
    id: string;
    name: string;
    heads: string;
    memberCount: number;
    taskCount: number;
    pending: number;
    approved: number;
    rejected: number;
  }> = [];
  if (topAdmin) {
    const { data: cats } = await supabase.from("categories").select(`
      id,
      name,
      profiles!category_id(id, full_name, role),
      tasks(id),
      member_categories(member_id)
    `).order("name");

    const { data: allAssignments } = await supabase.from("task_assignments").select(`
      status,
      tasks!inner(category_id)
    `);

    if (cats && allAssignments) {
      breakdown = cats.map(c => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const catAssignments = (allAssignments as any[]).filter(a => {
          const task = Array.isArray(a.tasks) ? a.tasks[0] : a.tasks;
          return task?.category_id === c.id;
        });
        const pending = catAssignments.filter(a => a.status === "submitted").length;
        const approved = catAssignments.filter(a => a.status === "approved").length;
        const rejected = catAssignments.filter(a => a.status === "rejected").length;
        
        return {
          id: c.id,
          name: c.name,
          heads: c.profiles.filter((p: { role: string; full_name: string }) => p.role === 'category_admin').map((h: { full_name: string }) => h.full_name).join(", "),
          memberCount: c.member_categories.length,
          taskCount: c.tasks.length,
          pending,
          approved,
          rejected
        };
      });
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-panel-text">
            Welcome, {profile.full_name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-panel-muted">
            {topAdmin
              ? "Here's an overview across all categories."
              : "Here's an overview of your category."}
          </p>
        </div>
        {topAdmin && (
          <a
            href="/api/admin/export"
            className="inline-flex items-center gap-2 rounded-md bg-panel-accent px-4 py-2 text-sm font-medium text-white hover:bg-panel-accent/90 shrink-0"
          >
            <Download className="h-4 w-4" />
            Export Data
          </a>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-sm text-panel-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-panel-text">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {topAdmin && breakdown.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-panel-text mb-4">Category Breakdown</h2>
          <div className="overflow-x-auto rounded-lg border border-panel-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-panel-bg text-panel-muted border-b border-panel-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Head(s)</th>
                  <th className="px-4 py-3 font-medium text-right">Members</th>
                  <th className="px-4 py-3 font-medium text-right">Tasks</th>
                  <th className="px-4 py-3 font-medium text-right">Pending</th>
                  <th className="px-4 py-3 font-medium text-right">Approved</th>
                  <th className="px-4 py-3 font-medium text-right">Rejected</th>
                  <th className="px-4 py-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border bg-white">
                {breakdown.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-panel-text">{row.name}</td>
                    <td className="px-4 py-3 text-panel-muted">{row.heads || "—"}</td>
                    <td className="px-4 py-3 text-panel-text text-right">{row.memberCount}</td>
                    <td className="px-4 py-3 text-panel-text text-right">{row.taskCount}</td>
                    <td className="px-4 py-3 text-amber-600 font-medium text-right">{row.pending}</td>
                    <td className="px-4 py-3 text-emerald-600 font-medium text-right">{row.approved}</td>
                    <td className="px-4 py-3 text-rose-600 font-medium text-right">{row.rejected}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/categories/${row.id}`} className="text-panel-muted hover:text-panel-accent inline-flex items-center gap-1">
                        View <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
