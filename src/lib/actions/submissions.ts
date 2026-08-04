"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export interface SubmitFormState {
  error?: string;
  success?: boolean;
}

export async function submitTask(
  _prevState: SubmitFormState,
  formData: FormData
): Promise<SubmitFormState> {
  const member = await requireMember();
  const assignmentId = String(formData.get("assignment_id") || "");
  const textResponse = String(formData.get("text_response") || "").trim() || null;
  const linkUrl = String(formData.get("link_url") || "").trim() || null;
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  if (!assignmentId) {
    return { error: "Missing assignment." };
  }
  if (!textResponse && !linkUrl && files.length === 0) {
    return { error: "Add a text response, a link, or at least one file." };
  }

  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("task_assignments")
    .select("id, member_id")
    .eq("id", assignmentId)
    .single();

  if (!assignment || assignment.member_id !== member.id) {
    return { error: "You cannot submit to this task." };
  }

  const filePaths: string[] = [];
  for (const file of files) {
    const path = `${member.id}/${assignmentId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("submissions")
      .upload(path, file, { contentType: file.type || undefined });
    if (uploadError) {
      return { error: `Could not upload "${file.name}": ${uploadError.message}` };
    }
    filePaths.push(path);
  }

  const { error: insertError } = await supabase.from("submissions").insert({
    task_assignment_id: assignmentId,
    text_response: textResponse,
    link_url: linkUrl,
    file_paths: filePaths,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  await supabase
    .from("task_assignments")
    .update({ status: "submitted" })
    .eq("id", assignmentId);

  revalidatePath("/member");
  revalidatePath(`/member/tasks/${assignmentId}`);
  return { success: true };
}
