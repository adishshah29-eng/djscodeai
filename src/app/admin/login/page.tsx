import type { Metadata } from "next";
import Link from "next/link";
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
  const adminRoles = ["super_admin", "vice_chair", "category_admin"];
  if (profile && adminRoles.includes(profile.role)) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-panel-bg px-4">
      <Card className="w-full max-w-sm p-8">
        <h1 className="mb-1 text-xl font-semibold text-panel-text">
          Admin Portal
        </h1>
        <p className="mb-6 text-sm text-panel-muted">
          Sign in to manage heads, members, and tasks.
          <br />
          For Chair Person, Vice Chair, and all Heads.
        </p>
        <LoginForm action={adminLogin} submitLabel="Sign in" />
      </Card>
      <p className="mt-4 text-sm text-panel-muted">
        Are you a member?{" "}
        <Link
          href="/member/login"
          className="font-medium text-panel-text underline underline-offset-2 hover:text-panel-accent"
        >
          Member login →
        </Link>
      </p>
    </div>
  );
}
