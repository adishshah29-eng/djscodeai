import { notFound } from "next/navigation";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "@/components/member/SubmitForm";
import { Card, Badge } from "@/components/ui/Card";
import type { AssignmentStatus, Submission, TaskType } from "@/lib/types";

interface AssignmentDetail {
  id: string;
  status: AssignmentStatus;
  member_id: string;
  tasks: {
    title: string;
    description: string;
    type: TaskType;
    due_date: string | null;
    categories: { name: string } | null;
  } | null;
}

export default async function MemberTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireMember();
  const { id } = await params;
  const supabase = await createClient();

  const { data: assignment } = (await supabase
    .from("task_assignments")
    .select("id, status, member_id, tasks(title, description, type, due_date, categories(name))")
    .eq("id", id)
    .single()) as unknown as { data: AssignmentDetail | null };

  if (!assignment || assignment.member_id !== profile.id) notFound();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("task_assignment_id", id)
    .order("submitted_at", { ascending: false });

  const latest = (submissions as Submission[] | null)?.[0] ?? null;

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {assignment.tasks?.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {assignment.tasks?.categories?.name ?? "—"}
            {assignment.tasks?.due_date
              ? ` · Due ${new Date(assignment.tasks.due_date).toLocaleDateString()}`
              : ""}
          </p>
        </div>
        <Badge variant={assignment.status}>{assignment.status}</Badge>
      </div>

      <Card className="mt-4 p-5">
        <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
          {assignment.tasks?.description}
        </p>
      </Card>

      {latest?.review_note && (
        <Card className="mt-4 p-5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Feedback from reviewer
          </p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{latest.review_note}</p>
        </Card>
      )}

      {assignment.status !== "approved" && (
        <Card className="mt-6 p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
            {latest ? "Resubmit" : "Submit your work"}
          </h2>
          <SubmitForm assignmentId={assignment.id} />
        </Card>
      )}
    </div>
  );
}
