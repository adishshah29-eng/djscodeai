import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MemberForm } from "@/components/admin/MemberForm";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

export default async function AddMemberPage() {
  const profile = await requireAdmin();
  const isSuperAdmin = profile.role === "super_admin";

  let categories: Category[] = [];
  if (isSuperAdmin) {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").order("name");
    categories = data ?? [];
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Add member</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Creates a login for the recruit and shares it with you to hand off.
      </p>

      <Card className="mt-6 p-5">
        <MemberForm categories={categories} isSuperAdmin={isSuperAdmin} />
      </Card>
    </div>
  );
}
