import * as React from "react";
import * as Label from "@radix-ui/react-label";

export interface CheckboxProps {
  id?: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, checked, onChange, disabled = false, className }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-red-500 bg-gray-50 border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
          {label && (
            <Label.Root
              htmlFor={id}
              className="text-[10px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
            >
              {label}
            </Label.Root>
          )}
        </label>
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
