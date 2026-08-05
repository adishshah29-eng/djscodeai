"use client";

import { useActionState, useRef, useEffect } from "react";
import { createCategory, updateCategory, type CategoryFormState } from "@/lib/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Card";

export function CategoryForm({ category }: { category?: { id: string; name: string } }) {
  const action = category ? updateCategory.bind(null, category.id) : createCategory;
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(
    action,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && !category) formRef.current?.reset();
  }, [state, category]);

  return (
    <form ref={formRef} action={formAction} className="flex items-start gap-3">
      <div className="flex-1">
        <Input name="name" defaultValue={category?.name} placeholder="e.g. Marketing" required />
        {state.error && (
          <div className="mt-2">
            <Alert variant="error">{state.error}</Alert>
          </div>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? (category ? "Saving…" : "Adding…") : (category ? "Save changes" : "Add category")}
      </Button>
    </form>
  );
}
