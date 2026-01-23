"use client";

import { useSession } from "next-auth/react";

export function UserRoleSelect() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] uppercase tracking-wider text-slate-400">
        Tipo de usuario
      </label>

      {/* <select className="h-11 rounded-md bg-white/10 border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary">
        <option className="text-black">Operador</option>
        <option className="text-black">Administrador</option>
      </select> */}

      <div className="inline-flex items-center px-3 py-2 bg-linear-to-r from-blue-500/20 to-white-500/20 border border-white/20 rounded-full backdrop-blur-sm">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        <span className="text-white text-sm font-medium">
          {session?.user?.role || "Cargando..."}
        </span>
      </div>
    </div>
  );
}
