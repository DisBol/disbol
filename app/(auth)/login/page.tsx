"use client"; // Necesario porque las primitivas de Radix son Client Components

import { Button } from "@/components/ui/Button";
import * as Label from "@radix-ui/react-label";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      {/* Container Blanco (Card) */}
      <div className="w-full max-w-[420px] bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-10">
        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-9">
          Iniciar Sesión
        </h1>

        <form className="flex flex-col gap-5">
          {/* Grupo: Usuario */}
          <div className="flex flex-col gap-2">
            <Label.Root
              htmlFor="username"
              className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-0.5 cursor-pointer"
            >
              Usuario
            </Label.Root>
            <input
              id="username"
              type="text"
              className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300 transition-all"
            />
          </div>

          {/* Grupo: Contraseña */}
          <div className="flex flex-col gap-2">
            <Label.Root
              htmlFor="password"
              className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-0.5 cursor-pointer"
            >
              Contraseña
            </Label.Root>
            <input
              id="password"
              type="password"
              className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300 transition-all"
            />
          </div>

          {/* Botón */}
          {/* <div className="pt-3">
            <button
              type="submit"
              className="w-full h-11 inline-flex items-center justify-center rounded-md bg-[#DC2646] px-4 font-semibold text-white transition-colors hover:bg-[#c4213e] focus:outline-none focus:ring-2 focus:ring-[#DC2646] focus:ring-offset-2"
            >
              Ingresar
            </button>
          </div> */}
          <Button variant="primary">Ingresar</Button>
        </form>
      </div>
    </div>
  );
}
