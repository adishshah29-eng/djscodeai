"use client";

import { useActionState, useMemo, useState } from "react";
import { createTask, type TaskFormState } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Card";
import type { Category } from "@/lib/types";

interface MemberOption {
  id: string;
  full_name: string;
  email: string;
  category_id: string | null;
}

export function TaskForm({
  categories,
  members,
  fixedCategoryId,
}: {
  categories: Category[];
  members: MemberOption[];
  fixedCategoryId: string | null;
}) {
  const [state, formAction, pending] = useActionState<TaskFormState, FormData>(createTask, {});
  const [categoryId, setCategoryId] = useState(fixedCategoryId ?? categories[0]?.id ?? "");
  const [assignAll, setAssignAll] = useState(true);

  const visibleMembers = useMemo(
    () => members.filter((m) => m.category_id === categoryId),
    [members, categoryId]
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert variant="error">{state.error}</Alert>}

      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" name="type" defaultValue="general">
            <option value="general">General</option>
            <option value="coding">Coding</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="due_date">Due date (optional)</Label>
          <Input id="due_date" name="due_date" type="date" />
        </div>
      </div>

      {fixedCategoryId ? (
        <input type="hidden" name="category_id" value={fixedCategoryId} />
      ) : (
        <div>
          <Label htmlFor="category_id">Category</Label>
          <Select
            id="category_id"
            name="category_id"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            name="assign_all"
            checked={assignAll}
            onChange={(e) => setAssignAll(e.target.checked)}
          />
          Assign to every member in this category
        </label>
      </div>

      {!assignAll && (
        <div>
          <Label>Select members</Label>
          <div className="max-h-52 space-y-1 overflow-y-auto rounded-md border border-slate-200 p-3 dark:border-slate-800">
            {visibleMembers.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No members in this category yet.
              </p>
            )}
            {visibleMembers.map((member) => (
              <label
                key={member.id}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <input type="checkbox" name="member_ids" value={member.id} />
                {member.full_name} <span className="text-slate-400">({member.email})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create task"}
      </Button>
    </form>
  );
}
