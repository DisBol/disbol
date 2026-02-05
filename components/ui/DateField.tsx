import * as React from "react";
import { InputField, type InputFieldProps } from "./InputField";
import { CalendarIcon } from "@/components/icons/CalendarIcon";

export interface DateFieldProps extends Omit<InputFieldProps, "type"> {
  asChild?: boolean;
}

export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  ({ className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleIconClick = () => {
      if (inputRef.current) {
        inputRef.current.showPicker();
      }
    };

    return (
      <InputField
        ref={inputRef}
        type="date"
        className={`[&::-webkit-calendar-picker-indicator]:hidden ${className || ""}`}
        rightIcon={
          <CalendarIcon
            className="w-4 h-4 cursor-pointer hover:text-gray-600"
            onClick={handleIconClick}
          />
        }
        {...props}
      />
    );
  },
);

DateField.displayName = "DateField";
