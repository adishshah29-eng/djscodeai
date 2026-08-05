import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-md border border-panel-border bg-panel-surface px-3 py-2 text-sm text-panel-text placeholder:text-panel-muted focus:border-panel-accent focus:outline-none focus:ring-1 focus:ring-panel-accent ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`w-full rounded-md border border-panel-border bg-panel-surface px-3 py-2 text-sm text-panel-text placeholder:text-panel-muted focus:border-panel-accent focus:outline-none focus:ring-1 focus:ring-panel-accent ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", ...props }, ref) => (
  <select
    ref={ref}
    className={`w-full rounded-md border border-panel-border bg-panel-surface px-3 py-2 text-sm text-panel-text focus:border-panel-accent focus:outline-none focus:ring-1 focus:ring-panel-accent ${className}`}
    {...props}
  />
));
Select.displayName = "Select";

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={`mb-1 block text-sm font-medium text-panel-text ${props.className ?? ""}`}
    />
  );
}
