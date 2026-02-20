import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dropdownVariants = cva(
  "w-full appearance-none outline-none font-medium subpixel-antialiased ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8 cursor-pointer text-left block bg-no-repeat",
  {
    variants: {
      variant: {
        solid: "",
        bordered: "border-2 bg-transparent",
        light: "bg-transparent",
        flat: "",
        faded: "border border-gray-200 bg-gray-50",
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
        sm: "h-8 text-xs pl-2 pr-6",
        md: "h-10 text-sm pl-3 pr-8",
        lg: "h-12 text-base pl-4 pr-10",
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
    ],
    defaultVariants: {
      variant: "bordered",
      color: "default",
      size: "md",
      radius: "md",
    },
  },
);

export interface DropdownProps
  extends
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "color" | "size">,
    Omit<VariantProps<typeof dropdownVariants>, "size"> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
  size?: VariantProps<typeof dropdownVariants>["size"];
}

const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  (
    {
      className,
      variant,
      color,
      size,
      radius,
      icon,
      wrapperClassName,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative inline-block w-full", wrapperClassName)}>
        <select
          ref={ref}
          className={cn(
            dropdownVariants({ variant, color, size, radius }),
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <div
          className={cn(
            "absolute inset-y-0 flex items-center pointer-events-none",
            size === "sm" ? "right-2" : size === "lg" ? "right-4" : "right-3",
          )}
        >
          {icon || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "w-4 h-4 opacity-70",
                size === "sm" && "w-3 h-3",
                size === "lg" && "w-5 h-5",
                variant === "solid" && color !== "default" ? "text-white" : "",
              )}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </div>
      </div>
    );
  },
);
Dropdown.displayName = "Dropdown";

export { Dropdown, dropdownVariants };
