import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types";

/**
 * Fetches the signed-in user's profile (role, category, etc). Memoized per
 * request so layouts + pages sharing a render pass only hit the DB once.
 * Returns null when there is no session.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile as Profile | null;
});

/** Redirects to the given login page if there is no session. */
export async function requireProfile(loginPath: string): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect(loginPath);
  return profile;
}

/** Requires an admin session (super_admin or category_admin). */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile("/admin/login");
  if (profile.role !== "super_admin" && profile.role !== "category_admin") {
    redirect("/admin/login");
  }
  return profile;
}

/** Requires a super_admin session. */
export async function requireSuperAdmin(): Promise<Profile> {
  const profile = await requireAdmin();
  if (profile.role !== "super_admin") {
    redirect("/admin");
  }
  return profile;
}

/** Requires a member session. */
export async function requireMember(): Promise<Profile> {
  const profile = await requireProfile("/member/login");
  if (profile.role !== "member") {
    redirect("/member/login");
  }
  return profile;
}

export function canManageCategory(profile: Profile, categoryId: string | null): boolean {
  if (profile.role === "super_admin") return true;
  if (profile.role === "category_admin") return profile.category_id === categoryId;
  return false;
}

export function isRole(profile: Profile | null, ...roles: UserRole[]): boolean {
  return !!profile && roles.includes(profile.role);
}
