import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TaskForm } from "@/components/admin/TaskForm";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

export default async function NewTaskPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();
  const isSuperAdmin = profile.role === "super_admin";

  const [{ data: categories }, { data: members }] = await Promise.all([
    isSuperAdmin
      ? supabase.from("categories").select("*").order("name")
      : Promise.resolve({ data: [] as Category[] }),
    supabase
      .from("profiles")
      .select("id, full_name, email, category_id")
      .eq("role", "member")
      .order("full_name"),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create task</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Coding assignments or general to-dos, assigned to one or more members.
      </p>

      <Card className="mt-6 p-5">
        <TaskForm
          categories={categories ?? []}
          members={members ?? []}
          fixedCategoryId={isSuperAdmin ? null : profile.category_id}
        />
      </Card>
    </div>
  );
}
