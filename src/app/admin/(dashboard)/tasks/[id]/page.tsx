import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { deleteTask } from "@/lib/actions/tasks";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Pencil } from "lucide-react";
import type { AssignmentStatus, Submission } from "@/lib/types";

interface AssignmentRow {
  id: string;
  member_id: string;
  status: AssignmentStatus;
  profiles: { full_name: string; email: string } | null;
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("tasks")
    .select("*, categories(name)")
    .eq("id", id)
    .single();

  if (!task) notFound();

  const { data: assignments } = (await supabase
    .from("task_assignments")
    .select("id, member_id, status, profiles(full_name, email)")
    .eq("task_id", id)
    .order("assigned_at")) as unknown as { data: AssignmentRow[] | null };

  const assignmentIds = (assignments ?? []).map((a) => a.id);
  const { data: submissions } =
    assignmentIds.length > 0
      ? await supabase
          .from("submissions")
          .select("*")
          .in("task_assignment_id", assignmentIds)
          .order("submitted_at", { ascending: false })
      : { data: [] as Submission[] };

  const latestByAssignment = new Map<string, Submission>();
  for (const submission of submissions ?? []) {
    if (!latestByAssignment.has(submission.task_assignment_id)) {
      latestByAssignment.set(submission.task_assignment_id, submission);
    }
  }

  const signedFileUrls = new Map<string, string>();
  for (const submission of latestByAssignment.values()) {
    for (const path of submission.file_paths) {
      const { data } = await supabase.storage
        .from("submissions")
        .createSignedUrl(path, 60 * 60);
      if (data?.signedUrl) signedFileUrls.set(path, data.signedUrl);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-panel-text">{task.title}</h1>
          <p className="mt-1 text-sm text-panel-muted">
            {task.categories?.name ?? "—"} ·{" "}
            {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : "No due date"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/admin/tasks/${task.id}/edit`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteButton
            action={deleteTask.bind(null, task.id)}
            confirmMessage={`Delete task "${task.title}"? This removes all assignments and submissions.`}
          />
        </div>
      </div>

      <Card className="mt-4 p-5">
        <p className="whitespace-pre-wrap text-sm text-panel-text">
          {task.description}
        </p>
      </Card>

      <h2 className="mt-8 text-lg font-semibold text-panel-text">
        Assignments ({assignments?.length ?? 0})
      </h2>

      <div className="mt-4 space-y-3">
        {assignments?.map((assignment) => {
          const submission = latestByAssignment.get(assignment.id);
          return (
            <Card key={assignment.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-panel-text">
                    {assignment.profiles?.full_name}
                  </p>
                  <p className="text-xs text-panel-muted">
                    {assignment.profiles?.email}
                  </p>
                </div>
                <Badge variant={assignment.status}>{assignment.status}</Badge>
              </div>

              {submission && (
                <div className="mt-3 space-y-2 border-t border-panel-border pt-3 text-sm">
                  {submission.text_response && (
                    <p className="whitespace-pre-wrap text-panel-text">
                      {submission.text_response}
                    </p>
                  )}
                  {submission.link_url && (
                    <a
                      href={submission.link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-600 underline"
                    >
                      {submission.link_url}
                    </a>
                  )}
                  {submission.file_paths.length > 0 && (
                    <ul className="space-y-1">
                      {submission.file_paths.map((path) => (
                        <li key={path}>
                          <a
                            href={signedFileUrls.get(path) ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            {path.split("/").pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {submission.review_note && (
                    <p className="text-xs text-panel-muted">
                      Review note: {submission.review_note}
                    </p>
                  )}
                </div>
              )}

              {assignment.status === "submitted" && submission && (
                <ReviewForm submissionId={submission.id} assignmentId={assignment.id} />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
