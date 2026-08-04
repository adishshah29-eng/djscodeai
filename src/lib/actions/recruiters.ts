"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RecruiterFormState {
  error?: string;
}

export async function createRecruiter(
  _prevState: RecruiterFormState,
  formData: FormData
): Promise<RecruiterFormState> {
  const admin = await requireSuperAdmin();

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const categoryId = String(formData.get("category_id") || "") || null;

  if (!fullName || !email || !password) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!categoryId) {
    return { error: "Please select a category for this recruiter." };
  }

  const adminClient = createAdminClient();
  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return { error: createError?.message || "Could not create the account." };
  }

  const { error: profileError } = await adminClient.from("profiles").insert({
    id: created.user.id,
    full_name: fullName,
    email,
    role: "category_admin",
    category_id: categoryId,
    created_by: admin.id,
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return { error: profileError.message };
  }

  revalidatePath("/admin/recruiters");
  return {};
}

export async function deleteRecruiter(recruiterId: string) {
  await requireSuperAdmin();
  const adminClient = createAdminClient();
  await adminClient.auth.admin.deleteUser(recruiterId);
  revalidatePath("/admin/recruiters");
}
