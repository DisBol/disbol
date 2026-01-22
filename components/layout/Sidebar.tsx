"use client";

import { signOut } from "next-auth/react";
import { sidebarOperadorMenu } from "./config/sidebar-operador.config";
import { SidebarItem } from "./SidebarItem";
import { UserRoleSelect } from "./UserRoleSelect";

export function Sidebar() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="w-70 bg-[#0B1220] text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 text-xl font-bold tracking-wide flex items-center">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white mr-3">
          D
        </span>
        DISBOL
      </div>

      {/* Tipo de usuario */}
      <div className="px-6 pb-6">
        <UserRoleSelect />
      </div>

      {/* Menú principal */}
      <nav className="flex-1 px-3 space-y-1">
        {sidebarOperadorMenu.main.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {sidebarOperadorMenu.footer.map((item) => (
          <SidebarItem
            key={item.href || item.label}
            {...item}
            onClick={item.label === "Cerrar sesión" ? handleLogout : undefined}
          />
        ))}
      </div>
    </aside>
  );
}
