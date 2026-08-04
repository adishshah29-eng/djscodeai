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
  return signIn(formData, ["super_admin", "category_admin"], () => "/admin");
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
