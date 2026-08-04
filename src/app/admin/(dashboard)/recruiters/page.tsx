import { requireSuperAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { deleteRecruiter } from "@/lib/actions/recruiters";
import { RecruiterForm } from "@/components/admin/RecruiterForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

interface RecruiterRow {
  id: string;
  full_name: string;
  email: string;
  categories: { name: string } | null;
}

export default async function RecruitersPage() {
  await requireSuperAdmin();
  const supabase = await createClient();

  const [{ data: categories }, { data: recruiters }] = await Promise.all([
    supabase.from("categories").select("*").order("name") as unknown as Promise<{
      data: Category[] | null;
    }>,
    supabase
      .from("profiles")
      .select("id, full_name, email, categories(name)")
      .eq("role", "category_admin")
      .order("full_name") as unknown as Promise<{ data: RecruiterRow[] | null }>,
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Recruiters</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Category admins can manage members and tasks within their assigned category.
      </p>

      <Card className="mt-6 p-5">
        {categories?.length ? (
          <RecruiterForm categories={categories} />
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create a category first before adding recruiters.
          </p>
        )}
      </Card>

      <Card className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
        {!recruiters?.length && (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">No recruiters yet.</p>
        )}
        {recruiters?.map((recruiter) => (
          <div key={recruiter.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{recruiter.full_name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {recruiter.email} · {recruiter.categories?.name ?? "No category"}
              </p>
            </div>
            <DeleteButton
              action={deleteRecruiter.bind(null, recruiter.id)}
              confirmMessage={`Remove recruiter "${recruiter.full_name}"?`}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
