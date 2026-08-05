import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MemberForm } from "@/components/admin/MemberForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAdmin();
  if (!isTopAdmin(profile)) {
    notFound();
  }

  const { id } = await params;
  const supabase = await createClient();

  // Fetch the member details
  const { data: member } = await supabase
    .from("profiles")
    .select(`
      id, full_name, email, phone, academic_year, college_id,
      member_categories(category_id)
    `)
    .eq("id", id)
    .single();

  if (!member) {
    notFound();
  }

  // Fetch all categories for the form
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name");

  return (
    <div className="max-w-2xl">
      <Link
        href={`/admin/members/${id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-panel-muted hover:text-panel-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Member
      </Link>
      
      <h1 className="text-2xl font-semibold text-panel-text">Edit Member</h1>
      <p className="mt-1 text-sm text-panel-muted mb-6">Update member profile details or category assignments.</p>
      
      <MemberForm 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        categories={(categories || []) as unknown as any[]} 
        isTopAdmin={true} 
        member={member} 
      />
    </div>
  );
}
