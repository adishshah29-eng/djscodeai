"use client";

import { useActionState } from "react";
import { submitTask, type SubmitFormState } from "@/lib/actions/submissions";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Card";

export function SubmitForm({ assignmentId }: { assignmentId: string }) {
  const [state, formAction, pending] = useActionState<SubmitFormState, FormData>(
    submitTask,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="assignment_id" value={assignmentId} />
      {state.error && <Alert variant="error">{state.error}</Alert>}
      {state.success && <Alert variant="success">Submitted! Your admin will review it soon.</Alert>}

      <div>
        <Label htmlFor="text_response">Text response</Label>
        <Textarea id="text_response" name="text_response" rows={4} />
      </div>
      <div>
        <Label htmlFor="link_url">Link (GitHub, Drive, deployed site…)</Label>
        <Input id="link_url" name="link_url" type="url" placeholder="https://" />
      </div>
      <div>
        <Label htmlFor="files">Files</Label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-200"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
