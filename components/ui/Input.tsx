import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-background text-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        sm: "h-9 px-2",
        md: "h-11 px-3",
        lg: "h-12 px-4 text-base",
      },
      variant: {
        default:
          "border-border focus-visible:ring-primary/20 focus-visible:border-primary",
        error: "border-danger focus-visible:ring-danger/20 text-danger",
        success: "border-success focus-visible:ring-success/20",
      },
      withIcon: {
        left: "pl-10",
        right: "pr-10",
        none: "",
      },
    },
    defaultVariants: {
      inputSize: "md",
      variant: "default",
      withIcon: "none",
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, inputSize, variant, leftIcon, rightIcon, ...props },
    ref,
  ) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          className={cn(
            inputVariants({
              inputSize,
              variant,
              withIcon: leftIcon ? "left" : rightIcon ? "right" : "none",
            }),
            className,
          )}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
