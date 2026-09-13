import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm text-fg placeholder:text-faint",
        "outline-none transition-[box-shadow,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
        "focus-visible:ring-2 focus-visible:ring-accent/50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
