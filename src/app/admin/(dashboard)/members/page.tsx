import Link from "next/link";
import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteMember } from "@/lib/actions/members";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface MemberRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  academic_year: string | null;
  college_id: string | null;
}

interface MemberCatRow {
  member_id: string;
  categories: { name: string } | null;
}

export default async function MembersPage() {
  const profile = await requireAdmin();
  const topAdmin = isTopAdmin(profile);
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // Fetch member profiles
  let membersQuery = supabase
    .from("profiles")
    .select("id, full_name, email, phone, academic_year, college_id")
    .eq("role", "member")
    .order("full_name");

  // Heads: filter members who belong to their category via member_categories
  let memberIds: string[] | null = null;
  if (!topAdmin && profile.category_id) {
    const { data: mc } = await adminClient
      .from("member_categories")
      .select("member_id")
      .eq("category_id", profile.category_id);
    memberIds = (mc ?? []).map((r) => r.member_id);
    if (memberIds.length > 0) {
      membersQuery = membersQuery.in("id", memberIds);
    } else {
      // No members in their category yet
      return renderPage([], new Map());
    }
  }

  const { data: members } = (await membersQuery) as unknown as { data: MemberRow[] | null };

  // Fetch member_categories to display all categories per member
  const { data: mcRows } = (await adminClient
    .from("member_categories")
    .select("member_id, categories(name)")) as unknown as { data: MemberCatRow[] | null };

  // Build memberId → category names map
  const categoryMap = new Map<string, string[]>();
  for (const row of mcRows ?? []) {
    if (!row.categories?.name) continue;
    const existing = categoryMap.get(row.member_id) ?? [];
    existing.push(row.categories.name);
    categoryMap.set(row.member_id, existing);
  }

  return renderPage(members ?? [], categoryMap);
}

function renderPage(
  members: MemberRow[],
  categoryMap: Map<string, string[]>
) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-panel-text">Members</h1>
          <p className="mt-1 text-sm text-panel-muted">
            {members.length} recruit{members.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/members/import">
            <Button variant="secondary">Import from Excel</Button>
          </Link>
          <Link href="/admin/members/add">
            <Button>Add member</Button>
          </Link>
        </div>
      </div>

      <Card className="mt-6 divide-y divide-panel-border">
        {!members.length && (
          <p className="p-5 text-sm text-panel-muted">
            No members yet. Add one manually or import from an Excel sheet.
          </p>
        )}
        {members.map((member) => {
          const cats = categoryMap.get(member.id) ?? [];
          return (
            <div key={member.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1 pr-4">
                <Link href={`/admin/members/${member.id}`} className="font-medium text-panel-text hover:underline hover:text-panel-accent inline-block">
                  {member.full_name}
                </Link>
                <p className="truncate text-xs text-panel-muted">
                  {member.email}
                  {member.phone ? ` · ${member.phone}` : ""}
                  {cats.length > 0 ? ` · ${cats.join(", ")}` : ""}
                  {member.academic_year ? ` · ${member.academic_year}` : ""}
                  {member.college_id ? ` · ${member.college_id}` : ""}
                </p>
              </div>
              <DeleteButton
                action={deleteMember.bind(null, member.id)}
                confirmMessage={`Remove member "${member.full_name}"?`}
              />
            </div>
          );
        })}
      </Card>
    </div>
  );
}
