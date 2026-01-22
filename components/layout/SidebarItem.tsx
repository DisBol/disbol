"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface SidebarItemProps {
  label: string;
  href?: string;
  icon: React.ElementType;
  onClick?: () => void;
}

export function SidebarItem({
  label,
  href,
  icon: Icon,
  onClick,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const className = clsx(
    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full text-left",
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-slate-300 hover:bg-white/10 hover:text-white",
  );

  // Si tiene onClick, renderizar como botón
  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        <Icon size={18} />
        {label}
      </button>
    );
  }

  // Si tiene href, renderizar como Link
  if (href) {
    return (
      <Link href={href} className={className}>
        <Icon size={18} />
        {label}
      </Link>
    );
  }

  // Fallback: renderizar como div
  return (
    <div className={className}>
      <Icon size={18} />
      {label}
    </div>
  );
}
