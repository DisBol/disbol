"use client";

import clsx from "clsx";
import { signOut } from "next-auth/react";
import { sidebarOperadorMenu } from "./config/sidebar-operador.config";
import { SidebarItem } from "./SidebarItem";
import { UserRoleSelect } from "./UserRoleSelect";
import { MenuRoundedIcon } from "../icons/MenuRoundedIcon";
import { CloseRoundedIcon } from "../icons/CloseRoundedIcon";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
      <aside
        className={`
    fixed md:static z-50 h-screen
    bg-[#0B1220] text-white
    flex flex-col
    transition-all duration-300
    w-70 ${collapsed ? "md:w-18" : "md:w-70"}
    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        {/* Header */}
        <div className="px-6 py-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white">
              D
            </span>

            {/* Texto solo en desktop */}
            <span
              className={clsx("text-xl font-bold tracking-wide", {
                inline: open, // Visible en móvil cuando open
                hidden: !open, // Oculto en móvil por defecto
                "md:inline": !collapsed, // Visible en desktop cuando no collapsed
                "md:hidden": collapsed, // Oculto en desktop cuando collapsed
              })}
            >
              DISBOL
            </span>
          </div>

          {/* Hamburguesa en header - solo cuando hay texto visible */}
          <button
            onClick={open ? onClose : onToggleCollapse}
            className={clsx(
              "p-2 rounded-lg hover:bg-white/10 transition-colors",
              {
                block: open, // Visible en móvil cuando open
                hidden: !open, // Oculto en móvil por defecto
                "md:block": !collapsed, // Visible en desktop cuando no collapsed
                "md:hidden": collapsed, // Oculto en desktop cuando collapsed
              },
            )}
          >
            {open ? (
              <CloseRoundedIcon size={24} />
            ) : (
              <MenuRoundedIcon size={24} />
            )}
          </button>
        </div>

        {/* Tipo de usuario */}
        <div
          className={clsx("px-6 pb-6", {
            block: open, // Visible en móvil cuando open
            hidden: !open, // Oculto en móvil por defecto
            "md:block": !collapsed, // Visible en desktop cuando no collapsed
            "md:hidden": collapsed, // Oculto en desktop cuando collapsed
          })}
        >
          <UserRoleSelect />
        </div>

        {/* Hamburguesa para modo colapsado */}
        <div
          className={`px-3 pb-4 hidden md:${collapsed ? "block" : "hidden"}`}
        >
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <MenuRoundedIcon size={20} />
          </button>
        </div>

        {/* Menú principal */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {sidebarOperadorMenu.main.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              open={open}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          {sidebarOperadorMenu.footer.map((item) => (
            <SidebarItem
              key={item.href || item.label}
              {...item}
              open={open}
              collapsed={collapsed}
              onClick={
                item.label === "Cerrar sesión" ? handleLogout : undefined
              }
            />
          ))}
        </div>
      </aside>
    </>
  );
}
