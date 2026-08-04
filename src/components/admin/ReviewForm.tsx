"use client";

import { useState, useTransition } from "react";
import { reviewSubmission } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

export function ReviewForm({
  submissionId,
  assignmentId,
}: {
  submissionId: string;
  assignmentId: string;
}) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const decide = (decision: "approved" | "rejected") => {
    startTransition(() => {
      reviewSubmission(submissionId, assignmentId, decision, note);
    });
  };

  return (
    <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
      <Textarea
        placeholder="Optional note to the member…"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="button" disabled={pending} onClick={() => decide("approved")}>
          Approve
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={pending}
          onClick={() => decide("rejected")}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
