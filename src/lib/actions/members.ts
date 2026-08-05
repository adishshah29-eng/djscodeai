"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, canManageCategory, isTopAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePassword } from "@/lib/password";

export interface MemberFormState {
  error?: string;
  success?: string;
  generatedPassword?: string;
}

export async function createMember(
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const admin = await requireAdmin();

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const passwordInput = String(formData.get("password") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;
  const academicYear = String(formData.get("academic_year") || "").trim() || null;
  const collegeId = String(formData.get("college_id") || "").trim() || null;

  // Collect category IDs: top admins can pick many; heads always get their own category only.
  let categoryIds: string[];
  if (isTopAdmin(admin)) {
    categoryIds = formData.getAll("category_ids").map(String).filter(Boolean);
  } else {
    // Head: can only add member to their own category
    categoryIds = admin.category_id ? [admin.category_id] : [];
  }

  if (!fullName || !email) {
    return { error: "Name and email are required." };
  }
  if (categoryIds.length === 0) {
    return { error: "Please select at least one category." };
  }
  // Verify head isn't injecting a foreign category
  if (!isTopAdmin(admin)) {
    const valid = categoryIds.every((id) => canManageCategory(admin, id));
    if (!valid) return { error: "You cannot add members to another category." };
  }

  const password = passwordInput.length >= 8 ? passwordInput : generatePassword();

  const adminClient = createAdminClient();
  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return { error: createError?.message || "Could not create the account." };
  }

  // Insert profile (no category_id — categories handled by member_categories)
  const { error: profileError } = await adminClient.from("profiles").insert({
    id: created.user.id,
    full_name: fullName,
    email,
    role: "member",
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

  // Insert member_categories rows
  const { error: catError } = await adminClient.from("member_categories").insert(
    categoryIds.map((cid) => ({ member_id: created.user!.id, category_id: cid }))
  );

  if (catError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return { error: catError.message };
  }

  revalidatePath("/admin/members");

  const msg = `${fullName} was added successfully.`;
  // Only show the generated password if we auto-generated it.
  if (!passwordInput || passwordInput.length < 8) {
    return { success: msg, generatedPassword: password };
  }
  return { success: msg };
}

export async function deleteMember(memberId: string) {
  const admin = await requireAdmin();
  const adminClient = createAdminClient();

  const { data: target } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", memberId)
    .single();

  if (!target || target.role !== "member") return;

  // Head: verify the member belongs to their category
  if (!isTopAdmin(admin)) {
    const { data: mc } = await adminClient
      .from("member_categories")
      .select("category_id")
      .eq("member_id", memberId)
      .eq("category_id", admin.category_id ?? "")
      .maybeSingle();
    if (!mc) return; // not in their category
  }

  await adminClient.auth.admin.deleteUser(memberId);
  revalidatePath("/admin/members");
}

export async function updateMember(
  id: string,
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const admin = await requireAdmin();

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const passwordInput = String(formData.get("password") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;
  const academicYear = String(formData.get("academic_year") || "").trim() || null;
  const collegeId = String(formData.get("college_id") || "").trim() || null;

  let categoryIds: string[];
  if (isTopAdmin(admin)) {
    categoryIds = formData.getAll("category_ids").map(String).filter(Boolean);
  } else {
    categoryIds = admin.category_id ? [admin.category_id] : [];
  }

  if (!fullName || !email) {
    return { error: "Name and email are required." };
  }
  if (categoryIds.length === 0) {
    return { error: "Please select at least one category." };
  }

  if (!isTopAdmin(admin)) {
    const valid = categoryIds.every((cid) => canManageCategory(admin, cid));
    if (!valid) return { error: "You cannot manage members in another category." };
  }

  const adminClient = createAdminClient();

  const authData: { email: string; password?: string } = { email };
  if (passwordInput.length >= 8) {
    authData.password = passwordInput;
  }

  const { error: authError } = await adminClient.auth.admin.updateUserById(id, authData);
  if (authError) {
    return { error: authError.message };
  }

  const { error: profileError } = await adminClient.from("profiles").update({
    full_name: fullName,
    email,
    phone,
    academic_year: academicYear,
    college_id: collegeId,
  }).eq("id", id);

  if (profileError) {
    return { error: profileError.message };
  }

  // Update categories: delete old and insert new
  await adminClient.from("member_categories").delete().eq("member_id", id);
  const { error: catError } = await adminClient.from("member_categories").insert(
    categoryIds.map((cid) => ({ member_id: id, category_id: cid }))
  );

  if (catError) {
    return { error: catError.message };
  }

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${id}`);
  return { success: "Member updated successfully." };
}
