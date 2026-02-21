"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dropdownVariants = cva(
  "inline-flex items-center justify-between w-full font-medium subpixel-antialiased transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "border-transparent",
        bordered: "border bg-transparent",
        light: "bg-transparent",
        flat: "border-transparent",
        faded: "border border-gray-200 bg-gray-50",
        iconOnly:
          "p-0 bg-transparent border-transparent w-auto hover:bg-transparent",
      },
      color: {
        info: "text-blue-600",
        default: "text-gray-800",
        primary: "text-pink-600",
        secondary: "text-purple-600",
        success: "text-green-600",
        warning: "text-yellow-600",
        danger: "text-red-600",
        iconDefault: "text-gray-500",
      },
      size: {
        sm: "h-8 text-xs px-2",
        md: "h-10 text-sm px-3",
        lg: "h-12 text-base px-4",
        none: "",
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
        variant: "bordered",
        color: "default",
        class: "border-gray-300 hover:bg-gray-100/50",
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
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "color" | "onChange" | "value"
    >,
    VariantProps<typeof dropdownVariants> {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  wrapperClassName?: string;
  children?: React.ReactNode;
}

const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      className,
      variant,
      color,
      size,
      radius,
      icon,
      iconOnly,
      wrapperClassName,
      children,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    // Parse options from children
    const options = React.Children.toArray(children)
      .filter(
        (child) =>
          React.isValidElement(child) &&
          (child.type === "option" ||
            (child.props as any)?.value !== undefined),
      )
      .map((child: any) => ({
        value: child.props.value,
        label: child.props.children,
      }));

    const selectedOption = options.find(
      (opt) => String(opt.value) === String(value),
    );

    const handleSelect = (optionValue: string | number) => {
      if (onChange) {
        onChange({
          target: { value: optionValue } as any,
        } as React.ChangeEvent<HTMLSelectElement>);
      }
      setIsOpen(false);
    };

    return (
      <div
        ref={dropdownRef}
        className={cn(
          "relative inline-block",
          iconOnly ? "w-auto" : "w-full",
          wrapperClassName,
        )}
      >
        <button
          ref={ref}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={cn(
            dropdownVariants({
              variant: iconOnly ? "iconOnly" : variant,
              color: iconOnly ? "iconDefault" : color,
              size: iconOnly ? "none" : size,
              radius,
            }),
            className,
          )}
          {...props}
        >
          {iconOnly ? (
            <div className="flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors">
              {icon || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-gray-500"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </div>
          ) : (
            <>
              <span className="flex-1 text-left truncate">
                {selectedOption?.label || "Select..."}
              </span>
              <div className="flex items-center justify-center ml-2 border-l border-gray-200/50 pl-2">
                {icon || (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 opacity-50"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </div>
            </>
          )}
        </button>

        {isOpen && (
          <div className="absolute z-50 min-w-[140px] p-1 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg shadow-black/5 animate-in fade-in zoom-in-95 duration-150 -left-2 top-full origin-top-left">
            <ul className="py-1">
              {options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(opt.value);
                    }}
                    className={cn(
                      "flex items-center w-full px-3 py-1.5 text-xs font-medium text-left transition-colors rounded-md",
                      String(opt.value) === String(value)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <span className="flex-1">{opt.label}</span>
                    {String(opt.value) === String(value) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 ml-2 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hidden select to preserve native form submission if needed by the parent */}
        <select value={value} aria-hidden="true" className="hidden" disabled>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);
Dropdown.displayName = "Dropdown";

export { Dropdown, dropdownVariants };
