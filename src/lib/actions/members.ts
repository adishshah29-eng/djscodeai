"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, canManageCategory } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export interface MemberFormState {
  error?: string;
  success?: string;
}

export async function createMember(
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const admin = await requireAdmin();

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const phone = String(formData.get("phone") || "").trim() || null;
  const academicYear = String(formData.get("academic_year") || "").trim() || null;
  const collegeId = String(formData.get("college_id") || "").trim() || null;
  const categoryId =
    admin.role === "category_admin"
      ? admin.category_id
      : String(formData.get("category_id") || "") || null;

  if (!fullName || !email || !password) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!categoryId) {
    return { error: "Please select a category." };
  }
  if (!canManageCategory(admin, categoryId)) {
    return { error: "You cannot add members to this category." };
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
    role: "member",
    category_id: categoryId,
    phone,
    academic_year: academicYear,
    college_id: collegeId,
    created_by: admin.id,
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return {
      error: profileError.code === "23505" ? "A user with this email already exists." : profileError.message,
    };
  }

  revalidatePath("/admin/members");
  return { success: `${fullName} was added successfully.` };
}

export async function deleteMember(memberId: string) {
  const admin = await requireAdmin();
  const adminClient = createAdminClient();

  const { data: target } = await adminClient
    .from("profiles")
    .select("category_id, role")
    .eq("id", memberId)
    .single();

  if (!target || target.role !== "member" || !canManageCategory(admin, target.category_id)) {
    return;
  }

  await adminClient.auth.admin.deleteUser(memberId);
  revalidatePath("/admin/members");
}
