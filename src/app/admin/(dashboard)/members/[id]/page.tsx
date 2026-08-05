import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAdmin();
  const topAdmin = isTopAdmin(profile);
  if (!topAdmin) {
    notFound();
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: member } = await supabase
    .from("profiles")
    .select(`
      id, full_name, email, phone, academic_year, college_id, created_at,
      member_categories(
        categories(id, name)
      )
    `)
    .eq("id", id)
    .eq("role", "member")
    .single();

  if (!member) {
    notFound();
  }

  const { data: assignments } = await supabase
    .from("task_assignments")
    .select(`
      id, status, assigned_at,
      tasks(id, title, due_date, category_id, categories(name)),
      submissions(id, submitted_at)
    `)
    .eq("member_id", id)
    .order("assigned_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = (member.member_categories as any[]).map((mc) => Array.isArray(mc.categories) ? mc.categories[0] : mc.categories).filter(Boolean);

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/members"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-panel-muted hover:text-panel-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Members
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-panel-text">{member.full_name}</h1>
          <p className="mt-1 text-sm text-panel-muted">{member.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {categories.map((c: { id: string; name: string }) => (
              <Badge key={c.id} variant="default">
                {c.name}
              </Badge>
            ))}
          </div>
          <Link href={`/admin/members/${member.id}/edit`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-medium text-panel-muted mb-4">Contact Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-panel-muted">Phone</span>
              <span className="font-medium text-panel-text">{member.phone || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-panel-muted">College ID</span>
              <span className="font-medium text-panel-text">{member.college_id || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-panel-muted">Academic Year</span>
              <span className="font-medium text-panel-text">{member.academic_year || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-panel-muted">Joined</span>
              <span className="font-medium text-panel-text">
                {new Date(member.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-panel-text mb-4">Task History</h2>
        <Card className="divide-y divide-panel-border">
          {!assignments?.length ? (
            <p className="p-5 text-sm text-panel-muted">No tasks assigned yet.</p>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (assignments as any[]).map((assignment) => {
              // Supabase types tasks as array due to joined view, but it is actually a single task
              const task = Array.isArray(assignment.tasks) ? assignment.tasks[0] : assignment.tasks;
              let badgeVariant: "default" | "success" | "danger" | "warning" = "default";
              if (assignment.status === "approved") badgeVariant = "success";
              else if (assignment.status === "rejected") badgeVariant = "danger";
              else if (assignment.status === "submitted") badgeVariant = "warning";

              const isOverdue =
                assignment.status === "pending" &&
                task?.due_date &&
                new Date(task.due_date) < new Date();

              if (isOverdue) badgeVariant = "danger";

              return (
                <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                  <div>
                    <Link href={`/admin/tasks/${task.id}`} className="font-medium text-panel-text hover:underline flex items-center gap-1">
                      {task.title}
                      <ExternalLink className="h-3 w-3 text-panel-muted" />
                    </Link>
                    <p className="mt-1 text-xs text-panel-muted">
                      {task.categories?.name ?? (Array.isArray(task.categories) ? task.categories[0]?.name : "")} ·{" "}
                      {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : "No due date"}
                    </p>
                  </div>
                  <Badge variant={badgeVariant} className="w-fit shrink-0">
                    {isOverdue ? "Overdue" : assignment.status}
                  </Badge>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}
