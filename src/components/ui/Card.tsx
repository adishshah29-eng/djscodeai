export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
      {...props}
    />
  );
}

export function Alert({
  variant = "error",
  children,
}: {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const styles = {
    error:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
    success:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  }[variant];

  return <div className={`rounded-md border px-3 py-2 text-sm ${styles}`}>{children}</div>;
}

export function Badge({
  variant = "default",
  children,
}: {
  variant?: "default" | "pending" | "submitted" | "approved" | "rejected";
  children: React.ReactNode;
}) {
  const styles = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    submitted: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  }[variant];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {children}
    </span>
  );
}
