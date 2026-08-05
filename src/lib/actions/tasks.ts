"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, canManageCategory } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
    admin.role === "category_admin"
      ? admin.category_id
      : String(formData.get("category_id") || "") || null;
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

  // Use admin client to avoid RLS issues when fetching member_categories
  const adminClient = createAdminClient();
  const supabase = await createClient();

  let assigneeIds = memberIds;
  if (assignAll) {
    // Get all members in this category via member_categories join table
    const { data: memberCats } = await adminClient
      .from("member_categories")
      .select("member_id")
      .eq("category_id", categoryId);
    assigneeIds = (memberCats ?? []).map((mc) => mc.member_id);
  }

  if (assigneeIds.length === 0) {
    return { error: "No members found in this category to assign the task to." };
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

  const { data: assignment } = (await supabase
    .from("task_assignments")
    .select("id, tasks(category_id)")
    .eq("id", assignmentId)
    .single()) as unknown as { data: { id: string; tasks: { category_id: string | null } | null } | null };

  const taskCategoryId = assignment?.tasks?.category_id ?? null;
  if (!assignment || !canManageCategory(admin, taskCategoryId)) {
    return;
  }

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
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: task } = await supabase.from("tasks").select("category_id").eq("id", taskId).single();
  if (!task || !canManageCategory(admin, task.category_id)) {
    return;
  }

  // Cleanup storage files for submissions associated with this task
  const { data: assignments } = await supabase.from("task_assignments").select("id").eq("task_id", taskId);
  const assignmentIds = (assignments ?? []).map((a) => a.id);

  if (assignmentIds.length > 0) {
    const { data: submissions } = await supabase.from("submissions").select("file_paths").in("task_assignment_id", assignmentIds);
    const allPaths = (submissions ?? []).flatMap((sub) => sub.file_paths || []);
    if (allPaths.length > 0) {
      await supabase.storage.from("submissions").remove(allPaths);
    }
  }

  await supabase.from("tasks").delete().eq("id", taskId);
  revalidatePath("/admin/tasks");
}

export async function updateTask(
  taskId: string,
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const admin = await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const type = String(formData.get("type") || "general") as TaskType;
  const dueDateRaw = String(formData.get("due_date") || "");

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  const supabase = await createClient();

  const { data: task } = await supabase.from("tasks").select("category_id").eq("id", taskId).single();
  if (!task || !canManageCategory(admin, task.category_id)) {
    return { error: "You cannot manage this task." };
  }

  const { error: updateError } = await supabase
    .from("tasks")
    .update({
      title,
      description,
      type,
      due_date: dueDateRaw ? new Date(dueDateRaw).toISOString() : null,
    })
    .eq("id", taskId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${taskId}`);
  redirect(`/admin/tasks/${taskId}`);
}
