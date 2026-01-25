import * as Label from "@radix-ui/react-label";
import { Input, type InputProps } from "./Input";

interface InputFieldProps extends InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  suffix?: React.ReactNode;
}

export function InputField({
  label,
  id,
  error,
  helperText,
  className,
  suffix,
  ...props
}: InputFieldProps) {
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

      <div className="relative">
        <Input
          id={id}
          variant={error ? "error" : props.variant}
          className={className}
          {...props}
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>

      {helperText && !error && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}

      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
