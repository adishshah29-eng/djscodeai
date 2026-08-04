"use client";

import { useActionState, useRef, useEffect } from "react";
import { createRecruiter, type RecruiterFormState } from "@/lib/actions/recruiters";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

export function RecruiterForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState<RecruiterFormState, FormData>(
    createRecruiter,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.error) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.error && <Alert variant="error">{state.error}</Alert>}
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
        <div>
          <Label htmlFor="password">Temporary password</Label>
          <Input id="password" name="password" type="text" minLength={8} required />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create recruiter"}
      </Button>
    </form>
  );
}
