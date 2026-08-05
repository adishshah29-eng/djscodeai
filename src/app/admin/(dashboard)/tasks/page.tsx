import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";

interface TaskRow {
  id: string;
  title: string;
  type: string;
  due_date: string | null;
  created_at: string;
  categories: { name: string } | null;
  task_assignments: { status: string }[];
}

export default async function TasksPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select("id, title, type, due_date, created_at, categories(name), task_assignments(status)")
    .order("created_at", { ascending: false });

  if (profile.role === "category_admin" && profile.category_id) {
    query = query.eq("category_id", profile.category_id);
  }

  const { data: tasks } = (await query) as unknown as { data: TaskRow[] | null };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-panel-text">Tasks</h1>
          <p className="mt-1 text-sm text-panel-muted">
            {tasks?.length ?? 0} task{tasks?.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/tasks/new">
          <Button>Create task</Button>
        </Link>
      </div>

      <Card className="mt-6 divide-y divide-panel-border">
        {!tasks?.length && (
          <p className="p-5 text-sm text-panel-muted">No tasks yet.</p>
        )}
        {tasks?.map((task) => {
          const total = task.task_assignments.length;
          const pending = task.task_assignments.filter((a) => a.status === "submitted").length;
          const isOverdue = task.due_date && new Date(task.due_date) < new Date();
          return (
            <Link
              key={task.id}
              href={`/admin/tasks/${task.id}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-panel-bg"
            >
              <div className="min-w-0">
                <p className="font-medium text-panel-text">{task.title}</p>
                <p className="truncate text-xs text-panel-muted">
                  {task.categories?.name ?? "—"} · {total} assigned
                  {task.due_date ? ` · due ${new Date(task.due_date).toLocaleDateString()}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="default">{task.type}</Badge>
                {isOverdue && <Badge variant="danger">Overdue</Badge>}
                {pending > 0 && <Badge variant="submitted">{pending} to review</Badge>}
              </div>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
