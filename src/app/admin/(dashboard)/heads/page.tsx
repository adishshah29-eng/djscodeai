import { requireSuperAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { deleteHead } from "@/lib/actions/heads";
import { HeadForm } from "@/components/admin/HeadForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

interface HeadRow {
  id: string;
  full_name: string;
  email: string;
  categories: { name: string } | null;
}

export default async function HeadsPage() {
  await requireSuperAdmin();
  const supabase = await createClient();

  const [{ data: categories }, { data: heads }] = await Promise.all([
    supabase.from("categories").select("*").order("name") as unknown as Promise<{
      data: Category[] | null;
    }>,
    supabase
      .from("profiles")
      .select("id, full_name, email, categories(name)")
      .eq("role", "category_admin")
      .order("full_name") as unknown as Promise<{ data: HeadRow[] | null }>,
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-panel-text">Heads</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Heads manage members and tasks within their assigned category. Each head can only see
        and assign tasks to their own team.
      </p>

      <Card className="mt-6 p-5">
        {categories?.length ? (
          <HeadForm categories={categories} />
        ) : (
          <p className="text-sm text-panel-muted">
            Create a category first before adding heads.
          </p>
        )}
      </Card>

      <Card className="mt-6 divide-y divide-panel-border">
        {!heads?.length && (
          <p className="p-5 text-sm text-panel-muted">No heads yet.</p>
        )}
        {heads?.map((head) => (
          <div key={head.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-panel-text">{head.full_name}</p>
              <p className="text-xs text-panel-muted">
                {head.email} · {head.categories?.name ?? "No category assigned"}
              </p>
            </div>
            <DeleteButton
              action={deleteHead.bind(null, head.id)}
              confirmMessage={`Remove head "${head.full_name}"? They will lose access to the admin panel.`}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
