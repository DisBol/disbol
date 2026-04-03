"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Movimiento, Cliente } from "./types";

interface Props {
  movimientos: Movimiento[];
  clientes: Cliente[];
}

export function HistoricoMovimientosCliente({ movimientos, clientes }: Props) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cliente, setCliente] = useState("Todos los clientes");
  const [grupoCliente, setGrupoCliente] = useState("Todos los grupos");

  const filtered = movimientos.filter((m) => {
    const movFecha = new Date(m.fecha.split(" ")[0]);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const fechaValida = (!inicio || movFecha >= inicio) && (!fin || movFecha <= fin);
    const clienteValido = cliente === "Todos los clientes" || m.cliente === cliente;
    const grupoValido = grupoCliente === "Todos los grupos" || m.grupo === grupoCliente;

    return fechaValida && clienteValido && grupoValido;
  });

  const limpiar = () => {
    setFechaInicio("");
    setFechaFin("");
    setCliente("Todos los clientes");
    setGrupoCliente("Todos los grupos");
  };

  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          Histórico de Movimientos por Cliente
        </h2>
        <p className="text-xs text-gray-400 mb-4">Movimientos de canastillas por cliente</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fecha Inicio</label>
            <Input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              inputSize="sm"
              placeholder="dd/mm/aaaa"
              className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fecha Fin</label>
            <Input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              inputSize="sm"
              placeholder="dd/mm/aaaa"
              className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cliente</label>
            <select
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            >
              <option>Todos los clientes</option>
              {clientes.map((c) => (
                <option key={c.nombre} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Grupo de Cliente</label>
            <select
              value={grupoCliente}
              onChange={(e) => setGrupoCliente(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            >
              <option>Todos los grupos</option>
              <option value="operation">operation</option>
              <option value="retail">retail</option>
              <option value="wholesale">wholesale</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={limpiar}
              variant="ghost"
              className="w-full h-auto px-4 py-2 text-red-500 font-semibold text-sm hover:text-red-600"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Fecha / Hora", "Canastilla", "Cliente", "Grupo", "Cantidad (+/-)"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[11px] font-bold tracking-wider text-gray-600 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{m.fecha}</td>
                <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">{m.canastilla}</td>
                <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{m.cliente}</td>
                <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{m.grupo}</td>
                <td className={`px-5 py-3 font-black whitespace-nowrap ${m.cantidad < 0 ? "text-red-500" : "text-emerald-500"}`}>
                  {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                  No hay movimientos para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
