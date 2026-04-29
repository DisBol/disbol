import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const chipVariants = cva(
  "inline-flex items-center justify-center box-border whitespace-nowrap font-medium subpixel-antialiased ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        solid: "",
        bordered: "border-2 bg-transparent",
        light: "bg-transparent",
        flat: "",
        faded: "border border-gray-200 bg-gray-50",
        dot: "border border-gray-200 bg-transparent gap-2",
      },
      color: {
        info: "text-blue-600",
        default: "text-gray-800",
        primary: "text-pink-600",
        secondary: "text-purple-600",
        success: "text-green-600",
        warning: "text-yellow-600",
        danger: "text-red-600",
      },
      size: {
        sm: "h-6 text-xs px-2 min-w-12",
        md: "h-8 text-sm px-3 min-w-16",
        lg: "h-10 text-base px-4 min-w-20",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        color: "default",
        class: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      },
      {
        variant: "solid",
        color: "primary",
        class:
          "bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-500/20",
      },
      {
        variant: "solid",
        color: "secondary",
        class:
          "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20",
      },
      {
        variant: "solid",
        color: "danger",
        class:
          "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20",
      },
      {
        variant: "solid",
        color: "success",
        class:
          "bg-green-600 hover:bg-green-500 text-white shadow-md shadow-green-500/20",
      },
      {
        variant: "solid",
        color: "warning",
        class:
          "bg-yellow-500 hover:bg-yellow-400 text-white shadow-md shadow-yellow-500/20",
      },
      {
        variant: "solid",
        color: "info",
        class:
          "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20",
      },

      {
        variant: "bordered",
        color: "default",
        class: "border-gray-300 hover:bg-gray-100",
      },
      {
        variant: "bordered",
        color: "primary",
        class: "border-pink-600 text-pink-600 hover:bg-pink-50",
      },
      {
        variant: "bordered",
        color: "danger",
        class: "border-red-600 text-red-600 hover:bg-red-50",
      },
      {
        variant: "bordered",
        color: "success",
        class: "border-green-600 text-green-600 hover:bg-green-50",
      },
      {
        variant: "bordered",
        color: "info",
        class: "border-blue-600 text-blue-600 hover:bg-blue-50",
      },
      {
        variant: "bordered",
        color: "warning",
        class: "border-yellow-500 text-yellow-500 hover:bg-yellow-50",
      },

      {
        variant: "flat",
        color: "default",
        class: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      },
      {
        variant: "flat",
        color: "primary",
        class: "bg-pink-100 text-pink-700 hover:bg-pink-200",
      },
      {
        variant: "flat",
        color: "secondary",
        class: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      },
      {
        variant: "flat",
        color: "danger",
        class: "bg-red-100 text-red-700 hover:bg-red-200",
      },
      {
        variant: "flat",
        color: "success",
        class: "bg-green-100 text-green-700 hover:bg-green-200",
      },
      {
        variant: "flat",
        color: "info",
        class: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      },
      {
        variant: "flat",
        color: "warning",
        class: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      },
      {
        variant: "dot",
        class: "pl-3 text-gray-700",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "default",
      size: "md",
      radius: "full",
    },
  },
);

export interface ChipProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof chipVariants> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onClose?: () => void;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant,
      color,
      size,
      radius,
      startContent,
      endContent,
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    const isDot = variant === "dot";

    return (
      <div
        ref={ref}
        className={cn(
          chipVariants({ variant, color, size, radius }),
          className,
        )}
        {...props}
      >
        {isDot && (
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              color === "default"
                ? "bg-gray-400"
                : color === "info"
                  ? "bg-blue-600"
                  : color === "primary"
                    ? "bg-pink-600"
                    : color === "secondary"
                      ? "bg-purple-600"
                      : color === "danger"
                        ? "bg-red-600"
                        : color === "success"
                          ? "bg-green-600"
                          : "bg-gray-400",
            )}
          />
        )}

        {!isDot && startContent && (
          <span className="mr-2 flex items-center justify-center">
            {startContent}
          </span>
        )}

        <span>{children}</span>

        {endContent && (
          <span className="ml-2 flex items-center justify-center">
            {endContent}
          </span>
        )}

        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={cn(
              "ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
              size === "sm" ? "h-3 w-3" : "h-4 w-4",
            )}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
