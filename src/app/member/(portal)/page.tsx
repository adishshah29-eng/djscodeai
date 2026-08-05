import Link from "next/link";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, Badge } from "@/components/ui/Card";
import type { AssignmentStatus, TaskType } from "@/lib/types";

interface AssignmentRow {
  id: string;
  status: AssignmentStatus;
  tasks: {
    title: string;
    type: TaskType;
    due_date: string | null;
    categories: { name: string } | null;
  } | null;
}

export default async function MemberDashboardPage() {
  const profile = await requireMember();
  const supabase = await createClient();

  const { data: assignments } = (await supabase
    .from("task_assignments")
    .select("id, status, tasks(title, type, due_date, categories(name))")
    .eq("member_id", profile.id)
    .order("assigned_at", { ascending: false })) as unknown as { data: AssignmentRow[] | null };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-panel-text">My Tasks</h1>
      <p className="mt-1 text-sm text-panel-muted">
        {assignments?.length ?? 0} task{assignments?.length === 1 ? "" : "s"} assigned to you.
      </p>

      <Card className="mt-6 divide-y divide-panel-border">
        {!assignments?.length && (
          <p className="p-5 text-sm text-panel-muted">
            No tasks assigned yet. Check back later.
          </p>
        )}
        {assignments?.map((assignment) => (
          <Link
            key={assignment.id}
            href={`/member/tasks/${assignment.id}`}
            className="flex items-center justify-between gap-4 p-4 hover:bg-panel-bg"
          >
            <div className="min-w-0">
              <p className="font-medium text-panel-text">
                {assignment.tasks?.title}
              </p>
              <p className="truncate text-xs text-panel-muted">
                {assignment.tasks?.categories?.name ?? "—"}
                {assignment.tasks?.due_date
                  ? ` · Due ${new Date(assignment.tasks.due_date).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="default">{assignment.tasks?.type}</Badge>
              <Badge variant={assignment.status}>{assignment.status}</Badge>
            </div>
          </Link>
        ))}
      </Card>
    </div>
  );
}
