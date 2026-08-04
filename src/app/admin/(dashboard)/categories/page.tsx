import { requireSuperAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { deleteCategory } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  await requireSuperAdmin();
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name") as { data: Category[] | null };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Categories</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Departments like Marketing, Events, Publicity, Creatives, Tech — create as many as you need.
      </p>

      <Card className="mt-6 p-5">
        <CategoryForm />
      </Card>

      <Card className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
        {!categories?.length && (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">No categories yet.</p>
        )}
        {categories?.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{category.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{category.slug}</p>
            </div>
            <DeleteButton
              action={deleteCategory.bind(null, category.id)}
              confirmMessage={`Delete category "${category.name}"? This cannot be undone.`}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
