"use client";

import { useActionState } from "react";
import { importMembers, type ImportFormState } from "@/lib/actions/import";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Card";

export function ImportForm() {
  const [state, formAction, pending] = useActionState<ImportFormState, FormData>(
    importMembers,
    {}
  );

  const created = state.results?.filter((r) => r.status === "created") ?? [];
  const errors = state.results?.filter((r) => r.status === "error") ?? [];

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        {state.error && <Alert variant="error">{state.error}</Alert>}
        <div>
          <label
            htmlFor="file"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Excel file (.xlsx)
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            required
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-200"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Importing…" : "Import members"}
        </Button>
      </form>

      {state.results && (
        <div className="space-y-4">
          <Alert variant={errors.length ? "info" : "success"}>
            {created.length} member{created.length === 1 ? "" : "s"} created
            {errors.length ? `, ${errors.length} row${errors.length === 1 ? "" : "s"} failed` : ""}.
          </Alert>

          {created.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {created.map((r) => (
                    <tr key={r.email}>
                      <td className="px-3 py-2 text-slate-900 dark:text-white">{r.name}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{r.email}</td>
                      <td className="px-3 py-2 font-mono text-slate-600 dark:text-slate-300">
                        {r.password}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Save these passwords now — they won&apos;t be shown again. Share them with each
                member securely.
              </p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {errors.map((r) => (
                    <tr key={`${r.row}-${r.email}`}>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{r.row}</td>
                      <td className="px-3 py-2 text-slate-900 dark:text-white">{r.name}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{r.email}</td>
                      <td className="px-3 py-2 text-red-600 dark:text-red-400">{r.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
