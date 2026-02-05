import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { ArrowDownBoldIcon } from "@/components/icons/ArrowDownBold";

const selectVariants = cva(
  "w-full inline-flex items-center justify-between bg-white border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm",
  {
    variants: {
      variant: {
        outline:
          "border-gray-300 hover:bg-gray-50 focus:ring-primary/20 focus:border-primary",
        error: "border-red-500 text-red-500 focus:ring-red-500/20",
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
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      radius: "md",
    },
  },
);

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: string | number | boolean;
}

interface SelectProps extends VariantProps<typeof selectVariants> {
  label?: string;
  options: SelectOption[];
  selectedValues?: string[];
  onSelect: (option: SelectOption) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
  closeOnSelect?: boolean;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      options = [],
      selectedValues = [],
      onSelect,
      placeholder,
      variant,
      size,
      radius,
      className,
      emptyMessage = "No hay opciones disponibles",
      closeOnSelect = true,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    // Usamos un ref interno para el clic fuera, pero lo sincronizamos con el ref externo si existe
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Permite que el padre reciba el ref del contenedor
    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    // Lógica para cerrar al hacer clic fuera
    React.useEffect(() => {
      const handleOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleOutside);
      };
    }, [isOpen]);

    return (
      <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
            {label}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className={clsx(
              selectVariants({ variant, size, radius }),
              className,
              isOpen && "ring-2 ring-primary/20 border-primary z-10",
            )}
          >
            <span
              className={clsx(
                "truncate",
                !selectedValues.length && "text-gray-500",
              )}
            >
              {selectedValues.length > 0
                ? selectedValues
                    .map(
                      (val) => options.find((opt) => opt.value === val)?.label,
                    )
                    .filter(Boolean)
                    .join(", ")
                : placeholder || "Seleccionar..."}
            </span>
            <ArrowDownBoldIcon
              className={clsx(
                "w-4 h-4 text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180 text-primary",
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100">
              {options.length > 0 ? (
                options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(option);
                        if (closeOnSelect) {
                          setIsOpen(false);
                        }
                      }}
                      className={clsx(
                        "w-full text-left px-3 py-2.5 text-sm flex justify-between items-center transition-colors border-b last:border-0 border-gray-50",
                        isSelected
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100 hover:text-primary",
                      )}
                    >
                      <span className="font-medium">{option.label}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold">
                          Agregado
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 italic text-center">
                  {emptyMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";
