import { requireAdmin } from "@/lib/auth";
import { ImportForm } from "@/components/admin/ImportForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function ImportMembersPage() {
  await requireAdmin();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-panel-text">
        Import members from Excel
      </h1>
      <p className="mt-1 text-sm text-panel-muted">
        Upload a .xlsx sheet with columns: Full Name, Email, Password (optional), Phone,
        Category, Academic Year, College ID.
      </p>

      <div className="mt-4">
        <a href="/api/admin/import/template">
          <Button variant="secondary">Download template</Button>
        </a>
      </div>

      <Card className="mt-6 p-5">
        <ImportForm />
      </Card>
    </div>
  );
}
