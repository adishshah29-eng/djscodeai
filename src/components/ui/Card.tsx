export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-panel-border bg-panel-surface shadow-sm ${className}`}
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
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  }[variant];

  return <div className={`rounded-md border px-3 py-2 text-sm ${styles}`}>{children}</div>;
}

export function Badge({
  variant = "default",
  className = "",
  children,
}: {
  variant?: "default" | "pending" | "submitted" | "approved" | "rejected" | "chair" | "vice_chair" | "head" | "member" | "danger" | "success" | "warning";
  className?: string;
  children: React.ReactNode;
}) {
  const styles: Record<NonNullable<Parameters<typeof Badge>[0]["variant"]>, string> = {
    default: "bg-panel-bg text-panel-muted",
    pending: "bg-amber-100 text-amber-800",
    submitted: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    chair: "bg-panel-chair-bg text-panel-chair-fg",
    vice_chair: "bg-panel-vice-chair-bg text-panel-vice-chair-fg",
    head: "bg-panel-head-bg text-panel-head-fg",
    member: "bg-panel-member-bg text-panel-member-fg",
    danger: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
