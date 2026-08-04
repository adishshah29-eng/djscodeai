import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
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
  categories: { name: string } | null;
}

export default async function MembersPage() {
  const profile = await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, full_name, email, phone, academic_year, college_id, categories(name)")
    .eq("role", "member")
    .order("full_name");

  if (profile.role === "category_admin" && profile.category_id) {
    query = query.eq("category_id", profile.category_id);
  }

  const { data: members } = (await query) as unknown as { data: MemberRow[] | null };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Members</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {members?.length ?? 0} recruit{members?.length === 1 ? "" : "s"}
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

      <Card className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
        {!members?.length && (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">
            No members yet. Add one manually or import from an Excel sheet.
          </p>
        )}
        {members?.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white">{member.full_name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {member.email}
                {member.phone ? ` · ${member.phone}` : ""}
                {member.categories?.name ? ` · ${member.categories.name}` : ""}
                {member.academic_year ? ` · ${member.academic_year}` : ""}
                {member.college_id ? ` · ${member.college_id}` : ""}
              </p>
            </div>
            <DeleteButton
              action={deleteMember.bind(null, member.id)}
              confirmMessage={`Remove member "${member.full_name}"?`}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
