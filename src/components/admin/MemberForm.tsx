"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createMember, type MemberFormState } from "@/lib/actions/members";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

export function MemberForm({
  categories,
  isSuperAdmin,
}: {
  categories: Category[];
  isSuperAdmin: boolean;
}) {
  const [state, formAction, pending] = useActionState<MemberFormState, FormData>(
    createMember,
    {}
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.push("/admin/members");
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert variant="error">{state.error}</Alert>}
      {state.success && <Alert variant="success">{state.success}</Alert>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" name="full_name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        {isSuperAdmin && (
          <div>
            <Label htmlFor="category_id">Category</Label>
            <Select id="category_id" name="category_id" required defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="academic_year">Academic year</Label>
          <Input id="academic_year" name="academic_year" placeholder="e.g. SY, TY" />
        </div>
        <div>
          <Label htmlFor="college_id">College ID / roll no.</Label>
          <Input id="college_id" name="college_id" />
        </div>
        <div>
          <Label htmlFor="password">Temporary password</Label>
          <Input id="password" name="password" type="text" minLength={8} required />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add member"}
      </Button>
    </form>
  );
}
