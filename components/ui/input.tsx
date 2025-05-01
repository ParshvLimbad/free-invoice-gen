// components/ui/input.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

export interface InputProps extends React.ComponentProps<"input"> {
  withEmailIcon?: boolean;
}

export function Input({
  className,
  type = "text",
  withEmailIcon,
  ...props
}: InputProps) {
  return (
    <div
      className={cn("relative", withEmailIcon && type === "email" && "pr-10")}
    >
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {withEmailIcon && type === "email" && (
        <Mail
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      )}
    </div>
  );
}
