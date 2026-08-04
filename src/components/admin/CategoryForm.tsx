"use client";

import { useActionState, useRef, useEffect } from "react";
import { createCategory, type CategoryFormState } from "@/lib/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Card";

export function CategoryForm() {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(
    createCategory,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.error) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex items-start gap-3">
      <div className="flex-1">
        <Input name="name" placeholder="e.g. Marketing" required />
        {state.error && (
          <div className="mt-2">
            <Alert variant="error">{state.error}</Alert>
          </div>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add category"}
      </Button>
    </form>
  );
}
