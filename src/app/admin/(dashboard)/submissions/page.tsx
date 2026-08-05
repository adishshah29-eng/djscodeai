import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function SubmissionsInboxPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Fetch recent submissions across all tasks.
  // RLS ensures Top Admins see all, Heads see only their category's submissions.
  const { data: submissions } = await supabase
    .from("submissions")
    .select(`
      id, submitted_at,
      task_assignments!inner(
        id, status,
        tasks!inner(id, title, categories(name)),
        profiles!inner(id, full_name)
      )
    `)
    .order("submitted_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold text-panel-text">Submissions Inbox</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Recent submissions requiring review or recently processed.
      </p>

      <Card className="mt-6 divide-y divide-panel-border">
        {!submissions?.length && (
          <p className="p-5 text-sm text-panel-muted">No submissions found.</p>
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(submissions as any[])?.map((sub) => {
          const assignment = Array.isArray(sub.task_assignments) ? sub.task_assignments[0] : sub.task_assignments;
          const task = Array.isArray(assignment?.tasks) ? assignment.tasks[0] : assignment?.tasks;
          const profile = Array.isArray(assignment?.profiles) ? assignment.profiles[0] : assignment?.profiles;
          const category = Array.isArray(task?.categories) ? task.categories[0] : task?.categories;

          return <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-panel-text">{profile?.full_name}</span>
                    <span className="text-panel-muted text-sm">submitted for</span>
                    <Link href={`/admin/tasks/${task?.id}`} className="font-medium text-panel-text hover:underline inline-flex items-center gap-1">
                      {task?.title}
                      <ExternalLink className="h-3 w-3 text-panel-muted" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-panel-muted">
                    <span>{category?.name ?? "General"}</span>
                    <span>·</span>
                    <span>{new Date(sub.submitted_at).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={
                    assignment?.status === "approved" ? "success" : 
                    assignment?.status === "rejected" ? "danger" : 
                    assignment?.status === "submitted" ? "warning" : "default"
                  }>
                    {assignment?.status}
                  </Badge>
              </div>
            </div>;
        })}
      </Card>
    </div>
  );
}
