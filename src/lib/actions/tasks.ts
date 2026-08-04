"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, canManageCategory } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AssignmentStatus, TaskType } from "@/lib/types";

export interface TaskFormState {
  error?: string;
}

export async function createTask(
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const admin = await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const type = String(formData.get("type") || "general") as TaskType;
  const dueDateRaw = String(formData.get("due_date") || "");
  const categoryId =
    admin.role === "category_admin" ? admin.category_id : String(formData.get("category_id") || "") || null;
  const assignAll = formData.get("assign_all") === "on";
  const memberIds = formData.getAll("member_ids").map(String);

  if (!title || !description) {
    return { error: "Title and description are required." };
  }
  if (!categoryId) {
    return { error: "Please select a category." };
  }
  if (!canManageCategory(admin, categoryId)) {
    return { error: "You cannot create tasks for this category." };
  }
  if (!assignAll && memberIds.length === 0) {
    return { error: "Select at least one member, or assign to the whole category." };
  }

  const supabase = await createClient();

  let assigneeIds = memberIds;
  if (assignAll) {
    const { data: members } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "member")
      .eq("category_id", categoryId);
    assigneeIds = (members ?? []).map((m) => m.id);
  }

  if (assigneeIds.length === 0) {
    return { error: "No members found to assign this task to." };
  }

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      title,
      description,
      type,
      category_id: categoryId,
      created_by: admin.id,
      due_date: dueDateRaw ? new Date(dueDateRaw).toISOString() : null,
    })
    .select("id")
    .single();

  if (taskError || !task) {
    return { error: taskError?.message || "Could not create task." };
  }

  const { error: assignError } = await supabase.from("task_assignments").insert(
    assigneeIds.map((memberId) => ({ task_id: task.id, member_id: memberId }))
  );

  if (assignError) {
    return { error: assignError.message };
  }

  revalidatePath("/admin/tasks");
  redirect(`/admin/tasks/${task.id}`);
}

export async function reviewSubmission(
  submissionId: string,
  assignmentId: string,
  decision: Extract<AssignmentStatus, "approved" | "rejected">,
  note: string
) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  await supabase
    .from("submissions")
    .update({
      reviewed_by: admin.id,
      review_note: note || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  await supabase.from("task_assignments").update({ status: decision }).eq("id", assignmentId);

  revalidatePath(`/admin/tasks`);
}

export async function deleteTask(taskId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", taskId);
  revalidatePath("/admin/tasks");
}
