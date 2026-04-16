"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select, SelectOption } from "@/components/ui/SelecMultipe";
import { useGetContainerMovementsProviderHistory } from "../hooks/useGetContainerMovementsProviderHistory";
import { useGetProvider } from "@/app/(operador)/configuraciones/hooks/proveedores/useGetProvider";

const today = new Date();
const defaultEndDate = today.toISOString().split("T")[0];
const defaultStartDate = `${today.getFullYear()}-01-01`;

interface Props {
  containerId: number;
}

export function HistoricoMovimientosProveedor({ containerId }: Props) {
  const [fechaInicio, setFechaInicio] = useState(defaultStartDate);
  const [fechaFin, setFechaFin] = useState(defaultEndDate);
  const [proveedorId, setProveedorId] = useState(0);

  const { options: proveedorOptions } = useGetProvider();

  const { data, loading, error } = useGetContainerMovementsProviderHistory(
    `${fechaInicio} 00:00:00`,
    `${fechaFin} 00:00:00`,
    proveedorId,
    containerId,
  );

  const limpiar = () => {
    setFechaInicio(defaultStartDate);
    setFechaFin(defaultEndDate);
    setProveedorId(0);
  };

  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
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
              className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400"
            />
          </div>
          <Select
            label="Proveedor"
            options={[
              { value: "0", label: "Todos los proveedores" },
              ...proveedorOptions.map((p): SelectOption => ({ value: p.value, label: p.label })),
            ]}
            selectedValues={[proveedorId.toString()]}
            onSelect={(opt) => setProveedorId(Number(opt.value))}
            size="md"
            radius="lg"
          />
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
            {loading && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                  Cargando...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-red-400">
                  Error al cargar los datos.
                </td>
              </tr>
            )}
            {!loading && !error && data.map((m) => (
              <tr key={m.ContainerMovements_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(m.ContainerMovements_created_at).toLocaleString("es-BO")}
                </td>
                <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">
                  {m.Container_name}
                </td>
                <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                  {m.Provider_name}
                </td>
                <td className={`px-5 py-3 font-black whitespace-nowrap ${m.ContainerMovements_quantity < 0 ? "text-red-500" : "text-emerald-500"}`}>
                  {m.ContainerMovements_quantity > 0 ? `+${m.ContainerMovements_quantity}` : m.ContainerMovements_quantity}
                </td>
              </tr>
            ))}
            {!loading && !error && data.length === 0 && (
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
