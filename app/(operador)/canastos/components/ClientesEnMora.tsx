"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useGetContainerMovementsTotalByClient } from "../hooks/useGetContainerMovementsTotalByClient";
import { ExtractoModal } from "./ExtractoModal";

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

interface Props {
  containerId: number;
}

export function ClientesEnMora({ containerId }: Props) {
  const { data, loading } = useGetContainerMovementsTotalByClient(containerId);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);

  const filtered = data.filter(
    (c) =>
      c.Client_name.toLowerCase().includes(search.toLowerCase()) ||
      c.Group_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Card className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex flex-col gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Clientes en Mora</h2>
            <p className="text-xs text-gray-400">
              Canastos pendientes – Ordenado por cantidad (mayor a menor)
            </p>
          </div>
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Buscar cliente o ruta…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              inputSize="sm"
              leftIcon={<IconSearch />}
              className="rounded-xl border-gray-200 bg-gray-50 text-[13px] focus-visible:ring-sky-200 focus-visible:border-sky-400 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="overflow-auto max-h-72">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Cliente", "Ruta", "Canastos", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-2.5 text-left text-[11px] font-bold tracking-wider text-red-500 uppercase whitespace-nowrap"
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
              {!loading && filtered.map((c) => (
                <tr key={c.Client_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">{c.Client_name}</td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{c.Group_name}</td>
                  <td className="px-5 py-3 font-black text-red-500">{c.Total_Canastos}</td>
                  <td className="px-5 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      radius="lg"
                      onClick={() => setSelectedClient({ id: c.Client_id, name: c.Client_name })}
                      className="h-auto px-3 py-1.5 text-xs font-semibold border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900"
                    >
                      Extracto
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                    No hay clientes en mora.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedClient && (
        <ExtractoModal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          containerId={containerId}
        />
      )}
    </>
  );
}
