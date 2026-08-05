import { requireAdmin, isTopAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Pencil, ArrowRight } from "lucide-react";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAdmin();
  const topAdmin = isTopAdmin(profile);
  if (!topAdmin) {
    notFound();
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select(`
      id, name, slug, created_at,
      profiles!category_id(id, full_name, email),
      member_categories(
        profiles!member_categories_member_id_fkey(id, full_name, email)
      ),
      tasks(id, title, due_date)
    `)
    .eq("id", id)
    .single();

  if (!category) {
    notFound();
  }

  const heads = category.profiles;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const members = (category.member_categories as any[]).map((mc) => Array.isArray(mc.profiles) ? mc.profiles[0] : mc.profiles).filter(Boolean);
  const tasks = category.tasks;

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-panel-muted hover:text-panel-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-panel-text">{category.name}</h1>
          <p className="mt-1 text-sm text-panel-muted">Slug: {category.slug}</p>
        </div>
        <Link href={`/admin/categories/${category.id}/edit`}>
          <Button variant="secondary" className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-panel-text mb-4">Heads ({heads.length})</h2>
          <Card className="divide-y divide-panel-border">
            {heads.length === 0 ? (
              <p className="p-5 text-sm text-panel-muted">No heads assigned.</p>
            ) : (
              heads.map((h: { id: string; full_name: string; email: string }) => (
                <div key={h.id} className="p-4">
                  <p className="font-medium text-panel-text">{h.full_name}</p>
                  <p className="text-sm text-panel-muted">{h.email}</p>
                </div>
              ))
            )}
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-panel-text mb-4">Tasks ({tasks.length})</h2>
          <Card className="divide-y divide-panel-border">
            {tasks.length === 0 ? (
              <p className="p-5 text-sm text-panel-muted">No tasks created.</p>
            ) : (
              tasks.map((t: { id: string; title: string; due_date: string | null }) => (
                <Link key={t.id} href={`/admin/tasks/${t.id}`} className="block p-4 hover:bg-panel-bg transition-colors">
                  <p className="font-medium text-panel-text">{t.title}</p>
                  {t.due_date && (
                    <p className="text-sm text-panel-muted">
                      Due: {new Date(t.due_date).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              ))
            )}
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-panel-text mb-4">Members ({members.length})</h2>
        <Card className="divide-y divide-panel-border">
          {members.length === 0 ? (
            <p className="p-5 text-sm text-panel-muted">No members in this category.</p>
          ) : (
            members.map((m: { id: string; full_name: string; email: string }) => (
              <Link key={m.id} href={`/admin/members/${m.id}`} className="flex items-center justify-between p-4 hover:bg-panel-bg transition-colors">
                <div>
                  <p className="font-medium text-panel-text">{m.full_name}</p>
                  <p className="text-sm text-panel-muted">{m.email}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-panel-muted" />
              </Link>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
