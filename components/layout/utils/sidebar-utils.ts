import clsx from "clsx";

interface VisibilityClassesProps {
  open?: boolean;
  collapsed?: boolean;
}

export const getVisibilityClasses = ({
  open,
  collapsed,
}: VisibilityClassesProps) => {
  return clsx({
    block: open, // Visible en móvil cuando open
    hidden: !open, // Oculto en móvil por defecto
    "md:block": !collapsed, // Visible en desktop cuando no collapsed
    "md:hidden": collapsed, // Oculto en desktop cuando collapsed
  });
};

export const getCollapsedToggleClasses = (collapsed?: boolean) => {
  return `px-3 pb-4 hidden md:${collapsed ? "block" : "hidden"}`;
};
