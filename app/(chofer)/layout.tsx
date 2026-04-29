"use client";

import { MenuRoundedIcon } from "@/components/icons/MenuRoundedIcon";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState, useEffect } from "react";

export default function OperadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Auto-colapsar en pantallas medianas
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024; // lg breakpoint
      const isMedium = window.innerWidth >= 768 && window.innerWidth < 1024; // md breakpoint
      const isSmall = window.innerWidth < 768; // < md breakpoint

      if (isSmall) {
        // En móvil: resetear estados para funcionalidad móvil limpia
        setCollapsed(false);
        setOpen(false);
      } else if (isMedium) {
        // En medianas: colapsar automáticamente
        setCollapsed(true);
      } else if (isLarge) {
        // En grandes: expandir automáticamente
        setCollapsed(false);
      }
    };

    // Ejecutar al montar
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Botón hamburguesa */}
        <button
          onClick={() => setOpen(true)}
          className="mb-4 md:hidden inline-flex items-center gap-2 rounded-md border px-3 py-2"
        >
          <MenuRoundedIcon size={20} />
        </button>

        {children}
      </main>
    </div>
  );
}
