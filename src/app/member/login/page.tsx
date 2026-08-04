import type { Metadata } from "next";
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-sm p-8">
        <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">
          Member Portal
        </h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Sign in to view and submit your tasks.
        </p>
        <LoginForm action={memberLogin} submitLabel="Sign in" />
      </Card>
    </div>
  );
}
