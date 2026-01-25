import * as React from "react";
import * as Label from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "flex w-full rounded-md border bg-background text-sm transition-all focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
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
    },
    defaultVariants: {
      inputSize: "md",
      variant: "default",
    },
  },
);

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps
  extends
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  placeholder?: string;
}

export const SelectInput = React.forwardRef<
  HTMLSelectElement,
  SelectInputProps
>(({ className, inputSize, variant, options, placeholder, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        className={cn(selectVariants({ inputSize, variant, className }))}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Icono de flecha personalizado */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
});

SelectInput.displayName = "SelectInput";

// Componente SelectField similar a InputField
interface SelectFieldProps extends SelectInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function SelectField({
  label,
  id,
  error,
  helperText,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label.Root
          htmlFor={id}
          className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer pl-0.5"
        >
          {label}
        </Label.Root>
      )}

      <SelectInput
        id={id}
        variant={error ? "error" : props.variant}
        className={className}
        {...props}
      />

      {helperText && !error && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}

      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
