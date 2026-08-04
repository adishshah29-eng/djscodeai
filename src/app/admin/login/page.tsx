import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { adminLogin } from "@/lib/actions/auth";
import { LoginForm } from "@/components/LoginForm";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Admin Login | DJS CodeAI",
};

export default async function AdminLoginPage() {
  const profile = await getCurrentProfile();
  if (profile && (profile.role === "super_admin" || profile.role === "category_admin")) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-sm p-8">
        <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">
          Admin Portal
        </h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Sign in to manage recruiters, members, and tasks.
        </p>
        <LoginForm action={adminLogin} submitLabel="Sign in" />
      </Card>
    </div>
  );
}
