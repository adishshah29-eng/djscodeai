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

/**
 * Requires an admin session.
 * Allowed: super_admin (Chair Person), vice_chair (Vice Chair), category_admin (Head).
 */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile("/admin/login");
  const adminRoles: UserRole[] = ["super_admin", "vice_chair", "category_admin"];
  if (!adminRoles.includes(profile.role)) {
    redirect("/admin/login");
  }
  return profile;
}

/**
 * Requires a top-level admin session.
 * Allowed: super_admin (Chair Person) or vice_chair (Vice Chair).
 */
export async function requireSuperAdmin(): Promise<Profile> {
  const profile = await requireAdmin();
  if (profile.role !== "super_admin" && profile.role !== "vice_chair") {
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

/** True if the current profile can manage members/tasks in the given category. */
export function canManageCategory(profile: Profile, categoryId: string | null): boolean {
  if (profile.role === "super_admin" || profile.role === "vice_chair") return true;
  if (profile.role === "category_admin") return profile.category_id === categoryId;
  return false;
}

/** Returns the human-readable title for a role. */
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "super_admin":
      return "Chair Person";
    case "vice_chair":
      return "Vice Chair";
    case "category_admin":
      return "Head";
    case "member":
      return "Member";
  }
}

export function isRole(profile: Profile | null, ...roles: UserRole[]): boolean {
  return !!profile && roles.includes(profile.role);
}

/** True if the profile is a top-level admin (Chair or Vice Chair). */
export function isTopAdmin(profile: Profile): boolean {
  return profile.role === "super_admin" || profile.role === "vice_chair";
}
