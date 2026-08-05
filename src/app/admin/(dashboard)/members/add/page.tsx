import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MemberForm } from "@/components/admin/MemberForm";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

export default async function AddMemberPage() {
  const profile = await requireAdmin();
  const topAdmin = isTopAdmin(profile);

  let categories: Category[] = [];
  if (topAdmin) {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").order("name");
    categories = (data ?? []) as Category[];
  } else {
    // Head: only fetch their own category for display
    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("categories")
      .select("*")
      .eq("id", profile.category_id ?? "")
      .single();
    if (data) categories = [data as Category];
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-panel-text">Add member</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Creates a login for the recruit and shares it with you to hand off.
      </p>

      <Card className="mt-6 p-5">
        <MemberForm
          categories={categories}
          isTopAdmin={topAdmin}
          headCategoryId={topAdmin ? null : profile.category_id}
        />
      </Card>
    </div>
  );
}
