import { requireAdmin, canManageCategory } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/admin/TaskForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the task details
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (!task || !canManageCategory(profile, task.category_id)) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <Link
        href={`/admin/tasks/${id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-panel-muted hover:text-panel-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Task
      </Link>
      
      <h1 className="text-2xl font-semibold text-panel-text">Edit Task</h1>
      <p className="mt-1 text-sm text-panel-muted mb-6">Update task title, description, or due date.</p>
      
      <TaskForm 
        categories={[]} 
        members={[]} 
        fixedCategoryId={task.category_id}
        task={task} 
      />
    </div>
  );
}
