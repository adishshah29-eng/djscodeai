import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditCategoryPage({
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

  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <Link
        href={`/admin/categories/${id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-panel-muted hover:text-panel-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Category
      </Link>
      <h1 className="text-2xl font-semibold text-panel-text">Edit Category</h1>
      <div className="mt-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
