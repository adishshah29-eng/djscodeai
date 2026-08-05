import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { memberLogin } from "@/lib/actions/auth";
import { LoginForm } from "@/components/LoginForm";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Member Login | DJS CodeAI",
};

export default async function MemberLoginPage() {
  const profile = await getCurrentProfile();
  if (profile && profile.role === "member") {
    redirect("/member");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-panel-bg px-4">
      <Card className="w-full max-w-sm p-8">
        <h1 className="mb-1 text-xl font-semibold text-panel-text">
          Member Portal
        </h1>
        <p className="mb-6 text-sm text-panel-muted">
          Sign in to view and submit your tasks.
        </p>
        <LoginForm action={memberLogin} submitLabel="Sign in" />
      </Card>
      <p className="mt-4 text-sm text-panel-muted">
        Are you a Head or Admin?{" "}
        <Link
          href="/admin/login"
          className="font-medium text-panel-text underline underline-offset-2 hover:text-panel-accent"
        >
          Admin login →
        </Link>
      </p>
    </div>
  );
}
