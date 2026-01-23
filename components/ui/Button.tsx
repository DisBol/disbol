// components/ui/button.tsx
import * as React from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        // secondary:
        //   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        secondary: "bg-slate-600 text-white hover:bg-slate-700",

        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        info: "bg-info text-info-foreground hover:bg-info/90",
        outline: "border border-border hover:bg-muted",
        ghost: "hover:bg-muted",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      radius: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<typeof Primitive.button>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      radius,
      fullWidth,
      asChild = false,
      leftIcon,
      rightIcon,
      loading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : Primitive.button;

    return (
      <Comp
        ref={ref}
        className={clsx(
          buttonVariants({ variant, size, radius, fullWidth }),
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {!loading && leftIcon}
        <span>{children}</span>
        {!loading && rightIcon}
      </Comp>
    );
  },
);

Button.displayName = "Button";
