"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { createMember, updateMember, type MemberFormState } from "@/lib/actions/members";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

export function MemberForm({
  categories,
  isTopAdmin,
  headCategoryId,
  member,
}: {
  categories: Category[];
  isTopAdmin: boolean;
  headCategoryId?: string | null;
  member?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string | null;
    academic_year?: string | null;
    college_id?: string | null;
    member_categories?: { category_id: string }[];
  };
}) {
  const action = member ? updateMember.bind(null, member.id) : createMember;
  const [state, formAction, pending] = useActionState<MemberFormState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    // If member was created successfully, the success message shows.
    // We don't auto-navigate so the admin can see the generated password.
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert variant="error">{state.error}</Alert>}
      {state.success && (
        <Alert variant="success">
          {state.success}
          {state.generatedPassword && (
            <p className="mt-1 font-mono text-sm">
              Generated password:{" "}
              <strong>{state.generatedPassword}</strong> — save this now!
            </p>
          )}
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" name="full_name" defaultValue={member?.full_name} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={member?.email} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={member?.phone || ""} />
        </div>
        <div>
          <Label htmlFor="academic_year">Academic year</Label>
          <Input id="academic_year" name="academic_year" placeholder="e.g. SY, TY" defaultValue={member?.academic_year || ""} />
        </div>
        <div>
          <Label htmlFor="college_id">College ID / roll no.</Label>
          <Input id="college_id" name="college_id" defaultValue={member?.college_id || ""} />
        </div>
        <div>
          <Label htmlFor="password">
            Temporary password{" "}
            <span className="text-slate-400">(leave blank to auto-generate)</span>
          </Label>
          <Input id="password" name="password" type="text" minLength={8} />
        </div>
      </div>

      {/* Category assignment */}
      <div>
        <Label>
          {isTopAdmin ? "Assign to categories" : "Category"}
        </Label>
        {isTopAdmin ? (
          // Top admins (Chair / Vice Chair) can pick multiple categories
          <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-md border border-slate-200 p-3 dark:border-slate-800">
            {categories.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No categories yet. Create categories first.
              </p>
            )}
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-sm text-panel-text cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  name="category_ids" 
                  value={cat.id} 
                  defaultChecked={member?.member_categories?.some((mc: { category_id: string }) => mc.category_id === cat.id)} 
                />
                {cat.name}
              </label>
            ))}
          </div>
        ) : (
          // Heads: their category is fixed — show as read-only
          <>
            <input type="hidden" name="category_ids" value={headCategoryId ?? ""} />
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {categories.find((c) => c.id === headCategoryId)?.name ?? "Your category"}
            </p>
          </>
        )}
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? (member ? "Saving…" : "Adding…") : (member ? "Save changes" : "Add member")}
      </Button>
    </form>
  );
}
