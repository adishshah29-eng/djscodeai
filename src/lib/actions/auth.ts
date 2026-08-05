"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export interface AuthFormState {
  error?: string;
}

async function signIn(
  formData: FormData,
  allowedRoles: UserRole[],
  onSuccessPath: (role: UserRole) => string
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    console.error("Sign in error:", error);
    return { error: "Invalid email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role)) {
    await supabase.auth.signOut();
    return { error: "This account cannot access this portal." };
  }

  redirect(onSuccessPath(profile.role));
}

export async function adminLogin(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  // Chair Person (super_admin), Vice Chair (vice_chair), and all Heads (category_admin)
  // all use this single admin login page.
  return signIn(formData, ["super_admin", "vice_chair", "category_admin"], () => "/admin");
}

export async function memberLogin(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  return signIn(formData, ["member"], () => "/member");
}

export async function logout(redirectTo: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(redirectTo);
}
