"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { MovimientoProveedor } from "./types";

interface Props {
  movimientosProveedor: MovimientoProveedor[];
}

export function HistoricoMovimientosProveedor({ movimientosProveedor }: Props) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [proveedor, setProveedor] = useState("Todos los proveedores");

  const filtered = movimientosProveedor.filter((m) => {
    const movFecha = new Date(m.fecha.split(" ")[0]);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const fechaValida = (!inicio || movFecha >= inicio) && (!fin || movFecha <= fin);
    const proveedorValido = proveedor === "Todos los proveedores" || m.proveedor === proveedor;

    return fechaValida && proveedorValido;
  });

  const limpiar = () => {
    setFechaInicio("");
    setFechaFin("");
    setProveedor("Todos los proveedores");
  };

  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          Histórico de Movimientos por Proveedor
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Movimientos de canastillas recibidas de proveedores
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
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
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Proveedor</label>
            <select
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            >
              <option>Todos los proveedores</option>
              <option value="SOFIA">SOFIA</option>
              <option value="TRANSPORTES BOLIVIA">TRANSPORTES BOLIVIA</option>
              <option value="LOGISTICA ANDINA">LOGISTICA ANDINA</option>
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
              {["Fecha / Hora", "Canastilla", "Proveedor", "Cantidad (+/-)"].map((h) => (
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
                <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{m.proveedor}</td>
                <td className="px-5 py-3 font-black whitespace-nowrap text-emerald-500">
                  +{m.cantidad}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
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
