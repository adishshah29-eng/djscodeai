import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { TaskForm } from "@/components/admin/TaskForm";
import { Card } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

interface MemberCatRow {
  member_id: string;
  category_id: string;
  profiles: { full_name: string; email: string } | null;
}

export default async function NewTaskPage() {
  const profile = await requireAdmin();
  const topAdmin = isTopAdmin(profile);
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // Fetch categories
  const categoriesData = topAdmin
    ? await supabase.from("categories").select("*").order("name")
    : await adminClient
        .from("categories")
        .select("*")
        .eq("id", profile.category_id ?? "");

  const categories = (categoriesData.data ?? []) as Category[];

  // Fetch member_categories to build member → category list
  let mcQuery = adminClient
    .from("member_categories")
    .select("member_id, category_id, profiles(full_name, email)");

  if (!topAdmin && profile.category_id) {
    mcQuery = mcQuery.eq("category_id", profile.category_id);
  }

  const { data: mcRows } = (await mcQuery) as unknown as { data: MemberCatRow[] | null };

  // Collapse into per-member records with an array of their categoryIds
  const memberMap = new Map<string, { id: string; full_name: string; email: string; categoryIds: string[] }>();
  for (const row of mcRows ?? []) {
    if (!row.profiles) continue;
    const existing = memberMap.get(row.member_id);
    if (existing) {
      existing.categoryIds.push(row.category_id);
    } else {
      memberMap.set(row.member_id, {
        id: row.member_id,
        full_name: row.profiles.full_name,
        email: row.profiles.email,
        categoryIds: [row.category_id],
      });
    }
  }
  const members = Array.from(memberMap.values()).sort((a, b) =>
    a.full_name.localeCompare(b.full_name)
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-panel-text">Create task</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Coding assignments or general to-dos, assigned to one or more members.
      </p>

      <Card className="mt-6 p-5">
        <TaskForm
          categories={categories}
          members={members}
          fixedCategoryId={topAdmin ? null : profile.category_id}
        />
      </Card>
    </div>
  );
}
