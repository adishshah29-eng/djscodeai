"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";

export function DeleteButton({
  action,
  confirmMessage,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
