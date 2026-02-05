import * as React from "react";
import * as Label from "@radix-ui/react-label";
import { Input, type InputProps } from "./Input";

export interface InputFieldProps extends InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  suffix?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, id, error, helperText, className, suffix, variant, ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label.Root
            htmlFor={id}
            className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 cursor-pointer"
          >
            {label}
          </Label.Root>
        )}

        <div className="relative">
          <Input
            ref={ref}
            id={id}
            variant={error ? "error" : variant}
            className={className}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>

        {helperText && !error && (
          <span className="text-xs text-muted-foreground">{helperText}</span>
        )}

        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  },
);

InputField.displayName = "InputField";
