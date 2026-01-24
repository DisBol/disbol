"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface SidebarItemProps {
  label: string;
  href?: string;
  icon: React.ElementType;
  onClick?: () => void;
  open?: boolean;
  collapsed?: boolean;
}

export function SidebarItem({
  label,
  href,
  icon: Icon,
  onClick,
  open = false,
  collapsed = false,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const className = clsx(
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      collapsed ? "justify-center" : "justify-start md:justify-start"
    }`,
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-slate-300 hover:bg-white/10 hover:text-white",
  );

  const content = (
    <>
      <Icon size={20} />
      {/* TEXTO: móvil (cuando open) o desktop (cuando no collapsed) */}
      <span
        className={clsx({
          inline: open, // Visible en móvil cuando open
          hidden: !open, // Oculto en móvil por defecto
          "md:inline": !collapsed, // Visible en desktop cuando no collapsed
          "md:hidden": collapsed, // Oculto en desktop cuando collapsed
        })}
      >
        {label}
      </span>
    </>
  );

  // Si tiene onClick, renderizar como botón
  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  // Si tiene href, renderizar como Link
  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  // Fallback: renderizar como div
  return <div className={className}>{content}</div>;
}
