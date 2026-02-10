import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { type InputFieldProps } from "./InputField";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { cn } from "@/lib/utils";

const dateFieldVariants = cva(
  "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border-border focus:ring-primary/20 focus:border-primary hover:border-gray-400",
        error:
          "border-danger focus:ring-danger/20 focus:border-danger hover:border-danger",
        success:
          "border-success focus:ring-success/20 focus:border-success hover:border-success/70",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
    },
  },
);

export interface DateFieldProps
  extends
    Omit<InputFieldProps, "type" | "inputSize">,
    VariantProps<typeof dateFieldVariants> {
  asChild?: boolean;
  showCalendarIcon?: boolean;
}

export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      showCalendarIcon = true,
      label,
      error,
      helperText,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleIconClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.showPicker();
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={props.id}
            className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 cursor-pointer"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          <input
            ref={inputRef}
            type="date"
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              dateFieldVariants({
                variant: error ? "error" : variant,
                size,
                radius,
              }),
              // Completely hide and disable the native calendar picker
              "[&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:display-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none",
              "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none",
              "[&::-webkit-clear-button]:appearance-none [&::-webkit-clear-button]:display-none",
              // Improve calendar popup styling
              "[&::-webkit-datetime-edit]:padding-0 [&::-webkit-datetime-edit-fields-wrapper]:padding-0",
              "[&::-webkit-datetime-edit-text]:color-inherit [&::-webkit-datetime-edit-month-field]:color-inherit [&::-webkit-datetime-edit-day-field]:color-inherit [&::-webkit-datetime-edit-year-field]:color-inherit",
              // Additional styling
              "bg-white border text-gray-900 placeholder:text-gray-500",
              "group-hover:shadow-sm transition-shadow duration-200",
              isFocused && "ring-2 shadow-sm",
              // Prevent flash/flicker
              "will-change-auto backface-visibility-hidden transform-gpu",
              className,
            )}
            style={{
              // Additional inline styles to improve calendar appearance
              colorScheme: "light",
            }}
            {...props}
          />

          {showCalendarIcon && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleIconClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 -m-1 rounded-sm transition-all duration-200 hover:bg-gray-100/80 active:scale-95"
            >
              <CalendarIcon
                className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  error
                    ? "text-danger hover:text-danger/80"
                    : isFocused
                      ? "text-primary hover:text-primary/80"
                      : "text-gray-400 group-hover:text-gray-600 hover:text-primary",
                )}
              />
            </button>
          )}
        </div>

        {helperText && !error && (
          <span className="text-xs text-gray-500">{helperText}</span>
        )}

        {error && (
          <span className="text-xs text-danger font-medium">{error}</span>
        )}
      </div>
    );
  },
);

DateField.displayName = "DateField";
