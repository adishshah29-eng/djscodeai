"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export interface CategoryFormState {
  error?: string;
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireSuperAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Category name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
  });

  if (error) {
    return { error: error.code === "23505" ? "A category with this name already exists." : error.message };
  }

  revalidatePath("/admin/categories");
  return {};
}

export async function deleteCategory(categoryId: string) {
  await requireSuperAdmin();
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidatePath("/admin/categories");
}
